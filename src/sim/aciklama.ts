// NVC'nin İngilizce mesajlarına kısa Türkçe açıklamalar. Mesajın kendisi
// değişmeden gösterilir; açıklama altına eklenir.

import type { SimMessage } from "./messages";

type Kural = [RegExp, (m: RegExpMatchArray) => string];

const KURALLAR: Kural[] = [
  [/invalid character|no visible declaration for '\s*'/i,
    () => "Dizgi ya da ad içinde VHDL'in tanımadığı bir karakter var. VHDL-93 dizgilerinde ı, ş, ğ gibi Türkçe harfler kullanılamaz; report metinlerini bu harfler olmadan yaz."],
  [/no visible declaration for (STD_LOGIC|STD_LOGIC_VECTOR|UNSIGNED|SIGNED|RISING_EDGE|FALLING_EDGE|TO_UNSIGNED|TO_SIGNED|TO_INTEGER)\b/i,
    (m) => `${m[1]} bir kütüphanede tanımlı. Dosyanın başında "library ieee;" ve "use ieee.std_logic_1164.all;" (sayısal türler için "use ieee.numeric_std.all;") satırları olmalı.`],
  [/no visible declaration for (\S+)/i,
    (m) => `${m[1]} adında bir sinyal, değişken ya da port bulunamadı. Yazımını kontrol et; tanımlamayı unutmuş da olabilirsin.`],
  [/unexpected end of file/i, () => "Dosya beklenmedik yerde bitti: kapanmamış bir blok var (ör. eksik \"end process;\" ya da \"end rtl;\")."],
  [/unexpected (.+?) while parsing (.+?), expecting/i,
    (m) => `Sözdizimi hatası. Hata genellikle gösterilen satırdan hemen önceki satırdadır: eksik ";" ya da eksik bir "end ..." ilk bakılacak yerlerdir.`],
  [/cannot read output port (\S+)/i,
    (m) => `VHDL-93'te "out" yönlü ${m[1]} portu okunamaz. Değeri bir iç sinyalde tut, portu o sinyalden ata (ör. q <= std_logic_vector(sayi);).`],
  [/unresolved signal (\S+) has multiple sources/i,
    (m) => `${m[1]} sinyaline birden fazla yerden değer veriliyor (ör. iki process ya da process ile eşzamanlı atama). Her sinyal tek bir yerden sürülmeli.`],
  [/no applicable subprogram declaration for "(.+?)"/i,
    (m) => `"${m[1]}" bu türlerle kullanılamıyor. Aritmetik için std_logic_vector'ü unsigned(...) ya da signed(...) ile dönüştür; sonucu geri atarken std_logic_vector(...) kullan.`],
  [/type of value (\S+) does not match type of target (\S+)/i,
    (m) => `${m[1]} türündeki değer ${m[2]} türündeki hedefe atanamaz. Tür dönüşümü gerekir: std_logic_vector(...), unsigned(...), to_integer(...) ya da to_unsigned(x, genişlik).`],
  [/expected (\d+) elements in string literal but have (\d+)/i,
    (m) => `Hedef ${m[1]} bit genişliğinde ama yazılan değer ${m[2]} bit. Bit sayısını hedefin genişliğine eşitle.`],
  [/(?:length|count) of .* does not match|right hand side has \d+ elements/i,
    () => "Atamanın iki tarafının bit genişliği aynı değil. Vektör genişliklerini kontrol et."],
  [/choices cover only/i,
    () => "case ya da with/select tüm durumları kapsamıyor. std_logic'in '0' ve '1' dışında da değerleri olduğu için son seçenek \"when others\" olmalı."],
  [/cannot find unit WORK\.(\S+)/i,
    (m) => `Top olarak seçilen ${m[1]} adında bir birim bulunamadı. Top adını kontrol et ya da dosyaya sağ tıklayıp "Top yap"ı seç.`],
  [/design unit (\S+) not found in library WORK/i,
    (m) => `${m[1]} adında bir entity yok. Onu tanımlayan dosyayı projeye ekle ya da adı düzelt.`],
  [/(\S+) has no port named (\S+)/i,
    (m) => `${m[1]} biriminin ${m[2]} adında bir portu yok. port map'teki adları entity tanımıyla karşılaştır.`],
  [/missing actual for (?:formal )?(\S+)/i,
    (m) => `${m[1]} portu port map içinde bağlanmamış.`],
  [/already declared in this region/i, () => "Aynı ad bu kapsamda iki kez tanımlanmış."],
  [/value (\S+) outside of .* range (.+?) for (?:signal|variable) (\S+)/i,
    (m) => `${m[3]} için ${m[1]} değeri izin verilen aralığın (${m[2]}) dışında. Sayaç taşmasını ya da aralık tanımını kontrol et.`],
  [/potential infinite loop in process with no sensitivity list and no wait/i,
    () => "Bu process'te ne duyarlılık listesi ne de wait var; benzetim burada sonsuza kadar döner. process (sinyaller) yaz ya da process'e wait ekle."],
  [/simülasyon .* saniyede bitmedi/i,
    () => "Genellikle duyarlılık listesi ve wait içermeyen bir process ya da sonsuz bir döngü buna yol açar. Testbench'teki son process \"wait;\" ile bitmeli."],
];

export function hataAciklamasi(m: SimMessage): string | null {
  if (m.severity === "note") return null;
  for (const [desen, metin] of KURALLAR) {
    const e = m.text.match(desen);
    if (e) return metin(e);
  }
  if (m.severity === "failure") return "Bir assert koşulu sağlanmadı ya da testbench benzetimi bilerek durdurdu. Mesajın metni testbench'ten geliyor.";
  return null;
}
