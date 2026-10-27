import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../lib/api";
import { uye, useOturum } from "../lib/oturum";
import { Markdown, inline } from "../components/Markdown";
import { KodSorusu } from "../components/KodSorusu";
import { href } from "../lib/router";
import { boslukEtiketi, bosluklariAyir } from "../lib/bosluk";
import type { AnswerResult, Question, SoruDurumlari, SoruIstatistigi, Topic } from "../../shared/api";
import type { Answer } from "../../shared/grade";

export function QuestionCard({ q, n }: { q: Question; n: number }) {
  if (q.type === "code" && q.payload.kod) return <KodKarti q={q} n={n} />;
  return <KapaliKart q={q} n={n} />;
}

function Baslik({ q, n }: { q: Question; n: number }) {
  return (
    <header>
      <span className="q-num">Soru {n}</span>
      <span className={`tag tag-${q.source}`}>{q.source === "original" ? "Orijinal" : "Türetilmiş"}</span>
      <span className="tag">H{q.week}</span>
      {q.type === "code" && <span className="tag">Kod</span>}
      <span className="tag" title={`Zorluk ${q.difficulty}/3`}>{"★".repeat(q.difficulty)}{"☆".repeat(3 - q.difficulty)}</span>
      {q.sourceRef && <span className="q-ref">{q.sourceRef}</span>}
      {q.oneren && <span className="q-ref">Öneren: <a href={`/profil/${encodeURIComponent(q.oneren)}`}>@{q.oneren}</a></span>}
    </header>
  );
}

function KodKarti({ q, n }: { q: Question; n: number }) {
  const [dogru, setDogru] = useState<boolean | null>(null);
  return (
    <article className={`question kod${dogru === null ? "" : dogru ? " correct" : " wrong"}`} data-soru={q.id} id={`soru-${q.id}`}>
      <Baslik q={q} n={n} />
      <Markdown text={q.prompt} terim />
      <KodSorusu id={q.id} bilgi={q.payload.kod!} onSonuc={setDogru} />
    </article>
  );
}

function KapaliKart({ q, n }: { q: Question; n: number }) {
  const [tf, setTf] = useState<boolean | null>(null);
  // choice: şıkkın asıl sırası (sunucuya giden). sira: ekranda gösterilen sıra,
  // soru her açıldığında ve "Tekrar dene"de karışır; şıkkın yeri ezberlenmesin
  const [choice, setChoice] = useState<number | null>(null);
  const [sira, setSira] = useState(() => karistir(q.payload.choices?.length ?? 0));
  const [blanks, setBlanks] = useState<string[]>(() => Array(q.payload.blanks ?? 0).fill(""));
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const girdiler = useRef<(HTMLInputElement | null)[]>([]);
  // "Tekrar dene"den sonra imlecin gideceği ilk yanlış boşluk
  const [odak, setOdak] = useState<number | null>(null);

  useEffect(() => {
    if (odak === null) return;
    girdiler.current[odak]?.focus();
    setOdak(null);
  }, [odak]);

  const answer: Answer | null =
    q.type === "tf" ? (tf === null ? null : { value: tf })
    : q.type === "mcq" ? (choice === null ? null : { index: choice })
    : q.type === "fill" ? (blanks.every((b) => b.trim()) ? { blanks } : null)
    : null;

  const submit = async () => {
    if (!answer) return;
    setSending(true);
    setError(null);
    try {
      setResult(await api.answer(q.id, answer));
    } catch (e) {
      setError(String(e));
    } finally {
      setSending(false);
    }
  };

  // Boşluk doldurmada doğru boşluklar yerinde kalır, yalnızca yanlışlar
  // temizlenir ve imleç ilk yanlış boşluğa gider
  const bosSonuc = result?.bosluklar;
  const reset = () => {
    setResult(null);
    setTf(null);
    setChoice(null);
    setSira(karistir(q.payload.choices?.length ?? 0));
    if (bosSonuc && !result?.correct && bosSonuc.length === blanks.length) {
      setBlanks(blanks.map((b, i) => (bosSonuc[i] ? b : "")));
      setOdak(Math.max(0, bosSonuc.indexOf(false)));
    } else {
      setBlanks(Array(q.payload.blanks ?? 0).fill(""));
    }
  };
  const dogruBosluk = bosSonuc?.filter(Boolean).length ?? 0;

  const bosluk = q.type === "fill" ? bosluklariAyir(q.prompt, blanks.length) : null;

  return (
    <article className={`question${result ? (result.correct ? " correct" : " wrong") : ""}`} data-soru={q.id} id={`soru-${q.id}`}>
      <Baslik q={q} n={n} />
      <Markdown text={bosluk ? bosluk.metin : q.prompt} terim />

      {q.type === "tf" && (
        <div className="choices">
          {[true, false].map((v) => (
            <label key={String(v)}>
              <input type="radio" name={q.id} checked={tf === v} onChange={() => setTf(v)} disabled={!!result} />
              {v ? "Doğru" : "Yanlış"}
            </label>
          ))}
        </div>
      )}

      {q.type === "mcq" && (
        <div className="choices">
          {sira.map((i, yer) => (
            <label key={i}>
              <input type="radio" name={q.id} checked={choice === i} onChange={() => setChoice(i)} disabled={!!result} />
              <span className="choice-letter">{String.fromCharCode(65 + yer)})</span> <span>{inline(q.payload.choices![i]!, true)}</span>
            </label>
          ))}
        </div>
      )}

      {q.type === "fill" && (
        <div className="choices">
          {blanks.map((b, i) => (
            <label key={i} className={`bosluk${bosSonuc ? (bosSonuc[i] ? " bosluk-dogru" : " bosluk-yanlis") : ""}`}>
              <span className="bosluk-etiket">
                {boslukEtiketi(i, blanks.length)}
                {bosluk?.adlar[i] && <>: {inline(bosluk.adlar[i]!, true)}</>}
                {bosSonuc && bosSonuc.length > 1 && <span className={bosSonuc[i] ? "ok" : "bad"}> {bosSonuc[i] ? "✓ doğru" : "✗ yanlış"}</span>}
              </span>
              <input
                ref={(el) => { girdiler.current[i] = el; }}
                className="mono"
                value={b}
                aria-invalid={bosSonuc ? !bosSonuc[i] : undefined}
                disabled={!!result}
                onChange={(e) => setBlanks(blanks.map((x, j) => (j === i ? e.target.value : x)))}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </label>
          ))}
        </div>
      )}

      {(q.type === "code" || q.type === "wave") && <p className="empty">Bu soru tipi yakında eklenecek.</p>}

      <footer>
        {result ? (
          <>
            <strong className={result.correct ? "ok" : "bad"}>
              {result.correct ? "Doğru" : bosSonuc && bosSonuc.length > 1 && dogruBosluk > 0 ? `Kısmen doğru: ${bosSonuc.length} boşluktan ${dogruBosluk} tanesi doğru` : "Yanlış"}
            </strong>
            {result.explanation && <Markdown text={result.explanation} terim />}
            {result.istatistik && <Istatistik i={result.istatistik} secilen={choice} sira={sira} />}
            <button onClick={reset}>{!result.correct && dogruBosluk > 0 ? "Yanlış boşlukları düzelt" : "Tekrar dene"}</button>
          </>
        ) : (
          <button className="primary" onClick={submit} disabled={!answer || sending}>
            {sending ? "Gönderiliyor…" : "Cevabı kontrol et"}
          </button>
        )}
        {error && <span className="bad">{error}</span>}
      </footer>
    </article>
  );
}

// 0..n-1 sayılarının rastgele bir sırası (Fisher-Yates)
function karistir(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

// Cevaptan sonra gösterilen anonim istatistik: herkesin ilk denemesi sayılır
function Istatistik({ i, secilen, sira }: { i: SoruIstatistigi; secilen: number | null; sira: number[] }) {
  if (!i.kisi) return null;
  const toplam = i.siklar?.reduce((a, b) => a + b, 0) ?? 0;
  return (
    <div className="soru-istatistik">
      <p>
        İlk denemesinde doğru cevaplayanlar: <strong>%{Math.round((i.ilkDogru / i.kisi) * 100)}</strong> ({i.kisi} kişi denedi)
      </p>
      {i.siklar && toplam > 0 && <p className="hint">Şıkların ilk denemelerde seçilme oranı:</p>}
      {i.siklar && toplam > 0 && (
        <ul className="sik-dagilimi" aria-label="İlk denemelerde şıkların seçilme oranı">
          {sira.map((j, yer) => {
            const n = i.siklar![j] ?? 0;
            const pct = Math.round((n / toplam) * 100);
            return (
              <li key={j} className={secilen === j ? "secilen" : undefined}>
                <span className="choice-letter">{String.fromCharCode(65 + yer)})</span>
                <div className="bar" aria-hidden="true"><div style={{ width: `${pct}%` }} /></div>
                <span>%{pct}{secilen === j ? " · senin seçimin" : ""}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Haftalar ve konular menü yerine sayfanın üstünde: 14 hafta olunca menü şişmesin
function KonuSecici({ topics, topic, hafta }: { topics: Topic[]; topic?: string; hafta?: number }) {
  const haftalar = [...new Set(topics.map((t) => t.week))].sort((a, b) => a - b);
  const seciliHafta = hafta ?? topics.find((t) => t.id === topic)?.week;
  const konular = seciliHafta ? topics.filter((t) => t.week === seciliHafta) : [];
  if (!haftalar.length) return null;
  return (
    <nav className="konu-secici" aria-label="Hafta ve konu">
      <div className="secici-satir">
        <span className="secici-etiket">Hafta</span>
        <a className="cip" href={href({ page: "sorular" })} aria-current={!seciliHafta ? "page" : undefined}>Tümü</a>
        {haftalar.map((h) => (
          <a key={h} className="cip" href={href({ page: "sorular", hafta: h })} aria-current={seciliHafta === h && !topic ? "page" : seciliHafta === h ? "true" : undefined}>
            {h}
          </a>
        ))}
      </div>
      {konular.length > 1 && (
        <div className="secici-satir">
          <span className="secici-etiket">Konu</span>
          <a className="cip" href={href({ page: "sorular", hafta: seciliHafta })} aria-current={!topic ? "page" : undefined}>Haftanın tümü</a>
          {konular.map((k) => (
            <a key={k.id} className="cip" href={href({ page: "sorular", topic: k.id })} aria-current={topic === k.id ? "page" : undefined}>
              {k.title}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

type Durum = "tumu" | "cozulmemis" | "yanlis" | "dogru";
const DURUMLAR: [Durum, string][] = [["tumu", "Tümü"], ["cozulmemis", "Çözmediklerim"], ["yanlis", "Yanlışlarım"], ["dogru", "Doğrularım"]];
const TURLER: [string, string][] = [["", "Tüm türler"], ["tf", "Doğru/Yanlış"], ["mcq", "Çoktan seçmeli"], ["fill", "Boşluk doldurma"], ["code", "Kod"]];

interface Suzgec {
  durum: Durum;
  tur: string;
  zorluk: number;
  ara: string;
}

function suzgecOku(): Suzgec {
  const p = new URLSearchParams(location.search);
  const durum = p.get("durum") as Durum;
  const zorluk = Number(p.get("zorluk"));
  return {
    durum: DURUMLAR.some(([d]) => d === durum) ? durum : "tumu",
    tur: TURLER.some(([t]) => t === p.get("tur")) ? p.get("tur")! : "",
    zorluk: [1, 2, 3].includes(zorluk) ? zorluk : 0,
    ara: p.get("ara") ?? "",
  };
}

// Süzgeçler adreste tutulur; sayfa yenilenince ya da bağlantı paylaşılınca korunur
function suzgecYaz(s: Suzgec) {
  const p = new URLSearchParams(location.search);
  for (const k of ["durum", "tur", "zorluk", "ara"]) p.delete(k);
  if (s.durum !== "tumu") p.set("durum", s.durum);
  if (s.tur) p.set("tur", s.tur);
  if (s.zorluk) p.set("zorluk", String(s.zorluk));
  if (s.ara.trim()) p.set("ara", s.ara.trim());
  const q = p.toString();
  history.replaceState(history.state, "", location.pathname + (q ? `?${q}` : "") + location.hash);
}

const sade = (x: string) => x.toLocaleLowerCase("tr").replace(/[~`*]/g, "");

export function Questions({ topic, hafta, topics }: { topic?: string; hafta?: number; topics: Topic[] }) {
  const { me } = useOturum();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Durumlar sayfa açılırken bir kez alınır; çözdükçe liste kaymasın diye canlı güncellenmez
  const [durumlar, setDurumlar] = useState<SoruDurumlari | null>(null);
  const [suzgec, setSuzgec] = useState<Suzgec>(suzgecOku);

  useEffect(() => {
    setQuestions(null);
    setSuzgec(suzgecOku());
    api.questions(topic).then((q) => setQuestions(hafta ? q.filter((x) => x.week === hafta) : q), (e) => setError(String(e)));
    api.soruDurumlari().then(setDurumlar, () => setDurumlar({}));
  }, [topic, hafta]);

  const degistir = (yeni: Partial<Suzgec>) => {
    const s = { ...suzgec, ...yeni };
    setSuzgec(s);
    suzgecYaz(s);
  };

  const gorunen = useMemo(() => {
    if (!questions) return null;
    const ara = sade(suzgec.ara.trim());
    return questions.filter((q) => {
      const d = durumlar?.[q.id];
      if (suzgec.durum === "cozulmemis" && d === "dogru") return false;
      if (suzgec.durum === "yanlis" && d !== "yanlis") return false;
      if (suzgec.durum === "dogru" && d !== "dogru") return false;
      if (suzgec.tur && q.type !== suzgec.tur) return false;
      if (suzgec.zorluk && q.difficulty !== suzgec.zorluk) return false;
      return !ara || sade(q.id).includes(ara) || sade(q.prompt).includes(ara);
    });
  }, [questions, durumlar, suzgec]);

  // Yanlışlar listesinden gelen #soru-<id> bağlantısı, sorular yüklenince o soruya kaydırır
  useEffect(() => {
    if (gorunen && location.hash.startsWith("#soru-")) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, [gorunen !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  const suzuluyor = suzgec.durum !== "tumu" || !!suzgec.tur || !!suzgec.zorluk || !!suzgec.ara.trim();
  const cozulen = questions && durumlar ? questions.filter((q) => durumlar[q.id] === "dogru").length : 0;

  return (
    <div className="questions">
      <KonuSecici topics={topics} topic={topic} hafta={hafta} />
      {questions && questions.length > 0 && (
        <div className="soru-suzgec" role="search">
          <div className="secici-satir" role="group" aria-label="Durum">
            {DURUMLAR.map(([d, ad]) => (
              <button key={d} className="cip" aria-pressed={suzgec.durum === d} onClick={() => degistir({ durum: d })}>
                {ad}
              </button>
            ))}
          </div>
          <div className="suzgec-alanlar">
            <select aria-label="Soru türü" value={suzgec.tur} onChange={(e) => degistir({ tur: e.target.value })}>
              {TURLER.map(([t, ad]) => <option key={t} value={t}>{ad}</option>)}
            </select>
            <select aria-label="Zorluk" value={suzgec.zorluk} onChange={(e) => degistir({ zorluk: Number(e.target.value) })}>
              <option value={0}>Tüm zorluklar</option>
              {[1, 2, 3].map((z) => <option key={z} value={z}>{"★".repeat(z)}{"☆".repeat(3 - z)}</option>)}
            </select>
            <input type="search" aria-label="Sorularda ara" placeholder="Sorularda ara" value={suzgec.ara} onChange={(e) => degistir({ ara: e.target.value })} />
            {suzuluyor && <button onClick={() => degistir({ durum: "tumu", tur: "", zorluk: 0, ara: "" })}>Temizle</button>}
          </div>
        </div>
      )}
      {error ? (
        <p className="empty">Sorular yüklenemedi: {error}</p>
      ) : !questions || !gorunen ? (
        <p className="empty">Yükleniyor…</p>
      ) : questions.length === 0 ? (
        <p className="empty">Burada henüz soru yok.</p>
      ) : (
        <>
          <p className="hint">
            {suzuluyor ? `${questions.length} sorudan ${gorunen.length} tanesi gösteriliyor. ` : `${questions.length} soru, ${cozulen} tanesini çözdün. `}
            Cevaplar sunucuda kontrol edilir; kod sorularının benzetimi tarayıcında yapılır.{" "}
            {uye(me) ? (
              "İlerlemen hesabına kaydedilir."
            ) : (
              <>
                Giriş yapmadan da çözebilirsin; ilerlemen bu tarayıcıda misafir olarak saklanır.{" "}
                <a href="/kayit">Hesap açarsan</a> bu ilerleme hesabına taşınır.
              </>
            )}{" "}
            Aklına iyi bir soru geldiyse <a href="/oner">öner</a>.{" "}
            {topic ? <a href={href({ page: "topluluk", konu: topic })}>Bu konunun topluluk testbench'leri</a> : <a href="/topluluk">Topluluk testbench'leri</a>}.
          </p>
          {gorunen.length === 0 && (
            <p className="empty">
              {suzgec.durum === "cozulmemis" ? "Burada çözmediğin soru kalmamış." : suzgec.durum === "yanlis" ? "Burada yanlış yaptığın soru yok." : "Bu süzgeçlere uyan soru yok."}
            </p>
          )}
          {gorunen.map((q, i) => (
            <QuestionCard key={q.id} q={q} n={i + 1} />
          ))}
        </>
      )}
    </div>
  );
}
