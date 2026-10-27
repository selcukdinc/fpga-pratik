// G-H4-08: bir process satır satır ilerletilir; değişken hemen, sinyal bir
// delta sonra değişir. Her şey tarayıcıda hesaplanır; sunucuya bir şey gitmez.

import { useState } from "react";
import { DELTA_ADIMLARI, deltaAdimlayici } from "../../gorseller/hafta-4";
import type { Gorsel } from "../../gorseller/tip";

export function Delta({ g }: { g: Gorsel }) {
  const [adim, setAdim] = useState(0);
  const son = DELTA_ADIMLARI.length - 1;
  const a = DELTA_ADIMLARI[adim]!;
  return (
    <>
      <svg viewBox={`0 0 ${g.en} ${g.boy}`} role="img" aria-label={`${g.baslik}. Adım ${adim}: v = ${a.v}, x = ${a.x}, s = ${a.s}, plan: ${a.plan}.`} dangerouslySetInnerHTML={{ __html: deltaAdimlayici(adim) }} />
      <div className="etkilesim-denetim">
        <div className="etkilesim-alanlar" role="group" aria-label="Adımlar">
          <button type="button" className="cip" disabled={adim === 0} onClick={() => setAdim(adim - 1)}>
            ◀ Geri
          </button>
          <button type="button" className="cip" disabled={adim === son} onClick={() => setAdim(adim + 1)}>
            İleri ▶
          </button>
          <button type="button" className="cip" disabled={adim === 0} onClick={() => setAdim(0)}>
            Başa dön
          </button>
        </div>
        <p aria-live="polite">{a.aciklama}</p>
      </div>
    </>
  );
}
