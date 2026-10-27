// G-H3-13: bir aralık ve bir öznitelik seçilince ilgili kutular vurgulanır.
// Her şey tarayıcıda hesaplanır; sunucuya bir şey gitmez.

import { useState } from "react";
import { OZ_ARALIKLARI, OZ_OZNITELIKLER, oznitelikGezgini, oznitelikSonuc, type OzAd, type OzAralik } from "../../gorseller/hafta-3";
import type { Gorsel } from "../../gorseller/tip";

export function Oznitelik({ g }: { g: Gorsel }) {
  const [aralik, setAralik] = useState<OzAralik>("7 downto 0");
  const [oz, setOz] = useState<OzAd>("left");
  const { deger } = oznitelikSonuc(aralik, oz);
  return (
    <>
      <svg viewBox={`0 0 ${g.en} ${g.boy}`} role="img" aria-label={`${g.baslik}. d(${aralik}) için d'${oz} = ${deger}.`} dangerouslySetInnerHTML={{ __html: oznitelikGezgini(aralik, oz) }} />
      <div className="etkilesim-denetim">
        <div className="etkilesim-alanlar" role="group" aria-label="Aralık">
          {OZ_ARALIKLARI.map((a) => (
            <button key={a} type="button" className="cip mono" aria-pressed={aralik === a} onClick={() => setAralik(a)}>
              ({a})
            </button>
          ))}
        </div>
        <div className="etkilesim-alanlar" role="group" aria-label="Öznitelik">
          {OZ_OZNITELIKLER.map((o) => (
            <button key={o} type="button" className="cip mono" aria-pressed={oz === o} onClick={() => setOz(o)}>
              '{o}
            </button>
          ))}
        </div>
        <p aria-live="polite">
          <code>
            d'{oz} = {deger}
          </code>
          . Aralığı değiştirip aynı özniteliğe bak: <code>'left</code> ve <code>'right</code> yöne göre değişir, <code>'high</code> ve <code>'low</code> değişmez.
        </p>
      </div>
    </>
  );
}
