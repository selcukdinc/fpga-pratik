// Simülasyon alanının proje işlemleri: entity bulma, top seçimi, yeni kaynak
// şablonu, dosya adı denetimi ve dışa aktarma için küçük bir zip yazıcı.

import type { SimFile } from "./simulator";

export interface Varlik {
  ad: string;
  dosya: string;
  // Portu olan bir birim top yapılırsa girişleri sürülmez
  portlu: boolean;
}

// Yorumları atar; dizgi içindeki "--" nadir olduğu için göz ardı edilir
const yorumsuz = (metin: string) => metin.replace(/--[^\n]*/g, "");

export function varliklar(files: SimFile[]): Varlik[] {
  const out: Varlik[] = [];
  for (const f of files) {
    const metin = yorumsuz(f.text);
    for (const m of metin.matchAll(/\bentity\s+([a-z][a-z0-9_]*)\s+is\b([\s\S]*?)\bend\b/gi)) {
      out.push({ ad: m[1].toLowerCase(), dosya: f.name, portlu: /\bport\s*\(/i.test(m[2]) });
    }
  }
  return out;
}

// Top seçili değilse ya da artık yoksa: portsuz (testbench) birimlerden adı tb ile
// başlayanı, yoksa ilk portsuz birimi seçer
export function topBul(files: SimFile[], mevcut: string): string {
  const v = varliklar(files);
  if (mevcut && v.some((x) => x.ad === mevcut.toLowerCase())) return mevcut.toLowerCase();
  const portsuz = v.filter((x) => !x.portlu);
  return (portsuz.find((x) => /^tb|_tb$|tb_/.test(x.ad)) ?? portsuz[0])?.ad ?? "";
}

const AYRILMIS = new Set(
  ("abs access after alias all and architecture array assert attribute begin block body buffer bus case component " +
    "configuration constant disconnect downto else elsif end entity exit file for function generate generic group " +
    "guarded if impure in inertial inout is label library linkage literal loop map mod nand new next nor not null of " +
    "on open or others out package port postponed procedure process pure range record register reject rem report " +
    "return rol ror select severity signal shared sla sll sra srl subtype then to transport type unaffected units " +
    "until use variable wait when while with xnor xor").split(" "),
);

const TR: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "C", Ğ: "G", İ: "I", Ö: "O", Ş: "S", Ü: "U" };

// Kullanıcının yazdığı adı VHDL tanımlayıcısına yaklaştırır: Türkçe harfler, boşluk ve uzantı
export function adDuzelt(girdi: string): string {
  return girdi
    .trim()
    .replace(/\.(vhd|vhdl)$/i, "")
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (c) => TR[c])
    .replace(/[\s-]+/g, "_");
}

export function adHatasi(ad: string): string | null {
  if (!ad) return "Bir ad yaz.";
  if (!/^[a-zA-Z]/.test(ad)) return "Ad bir harfle başlamalı.";
  if (!/^[a-zA-Z0-9_]+$/.test(ad)) return "Adda yalnızca İngilizce harf, rakam ve _ olabilir.";
  if (/__/.test(ad) || ad.endsWith("_")) return "Ad iki _ yan yana içeremez ve _ ile bitemez.";
  if (AYRILMIS.has(ad.toLowerCase())) return `"${ad}" VHDL'de ayrılmış bir sözcük, başka bir ad seç.`;
  if (ad.length > 60) return "Ad en fazla 60 karakter olabilir.";
  return null;
}

export type KaynakTuru = "tasarim" | "testbench";

// Vivado'nun yeni kaynak şablonuna benzer: yalnızca port satırı yorum olarak gelir
export function kaynakSablonu(ad: string, tur: KaynakTuru): string {
  const ust = "library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\n";
  if (tur === "testbench") {
    return `${ust}entity ${ad} is\nend ${ad};\n\narchitecture sim of ${ad} is\n\nbegin\n\n  process\n  begin\n\n    wait;\n  end process;\n\nend sim;\n`;
  }
  return `${ust}entity ${ad} is\n--  Port ( );\nend ${ad};\n\narchitecture Behavioral of ${ad} is\n\nbegin\n\n\nend Behavioral;\n`;
}

// Aynı adlı dosya varsa _2, _3 ... ekler
export function bosAd(ad: string, dolu: Iterable<string>): string {
  const kume = new Set([...dolu].map((x) => x.toLowerCase()));
  if (!kume.has(ad.toLowerCase())) return ad;
  for (let i = 2; ; i++) if (!kume.has(`${ad}_${i}`.toLowerCase())) return `${ad}_${i}`;
}

export const vhdlDosyasi = (ad: string) => /\.(vhd|vhdl)$/i.test(ad);

export function sureHatasi(sure: string): string | null {
  return /^\d+(\.\d+)?(fs|ps|ns|us|ms|sec)$/.test(sure) ? null : 'Süre "500ns", "6us" ya da "1ms" biçiminde olmalı.';
}

// ---- Zip (sıkıştırmasız) ----

const CRC_TABLO = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

export function crc32(veri: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of veri) c = CRC_TABLO[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function zipOlustur(files: { name: string; text: string }[]): Uint8Array {
  const enc = new TextEncoder();
  const parcalar: Uint8Array[] = [];
  const merkez: Uint8Array[] = [];
  let ofset = 0;
  for (const f of files) {
    const ad = enc.encode(f.name);
    const veri = enc.encode(f.text);
    const crc = crc32(veri);
    const yerel = new DataView(new ArrayBuffer(30));
    yerel.setUint32(0, 0x04034b50, true);
    yerel.setUint16(4, 20, true);
    yerel.setUint16(6, 0x0800, true); // UTF-8 adlar
    yerel.setUint32(14, crc, true);
    yerel.setUint32(18, veri.length, true);
    yerel.setUint32(22, veri.length, true);
    yerel.setUint16(26, ad.length, true);
    parcalar.push(new Uint8Array(yerel.buffer), ad, veri);

    const m = new DataView(new ArrayBuffer(46));
    m.setUint32(0, 0x02014b50, true);
    m.setUint16(4, 20, true);
    m.setUint16(6, 20, true);
    m.setUint16(8, 0x0800, true);
    m.setUint32(16, crc, true);
    m.setUint32(20, veri.length, true);
    m.setUint32(24, veri.length, true);
    m.setUint16(28, ad.length, true);
    m.setUint32(42, ofset, true);
    merkez.push(new Uint8Array(m.buffer), ad);
    ofset += 30 + ad.length + veri.length;
  }
  const merkezBoyu = merkez.reduce((t, p) => t + p.length, 0);
  const son = new DataView(new ArrayBuffer(22));
  son.setUint32(0, 0x06054b50, true);
  son.setUint16(8, files.length, true);
  son.setUint16(10, files.length, true);
  son.setUint32(12, merkezBoyu, true);
  son.setUint32(16, ofset, true);
  const hepsi = [...parcalar, ...merkez, new Uint8Array(son.buffer)];
  const out = new Uint8Array(hepsi.reduce((t, p) => t + p.length, 0));
  let i = 0;
  for (const p of hepsi) {
    out.set(p, i);
    i += p.length;
  }
  return out;
}
