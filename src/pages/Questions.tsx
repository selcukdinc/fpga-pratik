import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Markdown } from "../components/Markdown";
import type { AnswerResult, Question } from "../../shared/api";
import type { Answer } from "../../shared/grade";

function QuestionCard({ q, n }: { q: Question; n: number }) {
  const [tf, setTf] = useState<boolean | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [blanks, setBlanks] = useState<string[]>(() => Array(q.payload.blanks ?? 0).fill(""));
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

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

  const reset = () => {
    setResult(null);
    setTf(null);
    setChoice(null);
    setBlanks(Array(q.payload.blanks ?? 0).fill(""));
  };

  return (
    <article className={`question${result ? (result.correct ? " correct" : " wrong") : ""}`}>
      <header>
        <span className="q-num">Soru {n}</span>
        <span className={`tag tag-${q.source}`}>{q.source === "original" ? "Orijinal" : "Türetilmiş"}</span>
        <span className="tag">H{q.week}</span>
      </header>
      <Markdown text={q.prompt} />

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
          {q.payload.choices?.map((c, i) => (
            <label key={i}>
              <input type="radio" name={q.id} checked={choice === i} onChange={() => setChoice(i)} disabled={!!result} />
              <span className="choice-letter">{String.fromCharCode(65 + i)})</span> <code>{c}</code>
            </label>
          ))}
        </div>
      )}

      {q.type === "fill" && (
        <div className="choices">
          {blanks.map((b, i) => (
            <label key={i}>
              Boşluk {i + 1}
              <input
                className="mono"
                value={b}
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
            <strong className={result.correct ? "ok" : "bad"}>{result.correct ? "Doğru" : "Yanlış"}</strong>
            {result.explanation && <Markdown text={result.explanation} />}
            <button onClick={reset}>Tekrar dene</button>
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

export function Questions({ topic }: { topic?: string }) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setQuestions(null);
    api.questions(topic).then(setQuestions, (e) => setError(String(e)));
  }, [topic]);

  if (error) return <p className="empty">Sorular yüklenemedi: {error}</p>;
  if (!questions) return <p className="empty">Yükleniyor…</p>;
  if (questions.length === 0) return <p className="empty">Bu konuda henüz soru yok.</p>;

  return (
    <div className="questions">
      <p className="hint">
        Cevaplar sunucuda kontrol edilir. Giriş yapmadan da çözebilirsin; ilerlemen bu tarayıcıda misafir olarak saklanır.
      </p>
      {questions.map((q, i) => (
        <QuestionCard key={q.id} q={q} n={i + 1} />
      ))}
    </div>
  );
}
