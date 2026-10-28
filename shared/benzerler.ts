// Aynı bilgiyi (çoğu kez yalnızca başka sayılarla) soran sorular. Soru havuzunda
// her gruptan tek soru görünür: kişinin daha önce denediği, yoksa listede ilk
// gelen. Böylece "az önce bunu cevapladım" denen ikizler art arda çıkmaz.
// Aralıklı tekrar bu gruplara bakmaz; orada başka sayılı ikiz, kuralı yeniden
// uygulatmak için işe yarar.
export const BENZERLER: string[][] = [
  ["h2-lut-bit", "t2-lut-4"],
  ["h2-prom-terim", "t2-prom-4giris"],
  ["h2-pla-terim-sayisi", "t2-pla-paylasim-sayi"],
  ["h3-tam-toplayici", "t3-tam-111"],
  ["h3-attr-downto", "t3-high-low"],
  ["h3-attr-to", "t3-left-right"],
  ["h4-std-ulogic-deger", "t4-dokuz-deger"],
  ["h4-nand-variable", "h4-nand-variable-2"],
  ["h5-wait-liste", "t5-hassas-wait"],
  ["h5-for-sayi", "t5-for-sayi"],
  ["t5-if-sonuc", "t5-if-sonuc2"],
  ["t5-oncelik-kodlayici", "t5-oncelik-kodlayici2"],
  ["t5-ws-sonuc", "t5-ws-dekoder"],
];

const GRUP = new Map(BENZERLER.flatMap((g, i) => g.map((id) => [id, i] as const)));

// Listeyi sırasını bozmadan gruplardan birer soruya indirir. denendi: kişinin
// daha önce denediği sorular; gruptan denenmiş biri varsa o kalır.
export function benzerleriAyikla<T extends { id: string }>(liste: T[], denendi: (id: string) => boolean): T[] {
  const temsilci = new Map<number, string>();
  for (const q of liste) {
    const g = GRUP.get(q.id);
    if (g === undefined) continue;
    const onceki = temsilci.get(g);
    if (onceki === undefined || (!denendi(onceki) && denendi(q.id))) temsilci.set(g, q.id);
  }
  return liste.filter((q) => {
    const g = GRUP.get(q.id);
    return g === undefined || temsilci.get(g) === q.id;
  });
}
