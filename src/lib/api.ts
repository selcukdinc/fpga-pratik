import type { AnswerResult, ApiHata, IlerlemeAyrintisi, Me, Profil, Question, SoruDurumlari, Topic, TopicProgress } from "../../shared/api";
import type { KayitliDuzen } from "../../shared/duzen";
import type { Answer } from "../../shared/grade";
import type { KodSonucu, Sinama } from "../../shared/kod";
import type { Okunmamis, Oneri, OneriGirdi, PanelOneri, Yazisma, YazismaOzeti } from "../../shared/sosyal";
import type { BildirimTuru, PanelBildirim, Paylasimlar, Tb, TbGirdi, TbOzeti } from "../../shared/topluluk";
import type { PanelAyarlar, PanelKayit, PanelKullanici, PanelOzet, PanelPano, PanelSoru, SoruGirdi } from "../../shared/yonetim";
import { kutlamaBildir } from "./kutlama";

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
  ilerlemeAyrintisi: () => get<IlerlemeAyrintisi>("/progress/ayrinti"),
  soruDurumlari: () => get<SoruDurumlari>("/questions/durum"),
  profil: (ad: string) => get<Profil>(`/profil/${encodeURIComponent(ad)}`),
  async answer(id: string, answer: Answer): Promise<AnswerResult> {
    const r = await post<AnswerResult>(`/questions/${encodeURIComponent(id)}/answer`, { answer });
    if (!r.ok) throw new Error(r.hata.error);
    kutlamaBildir(r.data.gunluk);
    return r.data;
  },
  sinama: (id: string) => post<Sinama>(`/questions/${encodeURIComponent(id)}/sinama`),
  async sinamaGonder(id: string, iz: string[]) {
    const r = await post<KodSonucu>(`/sinama/${encodeURIComponent(id)}`, { iz });
    if (r.ok) kutlamaBildir(r.data.gunluk);
    return r;
  },
  topluluk: {
    paylasimlar: (soru: string) => get<Paylasimlar>(`/topluluk/paylasimlar/${encodeURIComponent(soru)}`),
    paylas: (soru: string, kod: string | null) => post<{ ok: true }>(`/topluluk/paylasimlar/${encodeURIComponent(soru)}`, { kod }),
    paylasimiKaldir: (soru: string) => post<{ ok: true }>(`/topluluk/paylasimlar/${encodeURIComponent(soru)}`, {}, "DELETE"),
    tbler: (f: { konu?: string; kullanici?: string; sira?: string }) => {
      const q = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][]).toString();
      return get<TbOzeti[]>(`/topluluk/tb${q ? `?${q}` : ""}`);
    },
    tb: (id: string) => get<Tb>(`/topluluk/tb/${encodeURIComponent(id)}`),
    tbYayimla: (g: TbGirdi) => post<{ id: string }>("/topluluk/tb", g),
    tbSil: (id: string) => post<{ ok: true }>(`/topluluk/tb/${encodeURIComponent(id)}`, {}, "DELETE"),
    begen: (id: string) => post<{ begeni: number; benBegendim: boolean }>(`/topluluk/tb/${encodeURIComponent(id)}/begen`),
    cozdum: (id: string) => post<{ cozen: number }>(`/topluluk/tb/${encodeURIComponent(id)}/cozdum`),
    bildir: (tur: BildirimTuru, id: string, neden: string) => post<{ ok: true }>("/topluluk/bildir", { tur, id, neden }),
  },
  uye: {
    oneriler: () => get<Oneri[]>("/uye/oneriler"),
    oneriOkundu: () => post<{ ok: true }>("/uye/oneriler/okundu"),
    oner: (g: OneriGirdi) => post<{ id: string }>("/uye/oneriler", g),
    yazismalar: () => get<YazismaOzeti[]>("/uye/yazismalar"),
    yazisma: (id: string) => get<Yazisma>(`/uye/yazismalar/${encodeURIComponent(id)}`),
    yeniYazisma: (subject: string, body: string) => post<{ id: string }>("/uye/yazismalar", { subject, body }),
    yaz: (id: string, body: string) => post<{ ok: true }>(`/uye/yazismalar/${encodeURIComponent(id)}`, { body }),
    okunmamis: () => get<Okunmamis>("/uye/okunmamis"),
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
    profil: (b: { publicProfile?: boolean; avatar?: string; avatarBg?: string | null; notifyEmail?: boolean; gunlukHedef?: number }) => post<Me>("/hesap/ayarlar/profil", b),
    parola: (mevcut: string, yeni: string) => post<{ ok: true }>("/hesap/ayarlar/parola", { mevcut, yeni }),
    kullaniciAdi: (yeni: string) => post<Me>("/hesap/ayarlar/kullanici-adi", { yeni }),
    eposta: (yeni: string, parola: string) => post<Kod>("/hesap/ayarlar/eposta", { yeni, parola }),
    epostaDogrula: (id: string, kod: string) => post<Me>("/hesap/ayarlar/eposta/dogrula", { id, kod }),
    oturumlariKapat: () => post<{ ok: true }>("/hesap/ayarlar/oturumlari-kapat"),
    hesabiSil: (parola: string) => post<{ ok: true }>("/hesap/ayarlar/hesabi-sil", { parola }),
    duzenler: () => get<KayitliDuzen[]>("/hesap/ayarlar/duzenler"),
    duzenleriKaydet: (duzenler: KayitliDuzen[]) => post<KayitliDuzen[]>("/hesap/ayarlar/duzenler", { duzenler }, "PUT"),
  },
  yonetim: {
    ozet: () => get<PanelOzet>("/yonetim/ozet"),
    pano: () => get<PanelPano>("/yonetim/pano"),
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
    sustur: (id: string, gun: number) => post<{ mutedUntil: number | null }>(`/yonetim/kullanicilar/${encodeURIComponent(id)}/sustur`, { gun }),
    oneriler: (durum: string) => get<PanelOneri[]>(`/yonetim/oneriler${durum ? `?durum=${durum}` : ""}`),
    oneri: (id: string) => get<PanelOneri>(`/yonetim/oneriler/${encodeURIComponent(id)}`),
    oneriKabul: (id: string, not: string) => post<{ questionId: string | null }>(`/yonetim/oneriler/${encodeURIComponent(id)}/kabul`, { not }),
    oneriRed: (id: string, not: string) => post<{ ok: true }>(`/yonetim/oneriler/${encodeURIComponent(id)}/red`, { not }),
    yazismalar: (durum: string) => get<YazismaOzeti[]>(`/yonetim/yazismalar${durum ? `?durum=${durum}` : ""}`),
    yazisma: (id: string) => get<Yazisma>(`/yonetim/yazismalar/${encodeURIComponent(id)}`),
    cevapla: (id: string, body: string) => post<{ ok: true }>(`/yonetim/yazismalar/${encodeURIComponent(id)}`, { body }),
    yazismaDurum: (id: string, status: "open" | "closed") =>
      post<{ ok: true }>(`/yonetim/yazismalar/${encodeURIComponent(id)}/durum`, { status }),
    rol: (id: string, role: string) => post<{ ok: true }>(`/yonetim/kullanicilar/${encodeURIComponent(id)}/rol`, { role }),
    kayit: () => get<PanelKayit[]>("/yonetim/kayit"),
    bildirimler: () => get<PanelBildirim[]>("/yonetim/bildirimler"),
    bildirimIslem: (tur: BildirimTuru, id: string, islem: "kaldir" | "geri-ac") =>
      post<{ ok: true }>(`/yonetim/bildirimler/${tur}/${encodeURIComponent(id)}`, { islem }),
  },
};

export const REPO_URL = "https://github.com/selcukdinc/fpga-pratik";
