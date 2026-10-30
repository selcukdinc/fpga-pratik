// G-H6-08: üçgen dalganın tepe değeri ve saat periyodu seçilir; periyot ve
// gereken bit sayısı hesaplanır. Her şey tarayıcıda hesaplanır.

import { useState } from "react";
import { UCGEN_SAATLER, UCGEN_TEPELER, ucgenOyunu } from "../../gorseller/hafta-6";
import type { Gorsel } from "../../gorseller/tip";

export function Ucgen({ g }: { g: Gorsel }) {
  const [tepe, setTepe] = useState(8);
  const [tclk, setTclk] = useState(10);
  return (
    <>
      <svg viewBox={`0 0 ${g.en} ${g.boy}`} role="img" aria-label={`${g.baslik}. Tepe ${tepe}, saat periyodu ${tclk} ns, üçgen periyodu ${2 * tepe * tclk} ns.`} dangerouslySetInnerHTML={{ __html: ucgenOyunu(tepe, tclk) }} />
      <div className="etkilesim-denetim">
        <div className="etkilesim-alanlar" role="group" aria-label="Tepe değeri">
          {UCGEN_TEPELER.map((t) => (
            <button key={t} type="button" className="cip mono" aria-pressed={tepe === t} onClick={() => setTepe(t)}>
              tepe = {t}
            </button>
          ))}
        </div>
        <div className="etkilesim-alanlar" role="group" aria-label="Saat periyodu">
          {UCGEN_SAATLER.map((t) => (
            <button key={t} type="button" className="cip mono" aria-pressed={tclk === t} onClick={() => setTclk(t)}>
              T = {t} ns
            </button>
          ))}
        </div>
        <p aria-live="polite">
          Tepe iki katına çıkınca periyot da iki katına çıkar; saat yavaşlayınca her basamak uzar. Periyot her zaman <code>2 · tepe · T</code>.
        </p>
      </div>
    </>
  );
}
