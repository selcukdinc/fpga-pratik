// /yonetim/gorseller: ders şekillerinin listesi. Bir şekilde düzeltme istenirken
// kodu (G-H1-01 gibi) söylenir; liste her şeklin hangi derste kullanıldığını da gösterir.

import { useMemo, useState } from "react";
import { GORSELLER } from "../gorseller";
import { gorselKullanimlari } from "../gorseller/kullanim";
import { Sekil } from "../components/Sekil";
import { href } from "../lib/router";

export function GorselListesi() {
  const kullanim = useMemo(gorselKullanimlari, []);
  const [ara, setAra] = useState("");
  const [kopyalanan, setKopyalanan] = useState<string | null>(null);
  const q = ara.trim().toLocaleLowerCase("tr");
  const liste = GORSELLER.filter((g) => !q || `${g.kod} ${g.baslik}`.toLocaleLowerCase("tr").includes(q));

  const kopyala = (kod: string) => {
    void navigator.clipboard?.writeText(kod).then(() => {
      setKopyalanan(kod);
      setTimeout(() => setKopyalanan((k) => (k === kod ? null : k)), 1500);
    });
  };

  return (
    <div className="panel-gorseller">
      <p className="hint">
        Derslerdeki şekiller sitenin kendi çizimleridir ve temaya göre renk değiştirir. Bir şekilde düzeltme istediğinde
        kodunu söylemen yeterli. Şekiller kodda <code>src/gorseller/index.ts</code> dosyasındadır; ders metninde{" "}
        <code>[[G-H1-01]]</code> satırı şekli o yere koyar.
      </p>
      <label className="gorsel-ara">
        Ara{" "}
        <input type="search" value={ara} onChange={(e) => setAra(e.target.value)} placeholder="kod ya da başlık" />
      </label>
      <p className="hint">{liste.length} / {GORSELLER.length} şekil</p>
      {liste.map((g) => {
        const yerler = kullanim.get(g.kod) ?? [];
        return (
          <section key={g.kod} className="gorsel-satir">
            <header>
              <button type="button" className="sekil-kod gorsel-kopyala" onClick={() => kopyala(g.kod)} title="Kodu kopyala">
                {kopyalanan === g.kod ? "Kopyalandı" : g.kod}
              </button>
              <strong>{g.baslik}</strong>
            </header>
            <p className="hint">
              {yerler.length ? "Kullanıldığı yer: " : "Hiçbir derste kullanılmıyor."}
              {yerler.map((y, i) => (
                <span key={i}>
                  {i > 0 && ", "}
                  <a href={`${href({ page: "ders", hafta: y.hafta })}#sekil-${g.kod}`}>
                    {y.hafta}. hafta, {y.bolum}. bölüm ({y.bolumBasligi})
                  </a>
                </span>
              ))}
            </p>
            <Sekil kod={g.kod} />
            <details>
              <summary>Açıklama (ekran okuyucu metni)</summary>
              <p>{g.aciklama}</p>
            </details>
          </section>
        );
      })}
    </div>
  );
}
