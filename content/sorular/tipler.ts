// Soru havuzunun kaynak biçimi. `npm run sorular:sql` bu dosyalardan
// migrations/ altındaki SQL'i üretir; `npm run sorular:dogrula` kodlu soruları
// NVC ile derleyip benzetimini yapar.
//
// Metinlerde ` yerine ~ yazılır (TypeScript şablon dizgilerinde ters tırnak
// kaçış gerektirdiği için). Üretici ~ karakterlerini ` ile değiştirir.

import type { KodBilgisi } from "../../shared/kod.ts";

export interface Konu {
  id: string;
  baslik: string;
  hafta: number;
  sira: number;
}

interface Ortak {
  id: string;
  konu: string;
  hafta: number;
  // original: sunumdaki soru ya da alıştırmanın yeniden yazılmış hali
  // derived: aynı konudan esinlenen yeni soru
  kaynak: "original" | "derived";
  zorluk: 1 | 2 | 3;
  // Sunumdaki yer, örneğin "Hafta 3, Veri öznitelikleri"
  ref: string;
  soru: string;
  aciklama: string;
  // Cevabı NVC ile kanıtlayan, kendi içinde tam bir VHDL dosyası.
  // `tb` adlı en üst birim assert'lerle kontrol eder.
  // calismali: derlenir ve assert'ler geçer
  // derlenmemeli: analiz ya da elaborasyon hata verir
  // calisirken_hata: derlenir ama benzetim hatayla durur
  dogrulama?: { calismali: string } | { derlenmemeli: string } | { calisirken_hata: string };
}

// Kod yazma sorusu: öğrenci şablondaki mimariyi doldurur, gizli testbench
// worker/modeller.ts'deki aynı kimlikli referans modelle karşılaştırır.
// cozum: doğrulama betiğinin NVC ile tüm kontrol noktalarını geçirdiği örnek çözüm.
interface KodSorusu {
  tip: "code";
  kod: KodBilgisi;
  cozum: string;
}

export type Soru =
  | (Ortak & { tip: "tf"; dogru: boolean })
  | (Ortak & { tip: "mcq"; secenekler: string[]; dogru: number })
  | (Ortak & { tip: "fill"; bosluklar: string[][] })
  | (Ortak & KodSorusu);

// Vektör ve bit cevaplarında tırnaklı ve tırnaksız yazımı birlikte kabul eder
export const vektor = (s: string): string[] => [s, `"${s}"`];
export const bit = (s: string): string[] => [s, `'${s}'`];

// Doğrulama dosyalarının ortak başlığı
export const IEEE = "library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n";
