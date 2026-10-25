// Kodlu soruların cevaplarını NVC ile doğrular.
// Kullanım: NVC=/yol/nvc [NVC_LIB=/yol/lib] npm run sorular:dogrula
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sorular } from "../content/sorular/index.ts";
import { TB_ADI, izOku, testbenchUret, type KodBilgisi } from "../shared/kod.ts";
import { MODELLER, degerlendir, vektorUret } from "../worker/modeller.ts";

const nvc = process.env.NVC ?? "nvc";
const lib = process.env.NVC_LIB ? ["-L", process.env.NVC_LIB] : [];
let hata = 0;
let sayi = 0;

// Tekrarlanabilir rastgele sayılar (mulberry32)
function tohumlu(tohum: number): () => number {
  return () => {
    tohum = (tohum + 0x6d2b79f5) | 0;
    let t = Math.imul(tohum ^ (tohum >>> 15), 1 | tohum);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tasarımı rastgele bir sınamaya karşı çalıştırıp modelle karşılaştırır
function kodSina(b: KodBilgisi, tasarim: string, id: string, tohum: number) {
  const model = MODELLER[id];
  const vektorler = vektorUret(b, model, tohumlu(tohum));
  const tb = testbenchUret(b, vektorler);
  const dir = mkdtempSync(join(tmpdir(), "kod-"));
  writeFileSync(join(dir, "tasarim.vhd"), tasarim);
  writeFileSync(join(dir, "tb.vhd"), tb.metin);
  const r = spawnSync(
    nvc,
    [...lib, "--work=" + join(dir, "work"), "--std=1993", "-a", "tasarim.vhd", "tb.vhd", "-e", TB_ADI, "-r", `--stop-time=${tb.stopTime}`],
    { cwd: dir, encoding: "utf8" },
  );
  const cikti = r.stdout + r.stderr;
  return { durum: r.status, cikti, sonuc: degerlendir(b, model, vektorler, izOku(cikti.split("\n"))) };
}

for (const s of sorular) {
  if (s.tip === "code") {
    sayi++;
    let tamam = true;
    for (const tohum of [1, 2, 3]) {
      const { durum, cikti, sonuc } = kodSina(s.kod, s.cozum, s.id, tohum);
      if (durum !== 0 || sonuc.gecen !== sonuc.toplam) {
        tamam = false;
        hata++;
        console.log(`HATA  ${s.id} (çözüm, tohum ${tohum}): ${sonuc.gecen}/${sonuc.toplam}\n${JSON.stringify(sonuc.rapor)}\n${cikti.slice(-1500)}\n`);
        break;
      }
    }
    // Boş şablon derlenmeli ama hiçbir kontrol noktasını geçmemeli
    const bos = kodSina(s.kod, s.kod.sablon, s.id, 1);
    if (bos.durum !== 0 || bos.sonuc.gecen !== 0) {
      tamam = false;
      hata++;
      console.log(`HATA  ${s.id} (şablon): durum ${bos.durum}, ${bos.sonuc.gecen}/${bos.sonuc.toplam} geçti\n${bos.cikti.slice(-1500)}\n`);
    }
    if (tamam) console.log(`tamam ${s.id} (kod, 3 rastgele sınama ve boş şablon)`);
    continue;
  }
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
