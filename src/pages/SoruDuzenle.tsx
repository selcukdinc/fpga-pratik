// Panelde soru ekleme ve düzenleme. Sağda sitede nasıl görüneceği önizlenir.

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { api } from "../lib/api";
import { href, navigate } from "../lib/router";
import { FormHatasi } from "../components/Form";
import { Markdown, inline } from "../components/Markdown";
import { soruGirdisiHatasi, type PanelSoru, type PanelSoruTipi, type SoruGirdi } from "../../shared/yonetim";
import type { Topic } from "../../shared/api";

const BOS: SoruGirdi = {
  topicId: "",
  type: "mcq",
  source: "derived",
  difficulty: 1,
  sourceRef: "",
  prompt: "",
  explanation: "",
  choices: ["", "", "", ""],
  answer: { index: 0 },
  status: "draft",
  active: true,
};

// Etiket ile alan useId ile bağlanır; böylece seçimlerin erişilebilir adı sadece etiket olur
function Etiketli({ etiket, not, tam, children }: { etiket: string; not?: string; tam?: boolean; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className={`etiketli${tam ? " tam" : ""}`}>
      <label htmlFor={id}>{etiket}</label>
      {children(id)}
      {not && <span className="hint">{not}</span>}
    </div>
  );
}

// Tür değişince cevap alanı yeni türe uygun hale getirilir
function turDegistir(g: SoruGirdi, type: PanelSoruTipi): SoruGirdi {
  if (type === g.type) return g;
  if (type === "tf") return { ...g, type, answer: { value: true } };
  if (type === "mcq") return { ...g, type, choices: g.choices.length >= 2 ? g.choices : ["", "", "", ""], answer: { index: 0 } };
  return { ...g, type, answer: { blanks: [[""]] } };
}

export function SoruDuzenle({ id }: { id: string }) {
  const yeni = id === "yeni";
  const [konular, setKonular] = useState<Topic[]>([]);
  const [g, setG] = useState<SoruGirdi | null>(yeni ? BOS : null);
  const [kayitli, setKayitli] = useState<PanelSoru | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [tamam, setTamam] = useState<string | null>(null);
  const [mesgul, setMesgul] = useState(false);

  useEffect(() => {
    api.yonetim.konular().then((k) => {
      setKonular(k);
      if (yeni) setG((x) => (x && !x.topicId && k[0] ? { ...x, topicId: k[0].id } : x));
    }, () => {});
    if (!yeni) {
      api.yonetim.soru(id).then(
        (s) => {
          setKayitli(s);
          setG({ ...s });
        },
        () => setHata("Soru bulunamadı."),
      );
    }
  }, [id, yeni]);

  if (!g) return hata ? <FormHatasi hata={hata} /> : <p className="empty">Yükleniyor…</p>;

  const ayarla = (p: Partial<SoruGirdi>) => {
    setTamam(null);
    setG({ ...g, ...p });
  };
  const yerelHata = soruGirdisiHatasi(g);

  const kaydet = async (e: FormEvent) => {
    e.preventDefault();
    setMesgul(true);
    setHata(null);
    setTamam(null);
    const r = yeni ? await api.yonetim.soruEkle(g) : await api.yonetim.soruKaydet(id, g);
    setMesgul(false);
    if (!r.ok) return setHata(r.hata.error);
    if (yeni) navigate(href({ page: "yonetim", bolum: "sorular", soru: r.data.id }), { replace: true });
    else setTamam("Kaydedildi.");
  };

  const blanks = "blanks" in g.answer ? g.answer.blanks : [];

  return (
    <div className="soru-duzenle">
      <p>
        <a href={href({ page: "yonetim", bolum: "sorular" })}>← Soru listesi</a>
      </p>
      <form className="soru-form" onSubmit={kaydet}>
        <h2>{yeni ? "Yeni soru" : <span className="mono">{id}</span>}</h2>
        {kayitli && (
          <p className="hint">
            {kayitli.deneme} deneme
            {kayitli.deneme > 0 && `, %${Math.round((kayitli.dogru / kayitli.deneme) * 100)} doğru`}.
            {!kayitli.updatedAt && " Bu soru depodaki içerikten geliyor; panelde kaydedersen sonraki içerik güncellemeleri bu sorunun üzerine yazmaz."}
          </p>
        )}

        <div className="form-izgara">
          <Etiketli etiket="Konu">
            {(id) => (
            <select id={id} value={g.topicId} onChange={(e) => ayarla({ topicId: e.target.value })}>
              {konular.map((k) => (
                <option key={k.id} value={k.id}>H{k.week} · {k.title}</option>
              ))}
            </select>
            )}
          </Etiketli>
          <Etiketli etiket="Tür">
            {(id) => (
            <select id={id} value={g.type} onChange={(e) => setG(turDegistir(g, e.target.value as PanelSoruTipi))}>
              <option value="mcq">Çoktan seçmeli</option>
              <option value="tf">Doğru / yanlış</option>
              <option value="fill">Boşluk doldurma</option>
            </select>
            )}
          </Etiketli>
          <Etiketli etiket="Kaynak">
            {(id) => (
            <select id={id} value={g.source} onChange={(e) => ayarla({ source: e.target.value as SoruGirdi["source"] })}>
              <option value="original">Orijinal (sunumdan)</option>
              <option value="derived">Türetilmiş</option>
            </select>
            )}
          </Etiketli>
          <Etiketli etiket="Zorluk">
            {(id) => (
            <select id={id} value={g.difficulty} onChange={(e) => ayarla({ difficulty: Number(e.target.value) })}>
              <option value={1}>★ Kolay</option>
              <option value={2}>★★ Orta</option>
              <option value={3}>★★★ Zor</option>
            </select>
            )}
          </Etiketli>
        </div>

        <Etiketli etiket="Kaynak notu" tam>
          {(id) => (
          <input id={id} value={g.sourceRef} maxLength={200} placeholder="ör. Hafta 3, Veri öznitelikleri" onChange={(e) => ayarla({ sourceRef: e.target.value })} />
          )}
        </Etiketli>

        <Etiketli etiket="Soru metni" tam not="Kod bloğu için ``` kullan, satır içi kod için `ters tırnak`, kalın için **iki yıldız**.">
          {(id) => <textarea id={id} rows={8} className="mono" value={g.prompt} onChange={(e) => ayarla({ prompt: e.target.value })} />}
        </Etiketli>

        {g.type === "tf" && "value" in g.answer && (
          <fieldset className="cevap-alani">
            <legend>Doğru cevap</legend>
            {[true, false].map((v) => (
              <label key={String(v)} className="onay">
                <input type="radio" name="tf" checked={(g.answer as { value: boolean }).value === v} onChange={() => ayarla({ answer: { value: v } })} />
                {v ? "Doğru" : "Yanlış"}
              </label>
            ))}
          </fieldset>
        )}

        {g.type === "mcq" && "index" in g.answer && (
          <fieldset className="cevap-alani">
            <legend>Şıklar (doğru olanı işaretle)</legend>
            {g.choices.map((c, i) => (
              <div key={i} className="sik-satiri">
                <input
                  type="radio"
                  name="dogru"
                  aria-label={`${String.fromCharCode(65 + i)} şıkkı doğru`}
                  checked={(g.answer as { index: number }).index === i}
                  onChange={() => ayarla({ answer: { index: i } })}
                />
                <span className="choice-letter">{String.fromCharCode(65 + i)})</span>
                <input value={c} onChange={(e) => ayarla({ choices: g.choices.map((x, j) => (j === i ? e.target.value : x)) })} />
                <button
                  type="button"
                  className="icon"
                  aria-label="Şıkkı sil"
                  disabled={g.choices.length <= 2}
                  onClick={() => {
                    const idx = (g.answer as { index: number }).index;
                    ayarla({
                      choices: g.choices.filter((_, j) => j !== i),
                      answer: { index: idx === i ? 0 : idx > i ? idx - 1 : idx },
                    });
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            {g.choices.length < 6 && (
              <button type="button" onClick={() => ayarla({ choices: [...g.choices, ""] })}>+ Şık ekle</button>
            )}
          </fieldset>
        )}

        {g.type === "fill" && (
          <fieldset className="cevap-alani">
            <legend>Boşluklar (her boşluk için kabul edilen yazımları | ile ayır)</legend>
            {blanks.map((b, i) => (
              <div key={i} className="sik-satiri">
                <span className="choice-letter">Boşluk {i + 1}</span>
                <input
                  className="mono"
                  value={b.join(" | ")}
                  placeholder={'ör. 8 | "8"'}
                  onChange={(e) =>
                    ayarla({ answer: { blanks: blanks.map((x, j) => (j === i ? e.target.value.split("|").map((y) => y.trim()) : x)) } })
                  }
                />
                <button
                  type="button"
                  className="icon"
                  aria-label="Boşluğu sil"
                  disabled={blanks.length <= 1}
                  onClick={() => ayarla({ answer: { blanks: blanks.filter((_, j) => j !== i) } })}
                >
                  ✕
                </button>
              </div>
            ))}
            {blanks.length < 6 && (
              <button type="button" onClick={() => ayarla({ answer: { blanks: [...blanks, [""]] } })}>+ Boşluk ekle</button>
            )}
            <p className="hint">Puanlamada büyük/küçük harf ve boşluklar önemsenmez.</p>
          </fieldset>
        )}

        <Etiketli etiket="Açıklama (cevaptan sonra görünür)" tam>
          {(id) => <textarea id={id} rows={4} value={g.explanation} onChange={(e) => ayarla({ explanation: e.target.value })} />}
        </Etiketli>

        <div className="form-izgara">
          <Etiketli etiket="Durum">
            {(id) => (
            <select id={id} value={g.status} onChange={(e) => ayarla({ status: e.target.value as SoruGirdi["status"] })}>
              <option value="draft">Taslak (sitede görünmez)</option>
              <option value="published">Yayında</option>
            </select>
            )}
          </Etiketli>
          <label className="onay">
            <input type="checkbox" checked={!g.active} onChange={(e) => ayarla({ active: !e.target.checked })} />
            Bu soruyu gizle
          </label>
        </div>

        <FormHatasi hata={hata ?? (g.prompt ? yerelHata : null)} />
        {tamam && <p className="ok" role="status">{tamam}</p>}
        <div className="form-dugmeler">
          <button className="primary" type="submit" disabled={!!yerelHata || mesgul}>
            {yeni ? "Soruyu ekle" : "Kaydet"}
          </button>
        </div>
      </form>

      <aside className="onizleme" aria-label="Önizleme">
        <div className="panel-title">ÖNİZLEME</div>
        <article className="question">
          <header>
            <span className="q-num">Soru</span>
            <span className={`tag tag-${g.source}`}>{g.source === "original" ? "Orijinal" : "Türetilmiş"}</span>
            <span className="tag">{"★".repeat(g.difficulty)}{"☆".repeat(3 - g.difficulty)}</span>
            {g.sourceRef && <span className="q-ref">{g.sourceRef}</span>}
          </header>
          <Markdown text={g.prompt || "Soru metni burada görünür."} />
          {g.type === "tf" && <div className="choices"><label>○ Doğru</label><label>○ Yanlış</label></div>}
          {g.type === "mcq" && (
            <div className="choices">
              {g.choices.map((c, i) => (
                <label key={i} className={"index" in g.answer && g.answer.index === i ? "dogru-sik" : undefined}>
                  <span className="choice-letter">{String.fromCharCode(65 + i)})</span> <span>{inline(c)}</span>
                </label>
              ))}
            </div>
          )}
          {g.type === "fill" && (
            <div className="choices">
              {blanks.map((_, i) => (
                <label key={i}>Boşluk {i + 1} <input className="mono" disabled /></label>
              ))}
            </div>
          )}
          <footer>
            <Markdown text={g.explanation} />
          </footer>
        </article>
      </aside>
    </div>
  );
}
