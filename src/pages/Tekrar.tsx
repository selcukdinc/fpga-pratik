// /tekrar: aralıklı tekrar. Yanlış yapılan sorular ve aynı kavramdan henüz
// çözülmemiş sorular Leitner kutularında artan aralıklarla yeniden sorulur.

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { href } from "../lib/router";
import { useGunlukTekrar } from "../lib/tekrarAyar";
import { QuestionCard } from "./Questions";
import { KAVRAMLAR } from "../../shared/kavramlar";
import {
  ARALIKLAR, EK_TEKRAR, GUNLUK_SECENEKLERI, GUNLUK_TEKRAR, TAKVIM_GUN, sonrakiKutu,
  type TakvimSorusu, type TekrarCevabi, type TekrarSorusu,
} from "../../shared/tekrar";

const GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

// Bugünden gun gün sonrası
function tarih(gun: number) {
  const d = new Date();
  d.setDate(d.getDate() + gun);
  return d;
}

// "yarın", "Cuma (3 gün sonra)", "12 Kasım (14 gün sonra)"
function gunMetni(gun: number) {
  if (gun === 1) return "yarın";
  const d = tarih(gun);
  const ad = gun < 7 ? GUNLER[d.getDay()]! : `${d.getDate()} ${AYLAR[d.getMonth()]}`;
  return `${ad} (${gun} gün sonra)`;
}

const gunlukAdi = (n: number) => (n === 0 ? "Sınırsız" : String(n));

function Etiket({ t, biliyorum }: { t: TekrarSorusu; biliyorum: () => void }) {
  const kavram = t.kavram ? KAVRAMLAR[t.kavram]?.ad : null;
  const dogruysa = sonrakiKutu(t.kutu, true);
  return (
    <div className="tekrar-etiket">
      <p>
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
      <p className="hint">
        Doğru cevaplarsan{" "}
        {dogruysa.gun === null ? "öğrenildi sayılır ve bir daha sorulmaz" : `bir sonraki tekrar ${gunMetni(dogruysa.gun)}`}; yanlışsa yarın.{" "}
        <button type="button" className="bagli-dugme" onClick={biliyorum}>Biliyorum, artık sorma</button>
      </p>
    </div>
  );
}

// Yarından başlayan 30 günlük takvim; bir güne basınca o günün soruları listelenir
function Takvim({ d }: { d: TekrarCevabi }) {
  const [secili, setSecili] = useState<number | null>(null);
  if (!d.takvim.some((n) => n)) return null;
  // Izgara haftanın gününe hizalansın diye ilk günden önce boş hücreler (Pazartesi başlar)
  const bosluk = (tarih(1).getDay() + 6) % 7;
  const gununSorulari = secili === null ? [] : d.takvimSorular.filter((s) => s.gun === secili);
  return (
    <div className="tekrar-takvim">
      <h3>Önümüzdeki {TAKVIM_GUN} gün</h3>
      <div className="takvim-izgara" role="group" aria-label="Tekrar takvimi">
        {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((g) => <span key={g} className="takvim-baslik">{g}</span>)}
        {Array.from({ length: bosluk }, (_, i) => <span key={`b${i}`} />)}
        {d.takvim.map((n, i) => {
          const gun = i + 1;
          const t = tarih(gun);
          return (
            <button
              key={gun}
              type="button"
              className={`takvim-gun${n ? " dolu" : ""}`}
              aria-pressed={secili === gun}
              disabled={!n}
              aria-label={`${t.getDate()} ${AYLAR[t.getMonth()]} ${GUNLER[t.getDay()]}: ${n} soru`}
              onClick={() => setSecili(secili === gun ? null : gun)}
            >
              <span className="takvim-tarih">{t.getDate() === 1 || gun === 1 ? `${t.getDate()} ${AYLAR[t.getMonth()]!.slice(0, 3)}` : t.getDate()}</span>
              {n > 0 && <strong>{n}</strong>}
            </button>
          );
        })}
      </div>
      {secili !== null && (
        <div className="takvim-liste">
          <h4>
            {(() => { const t = tarih(secili); return `${t.getDate()} ${AYLAR[t.getMonth()]} ${GUNLER[t.getDay()]}`; })()}:{" "}
            {gununSorulari.length} soru
          </h4>
          <ul>
            {gununSorulari.map((s: TakvimSorusu) => (
              <li key={s.id}>
                <span className="tag">{s.kutu}. kutu</span> <span className="tag">H{s.hafta}</span>{" "}
                <a href={`${href({ page: "sorular", topic: s.topicId })}?durum=tumu#soru-${encodeURIComponent(s.id)}`}>{s.ozet || s.id}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Tekrar() {
  const [gunluk, gunlukSec] = useGunlukTekrar();
  const [ek, setEk] = useState(0);
  const [hafta, setHafta] = useState<number | null>(null);
  const [yanlis, setYanlis] = useState(false);
  const [d, setD] = useState<TekrarCevabi | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [yenileme, setYenileme] = useState(0);

  useEffect(() => {
    api.tekrar({ gunluk, ek, hafta, yanlis }).then(setD, (e) => setHata(String(e)));
  }, [yenileme, gunluk, ek, hafta, yanlis]);

  if (hata) return <p className="empty">Tekrar listesi yüklenemedi: {hata}</p>;
  if (!d) return <p className="empty">Yükleniyor…</p>;

  const kutudaki = d.kutular.reduce((a, b) => a + b, 0);
  const kalan = d.bekleyen - d.bugun.length;
  const suzgecli = hafta !== null || yanlis;

  const biliyorum = async (id: string) => {
    const r = await api.tekrarBiliyorum(id);
    if (r.ok) setYenileme((n) => n + 1);
  };
  const sifirla = async () => {
    if (!confirm("Tekrar kutularındaki bütün sorular silinecek ve tekrar takvimi baştan başlayacak. Çözdüğün sorular ve istatistiklerin kalır. Emin misin?")) return;
    const r = await api.tekrarSifirla();
    if (r.ok) setYenileme((n) => n + 1);
  };

  return (
    <div className="tekrar">
      <section className="tekrar-ozet">
        <div className="tekrar-ayarlar">
          <div className="secici-satir" role="group" aria-label="Günlük tekrar sayısı">
            <span className="secici-etiket">Günde</span>
            {GUNLUK_SECENEKLERI.map((n) => (
              <button key={n} type="button" className="cip" aria-pressed={gunluk === n} onClick={() => (setEk(0), gunlukSec(n))}>
                {gunlukAdi(n)}
              </button>
            ))}
            <span className="hint">soru{gunluk === GUNLUK_TEKRAR ? " (varsayılan)" : ""}</span>
          </div>
          {(kutudaki > 0 || suzgecli) && (
            <div className="secici-satir">
              {(d.haftalar.length > 1 || hafta !== null) && <label>
                <span className="secici-etiket">Hafta</span>{" "}
                <select value={hafta ?? ""} onChange={(e) => (setEk(0), setHafta(e.target.value ? Number(e.target.value) : null))}>
                  <option value="">Tüm haftalar</option>
                  {d.haftalar.map((h) => <option key={h.hafta} value={h.hafta}>{h.hafta}. hafta ({h.n})</option>)}
                </select>
              </label>}
              <label className="tekrar-yanlis">
                <input type="checkbox" checked={yanlis} onChange={(e) => (setEk(0), setYanlis(e.target.checked))} /> Yalnız yanlış yaptıklarım
              </label>
            </div>
          )}
        </div>

        {d.bugun.length ? (
          <p>
            <strong>Bugün {d.bugun.length} soru seni bekliyor.</strong>{" "}
            {kalan > 0 && <span className="hint">Günlük sınırın {gunlukAdi(d.gunluk)}; {kalan} soru sonraki günlere kalıyor.</span>}
          </p>
        ) : kutudaki ? (
          <p>
            <strong>{suzgecli ? "Bu seçimde bugün sorulacak soru yok." : "Bugünlük tekrar bitti."}</strong>{" "}
            <span className="hint">
              {d.yapilan ? `Bugün ${d.yapilan} soruyu tekrar ettin. ` : ""}
              {kalan > 0 ? `${kalan} soru günlük sınırın yüzünden sonraki günlere kaldı. ` : ""}
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
        {kalan > 0 && (
          <p>
            <button type="button" onClick={() => setEk((n) => n + EK_TEKRAR)}>Biraz daha tekrar et (+{Math.min(EK_TEKRAR, kalan)})</button>
          </p>
        )}

        <ol className="tekrar-kutular" aria-label="Leitner kutuları">
          {d.kutular.map((n, i) => (
            <li key={i} className={n ? "dolu" : undefined}>
              <strong>{n}</strong>
              <span>{i + 1}. kutu</span>
              <span className="hint">{ARALIKLAR[i]} gün sonra</span>
            </li>
          ))}
          <li className={`ogrenildi${d.ogrenilen ? " dolu" : ""}`}>
            <strong>{d.ogrenilen}</strong>
            <span>Öğrenildi</span>
            <span className="hint">artık sorulmaz</span>
          </li>
        </ol>

        <Takvim d={d} />

        <details className="tekrar-nasil">
          <summary>Nasıl çalışır?</summary>
          <p>
            Bir soruyu yanlış yaptığında soru 1. kutuya girer ve ertesi gün sorulur. Tekrarda doğru cevaplarsan bir sonraki
            kutuya geçer: 2. kutudaki soru 3 gün, 3. kutudaki 7 gün, 4. kutudaki 14 gün, 5. kutudaki 30 gün sonra yeniden
            sorulur. 5. kutuda da doğru cevaplarsan öğrenilmiş sayılır. Yanlış cevap soruyu her zaman 1. kutuya döndürür.
          </p>
          <p>
            Bu günler her sorunun <strong>kendi son cevabından</strong> itibaren sayılır; bütün sorular aynı gün sorulmaz. Pazartesi
            yanlış yaptığın soru Salı, Çarşamba yanlış yaptığın soru Perşembe gelir. Hangi gün kaç soru geleceğini yukarıdaki
            takvimde görebilir, bir güne basıp o günün sorularını listeleyebilirsin. Her sorunun altında, doğru cevaplarsan
            bir sonraki tekrarının ne zaman olacağı yazar.
          </p>
          <p>
            Bir soruyu ilk kez yanlış yaptığında, aynı kavramdan henüz hiç denemediğin en çok iki soru da ertesi günün
            tekrarına eklenir. Böylece aynı konuyu farklı bir sorudan da sınarsın.
          </p>
          <p>
            Günde kaç soru tekrar edeceğini yukarıdan seçebilirsin (varsayılan {GUNLUK_TEKRAR}). Sınıra sığmayan sorular
            kaybolmaz, sonraki günlere kalır; istersen <strong>Biraz daha tekrar et</strong> ile bugün de çözebilirsin. Bir
            soruyu artık bildiğini düşünüyorsan <strong>Biliyorum, artık sorma</strong> onu öğrenildi kutusuna taşır.
          </p>
        </details>
      </section>

      {d.bugun.length > 0 && (
        <>
          <div className="question-list">
            {d.sorular.map((q, i) => (
              <div key={q.id} className="tekrar-kart">
                <Etiket t={d.bugun[i]!} biliyorum={() => void biliyorum(q.id)} />
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

      {kutudaki + d.ogrenilen > 0 && (
        <p className="tekrar-sifirla">
          <button type="button" className="bagli-dugme" onClick={() => void sifirla()}>Tekrar ilerlemesini sıfırla</button>
        </p>
      )}
    </div>
  );
}

