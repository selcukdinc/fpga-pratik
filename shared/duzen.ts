// Simülasyon alanının pencere düzeni. Paneller iki satıra dizilir; her panelin
// satırdaki payı (oran) ve üst satırın yükseklik payı (ustOran) saklanır.
// Kayıtlı düzenler misafirde tarayıcıda, üyede hesapta tutulur.

export type PanelId = "sources" | "editor" | "waves" | "bottom";
export const PANELLER: PanelId[] = ["sources", "editor", "waves", "bottom"];

export interface PanelYeri {
  id: PanelId;
  oran: number;
}

export interface Duzen {
  ust: PanelYeri[];
  alt: PanelYeri[];
  ustOran: number;
}

export interface KayitliDuzen {
  ad: string;
  duzen: Duzen;
}

export const VARSAYILAN_DUZEN: Duzen = {
  ust: [
    { id: "sources", oran: 0.18 },
    { id: "editor", oran: 0.41 },
    { id: "waves", oran: 0.41 },
  ],
  alt: [{ id: "bottom", oran: 1 }],
  ustOran: 0.72,
};

export const EN_COK_DUZEN = 10;
export const DUZEN_ADI_UZUNLUK = 40;

const sinirla = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

// Bozuk ya da eksik bir düzeni kullanılabilir hale getirir: her panel tam bir kez
// yer alır, oranlar pozitiftir. Hiçbir şey kurtarılamazsa varsayılan döner.
export function duzenDuzelt(d: unknown): Duzen {
  if (!d || typeof d !== "object") return VARSAYILAN_DUZEN;
  const g = d as Partial<Duzen>;
  const gorulen = new Set<PanelId>();
  const satir = (s: unknown): PanelYeri[] => {
    const out: PanelYeri[] = [];
    for (const p of Array.isArray(s) ? s : []) {
      const id = (p as PanelYeri | null)?.id as PanelId;
      if (!PANELLER.includes(id) || gorulen.has(id)) continue;
      gorulen.add(id);
      const oran = Number((p as PanelYeri).oran);
      out.push({ id, oran: Number.isFinite(oran) ? sinirla(oran, 0.02, 50) : 1 });
    }
    return out;
  };
  const ust = satir(g.ust);
  const alt = satir(g.alt);
  // Eksik kalan paneller alt satıra eklenir
  for (const id of PANELLER) if (!gorulen.has(id)) alt.push({ id, oran: 1 });
  if (!ust.length && !alt.length) return VARSAYILAN_DUZEN;
  const ustOran = Number(g.ustOran);
  return { ust, alt, ustOran: Number.isFinite(ustOran) ? sinirla(ustOran, 0.15, 0.9) : VARSAYILAN_DUZEN.ustOran };
}

// Sunucuya gelen kayıtlı düzen listesini denetler; hata yoksa düzeltilmiş listeyi döner
export function duzenleriDenetle(v: unknown): { hata: string } | { duzenler: KayitliDuzen[] } {
  if (!Array.isArray(v)) return { hata: "Düzen listesi bekleniyordu." };
  if (v.length > EN_COK_DUZEN) return { hata: `En fazla ${EN_COK_DUZEN} düzen kaydedebilirsin.` };
  const adlar = new Set<string>();
  const duzenler: KayitliDuzen[] = [];
  for (const x of v) {
    const ad = typeof x?.ad === "string" ? x.ad.trim() : "";
    if (!ad) return { hata: "Düzen adı boş olamaz." };
    if (ad.length > DUZEN_ADI_UZUNLUK) return { hata: `Düzen adı en fazla ${DUZEN_ADI_UZUNLUK} karakter olabilir.` };
    if (adlar.has(ad.toLocaleLowerCase("tr"))) return { hata: `"${ad}" adında iki düzen var.` };
    adlar.add(ad.toLocaleLowerCase("tr"));
    duzenler.push({ ad, duzen: duzenDuzelt(x.duzen) });
  }
  return { duzenler };
}
