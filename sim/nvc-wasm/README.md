# NVC → WebAssembly

Sitedeki VHDL analizi ve simülasyonu, [NVC](https://github.com/nickg/nvc)
simülatörünün WebAssembly'ye derlenmiş hâliyle öğrencinin tarayıcısında çalışır.
Derlenmiş dosyalar `public/nvc/` altındadır:

| Dosya      | İçerik                                              |
|------------|-----------------------------------------------------|
| `nvc.mjs`  | Emscripten yükleyicisi (ES modülü, `createNvc`)     |
| `nvc.wasm` | Simülatör (LLVM'siz, tek iş parçacıklı, yorumlayıcı) |
| `nvc.data` | Önceden derlenmiş `std` ve `ieee` kütüphaneleri (VHDL-93 ve 2008) |

## Yeniden derleme

```sh
sudo apt-get install -y build-essential autoconf automake libtool flex bison \
  pkg-config zlib1g-dev libzstd-dev libffi-dev
./build.sh            # çıktı: out/
cp out/* ../../public/nvc/
```

Betik NVC'yi sabit bir sürümden (`NVC_REV`) indirir, `nvc-wasm.patch` yamasını
uygular, önce yerel bir NVC ile VHDL kütüphanelerini derler, sonra Emscripten
ile `wasm32` hedefine derler.

## Yamada neler var?

- `pthread` olmadan derleme (SharedArrayBuffer ve COOP/COEP başlıkları gerekmez).
- WebAssembly fonksiyon işaretçisi imzası katı olduğu için `INTERNAL`
  alt programların ve kopyalama geri çağrılarının imzaları eşitlendi.
- `mmap`/`munmap` yerine `posix_memalign` (kısa ömürlü süreçte bellek serbest bırakılmaz).
- Yerel kod üretimine ait (`x86`/`arm64`) parçalar WebAssembly'de devre dışı.

## Lisans

NVC GPL-3.0-or-later lisanslıdır. Bu depo da aynı lisansla dağıtılır;
yama ve derleme betiği, dağıtılan ikili dosyaların karşılık gelen kaynağıdır.
