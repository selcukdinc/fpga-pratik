// Paylaşılan sonuçlar, topluluk testbench'leri ve bildirimler: istemci, Worker ve panel ortak tipleri.

export interface Paylasim {
  id: string;
  username: string | null;
  avatar: string | null;
  avatarBg: string | null;
  gecen: number;
  toplam: number;
  // İlk hatalı kontrol noktası; hepsi geçtiyse null
  ilkHata: number | null;
  kod: string | null;
  createdAt: number;
  benim: boolean;
  bildirdim: boolean;
  // Yalnızca sahibine: bildirimler yüzünden gizlendi
  gizli: boolean;
}

export interface Paylasimlar {
  // Yönetici sınav döneminde kod paylaşımını kapatabilir
  kodAcik: boolean;
  // Üye kodunu paylaşabilir mi (hesap 24 saatten eski ve susturulmamış)
  kodPaylasabilir: boolean;
  liste: Paylasim[];
}

export interface TbOzeti {
  id: string;
  topicId: string;
  topicTitle: string;
  title: string;
  username: string | null;
  begeni: number;
  cozen: number;
  benBegendim: boolean;
  benCozdum: boolean;
  gizli: boolean;
  createdAt: number;
}

export interface Tb extends TbOzeti {
  description: string;
  sablon: string;
  testbench: string;
  top: string;
  stopTime: string;
  benim: boolean;
  bildirdim: boolean;
  silebilir: boolean;
}

export interface TbGirdi {
  topicId: string;
  title: string;
  description: string;
  sablon: string;
  testbench: string;
  top: string;
  stopTime: string;
}

export type BildirimTuru = "tb" | "paylasim";

export interface PanelBildirim {
  tur: BildirimTuru;
  id: string;
  baslik: string;
  sahibi: string | null;
  sayi: number;
  nedenler: string[];
  gizli: boolean;
  sonTarih: number;
  // Bağlantı: testbench sayfası ya da paylaşımın sorusu
  bag: string;
  // Paylaşılan kod ya da testbench'in kendisi, panelde göz atmak için
  icerik: string | null;
}

export const KOD_SINIRI = 20_000;
export const GUNLUK_TB = 5;
export const BILDIRIM_ESIGI = 3;
export const YENI_HESAP_MS = 24 * 60 * 60 * 1000;

const dolu = (v: unknown, en: number, az = 1) => typeof v === "string" && v.trim().length >= az && v.length <= en;
const VHDL_ADI = /^[A-Za-z][A-Za-z0-9_]*$/;
const SURE = /^\d+(\.\d+)?\s*(fs|ps|ns|us|ms)$/;

// Simülasyon süresi en fazla 10 ms olabilir (tarayıcıda uzun benzetim donmasın)
export function sureNs(s: string): number | null {
  const m = /^(\d+(?:\.\d+)?)\s*(fs|ps|ns|us|ms)$/.exec(s.trim());
  if (!m) return null;
  const carpan = { fs: 1e-6, ps: 1e-3, ns: 1, us: 1e3, ms: 1e6 }[m[2] as "ns"];
  return Number(m[1]) * carpan;
}

export function tbHatasi(g: Partial<TbGirdi>): string | null {
  if (!dolu(g.topicId, 100)) return "Konu seçilmeli.";
  if (!dolu(g.title, 100, 3)) return "Başlık 3 ile 100 karakter arasında olmalı.";
  if (typeof g.description !== "string" || g.description.length > 2000) return "Açıklama en fazla 2000 karakter olabilir.";
  if (!dolu(g.sablon, KOD_SINIRI)) return "Şablon boş olamaz (en fazla 20 KB).";
  if (!dolu(g.testbench, KOD_SINIRI)) return "Testbench boş olamaz (en fazla 20 KB).";
  if (typeof g.top !== "string" || !VHDL_ADI.test(g.top) || g.top.length > 60) return "Testbench'in entity adı geçersiz.";
  if (typeof g.stopTime !== "string" || !SURE.test(g.stopTime.trim())) return "Süre 100 ns, 2 us gibi yazılmalı.";
  const ns = sureNs(g.stopTime)!;
  if (ns <= 0 || ns > 10_000_000) return "Süre 0 ile 10 ms arasında olmalı.";
  if (!/\bseverity\s+(failure|error)\b/i.test(g.testbench!)) {
    return "Testbench hatayı bildirmeli: en az bir assert ... severity failure (ya da error) satırı olmalı.";
  }
  return null;
}

export const NEDENLER = ["Kopya ya da sınav sorusunun cevabı", "Hatalı ya da yanıltıcı", "Uygunsuz içerik", "Spam"] as const;

export function bildirimHatasi(b: { tur?: unknown; id?: unknown; neden?: unknown }): string | null {
  if (b.tur !== "tb" && b.tur !== "paylasim") return "Bildirim türü geçersiz.";
  if (!dolu(b.id, 100)) return "Bildirilen içerik geçersiz.";
  if (!dolu(b.neden, 300)) return "Bir neden seç ya da yaz (en fazla 300 karakter).";
  return null;
}

// Çözümden çözenin başlayacağı şablonu çıkarır: kütüphane satırları, entity
// bildirimi ve boş bir mimari. Çözümün mimarisi şablona girmez.
export function sablonCikar(cozum: string): { sablon: string; varlik: string } | null {
  const temiz = cozum.replace(/\r\n/g, "\n").replace(/--.*$/gm, "").replace(/[ \t]+$/gm, "");
  const ent = /\bentity\s+([A-Za-z][A-Za-z0-9_]*)\s+is\b[\s\S]*?\bend\b(?:\s+entity)?(?:\s+\1)?\s*;/i.exec(temiz);
  if (!ent) return null;
  const varlik = ent[1]!;
  const once = temiz.slice(0, ent.index);
  const kutuphane = once
    .split("\n")
    .filter((s) => /^\s*(library|use)\b/i.test(s))
    .join("\n");
  const sablon = `${kutuphane ? `${kutuphane}\n\n` : ""}${ent[0]}\n\narchitecture rtl of ${varlik} is\nbegin\n\nend rtl;\n`;
  return { sablon, varlik };
}
