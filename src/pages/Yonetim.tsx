// /yonetim: genel ayarlar, soru listesi, öneriler, mesajlar, kullanıcılar ve işlem kaydı

import { useEffect, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { href, navigate, type YonetimBolumu } from "../lib/router";
import { useOturum } from "../lib/oturum";
import { FormHatasi } from "../components/Form";
import { Markdown, inline } from "../components/Markdown";
import { YazismaGorunumu, YazismaListesi } from "../components/Yazisma";
import { SoruDuzenle } from "./SoruDuzenle";
import { SoruPanosu } from "../components/SoruPanosu";
import type { Topic } from "../../shared/api";
import type { PanelKayit, PanelKullanici, PanelOzet, PanelSoru } from "../../shared/yonetim";
import type { PanelOneri, YazismaOzeti } from "../../shared/sosyal";
import type { PanelBildirim } from "../../shared/topluluk";

const BOLUMLER: [YonetimBolumu, string][] = [
  ["genel", "Genel"],
  ["sorular", "Sorular"],
  ["oneriler", "Öneriler"],
  ["mesajlar", "Mesajlar"],
  ["bildirimler", "Bildirimler"],
  ["kullanicilar", "Kullanıcılar"],
  ["kayit", "İşlem kaydı"],
];

const zaman = (ms: number) =>
  new Date(ms).toLocaleString("tr-TR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

function Genel() {
  const [o, setO] = useState<PanelOzet | null>(null);
  const [hafta, setHafta] = useState(1);
  const [duyuru, setDuyuru] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [tamam, setTamam] = useState<string | null>(null);

  const yukle = () =>
    api.yonetim.ozet().then((r) => {
      setO(r);
      setHafta(r.currentWeek);
      setDuyuru(r.announcement);
    }, (e) => setHata(String(e)));
  useEffect(() => {
    void yukle();
  }, []);

  const kaydet = async (b: Parameters<typeof api.yonetim.ayarlar>[0], mesaj: string) => {
    setHata(null);
    setTamam(null);
    const r = await api.yonetim.ayarlar(b);
    if (!r.ok) return setHata(r.hata.error);
    setTamam(mesaj);
    void yukle();
  };

  if (!o) return hata ? <FormHatasi hata={hata} /> : <p className="empty">Yükleniyor…</p>;

  return (
    <div className="panel-genel">
      <section className="ayar-bolum">
        <h3>Orijinal sorular</h3>
        <p>
          Sunumlardan gelen {o.soru.orijinal} soru şu an sitede{" "}
          <strong className={o.showOriginal ? "ok" : "bad"}>{o.showOriginal ? "görünüyor" : "gizli"}</strong>. Gizliyken
          listede, ilerlemede ve profillerde görünmezler, cevaplanamazlar. Eski denemeler silinmez.
        </p>
        <button
          className={o.showOriginal ? "tehlike" : "primary"}
          onClick={() =>
            kaydet({ showOriginal: !o.showOriginal }, o.showOriginal ? "Orijinal sorular gizlendi." : "Orijinal sorular açıldı.")
          }
        >
          {o.showOriginal ? "Orijinal soruları gizle" : "Orijinal soruları göster"}
        </button>
      </section>

      <section className="ayar-bolum">
        <h3>Paylaşılan kodlar</h3>
        <p>
          Kod sorularında üyelerin isteyerek paylaştığı kodlar şu an{" "}
          <strong className={o.kodPaylasimi ? "ok" : "bad"}>{o.kodPaylasimi ? "görünüyor" : "gizli"}</strong>. Sınav döneminde
          kopyayı önlemek için kapatabilirsin; skorlar görünmeye devam eder, kayıtlı kodlar silinmez.
        </p>
        <button
          onClick={() =>
            kaydet({ kodPaylasimi: !o.kodPaylasimi }, o.kodPaylasimi ? "Paylaşılan kodlar gizlendi." : "Paylaşılan kodlar açıldı.")
          }
        >
          {o.kodPaylasimi ? "Paylaşılan kodları gizle" : "Paylaşılan kodları göster"}
        </button>
      </section>

      <section className="ayar-bolum">
        <h3>Geçerli hafta</h3>
        <form
          className="satir-form"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            void kaydet({ currentWeek: hafta }, `Geçerli hafta ${hafta} oldu.`);
          }}
        >
          <label>
            Sorular bu haftaya kadar açık:{" "}
            <input type="number" min={1} max={14} value={hafta} onChange={(e) => setHafta(Number(e.target.value))} />
          </label>
          <button type="submit" disabled={hafta === o.currentWeek}>Kaydet</button>
        </form>
      </section>

      <section className="ayar-bolum">
        <h3>Duyuru şeridi</h3>
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            void kaydet({ announcement: duyuru }, duyuru.trim() ? "Duyuru yayında." : "Duyuru kaldırıldı.");
          }}
        >
          <textarea rows={2} maxLength={300} value={duyuru} onChange={(e) => setDuyuru(e.target.value)} placeholder="Boş bırakılırsa şerit görünmez" />
          <p className="hint">Sitenin üstünde herkese görünür. `kod` ve **kalın** yazılabilir.</p>
          <button type="submit" disabled={duyuru.trim() === o.announcement}>Kaydet</button>
        </form>
      </section>

      <FormHatasi hata={hata} />
      {tamam && <p className="ok" role="status">{tamam}</p>}

      <section className="ayar-bolum">
        <h3>Durum</h3>
        <ul className="sayilar">
          <li><strong>{o.soru.yayinda}</strong> yayında soru</li>
          <li><strong>{o.soru.taslak}</strong> taslak</li>
          <li><strong>{o.soru.gizli}</strong> tek tek gizlenmiş</li>
          <li><strong>{o.uye}</strong> üye</li>
          <li><strong>{o.misafir}</strong> misafir</li>
          <li><strong>{o.deneme}</strong> cevap denemesi</li>
          <li><a href={href({ page: "yonetim", bolum: "oneriler" })}><strong>{o.bekleyenOneri}</strong> bekleyen öneri</a></li>
          <li><a href={href({ page: "yonetim", bolum: "mesajlar" })}><strong>{o.okunmamisMesaj}</strong> okunmamış mesaj</a></li>
          <li><a href={href({ page: "yonetim", bolum: "bildirimler" })}><strong>{o.acikBildirim}</strong> bildirilen içerik</a></li>
        </ul>
      </section>
    </div>
  );
}

const TUR = { tf: "D/Y", mcq: "Şıklı", fill: "Boşluk", code: "Kod" } as const;

function SoruListesi() {
  const [konular, setKonular] = useState<Topic[]>([]);
  const [filtre, setFiltre] = useState({ konu: "", kaynak: "", durum: "", ara: "" });
  const [sorular, setSorular] = useState<PanelSoru[] | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [siralama, setSiralama] = useState<"sira" | "oran">("sira");

  useEffect(() => {
    api.yonetim.konular().then(setKonular, () => {});
  }, []);

  const yukle = () => api.yonetim.sorular(filtre).then(setSorular, (e) => setHata(String(e)));
  useEffect(() => {
    const t = setTimeout(() => void yukle(), filtre.ara ? 300 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtre]);

  const durum = async (s: PanelSoru, b: { active?: boolean; status?: "draft" | "published" }) => {
    const r = await api.yonetim.soruDurum(s.id, b);
    if (!r.ok) return setHata(r.hata.error);
    void yukle();
  };

  const konuAdi = new Map(konular.map((k) => [k.id, k.title]));
  const oran = (s: PanelSoru) => (s.deneme ? s.dogru / s.deneme : 2);
  const liste = sorular && (siralama === "oran" ? [...sorular].sort((a, b) => oran(a) - oran(b)) : sorular);

  return (
    <div className="panel-sorular">
      <SoruPanosu durum={filtre.durum} durumSec={(durum) => setFiltre({ ...filtre, durum })} />
      <div className="filtreler">
        <select value={filtre.konu} onChange={(e) => setFiltre({ ...filtre, konu: e.target.value })} aria-label="Konu">
          <option value="">Tüm konular</option>
          {konular.map((k) => (
            <option key={k.id} value={k.id}>H{k.week} · {k.title}</option>
          ))}
        </select>
        <select value={filtre.kaynak} onChange={(e) => setFiltre({ ...filtre, kaynak: e.target.value })} aria-label="Kaynak">
          <option value="">Orijinal ve türetilmiş</option>
          <option value="original">Orijinal</option>
          <option value="derived">Türetilmiş</option>
        </select>
        <select value={filtre.durum} onChange={(e) => setFiltre({ ...filtre, durum: e.target.value })} aria-label="Durum">
          <option value="">Her durum</option>
          <option value="yayinda">Yayında</option>
          <option value="taslak">Taslak</option>
          <option value="gizli">Gizlenmiş</option>
        </select>
        <input type="search" placeholder="Kimlik ya da metinde ara" value={filtre.ara} onChange={(e) => setFiltre({ ...filtre, ara: e.target.value })} />
        <select value={siralama} onChange={(e) => setSiralama(e.target.value as "sira" | "oran")} aria-label="Sıralama">
          <option value="sira">Hafta sırasıyla</option>
          <option value="oran">En çok yanlış yapılan önce</option>
        </select>
        <a className="buton primary" href={href({ page: "yonetim", bolum: "sorular", soru: "yeni" })}>+ Yeni soru</a>
      </div>
      <FormHatasi hata={hata} />
      {!liste ? (
        <p className="empty">Yükleniyor…</p>
      ) : (
        <>
          <p className="hint">{liste.length} soru</p>
          <div className="tablo-kap">
            <table className="panel-tablo">
              <thead>
                <tr>
                  <th>Soru</th>
                  <th>Tür</th>
                  <th>Deneme</th>
                  <th>Doğru</th>
                  <th>Durum</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {liste.map((s) => (
                  <tr key={s.id} className={s.status === "draft" || !s.active ? "soluk" : undefined}>
                    <td>
                      <a href={href({ page: "yonetim", bolum: "sorular", soru: s.id })} className="mono">{s.id}</a>
                      <span className={`tag tag-${s.source}`}>{s.source === "original" ? "Orijinal" : "Türetilmiş"}</span>
                      <span className="tag">H{s.week}</span>
                      {s.updatedAt && <span className="tag" title="Panelde değiştirildi">panel</span>}
                      <div className="panel-ozet">{inline(s.prompt.replace(/```[\s\S]*?```/g, "[kod]").slice(0, 140))}</div>
                      <div className="hint">{konuAdi.get(s.topicId)}</div>
                    </td>
                    <td>{TUR[s.type]}</td>
                    <td className="sayi">{s.deneme}</td>
                    <td className="sayi">{s.deneme ? `%${Math.round((s.dogru / s.deneme) * 100)}` : "-"}</td>
                    <td>{s.status === "draft" ? "Taslak" : s.active ? "Yayında" : "Gizli"}</td>
                    <td className="islemler">
                      {s.status === "draft" ? (
                        <button onClick={() => durum(s, { status: "published", active: true })}>Yayınla</button>
                      ) : (
                        <button onClick={() => durum(s, { active: !s.active })}>{s.active ? "Gizle" : "Göster"}</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Kullanicilar() {
  const { me } = useOturum();
  const [ara, setAra] = useState("");
  const [liste, setListe] = useState<PanelKullanici[] | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  const yukle = () => api.yonetim.kullanicilar(ara).then(setListe, (e) => setHata(String(e)));
  useEffect(() => {
    const t = setTimeout(() => void yukle(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ara]);

  const rol = async (u: PanelKullanici, role: string) => {
    if (role === "admin" && !confirm(`${u.username} yönetici olsun mu? Panelde senin yapabildiğin her şeyi yapabilir.`)) return;
    const r = await api.yonetim.rol(u.id, role);
    if (!r.ok) return setHata(r.hata.error);
    void yukle();
  };

  const sustur = async (u: PanelKullanici, gun: number) => {
    const ne = gun === 0 ? "susturması kalksın" : gun < 0 ? "kalıcı olarak susturulsun" : `${gun} gün susturulsun`;
    if (!confirm(`${u.username} ${ne} mu? Susturulan üye soru öneremez; yöneticiye yazmaya devam edebilir.`)) return;
    const r = await api.yonetim.sustur(u.id, gun);
    if (!r.ok) return setHata(r.hata.error);
    void yukle();
  };

  return (
    <div className="panel-sorular">
      <div className="filtreler">
        <input type="search" placeholder="Kullanıcı adı ya da e-posta" value={ara} onChange={(e) => setAra(e.target.value)} />
      </div>
      <FormHatasi hata={hata} />
      {!liste ? (
        <p className="empty">Yükleniyor…</p>
      ) : (
        <div className="tablo-kap">
          <table className="panel-tablo">
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>E-posta</th>
                <th>Katıldı</th>
                <th>Deneme</th>
                <th>Rol</th>
                <th>Öneri</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((u) => (
                <tr key={u.id}>
                  <td>
                    <a href={href({ page: "profil", ad: u.username })}>{u.username}</a>
                    {u.publicProfile && <span className="tag">açık profil</span>}
                  </td>
                  <td>{u.email}</td>
                  <td>{zaman(u.createdAt)}</td>
                  <td className="sayi">{u.deneme}</td>
                  <td>
                    <select value={u.role} disabled={u.id === me?.id} onChange={(e) => rol(u, e.target.value)} aria-label={`${u.username} rolü`}>
                      <option value="user">Üye</option>
                      <option value="admin">Yönetici</option>
                    </select>
                  </td>
                  <td className="islemler">
                    {u.mutedUntil && u.mutedUntil > Date.now() ? (
                      <>
                        <span className="tag durum-rejected" title={u.mutedUntil > 253402300000000 ? undefined : zaman(u.mutedUntil)}>
                          {u.mutedUntil > 253402300000000 ? "kalıcı susturuldu" : `${zaman(u.mutedUntil)} tarihine kadar susturuldu`}
                        </span>
                        <button onClick={() => sustur(u, 0)}>Kaldır</button>
                      </>
                    ) : u.id === me?.id ? null : (
                      <>
                        <button onClick={() => sustur(u, 7)}>7 gün sustur</button>
                        <button onClick={() => sustur(u, -1)}>Kalıcı</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const EYLEM: Record<string, string> = {
  ayar: "Ayar değişti",
  "soru.ekle": "Soru eklendi",
  "soru.duzenle": "Soru düzenlendi",
  "soru.durum": "Soru durumu değişti",
  "kullanici.rol": "Rol değişti",
  "kullanici.sustur": "Susturma değişti",
  "oneri.kabul": "Öneri kabul edildi",
  "oneri.red": "Öneri reddedildi",
  "mesaj.cevap": "Mesaja cevap verildi",
  "mesaj.durum": "Yazışma durumu değişti",
  "bildirim.kaldir": "Bildirilen içerik kaldırıldı",
  "bildirim.geri-ac": "Bildirilen içerik geri açıldı",
  "tb.sil": "Testbench silindi",
};

function Bildirimler() {
  const [liste, setListe] = useState<PanelBildirim[] | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const yukle = () => api.yonetim.bildirimler().then(setListe, (e) => setHata(String(e)));
  useEffect(() => {
    void yukle();
  }, []);

  const islem = async (b: PanelBildirim, i: "kaldir" | "geri-ac") => {
    if (i === "kaldir" && !confirm(`"${b.baslik}" kalıcı olarak silinsin mi?`)) return;
    const r = await api.yonetim.bildirimIslem(b.tur, b.id, i);
    if (!r.ok) return setHata(r.hata.error);
    void yukle();
  };

  return (
    <div className="panel-sorular">
      <p className="hint">
        3 farklı üyeden bildirim alan içerik sen bakana kadar otomatik gizlenir. "Görünür kalsın" bildirimleri kapatır,
        "Kaldır" içeriği siler. Sık bildirilen bir üyeyi Kullanıcılar sekmesinden susturabilirsin.
      </p>
      <FormHatasi hata={hata} />
      {!liste ? (
        <p className="empty">Yükleniyor…</p>
      ) : !liste.length ? (
        <p className="empty">Açık bildirim yok.</p>
      ) : (
        <ul className="oneri-listesi">
          {liste.map((b) => (
            <li key={`${b.tur}:${b.id}`}>
              <div className="oneri-ust">
                <span className="tag">{b.tur === "tb" ? "Testbench" : "Paylaşılan sonuç"}</span>
                {b.gizli && <span className="tag durum-rejected">gizlendi</span>}
                <span className="tag durum-pending">{b.sayi} bildirim</span>
                <span className="hint">@{b.sahibi ?? "silinmiş"} · {zaman(b.sonTarih)}</span>
              </div>
              <a className="oneri-metni" href={b.bag}>{b.baslik}</a>
              <ul className="bildirim-nedenleri">
                {b.nedenler.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
              {b.icerik && (
                <details>
                  <summary>İçeriğe bak</summary>
                  <pre className="log">{b.icerik}</pre>
                </details>
              )}
              <div className="form-dugmeler">
                <button onClick={() => islem(b, "geri-ac")}>Görünür kalsın</button>
                <button className="tehlike" onClick={() => islem(b, "kaldir")}>Kaldır</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const ONERI_TURU = { tf: "Doğru / yanlış", mcq: "Çoktan seçmeli", fill: "Boşluk doldurma", code: "Kod yazma" } as const;
const ONERI_DURUMU = { pending: "Bekliyor", accepted: "Kabul edildi", rejected: "Reddedildi" } as const;

function OneriListesi() {
  const [durum, setDurum] = useState("pending");
  const [liste, setListe] = useState<PanelOneri[] | null>(null);
  useEffect(() => {
    setListe(null);
    api.yonetim.oneriler(durum).then(setListe, () => setListe([]));
  }, [durum]);

  return (
    <div className="panel-sorular">
      <div className="filtreler">
        <select value={durum} onChange={(e) => setDurum(e.target.value)} aria-label="Durum">
          <option value="pending">Bekleyenler</option>
          <option value="accepted">Kabul edilenler</option>
          <option value="rejected">Reddedilenler</option>
          <option value="">Hepsi</option>
        </select>
      </div>
      {!liste ? (
        <p className="empty">Yükleniyor…</p>
      ) : !liste.length ? (
        <p className="empty">Bu durumda öneri yok.</p>
      ) : (
        <ul className="oneri-listesi">
          {liste.map((o) => (
            <li key={o.id}>
              <div className="oneri-ust">
                <span className={`tag durum-${o.status}`}>{ONERI_DURUMU[o.status]}</span>
                <span className="tag">{ONERI_TURU[o.type]}</span>
                <span className="hint">@{o.username ?? "silinmiş"} · {o.topicTitle} · {zaman(o.createdAt)}</span>
              </div>
              <a className="oneri-metni" href={href({ page: "yonetim", bolum: "oneriler", alt: o.id })}>
                {inline(o.prompt.replace(/```[\s\S]*?```/g, "[kod]").slice(0, 200))}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OneriDetay({ id }: { id: string }) {
  const [o, setO] = useState<PanelOneri | null>(null);
  const [yok, setYok] = useState(false);
  const [not, setNot] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [mesgul, setMesgul] = useState(false);

  const yukle = () => api.yonetim.oneri(id).then(setO, () => setYok(true));
  useEffect(() => {
    void yukle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const geri = href({ page: "yonetim", bolum: "oneriler" });
  if (yok) return <p className="empty">Öneri bulunamadı. <a href={geri}>Listeye dön</a></p>;
  if (!o) return <p className="empty">Yükleniyor…</p>;

  const karar = async (kabul: boolean) => {
    setMesgul(true);
    setHata(null);
    const r = kabul ? await api.yonetim.oneriKabul(o.id, not) : await api.yonetim.oneriRed(o.id, not);
    setMesgul(false);
    if (!r.ok) return setHata(r.hata.error);
    const soru = kabul ? (r.data as { questionId: string | null }).questionId : null;
    // Kabul edilen soru taslak olarak açılır; yönetici düzenleyip yayınlar
    if (soru) navigate({ page: "yonetim", bolum: "sorular", soru });
    else void yukle();
  };

  const a = o.answer as { value?: boolean; index?: number; blanks?: string[][] };
  return (
    <div className="oneri-detay">
      <p><a href={geri}>← Tüm öneriler</a></p>
      <div className="oneri-ust">
        <span className={`tag durum-${o.status}`}>{ONERI_DURUMU[o.status]}</span>
        <span className="tag">{ONERI_TURU[o.type]}</span>
        <span className="hint">
          {o.username ? <a href={href({ page: "profil", ad: o.username })}>@{o.username}</a> : "silinmiş hesap"} · {o.topicTitle} · {zaman(o.createdAt)}
          {o.showName ? " · adı görünsün istiyor" : " · adı görünmesin istiyor"}
        </span>
      </div>
      <section className="question oneri-onizleme">
        <Markdown text={o.prompt} />
        {o.type === "tf" && <p>Doğru cevap: <strong>{a.value ? "Doğru" : "Yanlış"}</strong></p>}
        {o.type === "mcq" && (
          <ol className="oneri-siklar">
            {o.choices.map((c, i) => (
              <li key={i} className={a.index === i ? "ok" : undefined}>
                {String.fromCharCode(65 + i)}) {inline(c)} {a.index === i && "✓"}
              </li>
            ))}
          </ol>
        )}
        {o.type === "fill" && (
          <ol className="oneri-siklar">
            {(a.blanks ?? []).map((b, i) => <li key={i}>Boşluk {i + 1}: <code>{b.join(" | ")}</code></li>)}
          </ol>
        )}
        <h4>{o.type === "code" ? "Beklenen davranış ya da çözüm fikri" : "Açıklama"}</h4>
        <Markdown text={o.explanation} />
      </section>
      {o.status === "pending" ? (
        <div className="oneri-karar">
          <label>
            Öneren kişiye not (isteğe bağlı)
            <textarea rows={3} maxLength={1000} value={not} onChange={(e) => setNot(e.target.value)} />
          </label>
          <FormHatasi hata={hata} />
          <div className="form-dugmeler">
            <button className="primary" disabled={mesgul} onClick={() => karar(true)}>
              {o.type === "code" ? "Kabul et" : "Kabul et ve taslak soru oluştur"}
            </button>
            <button className="tehlike" disabled={mesgul} onClick={() => karar(false)}>Reddet</button>
          </div>
          {o.type === "code" && (
            <p className="hint">Kod soruları için sunucuda bir model yazmak gerekir; kabul etmek yalnızca öneriyi işaretler.</p>
          )}
        </div>
      ) : (
        <>
          {o.adminNote && <div className="oneri-not"><strong>Not</strong><Markdown text={o.adminNote} /></div>}
          {o.questionId && (
            <p><a href={href({ page: "yonetim", bolum: "sorular", soru: o.questionId })}>Oluşturulan soruyu aç ({o.questionId})</a></p>
          )}
        </>
      )}
    </div>
  );
}

function PanelMesajlar({ id }: { id?: string }) {
  const [durum, setDurum] = useState("");
  const [liste, setListe] = useState<YazismaOzeti[] | null>(null);
  useEffect(() => {
    if (id) return;
    setListe(null);
    api.yonetim.yazismalar(durum).then(setListe, () => setListe([]));
  }, [durum, id]);

  const geri = href({ page: "yonetim", bolum: "mesajlar" });
  if (id) {
    return (
      <YazismaGorunumu key={id} panel geri={geri} yukle={() => api.yonetim.yazisma(id)}
        gonder={(b) => api.yonetim.cevapla(id, b)} durumDegistir={(s) => api.yonetim.yazismaDurum(id, s)} />
    );
  }
  return (
    <div className="panel-sorular">
      <div className="filtreler">
        <select value={durum} onChange={(e) => setDurum(e.target.value)} aria-label="Durum">
          <option value="">Hepsi</option>
          <option value="open">Açık</option>
          <option value="closed">Kapalı</option>
        </select>
      </div>
      <YazismaListesi liste={liste} bag={(y) => href({ page: "yonetim", bolum: "mesajlar", alt: y })} bos="Mesaj yok." />
    </div>
  );
}

function IslemKaydi() {
  const [liste, setListe] = useState<PanelKayit[] | null>(null);
  useEffect(() => {
    api.yonetim.kayit().then(setListe, () => setListe([]));
  }, []);
  if (!liste) return <p className="empty">Yükleniyor…</p>;
  if (!liste.length) return <p className="empty">Henüz bir işlem yok.</p>;
  return (
    <div className="tablo-kap panel-sorular">
      <table className="panel-tablo">
        <thead>
          <tr>
            <th>Zaman</th>
            <th>Kim</th>
            <th>İşlem</th>
            <th>Hedef</th>
            <th>Ayrıntı</th>
          </tr>
        </thead>
        <tbody>
          {liste.map((k) => (
            <tr key={k.id}>
              <td>{zaman(k.createdAt)}</td>
              <td>{k.username ?? "silinmiş"}</td>
              <td>{EYLEM[k.action] ?? k.action}</td>
              <td className="mono">{k.target}</td>
              <td className="mono kucuk">{k.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Yonetim({ bolum, soru, alt }: { bolum: YonetimBolumu; soru?: string; alt?: string }) {
  const { me, yuklendi } = useOturum();
  if (!yuklendi) return <p className="empty">Yükleniyor…</p>;
  if (me?.kind !== "member") {
    return (
      <p className="empty">
        Yönetim paneli için <a href={href({ page: "giris", sonra: location.pathname })}>giriş yapmalısın</a>.
      </p>
    );
  }
  if (me.role !== "admin") return <p className="empty">Bu sayfa için yetkin yok.</p>;

  return (
    <div className="yonetim">
      <nav className="tabs panel-sekmeler" aria-label="Yönetim bölümleri">
        {BOLUMLER.map(([b, ad]) => (
          <a key={b} href={href({ page: "yonetim", bolum: b })} aria-current={bolum === b ? "page" : undefined}>
            {ad}
          </a>
        ))}
      </nav>
      {bolum === "genel" && <Genel />}
      {bolum === "sorular" && (soru ? <SoruDuzenle id={soru} /> : <SoruListesi />)}
      {bolum === "oneriler" && (alt ? <OneriDetay id={alt} /> : <OneriListesi />)}
      {bolum === "mesajlar" && <PanelMesajlar id={alt} />}
      {bolum === "bildirimler" && <Bildirimler />}
      {bolum === "kullanicilar" && <Kullanicilar />}
      {bolum === "kayit" && <IslemKaydi />}
    </div>
  );
}
