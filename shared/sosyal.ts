// Soru önerileri ve yöneticiyle yazışmalar: istemci, Worker ve panel ortak tipleri.

import { soruGirdisiHatasi, type Beklenen } from "./yonetim";

export type OneriTipi = "tf" | "mcq" | "fill" | "code";
export type OneriDurumu = "pending" | "accepted" | "rejected";

export interface OneriGirdi {
  topicId: string;
  type: OneriTipi;
  prompt: string;
  choices: string[]; // sadece mcq
  // code önerilerinde cevap yoktur; beklenen davranış açıklamaya yazılır
  answer: Beklenen | Record<string, never>;
  explanation: string;
  showName: boolean;
}

export interface Oneri extends OneriGirdi {
  id: string;
  topicTitle: string;
  status: OneriDurumu;
  adminNote: string | null;
  questionId: string | null;
  createdAt: number;
  decidedAt: number | null;
  unread: boolean;
}

export interface PanelOneri extends Oneri {
  username: string | null;
}

export interface YazismaOzeti {
  id: string;
  subject: string;
  status: "open" | "closed";
  createdAt: number;
  updatedAt: number;
  unread: boolean;
  // Panel listesinde
  username?: string | null;
}

export interface YazismaMesaji {
  id: number;
  yonetici: boolean;
  body: string;
  createdAt: number;
}

export interface Yazisma extends YazismaOzeti {
  mesajlar: YazismaMesaji[];
}

export interface Okunmamis {
  mesaj: number;
  oneri: number;
}

export const GUNLUK_ONERI = 10;
export const GUNLUK_MESAJ = 10;
export const KONU_SINIRI = 120;
export const MESAJ_SINIRI = 4000;

const dolu = (v: unknown, en: number) => typeof v === "string" && v.trim().length > 0 && v.length <= en;

export function oneriHatasi(g: Partial<OneriGirdi>): string | null {
  if (g.type === "code") {
    if (!dolu(g.topicId, 100)) return "Konu seçilmeli.";
    if (!dolu(g.prompt, 4000)) return "Soru metni boş olamaz (en fazla 4000 karakter).";
    if (!dolu(g.explanation, 4000)) return "Beklenen davranışı ya da çözüm fikrini yaz (en fazla 4000 karakter).";
    if (typeof g.showName !== "boolean") return "Ad gösterme tercihi geçersiz.";
    return null;
  }
  if (typeof g.showName !== "boolean") return "Ad gösterme tercihi geçersiz.";
  // Kapalı uçlu öneriler, paneldeki soru girdisiyle aynı kurallara uyar
  return soruGirdisiHatasi({
    topicId: g.topicId, type: g.type as "tf", source: "derived", difficulty: 1, sourceRef: "",
    prompt: g.prompt, explanation: g.explanation, choices: g.choices ?? [], answer: g.answer as Beklenen,
    status: "draft", active: true,
  });
}

export function mesajHatasi(body: unknown): string | null {
  return dolu(body, MESAJ_SINIRI) ? null : `Mesaj boş olamaz (en fazla ${MESAJ_SINIRI} karakter).`;
}

export function konuHatasi(subject: unknown): string | null {
  return dolu(subject, KONU_SINIRI) ? null : `Konu boş olamaz (en fazla ${KONU_SINIRI} karakter).`;
}
