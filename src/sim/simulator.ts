// Tarayıcıda VHDL analizi ve simülasyonu. Sunucuya hiçbir şey gönderilmez.

import type { RunRequest, RunResponse } from "./nvc.worker";
import { parseMessages, type SimMessage } from "./messages";
import { parseVcd, type Vcd } from "./vcd";

export type VhdlStd = "1993" | "2008";

export interface SimFile {
  name: string;
  text: string;
}

export interface CheckResult {
  ok: boolean;
  messages: SimMessage[];
  log: string[];
  ms: number;
}

export interface SimResult extends CheckResult {
  vcd: Vcd | null;
  timedOut: boolean;
}

const DEFAULT_TIMEOUT_MS = 20_000;

function run(req: RunRequest, timeoutMs: number): Promise<RunResponse & { timedOut: boolean }> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL("./nvc.worker.ts", import.meta.url), { type: "module" });
    // Sonsuz döngüye giren bir testbench sekmeyi kilitlemesin
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({
        lines: [`** Error: simülasyon ${timeoutMs / 1000} saniyede bitmedi ve durduruldu`],
        exitCode: 1,
        files: {},
        timedOut: true,
      });
    }, timeoutMs);
    worker.onmessage = (e: MessageEvent<RunResponse>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ ...e.data, timedOut: false });
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ lines: [`** Fatal: ${e.message}`], exitCode: 1, files: {}, timedOut: false });
    };
    worker.postMessage(req);
  });
}

function baseArgs(std: VhdlStd): string[] {
  return [`--std=${std}`, "-L", "/lib"];
}

function toFiles(files: SimFile[]): Record<string, string> {
  return Object.fromEntries(files.map((f) => [f.name, f.text]));
}

function hasErrors(messages: SimMessage[]): boolean {
  return messages.some((m) => m.severity === "error" || m.severity === "fatal");
}

// Vivado'daki "Check Syntax" karşılığı: yalnızca analiz
export async function checkSyntax(files: SimFile[], std: VhdlStd = "1993"): Promise<CheckResult> {
  const t0 = performance.now();
  const res = await run(
    { args: [...baseArgs(std), "-a", ...files.map((f) => f.name)], files: toFiles(files), collect: [] },
    DEFAULT_TIMEOUT_MS,
  );
  const messages = parseMessages(res.lines, toFiles(files));
  return { ok: res.exitCode === 0 && !hasErrors(messages), messages, log: res.lines, ms: performance.now() - t0 };
}

export interface SimulateOptions {
  top: string;
  stopTime: string; // ör. "1us"
  std?: VhdlStd;
  timeoutMs?: number;
}

// Vivado'daki "Run Behavioral Simulation" karşılığı
export async function simulate(files: SimFile[], opts: SimulateOptions): Promise<SimResult> {
  const t0 = performance.now();
  const args = [
    ...baseArgs(opts.std ?? "1993"),
    "-a", ...files.map((f) => f.name),
    "-e", opts.top,
    "-r", `--stop-time=${opts.stopTime}`, "--wave=wave.vcd", "--format=vcd",
  ];
  const res = await run({ args, files: toFiles(files), collect: ["wave.vcd"] }, opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  // Hiç sinyali olmayan bir testbench'te (yalnızca report kullanan) NVC dalga
  // dosyası yazamayıp bu hatayı verir; benzetimin kendisi başarılıdır.
  const tum = parseMessages(res.lines, toFiles(files));
  const bosDalga = (m: SimMessage) => m.severity === "fatal" && m.text.includes("fstReaderOpen failed");
  const messages = tum.filter((m) => !bosDalga(m));
  const text = res.files["wave.vcd"];
  return {
    ok: (res.exitCode === 0 || tum.some(bosDalga)) && !hasErrors(messages),
    messages,
    log: res.lines,
    ms: performance.now() - t0,
    vcd: text ? parseVcd(text) : null,
    timedOut: res.timedOut,
  };
}
