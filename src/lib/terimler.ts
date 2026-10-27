// Derslerde ve sorularda geçen Türkçe terimlerin İngilizce karşılıkları.
// Ders ve soru metinlerinde terimin her kullanımından sonra "(AND)" gibi
// gösterilir; kod bloklarına ve satır içi koda dokunulmaz. Terimler sayfası da
// bu listeden çizilir.

export interface Terim {
  tr: string;
  en: string;
  // Büyük harfle yazılan mantık işlemleri (VE, VEYA) yalnızca büyük harfle eşleşir;
  // küçük harfli "ve" bağlacı terim değildir.
  buyuk?: boolean;
  aciklama?: string;
}

export const TERIMLER: Terim[] = [
  { tr: "VE", en: "AND", buyuk: true, aciklama: "Bütün girişler 1 iken 1 veren mantık işlemi" },
  { tr: "VEYA", en: "OR", buyuk: true, aciklama: "Girişlerden en az biri 1 iken 1 veren mantık işlemi" },
  { tr: "DEĞİL", en: "NOT", buyuk: true, aciklama: "Girişin tersini veren mantık işlemi" },
  { tr: "ÖZEL VEYA", en: "XOR", buyuk: true, aciklama: "Girişlerden tek sayıda 1 varken 1 veren işlem" },
  { tr: "VE DEĞİL", en: "NAND", buyuk: true },
  { tr: "VEYA DEĞİL", en: "NOR", buyuk: true },
  { tr: "mantık kapısı", en: "logic gate" },
  { tr: "kapı", en: "gate" },
  { tr: "sentez", en: "synthesis", aciklama: "HDL kodunun kapı ve flip-flop bağlantı listesine (netlist) çevrilmesi" },
  { tr: "eşleme", en: "mapping", aciklama: "Netlist'teki elemanların FPGA'nın LUT ve flip-flop'larına atanması" },
  { tr: "yerleştirme", en: "place", aciklama: "Eşlenen elemanlara yonga üzerinde yer seçilmesi" },
  { tr: "yönlendirme", en: "routing", aciklama: "Yerleştirilen elemanlar arasındaki bağlantıların kurulması" },
  { tr: "benzetim", en: "simulation", aciklama: "Devrenin davranışının bilgisayarda denenmesi" },
  { tr: "simülasyon", en: "simulation" },
  { tr: "veri akışı", en: "dataflow", aciklama: "Devreyi eşzamanlı atamalarla anlatan modelleme" },
  { tr: "davranışsal", en: "behavioral", aciklama: "Devreyi process içindeki sıralı kodla anlatan modelleme" },
  { tr: "yapısal", en: "structural", aciklama: "Devreyi birbirine bağlanan bileşenlerle anlatan modelleme" },
  { tr: "algoritmik", en: "algorithmic" },
  { tr: "mantık bloğu", en: "logic block, CLB" },
  { tr: "mantık blokları", en: "logic blocks, CLB" },
  { tr: "ara bağlantı", en: "interconnect" },
  { tr: "program sayacı", en: "program counter" },
  { tr: "çarpım terimi", en: "product term" },
  { tr: "arama tablosu", en: "look-up table, LUT" },
  { tr: "kilitleme", en: "latch" },
  { tr: "çoklayıcı", en: "multiplexer, MUX" },
  { tr: "kod çözücü", en: "decoder" },
  { tr: "kodlayıcı", en: "encoder" },
  { tr: "yarım toplayıcı", en: "half adder" },
  { tr: "tam toplayıcı", en: "full adder" },
  { tr: "toplayıcı", en: "adder" },
  { tr: "karşılaştırıcı", en: "comparator" },
  { tr: "sayaç", en: "counter" },
  { tr: "kayıtçı", en: "register" },
  { tr: "tampon", en: "buffer" },
  { tr: "hassasiyet listesi", en: "sensitivity list", aciklama: "Bir process'i uyandıran sinyallerin listesi" },
  { tr: "eşzamanlı", en: "concurrent" },
  { tr: "sıralı", en: "sequential" },
  { tr: "öznitelik", en: "attribute" },
  { tr: "yükselen kenar", en: "rising edge" },
  { tr: "düşen kenar", en: "falling edge" },
  { tr: "saat", en: "clock" },
  { tr: "bit akışı", en: "bitstream" },
];

export type Parca = string | { metin: string; en: string };

const kacir = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const HARF = "a-zçğıöşüâîû";

// Uzun terimler önce denenir ("ÖZEL VEYA", "VEYA"dan önce). Küçük harfli terimler
// cümle başında büyük harfle de eşleşir ve Türkçe ekleri kapsar (sentezlenir,
// kapısı). Büyük harfli terimler kesme işaretli ekleri kapsar (VE'leri).
// Hemen ardından "(" gelen kullanım zaten açıklanmış sayılır.
const DESEN = new RegExp(
  [...TERIMLER]
    .sort((a, b) => b.tr.length - a.tr.length)
    .map((t) => {
      if (t.buyuk) return `(${kacir(t.tr)}(?:'[${HARF}]+)?)`;
      const ilk = t.tr[0]!;
      return `([${ilk}${ilk.toLocaleUpperCase("tr")}]${kacir(t.tr.slice(1))}[${HARF}]*)`;
    })
    .map((g) => `(?<![\\p{L}\\d_])${g}(?![\\p{L}\\d_])(?!\\s*\\()`)
    .join("|"),
  "gu",
);
const SIRALI = [...TERIMLER].sort((a, b) => b.tr.length - a.tr.length);

export function terimleriAyir(metin: string): Parca[] {
  const out: Parca[] = [];
  let son = 0;
  for (const m of metin.matchAll(DESEN)) {
    const i = m.slice(1).findIndex((g) => g !== undefined);
    const terim = SIRALI[i]!;
    if (m.index! > son) out.push(metin.slice(son, m.index));
    out.push({ metin: m[0], en: terim.en });
    son = m.index! + m[0].length;
  }
  if (son < metin.length) out.push(metin.slice(son));
  return out;
}
