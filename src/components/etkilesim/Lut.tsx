// G-H2-14: 2 girişli LUT'un dört bitine tıklayınca kurulan kapı değişir.
// Her şey tarayıcıda hesaplanır; sunucuya bir şey gitmez.

import { useState } from "react";
import { LUT_ISLEVLERI, LUT_VARSAYILAN, lutOyunu } from "../../gorseller/hafta-2";
import type { Gorsel } from "../../gorseller/tip";

const HAZIR = ["1000", "1110", "0110", "0111", "0001", "1001"];

export function Lut({ g }: { g: Gorsel }) {
  const [tablo, setTablo] = useState(LUT_VARSAYILAN);
  // Düğmeler çizimdeki gibi yukarıdan aşağı ba = 00, 01, 10, 11 sırasıyla durur
  const degistir = (adres: number) => {
    const i = 3 - adres;
    setTablo(tablo.slice(0, i) + (tablo[i] === "1" ? "0" : "1") + tablo.slice(i + 1));
  };
  const f = LUT_ISLEVLERI[tablo]!;
  return (
    <>
      <svg viewBox={`0 0 ${g.en} ${g.boy}`} role="img" aria-label={`${g.baslik}. TABLO = "${tablo}", ${f.ad}.`} dangerouslySetInnerHTML={{ __html: lutOyunu(tablo) }} />
      <div className="etkilesim-denetim">
        <div className="etkilesim-alanlar" role="group" aria-label="Tablo hücreleri">
          {[0, 1, 2, 3].map((adres) => (
            <button key={adres} type="button" className="cip mono" aria-pressed={tablo[3 - adres] === "1"} onClick={() => degistir(adres)}>
              ba = {adres.toString(2).padStart(2, "0")}: <strong>{tablo[3 - adres]}</strong>
            </button>
          ))}
        </div>
        <div className="etkilesim-alanlar" role="group" aria-label="Hazır kapılar">
          {HAZIR.map((t) => (
            <button key={t} type="button" className="cip" aria-pressed={tablo === t} onClick={() => setTablo(t)}>
              {LUT_ISLEVLERI[t]!.ad}
            </button>
          ))}
        </div>
        <p aria-live="polite">
          <code>TABLO = "{tablo}"</code>: bu LUT bir <strong>{f.ad}</strong> kurar, yani <code>y &lt;= {f.ifade};</code> İki girişle 16 farklı tablo yazılabilir; her biri başka bir fonksiyondur.
        </p>
      </div>
    </>
  );
}
