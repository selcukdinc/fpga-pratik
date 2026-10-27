// /ders: 1-5. haftaların ders sayfaları. Anlatım, tarayıcıda çalışan küçük
// benzetimler ve soru havuzundan seçilmiş konu sonu testi.

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { href } from "../lib/router";
import { Markdown, inline } from "../components/Markdown";
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

// Ders sayfasındaki sorular (bölüm sonu "Kendini dene" ve konu sonu testi) tek
// istekle yüklenir
type SoruDurumu = Map<string, Question> | "hata" | null;

function useSorular(ders: DersVerisi): SoruDurumu {
  const [sorular, setSorular] = useState<SoruDurumu>(null);
  useEffect(() => {
    setSorular(null);
    api.questions().then((liste) => setSorular(new Map(liste.map((q) => [q.id, q]))), () => setSorular("hata"));
  }, [ders]);
  return sorular;
}

function KendiniDene({ ids, sorular }: { ids: string[]; sorular: SoruDurumu }) {
  if (!(sorular instanceof Map)) return null;
  const liste = ids.map((id) => sorular.get(id)).filter((q): q is Question => !!q);
  if (!liste.length) return null;
  return (
    <div className="kendini-dene">
      <h4>Kendini dene</h4>
      {liste.map((q, i) => (
        <QuestionCard key={q.id} q={q} n={i + 1} />
      ))}
    </div>
  );
}

function KonuSonuTesti({ ders, sorular: hepsi }: { ders: DersVerisi; sorular: SoruDurumu }) {
  if (hepsi === "hata") return <p className="bad">Sorular yüklenemedi.</p>;
  if (!hepsi) return <p className="empty">Yükleniyor…</p>;
  const sorular = ders.test.map((id) => hepsi.get(id)).filter((q): q is Question => !!q);
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
  const sorular = useSorular(ders);
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
          <h3>{inline(b.baslik, true)}</h3>
          <Markdown text={b.metin} terim />
          {b.sim && <MiniSim key={`${ders.hafta}-${i}`} sim={b.sim} />}
          {b.dene && <KendiniDene ids={b.dene} sorular={sorular} />}
        </section>
      ))}

      <section id="test" className="ders-bolum ders-test">
        <h3>Konu sonu testi</h3>
        <KonuSonuTesti ders={ders} sorular={sorular} />
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
