import { useEffect, useState } from "react";
import { inline } from "../components/Markdown";
import { YENILIKLER } from "../yenilikler";
import { hepsiGoruldu, useSonGorulen } from "../lib/yenilik";

const tarihYaz = (t: string) =>
  new Date(`${t}T12:00:00`).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export function Yenilikler() {
  // Sayfa açıldığı andaki durum: hangi kayıtlar yeni olarak işaretlenecek
  const son = useSonGorulen();
  const [acilistaGorulen] = useState(son);
  useEffect(hepsiGoruldu, []);

  return (
    <div className="yenilikler">
      <p className="hint">
        Sitede değişen her şey burada, en yenisi en üstte. Bir hata ya da öneri için giriş yapıp Mesajlarım'dan yazabilirsin.
      </p>
      <ol className="yenilik-listesi">
        {YENILIKLER.map((y) => (
          <li key={y.pr} className={y.pr > acilistaGorulen ? "yenilik yeni" : "yenilik"}>
            <header>
              <time dateTime={y.tarih}>{tarihYaz(y.tarih)}</time>
              {y.pr > acilistaGorulen && <span className="tag yeni-etiket">Yeni</span>}
            </header>
            <h3>{y.baslik}</h3>
            <ul>
              {y.maddeler.map((m, i) => <li key={i}>{inline(m)}</li>)}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
