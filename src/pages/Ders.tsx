// /ders: 1-5. haftaların ders sayfaları. Anlatım, tarayıcıda çalışan küçük
// benzetimler ve soru havuzundan seçilmiş konu sonu testi.

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { href } from "../lib/router";
import { Markdown } from "../components/Markdown";
import { MiniSim } from "../components/MiniSim";
import { QuestionCard } from "./Questions";
import { DERSLER, dersBul } from "../dersler";
import type { Ders as DersVerisi } from "../dersler/tipler";
import type { Question } from "../../shared/api";

const bolumId = (i: number) => `bolum-${i + 1}`;

function DersListesi() {
  return (
    <div className="ders-sayfa">
      <p className="ders-giris">
        Her ders konuyu kısaca anlatır, tarayıcında çalıştırabileceğin küçük örneklerle pekiştirir ve sonunda soru
        havuzundan seçilmiş kısa bir testle biter.
      </p>
      <ol className="ders-listesi">
        {DERSLER.map((d) => {
          const sim = d.bolumler.filter((b) => b.sim).length;
          return (
            <li key={d.hafta}>
              <a href={href({ page: "ders", hafta: d.hafta })}>
                <span className="ders-hafta">{d.hafta}. hafta</span>
                <strong>{d.baslik}</strong>
                <span className="hint">{d.ozet}</span>
                <span className="ders-etiketler">
                  <span className="tag">{d.bolumler.length} bölüm</span>
                  {sim > 0 && <span className="tag">{sim} benzetim</span>}
                  <span className="tag">{d.test.length} soruluk test</span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function KonuSonuTesti({ ders }: { ders: DersVerisi }) {
  const [sorular, setSorular] = useState<Question[] | null>(null);
  const [hata, setHata] = useState(false);
  useEffect(() => {
    setSorular(null);
    api.questions().then((liste) => {
      const m = new Map(liste.map((q) => [q.id, q]));
      setSorular(ders.test.map((id) => m.get(id)).filter((q): q is Question => !!q));
    }, () => setHata(true));
  }, [ders]);

  if (hata) return <p className="bad">Sorular yüklenemedi.</p>;
  if (!sorular) return <p className="empty">Yükleniyor…</p>;
  if (sorular.length === 0) return <p className="empty">Bu haftanın soruları henüz açılmadı.</p>;
  return (
    <>
      <p className="hint">
        Cevapların ilerlemene işlenir. Daha fazlası için{" "}
        <a href={href({ page: "sorular", hafta: ders.hafta })}>{ders.hafta}. haftanın tüm sorularına</a> bak.
      </p>
      {sorular.map((q, i) => (
        <QuestionCard key={q.id} q={q} n={i + 1} />
      ))}
    </>
  );
}

function DersSayfasi({ ders }: { ders: DersVerisi }) {
  // /ders/3#bolum-2 gibi bir adresle gelindiyse sayfa çizildikten sonra o bölüme kaydırılır
  useEffect(() => {
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, []);
  const onceki = dersBul(ders.hafta - 1);
  const sonraki = dersBul(ders.hafta + 1);
  return (
    <div className="ders-sayfa">
      <header className="ders-ust">
        <span className="ders-hafta">{ders.hafta}. hafta</span>
        <h2>{ders.baslik}</h2>
        <p className="hint">{ders.ozet}</p>
      </header>
      <nav className="ders-icindekiler" aria-label="Bu derste">
        <ol>
          {ders.bolumler.map((b, i) => (
            <li key={b.baslik}><a href={`#${bolumId(i)}`}>{b.baslik}</a></li>
          ))}
          <li><a href="#test">Konu sonu testi</a></li>
        </ol>
      </nav>

      {ders.bolumler.map((b, i) => (
        <section key={b.baslik} id={bolumId(i)} className="ders-bolum">
          <h3>{b.baslik}</h3>
          <Markdown text={b.metin} />
          {b.sim && <MiniSim key={`${ders.hafta}-${i}`} sim={b.sim} />}
        </section>
      ))}

      <section id="test" className="ders-bolum ders-test">
        <h3>Konu sonu testi</h3>
        <KonuSonuTesti ders={ders} />
      </section>

      <nav className="ders-gezinti" aria-label="Dersler arasında">
        {onceki ? <a href={href({ page: "ders", hafta: onceki.hafta })}>← {onceki.hafta}. hafta: {onceki.baslik}</a> : <span />}
        {sonraki && <a href={href({ page: "ders", hafta: sonraki.hafta })}>{sonraki.hafta}. hafta: {sonraki.baslik} →</a>}
      </nav>
    </div>
  );
}

export function Ders({ hafta }: { hafta?: number }) {
  if (hafta === undefined) return <DersListesi />;
  const ders = dersBul(hafta);
  if (!ders) return <p className="empty">Bu hafta için henüz ders yok. <a href="/ders">Tüm dersler</a></p>;
  return <DersSayfasi key={hafta} ders={ders} />;
}
