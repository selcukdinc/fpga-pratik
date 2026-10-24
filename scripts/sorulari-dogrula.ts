// Kodlu soruların cevaplarını NVC ile doğrular.
// Kullanım: NVC=/yol/nvc [NVC_LIB=/yol/lib] npm run sorular:dogrula
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sorular } from "../content/sorular/index.ts";

const nvc = process.env.NVC ?? "nvc";
const lib = process.env.NVC_LIB ? ["-L", process.env.NVC_LIB] : [];
let hata = 0;
let sayi = 0;

for (const s of sorular) {
  if (!s.dogrulama) continue;
  sayi++;
  const dir = mkdtempSync(join(tmpdir(), "soru-"));
  const [tur, kod] = Object.entries(s.dogrulama)[0] as [string, string];
  writeFileSync(join(dir, "tb.vhd"), kod);
  const args = [...lib, "--work=" + join(dir, "work"), "--std=1993", "-a", "tb.vhd", "-e", "tb"];
  if (tur !== "derlenmemeli") args.push("-r", "--stop-time=1ms");
  const r = spawnSync(nvc, args, { cwd: dir, encoding: "utf8" });
  const cikti = (r.stdout + r.stderr).trim();
  const basarili = r.status === 0;
  const beklenen = tur === "calismali";
  if (basarili !== beklenen) {
    hata++;
    console.log(`HATA  ${s.id} (${tur})\n${cikti}\n`);
  } else {
    const ilk = cikti.split("\n").find((l) => /error|fatal|failure/i.test(l)) ?? "";
    console.log(`tamam ${s.id} (${tur})${ilk ? "  → " + ilk.replace(/\s+/g, " ").slice(0, 110) : ""}`);
  }
}

console.log(`\n${sayi} soru doğrulandı, ${hata} hata.`);
process.exit(hata ? 1 : 0);
