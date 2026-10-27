// Boşluk doldurma sorularının metnindeki "Boşluk 1: S, Boşluk 2: CO" bölümünü
// ayırır: metin bu bölüm olmadan gösterilir, her boşluğun adı kendi kutusunun
// üstünde yazar. Bölüm bulunamazsa metin olduğu gibi kalır, adlar boş döner.

export interface BoslukMetni {
  metin: string;
  adlar: (string | null)[];
}

export function bosluklariAyir(soru: string, sayi: number): BoslukMetni {
  const bos = { metin: soru, adlar: Array<string | null>(sayi).fill(null) };
  const bas = soru.search(/(^|\n\n)Boşluk 1:/);
  if (bas < 0 || sayi < 1) return bos;
  const bolum = soru.slice(bas).replace(/^\n\n/, "");
  const parcalar = bolum.split(/(?:^|,\s*|\n\n)Boşluk (\d+):\s*/);
  // split: ["", "1", "S", "2", "CO"]
  if (parcalar[0] !== "" || (parcalar.length - 1) / 2 !== sayi) return bos;
  const adlar: string[] = [];
  for (let i = 1; i < parcalar.length; i += 2) {
    if (Number(parcalar[i]) !== adlar.length + 1) return bos;
    adlar.push(parcalar[i + 1]!.trim());
  }
  return { metin: soru.slice(0, bas).trimEnd(), adlar };
}

// Kutunun üstündeki etiket: tek boşlukta "Cevap", birden çoksa "1. boşluk"
export const boslukEtiketi = (i: number, sayi: number) => (sayi === 1 ? "Cevap" : `${i + 1}. boşluk`);
