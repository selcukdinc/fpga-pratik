// Yönetim paneli ile Worker arasındaki tipler ve soru girdisi denetimi.
// Panel cevapları da görür; bu tipler sadece /api/yonetim altında kullanılır.

export type PanelSoruTipi = "tf" | "mcq" | "fill";

export type Beklenen = { value: boolean } | { index: number } | { blanks: string[][] };

export interface SoruGirdi {
  topicId: string;
  type: PanelSoruTipi;
  source: "original" | "derived";
  difficulty: number;
  sourceRef: string;
  prompt: string;
  explanation: string;
  choices: string[]; // sadece mcq
  answer: Beklenen;
  status: "draft" | "published";
  active: boolean;
}

// Kod soruları depodaki içerikten gelir (referans modeli worker/modeller.ts'de);
// panelde yalnızca durumları değiştirilebilir.
export interface PanelSoru extends Omit<SoruGirdi, "type"> {
  type: PanelSoruTipi | "code";
  id: string;
  week: number;
  updatedAt: number | null;
  deneme: number;
  dogru: number;
}

export interface PanelAyarlar {
  showOriginal: boolean;
  currentWeek: number;
  announcement: string;
}

export interface PanelOzet extends PanelAyarlar {
  soru: { toplam: number; yayinda: number; taslak: number; gizli: number; orijinal: number };
  uye: number;
  misafir: number;
  deneme: number;
}

export interface PanelKullanici {
  id: string;
  username: string;
  email: string | null;
  role: string;
  publicProfile: boolean;
  createdAt: number;
  deneme: number;
}

export interface PanelKayit {
  id: number;
  username: string | null;
  action: string;
  target: string | null;
  detail: string | null;
  createdAt: number;
}

const metin = (v: unknown, en: number) => typeof v === "string" && v.trim().length > 0 && v.length <= en;

// Hata yoksa null döner
export function soruGirdisiHatasi(g: Partial<SoruGirdi>): string | null {
  if (!metin(g.topicId, 100)) return "Konu seçilmeli.";
  if (g.type !== "tf" && g.type !== "mcq" && g.type !== "fill") return "Soru türü geçersiz.";
  if (g.source !== "original" && g.source !== "derived") return "Kaynak türü geçersiz.";
  if (![1, 2, 3].includes(g.difficulty as number)) return "Zorluk 1, 2 ya da 3 olmalı.";
  if (typeof g.sourceRef !== "string" || g.sourceRef.length > 200) return "Kaynak notu en fazla 200 karakter olabilir.";
  if (!metin(g.prompt, 4000)) return "Soru metni boş olamaz (en fazla 4000 karakter).";
  if (!metin(g.explanation, 4000)) return "Açıklama boş olamaz (en fazla 4000 karakter).";
  if (g.status !== "draft" && g.status !== "published") return "Durum geçersiz.";
  if (typeof g.active !== "boolean") return "Görünürlük geçersiz.";

  const a = g.answer as Record<string, unknown> | undefined;
  if (!a || typeof a !== "object") return "Doğru cevap seçilmeli.";
  switch (g.type) {
    case "tf":
      if (typeof a.value !== "boolean") return "Doğru ya da yanlış seçilmeli.";
      break;
    case "mcq": {
      const c = g.choices;
      if (!Array.isArray(c) || c.length < 2 || c.length > 6) return "2 ile 6 arasında şık olmalı.";
      if (!c.every((x) => metin(x, 500))) return "Şıklar boş olamaz (en fazla 500 karakter).";
      if (new Set(c.map((x) => x.trim())).size !== c.length) return "Aynı şık iki kez yazılmış.";
      if (!Number.isInteger(a.index) || (a.index as number) < 0 || (a.index as number) >= c.length) return "Doğru şık seçilmeli.";
      break;
    }
    case "fill": {
      const b = a.blanks;
      if (!Array.isArray(b) || b.length < 1 || b.length > 6) return "1 ile 6 arasında boşluk olmalı.";
      for (const [i, kabul] of b.entries()) {
        if (!Array.isArray(kabul) || kabul.length < 1 || kabul.length > 10 || !kabul.every((x) => metin(x, 200))) {
          return `Boşluk ${i + 1} için en az bir kabul edilen cevap yazılmalı.`;
        }
      }
      break;
    }
  }
  return null;
}

// Veritabanındaki payload / answer sütunları
export function soruSutunlari(g: SoruGirdi): { payload: string; answer: string } {
  if (g.type === "mcq") {
    return { payload: JSON.stringify({ choices: g.choices.map((c) => c.trim()) }), answer: JSON.stringify(g.answer) };
  }
  if (g.type === "fill") {
    const blanks = (g.answer as { blanks: string[][] }).blanks.map((b) => b.map((x) => x.trim()));
    return { payload: JSON.stringify({ blanks: blanks.length }), answer: JSON.stringify({ blanks }) };
  }
  return { payload: "{}", answer: JSON.stringify(g.answer) };
}
