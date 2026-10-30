// G-H6-03: aynı girişler yükselen ya da düşen kenarda örneklenir; seçilen
// kenarın çıkışı dalgada çizilir. Her şey tarayıcıda hesaplanır.

import { useState } from "react";
import { kenarOyunu, type KenarSecimi } from "../../gorseller/hafta-6";
import type { Gorsel } from "../../gorseller/tip";

const SECENEKLER: [KenarSecimi, string][] = [
  ["yukselen", "rising_edge"],
  ["dusen", "falling_edge"],
  ["ikisi", "İkisini karşılaştır"],
];

const ACIKLAMA: Record<KenarSecimi, string> = {
  yukselen: "Kesik çizgiler yükselen kenarlar: y yalnızca bu anlarda o anki girişi alır ve bir sonraki yükselen kenara kadar tutar.",
  dusen: "Kesik çizgiler düşen kenarlar: aynı kod falling_edge ile yazılınca girişler yarım periyot kaymış anlarda örneklenir.",
  ikisi: "İki çıkış aynı girişlerden farklı sonuçlar çıkarıyor: hangi kenarın kullanıldığı, hangi değerlerin yakalanacağını belirler.",
};

export function Kenar({ g }: { g: Gorsel }) {
  const [secim, setSecim] = useState<KenarSecimi>("yukselen");
  return (
    <>
      <svg viewBox={`0 0 ${g.en} ${g.boy}`} role="img" aria-label={`${g.baslik}. Seçili: ${SECENEKLER.find(([s]) => s === secim)![1]}.`} dangerouslySetInnerHTML={{ __html: kenarOyunu(secim) }} />
      <div className="etkilesim-denetim">
        <div className="etkilesim-alanlar" role="group" aria-label="Kenar türü">
          {SECENEKLER.map(([s, ad]) => (
            <button key={s} type="button" className={`cip${s === "ikisi" ? "" : " mono"}`} aria-pressed={secim === s} onClick={() => setSecim(s)}>
              {ad}
            </button>
          ))}
        </div>
        <p aria-live="polite">{ACIKLAMA[secim]}</p>
      </div>
    </>
  );
}
