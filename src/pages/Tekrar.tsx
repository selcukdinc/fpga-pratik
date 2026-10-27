// /tekrar: aralıklı tekrar. Yanlış yapılan sorular ve aynı kavramdan henüz
// çözülmemiş sorular Leitner kutularında artan aralıklarla yeniden sorulur.

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { QuestionCard } from "./Questions";
import { KAVRAMLAR } from "../../shared/kavramlar";
import { ARALIKLAR, GUNLUK_TEKRAR, type TekrarCevabi, type TekrarSorusu } from "../../shared/tekrar";

const GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function gunAdi(i: number) {
  if (i === 0) return "Yarın";
  const d = new Date();
  d.setDate(d.getDate() + i + 1);
  return GUNLER[d.getDay()]!;
}

function Etiket({ t }: { t: TekrarSorusu }) {
  const kavram = t.kavram ? KAVRAMLAR[t.kavram]?.ad : null;
  return (
    <p className="tekrar-etiket">
      {t.kaynak === "iliskili" ? (
        <>
          <span className="tag tekrar-yeni">Yeni</span> Daha önce görmediğin bir soru{kavram ? `, ${kavram} kavramından` : ""}
        </>
      ) : (
        <>
          <span className="tag">{t.kutu}. kutu</span> Daha önce yanlış yaptığın soru{kavram ? ` · ${kavram}` : ""}
        </>
      )}
    </p>
  );
}

export function Tekrar() {
  const [d, setD] = useState<TekrarCevabi | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [yenileme, setYenileme] = useState(0);

  useEffect(() => {
    api.tekrar().then(setD, (e) => setHata(String(e)));
  }, [yenileme]);

  if (hata) return <p className="empty">Tekrar listesi yüklenemedi: {hata}</p>;
  if (!d) return <p className="empty">Yükleniyor…</p>;

  const kutudaki = d.kutular.reduce((a, b) => a + b, 0);
  const yarinaKalan = d.bekleyen - d.bugun.length;

  return (
    <div className="tekrar">
      <section className="tekrar-ozet">
        {d.bugun.length ? (
          <p>
            <strong>Bugün {d.bugun.length} soru seni bekliyor.</strong>{" "}
            {yarinaKalan > 0 && <span className="hint">Günde en çok {GUNLUK_TEKRAR} tekrar yapılır; {yarinaKalan} soru sonraki günlere kalır.</span>}
          </p>
        ) : kutudaki ? (
          <p>
            <strong>Bugünlük tekrar bitti.</strong>{" "}
            <span className="hint">
              {d.yapilan ? `Bugün ${d.yapilan} soruyu tekrar ettin. ` : ""}
              {d.takvim[0] ? `Yarın ${d.takvim[0]} soru var.` : "Yarın sorulacak soru yok."}
            </span>
          </p>
        ) : (
          <p>
            <strong>Tekrar kutun boş.</strong>{" "}
            <span className="hint">
              <a href="/sorular">Soru havuzunda</a> yanlış yaptığın her soru ertesi gün burada yeniden sorulur.
            </span>
          </p>
        )}

        <ol className="tekrar-kutular" aria-label="Leitner kutuları">
          {d.kutular.map((n, i) => (
            <li key={i} className={n ? "dolu" : undefined}>
              <strong>{n}</strong>
              <span>{i + 1}. kutu</span>
              <span className="hint">{ARALIKLAR[i]} günde bir</span>
            </li>
          ))}
          <li className={`ogrenildi${d.ogrenilen ? " dolu" : ""}`}>
            <strong>{d.ogrenilen}</strong>
            <span>Öğrenildi</span>
            <span className="hint">artık sorulmaz</span>
          </li>
        </ol>

        {d.takvim.some((n) => n) && (
          <p className="hint tekrar-takvim">
            Önümüzdeki günler:{" "}
            {d.takvim.flatMap((n, i) => (n ? [`${gunAdi(i)} ${n}`] : [])).join(" · ")}
          </p>
        )}

        <details className="tekrar-nasil">
          <summary>Nasıl çalışır?</summary>
          <p>
            Bir soruyu yanlış yaptığında soru 1. kutuya girer ve ertesi gün sorulur. Tekrarda doğru cevaplarsan bir sonraki
            kutuya geçer: 2. kutudaki soru 3 gün, 3. kutudaki 7 gün, 4. kutudaki 14 gün, 5. kutudaki 30 gün sonra yeniden
            sorulur. 5. kutuda da doğru cevaplarsan öğrenilmiş sayılır. Yanlış cevap soruyu her zaman 1. kutuya döndürür.
          </p>
          <p>
            Bir soruyu ilk kez yanlış yaptığında, aynı kavramdan henüz hiç denemediğin en çok iki soru da ertesi günün
            tekrarına eklenir. Böylece aynı konuyu farklı bir sorudan da sınarsın.
          </p>
        </details>
      </section>

      {d.bugun.length > 0 && (
        <>
          <div className="question-list">
            {d.sorular.map((q, i) => (
              <div key={q.id} className="tekrar-kart">
                <Etiket t={d.bugun[i]!} />
                <QuestionCard q={q} n={i + 1} />
              </div>
            ))}
          </div>
          <p className="tekrar-alt">
            <button type="button" onClick={() => setYenileme((n) => n + 1)}>Listeyi yenile</button>{" "}
            <span className="hint">Cevapladığın sorular kutularına göre ileri tarihe taşınır.</span>
          </p>
        </>
      )}
    </div>
  );
}
