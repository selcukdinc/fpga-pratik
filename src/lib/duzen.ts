// Pencere düzeni üzerindeki saf işlemler: paneli taşıma, komşu panelleri ve
// satırları yeniden boyutlandırma. Bileşen bunları sürükleme olaylarından çağırır.

import { duzenDuzelt, type Duzen, type PanelId, type PanelYeri } from "../../shared/duzen";

export type SatirAdi = "ust" | "alt";

export function paneliBul(d: Duzen, id: PanelId): { satir: SatirAdi; indeks: number } {
  const i = d.ust.findIndex((p) => p.id === id);
  return i >= 0 ? { satir: "ust", indeks: i } : { satir: "alt", indeks: d.alt.findIndex((p) => p.id === id) };
}

// Paneli hedef satırın verilen sırasına taşır. Yeni yerinde satırdaki
// panellerin ortalama payını alır, böylece bir anda çok büyük ya da küçük olmaz.
export function tasi(d: Duzen, id: PanelId, satir: SatirAdi, indeks: number): Duzen {
  const kaynak = paneliBul(d, id);
  const yeni: Duzen = { ...d, ust: d.ust.filter((p) => p.id !== id), alt: d.alt.filter((p) => p.id !== id) };
  const hedef = yeni[satir];
  // Aynı satırda ileri taşınırken çıkarılan panel sırayı bir kaydırır
  const sira = kaynak.satir === satir && kaynak.indeks < indeks ? indeks - 1 : indeks;
  const ortalama = hedef.length ? hedef.reduce((s, p) => s + p.oran, 0) / hedef.length : 1;
  const yer: PanelYeri = { id, oran: ortalama };
  yeni[satir] = [...hedef.slice(0, sira), yer, ...hedef.slice(sira)];
  return duzenDuzelt(yeni);
}

// Bir satırdaki i. ve i+1. panel arasındaki ayırıcı, satır genişliğinin
// `pay` kadarı (-1..1) kaydırılır. İki panelin toplam payı korunur.
export function komsuBoyutla(d: Duzen, satir: SatirAdi, i: number, pay: number, enAzPay = 0.06): Duzen {
  const s = d[satir];
  const a = s[i];
  const b = s[i + 1];
  if (!a || !b) return d;
  const toplam = s.reduce((t, p) => t + p.oran, 0);
  const ikisi = a.oran + b.oran;
  const enAz = enAzPay * toplam;
  const yeniA = Math.min(ikisi - enAz, Math.max(enAz, a.oran + pay * toplam));
  const yeniSatir = s.map((p, j) => (j === i ? { ...p, oran: yeniA } : j === i + 1 ? { ...p, oran: ikisi - yeniA } : p));
  return { ...d, [satir]: yeniSatir };
}

export function satirBoyutla(d: Duzen, ustOran: number): Duzen {
  return { ...d, ustOran: Math.min(0.9, Math.max(0.15, ustOran)) };
}

// Satırdaki bir ayırıcıya çift tıklayınca iki komşu eşit paylaşır
export function komsuEsitle(d: Duzen, satir: SatirAdi, i: number): Duzen {
  const s = d[satir];
  if (!s[i] || !s[i + 1]) return d;
  const yarim = (s[i].oran + s[i + 1].oran) / 2;
  return { ...d, [satir]: s.map((p, j) => (j === i || j === i + 1 ? { ...p, oran: yarim } : p)) };
}
