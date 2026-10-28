// Derslerdeki ilerleme: "Bu bölümü bitirdim" denen bölümler ve en son okunan
// bölüm. Misafirde tarayıcıda, üyede hesapta (users.ders_ilerleme) tutulur;
// giriş yapılınca tarayıcıdaki ilerleme hesaptakiyle birleştirilir.

export interface DersYeri {
  hafta: number;
  // Ders sayfasındaki bölümün sırası (0'dan)
  bolum: number;
  // Birleştirmede hangisinin daha yeni olduğunu bilmek için (ms)
  zaman: number;
}

export interface DersIlerleme {
  // Hafta -> bitirilen bölümlerin sıraları, küçükten büyüğe
  bitenler: Record<string, number[]>;
  son: DersYeri | null;
}

export const BOS_ILERLEME: DersIlerleme = { bitenler: {}, son: null };

const EN_COK_HAFTA = 20;
const EN_COK_BOLUM = 40;

const haftaGecerli = (h: unknown): h is number => Number.isInteger(h) && (h as number) >= 1 && (h as number) <= EN_COK_HAFTA;
const bolumGecerli = (b: unknown): b is number => Number.isInteger(b) && (b as number) >= 0 && (b as number) < EN_COK_BOLUM;

// Gelen değeri kullanılabilir hale getirir; geçersiz parçalar atılır
export function ilerlemeDuzelt(v: unknown): DersIlerleme {
  const x = (v ?? {}) as { bitenler?: unknown; son?: unknown };
  const bitenler: Record<string, number[]> = {};
  if (x.bitenler && typeof x.bitenler === "object") {
    for (const [h, liste] of Object.entries(x.bitenler as Record<string, unknown>)) {
      if (!haftaGecerli(Number(h)) || !Array.isArray(liste)) continue;
      const temiz = [...new Set(liste.filter(bolumGecerli))].sort((a, b) => a - b);
      if (temiz.length) bitenler[String(Number(h))] = temiz;
    }
  }
  const s = x.son as Partial<DersYeri> | null | undefined;
  const son = s && haftaGecerli(s.hafta) && bolumGecerli(s.bolum) && Number.isFinite(s.zaman)
    ? { hafta: s.hafta, bolum: s.bolum, zaman: s.zaman! }
    : null;
  return { bitenler, son };
}

// İki kaydı birleştirir: bitenler birleşimi, son yer daha yeni olan
export function ilerlemeBirlestir(a: DersIlerleme, b: DersIlerleme): DersIlerleme {
  const bitenler: Record<string, number[]> = { ...a.bitenler };
  for (const [h, liste] of Object.entries(b.bitenler)) {
    bitenler[h] = [...new Set([...(bitenler[h] ?? []), ...liste])].sort((x, y) => x - y);
  }
  const son = !a.son ? b.son : !b.son ? a.son : a.son.zaman >= b.son.zaman ? a.son : b.son;
  return { bitenler, son };
}

export function bolumBittiMi(i: DersIlerleme, hafta: number, bolum: number): boolean {
  return i.bitenler[String(hafta)]?.includes(bolum) ?? false;
}

export function bolumIsaretle(i: DersIlerleme, hafta: number, bolum: number, bitti: boolean): DersIlerleme {
  const h = String(hafta);
  const liste = (i.bitenler[h] ?? []).filter((b) => b !== bolum);
  if (bitti) liste.push(bolum);
  liste.sort((a, b) => a - b);
  const bitenler = { ...i.bitenler, [h]: liste };
  if (!liste.length) delete bitenler[h];
  return { ...i, bitenler };
}
