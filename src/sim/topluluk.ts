// Topluluk testbench'lerini tarayıcıda çalıştırır. Geçmek için benzetim hatasız
// bitmeli ve testbench'in assert'lerinden hiçbiri error ya da failure vermemeli.

import { simulate, type SimResult } from "./simulator";
import { varliklar } from "./proje";

export const TASARIM_DOSYASI = "tasarim.vhd";
export const TB_DOSYASI = "testbench.vhd";

export interface TbSonucu extends SimResult {
  gecti: boolean;
}

export async function tbSina(tasarim: string, tb: { testbench: string; top: string; stopTime: string }): Promise<TbSonucu> {
  const r = await simulate(
    [{ name: TASARIM_DOSYASI, text: tasarim }, { name: TB_DOSYASI, text: tb.testbench }],
    { top: tb.top, stopTime: tb.stopTime.replace(/\s+/g, "") },
  );
  const gecti = r.ok && !r.timedOut && !r.messages.some((m) => m.severity === "failure" || m.severity === "error" || m.severity === "fatal");
  return { ...r, gecti };
}

// Testbench dosyasındaki portsuz birim top olur
export function tbTopu(testbench: string): string | null {
  const v = varliklar([{ name: TB_DOSYASI, text: testbench }]).filter((x) => !x.portlu);
  return v[0]?.ad ?? null;
}
