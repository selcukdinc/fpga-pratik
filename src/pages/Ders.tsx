// /ders: 1-6. haftaların ders sayfaları. Anlatım, tarayıcıda çalışan küçük
// benzetimler ve soru havuzundan seçilmiş konu sonu testi.

import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { href } from "../lib/router";
import { Markdown, inline } from "../components/Markdown";
import { MiniSim } from "../components/MiniSim";
import { QuestionCard } from "./Questions";
import { bolumId } from "../dersler/bolumBul";
import { DERSLER, dersBul } from "../dersler";
import type { Ders as DersVerisi } from "../dersler/tipler";
import type { Question, SoruDurumlari } from "../../shared/api";
import { useDersIlerleme } from "../lib/dersIlerleme";
import { bolumBittiMi, type DersIlerleme } from "../../shared/dersIlerleme";


const bitenSayisi = (i: DersIlerleme, d: DersVerisi) => d.bolumler.filter((_, k) => bolumBittiMi(i, d.hafta, k)).length;

function IlerlemeCubugu({ biten, toplam }: { biten: number; toplam: number }) {
  return (
    <span className="ders-ilerleme">
      <span className="ders-ilerleme-cubuk" aria-hidden="true"><span style={{ width: `${(biten / toplam) * 100}%` }} /></span>
      <span>{biten === toplam ? "Bitirdin" : `${biten}/${toplam} bölüm bitti`}</span>
    </span>
  );
}

function DersListesi() {
  const { ilerleme } = useDersIlerleme();
  const son = ilerleme.son;
  const sonDers = son ? dersBul(son.hafta) : undefined;
  const sonBolum = son && sonDers?.bolumler[son.bolum];
  return (
    <div className="ders-sayfa">
      <p className="ders-giris">
        Her ders konuyu kısaca anlatır, tarayıcında çalıştırabileceğin küçük örneklerle pekiştirir ve sonunda soru
        havuzundan seçilmiş kısa bir testle biter. Bir bölümü bitirince sonundaki <strong>Bu bölümü bitirdim</strong>{" "}
        düğmesine bas; ilerlemen burada görünür.
      </p>
      {son && sonDers && sonBolum && (
        <a className="ders-devam" href={`${href({ page: "ders", hafta: son.hafta })}#${bolumId(son.bolum)}`}>
          <span className="ders-hafta">Kaldığın yer</span>
          <strong>{son.hafta}. hafta: {sonBolum.baslik}</strong>
          <span className="ders-devam-ok">Devam et →</span>
        </a>
      )}
      <ol className="ders-listesi">
        {DERSLER.map((d) => {
          const sim = d.bolumler.filter((b) => b.sim).length;
          const biten = bitenSayisi(ilerleme, d);
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
                {biten > 0 && <IlerlemeCubugu biten={biten} toplam={d.bolumler.length} />}
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

function useSorular(ders: DersVerisi): [SoruDurumu, SoruDurumlari] {
  const [sorular, setSorular] = useState<SoruDurumu>(null);
  // Daha önce çözülen sorular kartta işaretlenir; sayfa açılırken bir kez alınır
  const [durumlar, setDurumlar] = useState<SoruDurumlari>({});
  useEffect(() => {
    setSorular(null);
    api.questions().then((liste) => setSorular(new Map(liste.map((q) => [q.id, q]))), () => setSorular("hata"));
    api.soruDurumlari().then(setDurumlar, () => setDurumlar({}));
  }, [ders]);
  return [sorular, durumlar];
}

function KendiniDene({ ids, sorular, durumlar }: { ids: string[]; sorular: SoruDurumu; durumlar: SoruDurumlari }) {
  if (!(sorular instanceof Map)) return null;
  const liste = ids.map((id) => sorular.get(id)).filter((q): q is Question => !!q);
  if (!liste.length) return null;
  return (
    <div className="kendini-dene">
      <h4>Kendini dene</h4>
      {liste.map((q, i) => (
        <QuestionCard key={q.id} q={q} n={i + 1} dersBagi={false} durum={durumlar[q.id]} />
      ))}
    </div>
  );
}

function KonuSonuTesti({ ders, sorular: hepsi, durumlar }: { ders: DersVerisi; sorular: SoruDurumu; durumlar: SoruDurumlari }) {
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
        <QuestionCard key={q.id} q={q} n={i + 1} dersBagi={false} durum={durumlar[q.id]} />
      ))}
    </>
  );
}

function DersSayfasi({ ders }: { ders: DersVerisi }) {
  // /ders/3#bolum-2 gibi bir adresle gelindiyse sayfa çizildikten sonra o bölüme kaydırılır
  useEffect(() => {
    if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, []);
  const [sorular, durumlar] = useSorular(ders);
  const { ilerleme, isaretle, sonYer } = useDersIlerleme();
  useSonBolum(ders.hafta, sonYer);
  const biten = bitenSayisi(ilerleme, ders);
  const onceki = dersBul(ders.hafta - 1);
  const sonraki = dersBul(ders.hafta + 1);
  return (
    <div className="ders-sayfa">
      <header className="ders-ust">
        <span className="ders-hafta">{ders.hafta}. hafta</span>
        <h2>{ders.baslik}</h2>
        <p className="hint">{ders.ozet}</p>
        <IlerlemeCubugu biten={biten} toplam={ders.bolumler.length} />
      </header>
      <nav className="ders-icindekiler" aria-label="Bu derste">
        <ol>
          {ders.bolumler.map((b, i) => {
            const bitti = bolumBittiMi(ilerleme, ders.hafta, i);
            return (
              <li key={b.baslik} className={bitti ? "bitti" : undefined}>
                <a href={`#${bolumId(i)}`}>{b.baslik}</a>
                {bitti && <span className="bitti-isareti" aria-label="bitirdin"> ✓</span>}
              </li>
            );
          })}
          <li><a href="#test">Konu sonu testi</a></li>
        </ol>
      </nav>

      {ders.bolumler.map((b, i) => (
        <section key={b.baslik} id={bolumId(i)} className="ders-bolum">
          <h3>{inline(b.baslik, true)}</h3>
          <Markdown text={b.metin} terim />
          {b.sim && <MiniSim key={`${ders.hafta}-${i}`} sim={b.sim} />}
          {b.dene && <KendiniDene ids={b.dene} sorular={sorular} durumlar={durumlar} />}
          <BolumSonu
            bitti={bolumBittiMi(ilerleme, ders.hafta, i)}
            degistir={(bitti) => isaretle(ders.hafta, i, bitti)}
            sonraki={i + 1 < ders.bolumler.length ? { id: bolumId(i + 1), baslik: ders.bolumler[i + 1]!.baslik } : { id: "test", baslik: "Konu sonu testi" }}
          />
        </section>
      ))}

      <section id="test" className="ders-bolum ders-test">
        <h3>Konu sonu testi</h3>
        <KonuSonuTesti ders={ders} sorular={sorular} durumlar={durumlar} />
      </section>

      <nav className="ders-gezinti" aria-label="Dersler arasında">
        {onceki ? <a href={href({ page: "ders", hafta: onceki.hafta })}>← {onceki.hafta}. hafta: {onceki.baslik}</a> : <span />}
        {sonraki && <a href={href({ page: "ders", hafta: sonraki.hafta })}>{sonraki.hafta}. hafta: {sonraki.baslik} →</a>}
      </nav>
    </div>
  );
}

// Bölümün sonundaki "Bu bölümü bitirdim" düğmesi; bitirilince sonraki bölüme bağlantı da verir
function BolumSonu({ bitti, degistir, sonraki }: { bitti: boolean; degistir: (bitti: boolean) => void; sonraki: { id: string; baslik: string } }) {
  return (
    <div className={`bolum-sonu${bitti ? " bitti" : ""}`}>
      {bitti ? (
        <>
          <span className="bolum-sonu-durum">✓ Bu bölümü bitirdin.</span>
          <a href={`#${sonraki.id}`}>Sıradaki: {sonraki.baslik} →</a>
          <button className="bagli-dugme" onClick={() => degistir(false)}>Geri al</button>
        </>
      ) : (
        <button className="primary" onClick={() => degistir(true)}>Bu bölümü bitirdim</button>
      )}
    </div>
  );
}

// Ekranın üst kısmındaki bölüm "kaldığın yer" olarak kaydedilir
function useSonBolum(hafta: number, sonYer: (hafta: number, bolum: number) => void) {
  const kaydet = useRef(sonYer);
  kaydet.current = sonYer;
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const bolumler = [...document.querySelectorAll<HTMLElement>(".ders-bolum[id^='bolum-']")];
    const g = new IntersectionObserver(
      (girdiler) => {
        for (const e of girdiler) {
          if (!e.isIntersecting) continue;
          const sira = Number((e.target as HTMLElement).id.slice("bolum-".length)) - 1;
          if (sira >= 0) kaydet.current(hafta, sira);
        }
      },
      // Bölüm ekranın üstten %20-40'lık şeridine girince okunuyor sayılır
      { rootMargin: "-20% 0px -60% 0px" },
    );
    bolumler.forEach((b) => g.observe(b));
    return () => g.disconnect();
  }, [hafta]);
}

export function Ders({ hafta }: { hafta?: number }) {
  if (hafta === undefined) return <DersListesi />;
  const ders = dersBul(hafta);
  if (!ders) return <p className="empty">Bu hafta için henüz ders yok. <a href="/ders">Tüm dersler</a></p>;
  return <DersSayfasi key={hafta} ders={ders} />;
}
