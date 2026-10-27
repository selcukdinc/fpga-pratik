// /terimler: derslerde ve sorularda geçen terimlerin Türkçe ve İngilizce karşılıkları
import { useState } from "react";
import { TERIMLER } from "../lib/terimler";

const sade = (s: string) => s.toLocaleLowerCase("tr");

export function Terimler() {
  const [ara, setAra] = useState("");
  const a = sade(ara.trim());
  const liste = [...TERIMLER]
    .sort((x, y) => x.tr.localeCompare(y.tr, "tr"))
    .filter((t) => !a || sade(t.tr).includes(a) || sade(t.en).includes(a));
  return (
    <div className="terimler">
      <p className="hint">
        Ders ve sorularda bu terimlerin İngilizcesi her kullanımda parantez içinde gösterilir. Vivado ve belgelerde çoğunlukla
        İngilizceleri geçer.
      </p>
      <input type="search" aria-label="Terimlerde ara" placeholder="Türkçe ya da İngilizce ara" value={ara} onChange={(e) => setAra(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th>Türkçe</th>
            <th>İngilizce</th>
            <th>Anlamı</th>
          </tr>
        </thead>
        <tbody>
          {liste.map((t) => (
            <tr key={t.tr}>
              <td>{t.tr}</td>
              <td lang="en">{t.en}</td>
              <td>{t.aciklama ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!liste.length && <p className="empty">Bu aramaya uyan terim yok.</p>}
    </div>
  );
}
