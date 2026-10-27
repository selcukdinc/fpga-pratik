// /oner: üyeler soru önerir; önerileri ve yöneticinin kararını aşağıda görür.

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { api } from "../lib/api";
import { href } from "../lib/router";
import { uye, useOturum } from "../lib/oturum";
import { FormHatasi } from "../components/Form";
import { Markdown, inline } from "../components/Markdown";
import { MetinAlani } from "../components/MetinAlani";
import { SoruOnizleme } from "../components/SoruOnizleme";
import { oneriHatasi, type Oneri, type OneriGirdi, type OneriTipi } from "../../shared/sosyal";
import type { Topic } from "../../shared/api";

const TUR_ADI: Record<OneriTipi, string> = { tf: "Doğru / yanlış", mcq: "Çoktan seçmeli", fill: "Boşluk doldurma", code: "Kod yazma" };
const DURUM_ADI = { pending: "İnceleniyor", accepted: "Kabul edildi", rejected: "Kabul edilmedi" } as const;

const BOS: OneriGirdi = { topicId: "", type: "mcq", prompt: "", choices: ["", "", "", ""], answer: { index: 0 }, explanation: "", showName: true };

function Alan({ etiket, not, children }: { etiket: string; not?: ReactNode; children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <div className="etiketli tam">
      <label htmlFor={id}>{etiket}</label>
      {children(id)}
      {not && <span className="hint">{not}</span>}
    </div>
  );
}

function turDegistir(g: OneriGirdi, type: OneriTipi): OneriGirdi {
  if (type === "tf") return { ...g, type, answer: { value: true } };
  if (type === "mcq") return { ...g, type, choices: g.choices.length >= 2 ? g.choices : ["", "", "", ""], answer: { index: 0 } };
  if (type === "fill") return { ...g, type, answer: { blanks: [[""]] } };
  return { ...g, type, answer: {} };
}

const tarih = (ms: number) => new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" });

export function Oner() {
  const { me, yuklendi } = useOturum();
  const [konular, setKonular] = useState<Topic[]>([]);
  const [g, setG] = useState<OneriGirdi>(BOS);
  const [hata, setHata] = useState<string | null>(null);
  const [tamam, setTamam] = useState(false);
  const [mesgul, setMesgul] = useState(false);
  const [oneriler, setOneriler] = useState<Oneri[] | null>(null);
  // Dar ekranda yazma ve önizleme arasında geçiş
  const [gorunum, setGorunum] = useState<"yaz" | "onizle">("yaz");

  const listele = () =>
    api.uye.oneriler().then((o) => {
      setOneriler(o);
      if (o.some((x) => x.unread)) void api.uye.oneriOkundu();
    }, () => setOneriler([]));

  useEffect(() => {
    api.topics().then((r) => {
      setKonular(r.topics);
      setG((x) => (x.topicId ? x : { ...x, topicId: r.topics.at(-1)?.id ?? "" }));
    }, () => {});
  }, []);
  useEffect(() => {
    if (uye(me)) void listele();
  }, [me]);

  if (!yuklendi) return null;
  if (!uye(me)) {
    return (
      <div className="form-sayfa">
        <p>Soru önermek için <a href={href({ page: "giris", sonra: "/oner" })}>giriş yap</a> ya da <a href="/kayit">hesap aç</a>.</p>
      </div>
    );
  }

  const susturuldu = !!me.mutedUntil && me.mutedUntil > Date.now();
  const ayarla = (p: Partial<OneriGirdi>) => {
    setTamam(false);
    setG({ ...g, ...p });
  };
  const yerelHata = oneriHatasi(g);
  const blanks = "blanks" in g.answer ? g.answer.blanks : [];

  const gonder = async (e: FormEvent) => {
    e.preventDefault();
    setMesgul(true);
    setHata(null);
    const r = await api.uye.oner(g);
    setMesgul(false);
    if (!r.ok) return setHata(r.hata.error);
    setTamam(true);
    setG({ ...BOS, topicId: g.topicId, showName: g.showName });
    void listele();
  };

  return (
    <div className="oner-sayfa">
      <p className="oner-giris">
        Aklına gelen bir soruyu öner. Yönetici inceler; uygun bulursa düzenleyip soru havuzuna ekler. Yazdıkça sorunun
        nasıl görüneceğini önizlemede görebilirsin.
      </p>
      <div className="gorunum-secici" role="tablist" aria-label="Görünüm">
        <button role="tab" aria-selected={gorunum === "yaz"} onClick={() => setGorunum("yaz")}>Yaz</button>
        <button role="tab" aria-selected={gorunum === "onizle"} onClick={() => setGorunum("onizle")}>Önizle</button>
      </div>
      <div className={`oner-duzen gorunum-${gorunum}`}>
      <form className="soru-form" onSubmit={gonder}>
        {susturuldu && <p className="bad">Hesabın şu an öneri gönderemiyor. Bir yanlışlık olduğunu düşünüyorsan <a href="/mesajlar">yöneticiye yaz</a>.</p>}
        <div className="form-izgara">
          <Alan etiket="Konu">
            {(id) => (
              <select id={id} value={g.topicId} onChange={(e) => ayarla({ topicId: e.target.value })}>
                {konular.map((k) => <option key={k.id} value={k.id}>H{k.week} · {k.title}</option>)}
              </select>
            )}
          </Alan>
          <Alan etiket="Soru türü">
            {(id) => (
              <select id={id} value={g.type} onChange={(e) => (setTamam(false), setG(turDegistir(g, e.target.value as OneriTipi)))}>
                {(Object.keys(TUR_ADI) as OneriTipi[]).map((t) => <option key={t} value={t}>{TUR_ADI[t]}</option>)}
              </select>
            )}
          </Alan>
        </div>
        <Alan etiket="Soru metni">
          {(id) => <MetinAlani id={id} rows={7} maxLength={4000} value={g.prompt} onChange={(v) => ayarla({ prompt: v })} />}
        </Alan>

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
                <input type="radio" name="dogru" aria-label={`${String.fromCharCode(65 + i)} şıkkı doğru`}
                  checked={(g.answer as { index: number }).index === i} onChange={() => ayarla({ answer: { index: i } })} />
                <span className="choice-letter">{String.fromCharCode(65 + i)})</span>
                <input aria-label={`${String.fromCharCode(65 + i)} şıkkı`} value={c}
                  onChange={(e) => ayarla({ choices: g.choices.map((x, j) => (j === i ? e.target.value : x)) })} />
              </div>
            ))}
          </fieldset>
        )}
        {g.type === "fill" && (
          <fieldset className="cevap-alani">
            <legend>Boşlukların cevabı (kabul edilen yazımları | ile ayır)</legend>
            {blanks.map((b, i) => (
              <div key={i} className="sik-satiri">
                <span className="choice-letter">Boşluk {i + 1}</span>
                <input className="mono" aria-label={`Boşluk ${i + 1} cevabı`} value={b.join(" | ")}
                  onChange={(e) => ayarla({ answer: { blanks: blanks.map((x, j) => (j === i ? e.target.value.split("|").map((y) => y.trim()) : x)) } })} />
                <button type="button" className="icon" aria-label="Boşluğu sil" disabled={blanks.length <= 1}
                  onClick={() => ayarla({ answer: { blanks: blanks.filter((_, j) => j !== i) } })}>✕</button>
              </div>
            ))}
            {blanks.length < 6 && <button type="button" onClick={() => ayarla({ answer: { blanks: [...blanks, [""]] } })}>+ Boşluk ekle</button>}
            {blanks.length > 1 && (
              <p className="hint">Hangi kutunun neyi sorduğunu metnin sonunda "Boşluk 1: S, Boşluk 2: CO" diye yaz; öğrenci bu adları kutuların üstünde görür.</p>
            )}
          </fieldset>
        )}

        <Alan etiket={g.type === "code" ? "Beklenen davranış ya da çözüm fikri" : "Açıklama (cevaptan sonra görünür)"}>
          {(id) => <MetinAlani id={id} rows={4} maxLength={4000} value={g.explanation} onChange={(v) => ayarla({ explanation: v })} />}
        </Alan>
        <label className="onay">
          <input type="checkbox" checked={g.showName} onChange={(e) => ayarla({ showName: e.target.checked })} />
          Soru yayımlanırsa altında "Öneren: @{me.username}" yazsın
        </label>

        <FormHatasi hata={hata ?? (g.prompt ? yerelHata : null)} />
        {tamam && <p className="ok" role="status">Önerin alındı, teşekkürler. Durumunu aşağıdan izleyebilirsin.</p>}
        <div className="form-dugmeler">
          <button className="primary" type="submit" disabled={!!yerelHata || mesgul || susturuldu}>Öneriyi gönder</button>
        </div>
      </form>

      <aside className="onizleme" aria-label="Önizleme">
        <div className="panel-title">ÖNİZLEME</div>
        <SoruOnizleme
          type={g.type}
          prompt={g.prompt}
          choices={g.choices}
          dogruSik={"index" in g.answer ? g.answer.index : undefined}
          bosluk={blanks.length}
          explanation={g.explanation}
          aciklamaBasligi={g.type === "code" ? "Beklenen davranış" : "Cevaptan sonra görünen açıklama"}
          ust={<span className="tag">{TUR_ADI[g.type]}</span>}
        />
      </aside>
      </div>

      <section className="onerilerim">
        <h3>Önerilerim</h3>
        {oneriler === null ? (
          <p className="empty">Yükleniyor…</p>
        ) : oneriler.length === 0 ? (
          <p className="empty">Henüz bir öneri göndermedin.</p>
        ) : (
          <ul className="oneri-listesi">
            {oneriler.map((o) => (
              <li key={o.id} className={o.unread ? "yeni" : undefined}>
                <div className="oneri-ust">
                  <span className={`tag durum-${o.status}`}>{DURUM_ADI[o.status]}</span>
                  <span className="tag">{TUR_ADI[o.type]}</span>
                  <span className="hint">{o.topicTitle} · {tarih(o.createdAt)}</span>
                  {o.unread && <span className="tag yeni-rozet">yeni</span>}
                </div>
                <div className="oneri-metni">{inline(o.prompt.replace(/```[\s\S]*?```/g, "[kod]").slice(0, 200))}</div>
                {o.adminNote && <div className="oneri-not"><strong>Yöneticinin notu</strong><Markdown text={o.adminNote} /></div>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
