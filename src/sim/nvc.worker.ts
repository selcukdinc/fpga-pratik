// NVC'yi (WebAssembly) ayrı bir iş parçacığında çalıştırır. Her çalıştırma
// için yeni bir modül örneği açılır: NVC global durum tutar.

/// <reference lib="webworker" />

export interface RunRequest {
  args: string[];
  files: Record<string, string>;
  // Çalıştırmadan sonra geri okunacak dosyalar (ör. wave.vcd)
  collect: string[];
}

export interface RunResponse {
  lines: string[];
  exitCode: number;
  files: Record<string, string>;
}

interface NvcModule {
  FS: {
    mkdir(path: string): void;
    chdir(path: string): void;
    writeFile(path: string, data: string): void;
    readFile(path: string, opts: { encoding: "utf8" }): string;
  };
  callMain(args: string[]): number;
}

type CreateNvc = (opts: object) => Promise<NvcModule>;

const NVC_URL = new URL("/nvc/nvc.mjs", self.location.origin).href;

self.onmessage = async (e: MessageEvent<RunRequest>) => {
  const { args, files, collect } = e.data;
  const lines: string[] = [];
  let exitCode = 0;

  const { default: createNvc } = (await import(/* @vite-ignore */ NVC_URL)) as { default: CreateNvc };
  const m = await createNvc({
    // nvc.data varsayılan olarak bu iş parçacığının adresine göre aranır
    locateFile: (path: string) => new URL(path, NVC_URL).href,
    print: (t: string) => lines.push(t),
    printErr: (t: string) => lines.push(t),
    onExit: (code: number) => (exitCode = code),
  });

  m.FS.mkdir("/proje");
  m.FS.chdir("/proje");
  for (const [name, text] of Object.entries(files)) m.FS.writeFile(name, text);

  try {
    exitCode = m.callMain(args);
  } catch (err) {
    // exit() bir ExitStatus fırlatır; diğer her şey gerçek bir çökmedir
    const status = (err as { status?: number }).status;
    if (typeof status === "number") exitCode = status;
    else {
      lines.push(`** Fatal: simülatör çöktü: ${String(err)}`);
      exitCode = 1;
    }
  }

  const out: Record<string, string> = {};
  for (const name of collect) {
    try {
      out[name] = m.FS.readFile(name, { encoding: "utf8" });
    } catch {
      // dosya oluşmadıysa (ör. analiz hatası) atlanır
    }
  }
  const res: RunResponse = { lines, exitCode, files: out };
  self.postMessage(res);
};
