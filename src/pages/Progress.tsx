import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { href } from "../lib/router";
import { uye, useOturum } from "../lib/oturum";
import { basamak } from "../lib/ilerleme";
import { ALEV, KIVILCIM, PARILTI, gunSusu, rozetler } from "../../shared/motivasyon";
import type { IlerlemeAyrintisi, TopicProgress } from "../../shared/api";

type Gun = IlerlemeAyrintisi["takvim"][number];

const AYLAR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const GUN_ADLARI = ["", "Pzt", "", "Çar", "", "Cum", "", ""];

function tarihYaz(gun: string) {
  const [y, a, g] = gun.split("-").map(Number);
  return `${g} ${AYLAR[a! - 1]} ${y}`;
}

function Takvim({ takvim }: { takvim: Gun[] }) {
  if (!takvim.length) return null;
  const enCok = Math.max(1, ...takvim.map((g) => g.deneme));
  // Sütunlar haftalar, satırlar Pazartesi-Pazar; ilk günün haftadaki yeri kadar boşluk bırakılır
  const ilk = (new Date(`${takvim[0]!.gun}T12:00:00Z`).getUTCDay() + 6) % 7;
  const hucreler: (Gun | null)[] = [...Array(ilk).fill(null), ...takvim];
  const sutunlar: (Gun | null)[][] = [];
  for (let i = 0; i < hucreler.length; i += 7) sutunlar.push(hucreler.slice(i, i + 7));
  const ayEtiketi = (s: (Gun | null)[], i: number) => {
    const g = s.find((x) => x);
    if (!g) return "";
    const ay = Number(g.gun.slice(5, 7));
    const onceki = i > 0 ? sutunlar[i - 1]!.find((x) => x) : null;
    return !onceki || Number(onceki.gun.slice(5, 7)) !== ay ? AYLAR[ay - 1] : "";
  };

  return (
    <figure className="takvim">
      <div className="takvim-izgara" role="img" aria-label="Son 12 haftanın günlük deneme sayıları; ayrıntılar aşağıdaki tabloda">
        <div className="takvim-gunler" aria-hidden="true">
          {GUN_ADLARI.map((g, i) => <span key={i}>{g}</span>)}
        </div>
        {sutunlar.map((s, i) => (
          <div className="takvim-sutun" key={i}>
            <span className="takvim-ay" aria-hidden="true">{ayEtiketi(s, i)}</span>
            {s.map((g, j) =>
              g ? (
                <span
                  key={j}
                  className={`takvim-hucre b${basamak(g.deneme, enCok)} ${gunSusu(g.dogru) ?? ""}`}
                  title={`${tarihYaz(g.gun)}: ${g.deneme ? `${g.deneme} deneme, ${g.dogru} doğru` : "deneme yok"}${SUS_ADI[gunSusu(g.dogru) ?? ""] ?? ""}`}
                />
              ) : (
                <span key={j} className="takvim-hucre bos" />
              ),
            )}
          </div>
        ))}
      </div>
      <figcaption className="takvim-lejant">
        Az
        {[0, 1, 2, 3, 4].map((b) => <span key={b} className={`takvim-hucre b${b}`} aria-hidden="true" />)}
        Çok
        <span className="hint"> (en yoğun gün: {enCok} deneme)</span>
        <span className="takvim-suslar">
          <span className="takvim-hucre b2 kivilcim" aria-hidden="true" /> {KIVILCIM}+ doğru
          <span className="takvim-hucre b3 parilti" aria-hidden="true" /> {PARILTI}+
          <span className="takvim-hucre b4 alev" aria-hidden="true" /> {ALEV}+ alev
        </span>
      </figcaption>
      <details className="takvim-tablo">
        <summary>Tablo olarak göster</summary>
        <table>
          <thead><tr><th>Gün</th><th>Deneme</th><th>Doğru</th></tr></thead>
          <tbody>
            {takvim.filter((g) => g.deneme).reverse().map((g) => (
              <tr key={g.gun}><td>{tarihYaz(g.gun)}</td><td>{g.deneme}</td><td>{g.dogru}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

const SUS_ADI: Record<string, string> = { kivilcim: " · kıvılcım", parilti: " · parıltı", alev: " · alev günü 🔥" };

function Bugun({ dogru, hedef, uyeMi }: { dogru: number; hedef: number; uyeMi: boolean }) {
  if (!hedef) {
    return (
      <p className="hint bugun">
        Bugün {dogru} doğru. Günlük hedefin kapalı; <a href="/ayarlar">Ayarlar</a>'dan açabilirsin.
      </p>
    );
  }
  const tamam = dogru >= hedef;
  return (
    <div className={`bugun${tamam ? " tamam" : ""}`}>
      <div>
        <strong>{tamam ? "🎯 Günlük hedef tamam" : "Bugünkü hedef"}</strong>
        <span className="hint">
          {" "}{Math.min(dogru, hedef)} / {hedef} doğru
          {tamam && dogru > hedef ? ` (toplam ${dogru})` : ""}
          {!tamam && ` · ${hedef - dogru} kaldı`}
        </span>
      </div>
      <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={hedef} aria-valuenow={Math.min(dogru, hedef)} aria-label="Günlük hedef">
        <div style={{ width: `${Math.min(100, Math.round((dogru / hedef) * 100))}%` }} />
      </div>
      <span className="hint">
        {uyeMi ? <a href="/ayarlar">Hedefi değiştir</a> : <><a href="/kayit">Hesap açarsan</a> hedefini değiştirebilirsin.</>}
      </span>
    </div>
  );
}

const oran = (r: TopicProgress) => (r.total ? r.correct / r.total : 0);
const yuzde = (x: number) => `%${Math.round(x * 100)}`;

export function Progress() {
  const { me } = useOturum();
  const [rows, setRows] = useState<TopicProgress[] | null>(null);
  const [ayrinti, setAyrinti] = useState<IlerlemeAyrintisi | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.progress().then(setRows, (e) => setError(String(e)));
    api.ilerlemeAyrintisi().then(setAyrinti, () => setAyrinti({ takvim: [], yanlislar: [], hedef: 0, seri: { simdi: 0, enUzun: 0 }, alevGunleri: 0, hedefGunleri: 0 }));
  }, []);

  if (error) return <p className="empty">İlerleme yüklenemedi: {error}</p>;
  if (!rows || !ayrinti) return <p className="empty">Yükleniyor…</p>;

  const toplam = rows.reduce((s, r) => s + r.total, 0);
  const dogru = rows.reduce((s, r) => s + r.correct, 0);
  const denenen = rows.reduce((s, r) => s + r.attempted, 0);
  const deneme = ayrinti.takvim.reduce((s, g) => s + g.deneme, 0);
  const dogruDeneme = ayrinti.takvim.reduce((s, g) => s + g.dogru, 0);
  const aktifGun = ayrinti.takvim.filter((g) => g.deneme).length;

  // Zayıf konular: denenmiş ve henüz bitmemiş konular, oranı en düşük olanlar
  const zayif = rows
    .filter((r) => r.attempted > 0 && r.correct < r.total)
    .sort((a, b) => oran(a) - oran(b) || b.total - a.total)
    .slice(0, 3);

  const haftalar = [...new Set(rows.map((r) => r.week))].sort((a, b) => a - b).map((w) => {
    const h = rows.filter((r) => r.week === w);
    return { w, total: h.reduce((s, r) => s + r.total, 0), correct: h.reduce((s, r) => s + r.correct, 0) };
  });

  return (
    <div className="progress">
      {!uye(me) && (
        <p className="hint">
          İlerlemen bu tarayıcıda misafir olarak saklanıyor. <a href="/kayit">Hesap açarsan</a> hesabına taşınır ve her cihazda görürsün.
        </p>
      )}

      <div className="ilerleme-ozet">
        <div className="pano-kart"><strong>{dogru} / {toplam}</strong><span>soru çözüldü</span></div>
        <div className="pano-kart"><strong>{deneme ? yuzde(dogruDeneme / deneme) : "–"}</strong><span>son 12 haftada isabet</span></div>
        <div className="pano-kart"><strong>{aktifGun}</strong><span>aktif gün (12 hafta)</span></div>
        <div className="pano-kart">
          <strong>{ayrinti.seri.simdi}{ayrinti.seri.simdi >= 3 ? " 🔥" : ""}</strong>
          <span>günlük seri · en uzun {ayrinti.seri.enUzun}</span>
        </div>
      </div>

      <Bugun dogru={ayrinti.takvim[ayrinti.takvim.length - 1]?.dogru ?? 0} hedef={ayrinti.hedef} uyeMi={uye(me)} />

      <section className="ilerleme-bolum">
        <h3>Etkinlik</h3>
        <Takvim takvim={ayrinti.takvim} />
      </section>

      <section className="ilerleme-bolum">
        <h3>Rozetler</h3>
        <p className="hint">Yalnızca sen görürsün; kimseyle karşılaştırılmaz.</p>
        <ul className="rozetler">
          {rozetler({ enUzunSeri: ayrinti.seri.enUzun, alevGunleri: ayrinti.alevGunleri, hedefGunleri: ayrinti.hedefGunleri, cozulen: dogru, toplam }).map((r) => {
            const kazanildi = r.ilerleme >= r.esik;
            return (
              <li key={r.id} className={kazanildi ? "kazanildi" : undefined}>
                <span className="rozet-ikon" aria-hidden="true">{r.ikon}</span>
                <span>
                  <strong>{r.ad}</strong>
                  <span className="hint">{r.aciklama}</span>
                  <span className="hint">{kazanildi ? "Kazanıldı" : `${Math.min(r.ilerleme, r.esik)} / ${r.esik}`}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="ilerleme-iki">
        <section className="ilerleme-bolum">
          <h3>Tekrar etmen gereken konular</h3>
          {zayif.length === 0 ? (
            <p className="hint">{denenen ? "Denediğin konuların hepsini bitirmişsin." : "Birkaç soru çözünce zayıf konuların burada görünür."}</p>
          ) : (
            <ul className="zayif-konular">
              {zayif.map((r) => (
                <li key={r.topicId}>
                  <div>
                    <a href={href({ page: "sorular", topic: r.topicId })}>{r.title}</a>
                    <span className="hint"> H{r.week} · {r.correct}/{r.total} doğru</span>
                  </div>
                  <div className="bar" role="img" aria-label={yuzde(oran(r))}><div style={{ width: `${Math.round(oran(r) * 100)}%` }} /></div>
                  <a className="dugme-link" href={`${href({ page: "sorular", topic: r.topicId })}?durum=cozulmemis`}>Tekrar et</a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="ilerleme-bolum">
          <h3>Haftalar</h3>
          <ul className="hafta-cubuklari">
            {haftalar.map((h) => (
              <li key={h.w}>
                <a href={href({ page: "sorular", hafta: h.w })}>Hafta {h.w}</a>
                <div className="bar" role="img" aria-label={yuzde(h.total ? h.correct / h.total : 0)}>
                  <div style={{ width: `${h.total ? Math.round((h.correct / h.total) * 100) : 0}%` }} />
                </div>
                <span className="hint">{h.correct}/{h.total}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="ilerleme-bolum">
        <h3>Yanlış yaptıklarım</h3>
        {ayrinti.yanlislar.length === 0 ? (
          <p className="hint">Denediğin halde doğru çözemediğin soru yok.</p>
        ) : (
          <>
            <p>
              Henüz doğru çözemediğin {ayrinti.yanlislar.length} soru.{" "}
              <a className="dugme-link" href="/sorular?durum=yanlis">Hepsini tekrar çöz</a>
            </p>
            <ul className="yanlis-listesi">
              {ayrinti.yanlislar.map((y) => (
                <li key={y.id}>
                  <a href={`${href({ page: "sorular", topic: y.topicId })}?durum=yanlis#soru-${encodeURIComponent(y.id)}`}>{y.ozet}</a>
                  <span className="hint"> {y.topicTitle} · H{y.week} · {y.deneme} deneme</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="ilerleme-bolum">
        <h3>Konular</h3>
        <p className="hint">Her konuda en az bir kez doğru çözdüğün soruların oranı. Eksik olduğun konular üstte.</p>
        <table>
          <thead>
            <tr>
              <th>Hafta</th>
              <th>Konu</th>
              <th>Doğru</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {[...rows]
              .sort((a, b) => oran(a) - oran(b))
              .map((r) => {
                const pct = Math.round(oran(r) * 100);
                return (
                  <tr key={r.topicId}>
                    <td>{r.week}</td>
                    <td>
                      <a href={href({ page: "sorular", topic: r.topicId })}>{r.title}</a>
                    </td>
                    <td>
                      {r.correct} / {r.total}
                    </td>
                    <td>
                      <div className="bar" role="img" aria-label={`%${pct}`}>
                        <div style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
