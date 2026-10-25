// /topluluk: üyelerin yazdığı testbench'ler. Liste, yeni testbench yazma ve
// başkasının testbench'ini kendi mimarinle çözme. Hepsi tarayıcıda çalışır;
// resmi ilerlemeye sayılmaz.

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { api } from "../lib/api";
import { href, navigate } from "../lib/router";
import { uye, useOturum } from "../lib/oturum";
import { VhdlEditor, type EditorMark } from "../components/VhdlEditor";
import { MessagesPanel } from "../components/MessagesPanel";
import { WaveformView } from "../components/WaveformView";
import { Markdown } from "../components/Markdown";
import { FormHatasi } from "../components/Form";
import { BildirDugmesi } from "../components/Bildir";
import { TASARIM_DOSYASI, tbSina, tbTopu, type TbSonucu } from "../sim/topluluk";
import { sablonCikar, tbHatasi, type Tb, type TbGirdi, type TbOzeti } from "../../shared/topluluk";
import type { Topic } from "../../shared/api";

const tarih = (ms: number) => new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });

function oku(anahtar: string): string | null {
  try {
    return localStorage.getItem(anahtar);
  } catch {
    return null;
  }
}
function yaz(anahtar: string, deger: string | null) {
  try {
    if (deger === null) localStorage.removeItem(anahtar);
    else localStorage.setItem(anahtar, deger);
  } catch {
    // kaydedilemezse sayfa açık kaldıkça bellekte durur
  }
}

const isaretler = (r: TbSonucu | null, dosya: string): EditorMark[] =>
  (r?.messages ?? [])
    .filter((m) => m.file === dosya && m.line && m.severity !== "note")
    .map((m) => ({ line: m.line!, severity: m.severity === "warning" ? "warning" : "error" }));

function useKonular() {
  const [konular, setKonular] = useState<Topic[]>([]);
  useEffect(() => {
    api.topics().then((r) => setKonular(r.topics), () => {});
  }, []);
  return konular;
}

function Rozetler({ t }: { t: TbOzeti }) {
  return (
    <span className="tb-rozetler">
      <span title="Beğeni">★ {t.begeni}</span>
      <span title="Çözen üye sayısı">✓ {t.cozen} çözdü</span>
      {t.benCozdum && <span className="tag durum-accepted">çözdün</span>}
      {t.gizli && <span className="tag durum-rejected">bildirimler yüzünden gizlendi</span>}
    </span>
  );
}

// ---- Liste ----

export function Topluluk({ konu }: { konu?: string }) {
  const { me } = useOturum();
  const konular = useKonular();
  const [sira, setSira] = useState("yeni");
  const [liste, setListe] = useState<TbOzeti[] | null>(null);

  useEffect(() => {
    setListe(null);
    api.topluluk.tbler({ konu, sira: sira === "begeni" ? "begeni" : undefined }).then(setListe, () => setListe([]));
  }, [konu, sira]);

  return (
    <div className="topluluk">
      <p>
        Üyelerin yazdığı testbench'ler. Birini seç, verilen entity'nin mimarisini yaz ve testbench'ten geçir. Benzetim senin
        tarayıcında çalışır; topluluk testbench'leri resmi ilerlemene sayılmaz.
      </p>
      <div className="filtreler">
        <select aria-label="Konu" value={konu ?? ""} onChange={(e) => navigate({ page: "topluluk", konu: e.target.value || undefined }, { replace: true })}>
          <option value="">Tüm konular</option>
          {konular.map((k) => <option key={k.id} value={k.id}>H{k.week} · {k.title}</option>)}
        </select>
        <select aria-label="Sıralama" value={sira} onChange={(e) => setSira(e.target.value)}>
          <option value="yeni">En yeni</option>
          <option value="begeni">En çok beğenilen</option>
        </select>
        {uye(me) ? (
          <a className="buton primary" href={href({ page: "topluluk-tb", id: "yeni" })}>+ Testbench yaz</a>
        ) : (
          <span className="hint">Testbench yazmak için <a href={href({ page: "giris", sonra: "/topluluk/yeni" })}>giriş yap</a>.</span>
        )}
      </div>
      {!liste ? (
        <p className="empty">Yükleniyor…</p>
      ) : liste.length === 0 ? (
        <p className="empty">Bu konuda henüz testbench yok. İlkini sen yazabilirsin.</p>
      ) : (
        <ul className="tb-listesi">
          {liste.map((t) => (
            <li key={t.id}>
              <a className="tb-baslik" href={href({ page: "topluluk-tb", id: t.id })}>{t.title}</a>
              <div className="hint">
                {t.topicTitle} · {t.username ? `@${t.username}` : "silinmiş hesap"} · {tarih(t.createdAt)}
              </div>
              <Rozetler t={t} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---- Çözme ----

function Sonuc({ r, gecti }: { r: TbSonucu; gecti: ReactNode }) {
  return (
    <div className="kod-sonuc" role="status">
      {r.gecti ? (
        <p><strong className="ok">Geçti.</strong> {gecti}</p>
      ) : (
        <p className="bad">
          {r.timedOut
            ? "Benzetim zaman sınırını aştı. Sonsuz bir döngü ya da kendini tetikleyen bir atama olabilir."
            : r.messages.some((m) => m.severity === "failure" || (m.severity === "error" && !m.file))
              ? "Testbench bir hata bildirdi. Aşağıdaki mesajda hangi kontrolün tutmadığı yazıyor."
              : "Tasarım derlenemedi ya da benzetim hatayla durdu. Ayrıntılar aşağıdaki mesajlarda."}
        </p>
      )}
    </div>
  );
}

function TbCoz({ id }: { id: string }) {
  const { me } = useOturum();
  const [tb, setTb] = useState<Tb | null>(null);
  const [yok, setYok] = useState(false);
  const anahtar = `fpga-pratik:tb:${id}`;
  const [kod, setKod] = useState<string | null>(null);
  const [mesgul, setMesgul] = useState(false);
  const [sonuc, setSonuc] = useState<TbSonucu | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [gotoLine, setGotoLine] = useState<{ line: number; nonce: number }>();

  useEffect(() => {
    api.topluluk.tb(id).then((t) => {
      setTb(t);
      setKod(oku(anahtar) ?? t.sablon);
    }, () => setYok(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (tb && kod !== null) yaz(anahtar, kod === tb.sablon ? null : kod);
  }, [tb, kod, anahtar]);

  const marks = useMemo(() => isaretler(sonuc, TASARIM_DOSYASI), [sonuc]);

  if (yok) return <p className="empty">Bu testbench bulunamadı. <a href="/topluluk">Listeye dön</a></p>;
  if (!tb || kod === null) return <p className="empty">Yükleniyor…</p>;

  const sina = async () => {
    setMesgul(true);
    setHata(null);
    const r = await tbSina(kod, tb);
    setSonuc(r);
    setMesgul(false);
    if (r.gecti && uye(me) && !tb.benCozdum) {
      const c = await api.topluluk.cozdum(tb.id);
      if (c.ok) setTb({ ...tb, cozen: c.data.cozen, benCozdum: true });
    }
  };
  const begen = async () => {
    const r = await api.topluluk.begen(tb.id);
    if (!r.ok) return setHata(r.hata.error);
    setTb({ ...tb, ...r.data });
  };
  const sil = async () => {
    if (!confirm(`"${tb.title}" silinsin mi? Beğeniler ve çözüm sayısı da silinir.`)) return;
    const r = await api.topluluk.tbSil(tb.id);
    if (!r.ok) return setHata(r.hata.error);
    navigate({ page: "topluluk", konu: tb.topicId });
  };
  const sablonaDon = () => {
    if (kod !== tb.sablon && !confirm("Yazdığın kod silinip şablon geri yüklensin mi?")) return;
    setKod(tb.sablon);
    setSonuc(null);
  };

  return (
    <div className="tb-coz">
      <p><a href={href({ page: "topluluk", konu: tb.topicId })}>← {tb.topicTitle} testbench'leri</a></p>
      <h2 className="tb-baslik">{tb.title}</h2>
      <div className="tb-ust">
        <span className="hint">
          {tb.username ? <a href={href({ page: "profil", ad: tb.username })}>@{tb.username}</a> : "silinmiş hesap"} · {tarih(tb.createdAt)}
        </span>
        <Rozetler t={tb} />
        {uye(me) && (
          <button className={tb.benBegendim ? "primary" : undefined} onClick={begen} aria-pressed={tb.benBegendim}>
            {tb.benBegendim ? "★ Beğendin" : "☆ Beğen"}
          </button>
        )}
        {uye(me) && !tb.benim && <BildirDugmesi tur="tb" id={tb.id} bildirdim={tb.bildirdim} />}
        {tb.silebilir && <button className="tehlike" onClick={sil}>Sil</button>}
      </div>
      <p className="hint">Topluluk testbench'i: tarayıcında puanlanır, resmi ilerlemene sayılmaz.</p>
      {tb.description && <Markdown text={tb.description} />}

      <div className="kod-sorusu">
        <div className="kod-editor">
          <VhdlEditor value={kod} onChange={setKod} marks={marks} gotoLine={gotoLine} />
        </div>
        <div className="kod-dugmeler">
          <button className="primary" onClick={sina} disabled={mesgul}>{mesgul ? "Benzetim çalışıyor…" : "▶ Testbench'le sına"}</button>
          <button onClick={sablonaDon} disabled={mesgul}>Şablona dön</button>
          {!uye(me) && <span className="hint">Çözdüğünde sayılması için giriş yap.</span>}
        </div>
        <FormHatasi hata={hata} />
        {sonuc && <Sonuc r={sonuc} gecti="Testbench'teki tüm kontroller tuttu." />}
        {sonuc && sonuc.messages.length > 0 && (
          <div className="kod-mesajlar">
            <MessagesPanel
              messages={sonuc.messages}
              onSelect={(m) => m.file === TASARIM_DOSYASI && m.line && setGotoLine({ line: m.line, nonce: Date.now() })}
            />
          </div>
        )}
        <div className="kod-ayrinti">
          {sonuc?.vcd && (
            <details>
              <summary>Dalga ekranı (son benzetim)</summary>
              <div className="kod-dalga"><WaveformView vcd={sonuc.vcd} /></div>
            </details>
          )}
          <details>
            <summary>Testbench ({tb.top}, {tb.stopTime})</summary>
            <pre className="log">{tb.testbench}</pre>
          </details>
        </div>
      </div>
    </div>
  );
}

// ---- Yeni testbench ----

const TASLAK = "fpga-pratik:tb-taslak";

const ORNEK_COZUM = `library ieee;
use ieee.std_logic_1164.all;

entity cogunluk is
  port (
    a, b, c : in  std_logic;
    y       : out std_logic
  );
end cogunluk;

architecture rtl of cogunluk is
begin
  y <= (a and b) or (a and c) or (b and c);
end rtl;
`;

const ORNEK_TB = `library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;

entity tb_cogunluk is
end tb_cogunluk;

architecture sim of tb_cogunluk is
  signal a, b, c, y : std_logic;
begin
  dut : entity work.cogunluk port map (a => a, b => b, c => c, y => y);

  process
    variable girdi : unsigned(2 downto 0);
    variable bir   : integer;
  begin
    for i in 0 to 7 loop
      girdi := to_unsigned(i, 3);
      a <= girdi(2);
      b <= girdi(1);
      c <= girdi(0);
      wait for 10 ns;
      bir := 0;
      for k in 0 to 2 loop
        if girdi(k) = '1' then
          bir := bir + 1;
        end if;
      end loop;
      if bir >= 2 then
        assert y = '1' report "cogunluk 1 olmali" severity failure;
      else
        assert y = '0' report "cogunluk 0 olmali" severity failure;
      end if;
    end loop;
    wait;
  end process;
end sim;
`;

interface Taslak {
  topicId: string;
  title: string;
  description: string;
  cozum: string;
  testbench: string;
  stopTime: string;
}

function taslakOku(): Taslak {
  try {
    const t = oku(TASLAK);
    if (t) return JSON.parse(t) as Taslak;
  } catch {
    // bozuk taslak: örnekle başla
  }
  return { topicId: "", title: "", description: "", cozum: ORNEK_COZUM, testbench: ORNEK_TB, stopTime: "200 ns" };
}

type Denetim = { cozum: TbSonucu; bos: TbSonucu; girdi: TbGirdi };

function TbYeni() {
  const { me, yuklendi } = useOturum();
  const konular = useKonular();
  const [t, setT] = useState<Taslak>(taslakOku);
  const [mesgul, setMesgul] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [denetim, setDenetim] = useState<Denetim | null>(null);
  const [sekme, setSekme] = useState<"cozum" | "testbench">("testbench");
  const baslikId = useId();
  const aciklamaId = useId();
  const sureId = useId();
  const konuId = useId();

  useEffect(() => yaz(TASLAK, JSON.stringify(t)), [t]);
  useEffect(() => {
    if (!t.topicId && konular.length) setT((x) => ({ ...x, topicId: konular.at(-1)!.id }));
  }, [konular, t.topicId]);

  if (!yuklendi) return null;
  if (!uye(me)) {
    return <p className="empty">Testbench yazmak için <a href={href({ page: "giris", sonra: "/topluluk/yeni" })}>giriş yap</a>.</p>;
  }

  const ayarla = (p: Partial<Taslak>) => {
    setDenetim(null);
    setT({ ...t, ...p });
  };

  // Yayımlamadan önce: çözüm geçmeli, boş şablon geçmemeli
  const denetle = async () => {
    setHata(null);
    setDenetim(null);
    const s = sablonCikar(t.cozum);
    if (!s) return setHata("Çözümde bir entity bildirimi bulunamadı.");
    const top = tbTopu(t.testbench);
    if (!top) return setHata("Testbench'te portsuz bir entity bulunamadı (ör. entity tb_x is end tb_x;).");
    const girdi: TbGirdi = { topicId: t.topicId, title: t.title, description: t.description, sablon: s.sablon, testbench: t.testbench, top, stopTime: t.stopTime };
    const h = tbHatasi({ ...girdi, title: girdi.title || "geçici" });
    if (h) return setHata(h);
    setMesgul(true);
    const cozum = await tbSina(t.cozum, girdi);
    const bos = cozum.gecti ? await tbSina(s.sablon, girdi) : cozum;
    setMesgul(false);
    setDenetim({ cozum, bos, girdi });
  };

  const hazir = denetim && denetim.cozum.gecti && !denetim.bos.gecti;
  const yayimla = async () => {
    if (!denetim) return;
    setHata(null);
    const h = tbHatasi({ ...denetim.girdi, title: t.title, description: t.description, topicId: t.topicId });
    if (h) return setHata(h);
    setMesgul(true);
    const r = await api.topluluk.tbYayimla({ ...denetim.girdi, title: t.title, description: t.description, topicId: t.topicId });
    setMesgul(false);
    if (!r.ok) return setHata(r.hata.error);
    yaz(TASLAK, null);
    navigate({ page: "topluluk-tb", id: r.data.id });
  };

  // Yalnızca çözüm geçmediyse mesajlar gösterilir; boş şablonun hataları beklenen sonuçtur
  const goster = denetim && !denetim.cozum.gecti ? denetim.cozum : null;

  return (
    <div className="tb-yeni soru-form">
      <p><a href="/topluluk">← Topluluk testbench'leri</a></p>
      <p>
        Bir tasarımın çözümünü ve onu sınayan testbench'i yaz. Çözümün <strong>yayımlanmaz ve sunucuya gönderilmez</strong>;
        başkalarına yalnızca çözümündeki entity ile boş bir mimari şablon olarak verilir. Testbench hatayı{" "}
        <code>assert ... severity failure</code> ile bildirmeli.
      </p>
      <div className="form-izgara">
        <div className="etiketli">
          <label htmlFor={konuId}>Konu</label>
          <select id={konuId} value={t.topicId} onChange={(e) => ayarla({ topicId: e.target.value })}>
            {konular.map((k) => <option key={k.id} value={k.id}>H{k.week} · {k.title}</option>)}
          </select>
        </div>
        <div className="etiketli">
          <label htmlFor={sureId}>Simülasyon süresi</label>
          <input id={sureId} value={t.stopTime} onChange={(e) => ayarla({ stopTime: e.target.value })} />
        </div>
      </div>
      <div className="etiketli tam">
        <label htmlFor={baslikId}>Başlık</label>
        <input id={baslikId} maxLength={100} value={t.title} onChange={(e) => ayarla({ title: e.target.value })} placeholder="ör. 3 girişli çoğunluk devresi" />
      </div>
      <div className="etiketli tam">
        <label htmlFor={aciklamaId}>Açıklama (ne yapılacağı)</label>
        <textarea id={aciklamaId} rows={3} maxLength={2000} value={t.description} onChange={(e) => ayarla({ description: e.target.value })} />
      </div>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={sekme === "testbench"} onClick={() => setSekme("testbench")}>Testbench</button>
        <button role="tab" aria-selected={sekme === "cozum"} onClick={() => setSekme("cozum")}>Çözümün (gizli kalır)</button>
      </div>
      <div className="kod-editor">
        {sekme === "testbench" ? (
          <VhdlEditor key="tb" value={t.testbench} onChange={(v) => ayarla({ testbench: v })} />
        ) : (
          <VhdlEditor key="cozum" value={t.cozum} onChange={(v) => ayarla({ cozum: v })} marks={isaretler(denetim?.cozum ?? null, TASARIM_DOSYASI)} />
        )}
      </div>

      <div className="form-dugmeler">
        <button onClick={denetle} disabled={mesgul}>{mesgul && !denetim ? "Sınanıyor…" : "▶ Çözümle sına"}</button>
        <button className="primary" onClick={yayimla} disabled={!hazir || mesgul || !t.title.trim()}>Yayımla</button>
        {hazir && !t.title.trim() && <span className="hint">Yayımlamak için bir başlık yaz.</span>}
      </div>
      <FormHatasi hata={hata} />

      {denetim && (
        <div className="tb-denetim">
          <ul>
            <li className={denetim.cozum.gecti ? "ok" : "bad"}>
              {denetim.cozum.gecti ? "✓ Çözümün testbench'ten geçti." : "✗ Çözümün testbench'ten geçmedi."}
            </li>
            {denetim.cozum.gecti && (
              <li className={denetim.bos.gecti ? "bad" : "ok"}>
                {denetim.bos.gecti
                  ? "✗ Boş şablon da geçiyor: testbench çıkışları kontrol etmiyor. Çıkışları karşılaştıran assert'ler ekle."
                  : "✓ Boş şablon testbench'ten geçmedi, yani testbench gerçekten kontrol ediyor."}
              </li>
            )}
          </ul>
          {goster && goster.messages.length > 0 && (
            <div className="kod-mesajlar">
              <MessagesPanel messages={goster.messages} onSelect={(m) => setSekme(m.file === TASARIM_DOSYASI ? "cozum" : "testbench")} />
            </div>
          )}
          {hazir && (
            <details open>
              <summary>Başkalarının göreceği şablon</summary>
              <pre className="log">{denetim.girdi.sablon}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

export function ToplulukTb({ id }: { id: string }) {
  return id === "yeni" ? <TbYeni /> : <TbCoz key={id} id={id} />;
}
