#!/usr/bin/env bash
# Builds the NVC VHDL simulator as a single-threaded WebAssembly module.
# Output: out/nvc.mjs, out/nvc.wasm, out/nvc.data (preloaded IEEE/std libs)
#
# Requires: git, autotools, flex, bison, a host C compiler, zlib/zstd/libffi
# dev packages (for the native build that compiles the VHDL libraries) and
# network access to download emsdk.
set -euo pipefail

NVC_REV=ef6f527cad74b3058b213d6e38ca438b8d044597
EMSDK_VERSION=latest
ZLIB_TAG=v1.3.1
ZSTD_TAG=v1.5.6
LIBFFI_REV=master

HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="${WORK:-$HERE/.build}"
OUT="${OUT:-$HERE/out}"
DEPS="$WORK/wasmdeps"
JOBS="${JOBS:-$(nproc)}"

mkdir -p "$WORK" "$OUT" "$DEPS/include" "$DEPS/lib"
cd "$WORK"

fetch() {  # fetch <url> <dir> [ref]
   [ -d "$2" ] && return
   if [ -n "${3:-}" ]; then
      git init -q "$2" && git -C "$2" remote add origin "$1"
      git -C "$2" fetch -q --depth 1 origin "$3" && git -C "$2" checkout -q FETCH_HEAD
   else
      git clone -q --depth 1 "$1" "$2"
   fi
}

fetch https://github.com/emscripten-core/emsdk emsdk
(cd emsdk && ./emsdk install "$EMSDK_VERSION" >/dev/null && ./emsdk activate "$EMSDK_VERSION" >/dev/null)
# shellcheck disable=SC1091
source emsdk/emsdk_env.sh >/dev/null 2>&1

fetch https://github.com/nickg/nvc nvc "$NVC_REV"
if [ ! -f nvc/.wasm-patched ]; then
   git -C nvc apply "$HERE/nvc-wasm.patch"
   touch nvc/.wasm-patched
fi
[ -f nvc/configure ] || (cd nvc && ./autogen.sh)

# 1. Native build: compiles the std/ieee VHDL libraries (portable) and
#    produces generated headers the cross build needs
if [ ! -x nvc/build-native/bin/nvc ]; then
   mkdir -p nvc/build-native
   (cd nvc/build-native && ../configure --disable-llvm >/dev/null && make -j"$JOBS" >/dev/null)
fi

# 2. Dependencies for wasm32
if [ ! -f "$DEPS/lib/libz.a" ]; then
   fetch https://github.com/madler/zlib zlib "$ZLIB_TAG"
   (cd zlib && emconfigure ./configure --static --prefix="$DEPS" >/dev/null && emmake make -j"$JOBS" install >/dev/null)
fi
if [ ! -f "$DEPS/lib/libzstd.a" ]; then
   fetch https://github.com/facebook/zstd zstd "$ZSTD_TAG"
   (cd zstd/lib && emmake make -j"$JOBS" libzstd.a ZSTD_LEGACY_SUPPORT=0 >/dev/null)
   cp zstd/lib/libzstd.a "$DEPS/lib/"
   cp zstd/lib/zstd.h zstd/lib/zstd_errors.h zstd/lib/zdict.h "$DEPS/include/"
fi
if [ ! -f "$DEPS/lib/libffi.a" ]; then
   fetch https://github.com/libffi/libffi libffi "$LIBFFI_REV"
   # autogen.sh fails on the first run of a fresh checkout, then succeeds
   (cd libffi && (./autogen.sh >/dev/null 2>&1 || ./autogen.sh >/dev/null) \
       && emconfigure ./configure --host=wasm32-unknown-emscripten --enable-static \
            --disable-shared --disable-docs --disable-dependency-tracking \
            --prefix="$DEPS" >/dev/null \
       && emmake make -j"$JOBS" install >/dev/null)
fi

# 3. Cross build, single threaded (no SharedArrayBuffer / COOP+COEP needed)
B=nvc/build-wasm
if [ ! -f $B/Makefile ]; then
   mkdir -p $B
   (cd $B && emconfigure ../configure --host=wasm32-unknown-emscripten \
       --build="$(../config.guess 2>/dev/null || echo x86_64-pc-linux-gnu)" \
       --disable-llvm --disable-tcl --disable-vital --disable-default-paths \
       ac_cv_func_fpurge=no \
       zlib_CFLAGS="-I$DEPS/include" zlib_LIBS="-L$DEPS/lib -lz" \
       libzstd_CFLAGS="-I$DEPS/include" libzstd_LIBS="-L$DEPS/lib -lzstd" \
       libffi_CFLAGS="-I$DEPS/include" libffi_LIBS="-L$DEPS/lib -lffi" >/dev/null)
   sed -i 's/^#define HAVE_FPURGE 1/\/* #undef HAVE_FPURGE *\//' $B/config.h
   sed -i 's/^PTHREAD_CFLAGS = .*/PTHREAD_CFLAGS =/; s/^PTHREAD_LIBS = .*/PTHREAD_LIBS =/' $B/Makefile
   mkdir -p $B/src/cov
   cp nvc/build-native/src/gitsha.h $B/src/
   cp nvc/build-native/src/cov/cov-style.h $B/src/cov/
fi

# Only the 1993 and 2008 libraries are shipped
LIBS="$WORK/vhdl-lib"
rm -rf "$LIBS" && mkdir -p "$LIBS"
for l in std std.08 ieee ieee.08 nvc nvc.08; do
   cp -r nvc/build-native/lib/$l "$LIBS/"
done
find "$LIBS" -name '*.so' -delete

rm -f $B/bin/nvc $B/bin/nvc.wasm $B/bin/nvc.data
emmake make -C $B -j"$JOBS" bin/nvc LDFLAGS="-g0 -O2 -sMAIN_MODULE=1 \
   -sMODULARIZE=1 -sEXPORT_ES6=1 -sEXPORT_NAME=createNvc \
   -sEXPORTED_RUNTIME_METHODS=FS,callMain -sINVOKE_RUN=0 -sEXIT_RUNTIME=1 \
   -sALLOW_MEMORY_GROWTH=1 -sINITIAL_MEMORY=64MB -sSTACK_SIZE=8MB \
   -sENVIRONMENT=web,worker --preload-file $LIBS@/lib" >/dev/null

cp $B/bin/nvc "$OUT/nvc.mjs"
cp $B/bin/nvc.wasm $B/bin/nvc.data "$OUT/"
ls -la "$OUT"
