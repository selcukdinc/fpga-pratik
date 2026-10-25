import type { AnswerResult, ApiHata, Me, Profil, Question, Topic, TopicProgress } from "../../shared/api";
import type { Answer } from "../../shared/grade";
import type { PanelAyarlar, PanelKayit, PanelKullanici, PanelOzet, PanelSoru, SoruGirdi } from "../../shared/yonetim";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, { credentials: "same-origin" });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

// Form istekleri: hata da bir sonuç olarak döner, böylece alanın altında gösterilebilir
export type Sonuc<T> = { ok: true; data: T } | { ok: false; hata: ApiHata };

async function post<T>(path: string, body: unknown = {}, method = "POST"): Promise<Sonuc<T>> {
  try {
    const res = await fetch(`/api${path}`, {
      method,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) return { ok: true, data: data as T };
    return { ok: false, hata: data?.error ? (data as ApiHata) : { error: `Sunucu hatası (${res.status})` } };
  } catch {
    return { ok: false, hata: { error: "Sunucuya ulaşılamadı. Bağlantını kontrol et." } };
  }
}

export type MeYaniti = (Me & { epostaAcik: boolean }) | { epostaAcik: boolean; id?: undefined };
type Kod = { id: string; tekrarSaniye: number };

export const api = {
  me: () => get<MeYaniti>("/me"),
  topics: () => get<{ currentWeek: number; topics: Topic[]; announcement: string | null }>("/topics"),
  questions: (topic?: string) => get<Question[]>(topic ? `/questions?topic=${encodeURIComponent(topic)}` : "/questions"),
  progress: () => get<TopicProgress[]>("/progress"),
  profil: (ad: string) => get<Profil>(`/profil/${encodeURIComponent(ad)}`),
  async answer(id: string, answer: Answer): Promise<AnswerResult> {
    const r = await post<AnswerResult>(`/questions/${encodeURIComponent(id)}/answer`, { answer });
    if (!r.ok) throw new Error(r.hata.error);
    return r.data;
  },
  hesap: {
    adUygun: (ad: string) => get<{ uygun: boolean; sebep: string | null }>(`/hesap/kullanici-adi/${encodeURIComponent(ad)}`),
    kayit: (b: { username: string; password: string; email: string }) => post<Kod>("/hesap/kayit", b),
    kayitYeniden: (id: string) => post<{ tekrarSaniye: number }>("/hesap/kayit/yeniden", { id }),
    kayitDogrula: (id: string, kod: string) => post<Me>("/hesap/kayit/dogrula", { id, kod }),
    giris: (kimlik: string, parola: string) => post<Me>("/hesap/giris", { kimlik, parola }),
    cikis: () => post<{ ok: true }>("/hesap/cikis"),
    sifreIste: (kimlik: string) => post<Kod>("/hesap/sifre/iste", { kimlik }),
    sifreDogrula: (id: string, kod: string, parola: string) => post<Me>("/hesap/sifre/dogrula", { id, kod, parola }),
  },
  ayarlar: {
    profil: (b: { publicProfile?: boolean; avatar?: string; avatarBg?: string | null }) => post<Me>("/hesap/ayarlar/profil", b),
    parola: (mevcut: string, yeni: string) => post<{ ok: true }>("/hesap/ayarlar/parola", { mevcut, yeni }),
    kullaniciAdi: (yeni: string) => post<Me>("/hesap/ayarlar/kullanici-adi", { yeni }),
    eposta: (yeni: string, parola: string) => post<Kod>("/hesap/ayarlar/eposta", { yeni, parola }),
    epostaDogrula: (id: string, kod: string) => post<Me>("/hesap/ayarlar/eposta/dogrula", { id, kod }),
    oturumlariKapat: () => post<{ ok: true }>("/hesap/ayarlar/oturumlari-kapat"),
    hesabiSil: (parola: string) => post<{ ok: true }>("/hesap/ayarlar/hesabi-sil", { parola }),
  },
  yonetim: {
    ozet: () => get<PanelOzet>("/yonetim/ozet"),
    ayarlar: (b: Partial<PanelAyarlar>) => post<PanelAyarlar>("/yonetim/ayarlar", b),
    konular: () => get<Topic[]>("/yonetim/konular"),
    sorular: (f: Record<string, string>) => {
      const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
      return get<PanelSoru[]>(`/yonetim/sorular${q ? `?${q}` : ""}`);
    },
    soru: (id: string) => get<PanelSoru>(`/yonetim/sorular/${encodeURIComponent(id)}`),
    soruEkle: (g: SoruGirdi) => post<{ id: string }>("/yonetim/sorular", g),
    soruKaydet: (id: string, g: SoruGirdi) => post<{ id: string }>(`/yonetim/sorular/${encodeURIComponent(id)}`, g, "PUT"),
    soruDurum: (id: string, b: { active?: boolean; status?: "draft" | "published" }) =>
      post<{ ok: true }>(`/yonetim/sorular/${encodeURIComponent(id)}/durum`, b),
    kullanicilar: (ara: string) => get<PanelKullanici[]>(`/yonetim/kullanicilar${ara ? `?ara=${encodeURIComponent(ara)}` : ""}`),
    rol: (id: string, role: string) => post<{ ok: true }>(`/yonetim/kullanicilar/${encodeURIComponent(id)}/rol`, { role }),
    kayit: () => get<PanelKayit[]>("/yonetim/kayit"),
  },
};

export const REPO_URL = "https://github.com/selcukdinc/fpga-pratik";
