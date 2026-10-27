// G-H5-15: "101" dedektörüne bit bit giriş verilir; etkin durum ve son geçiş
// diyagramda vurgulanır. Her şey tarayıcıda hesaplanır; sunucuya bir şey gitmez.

import { useState } from "react";
import { AZAMI_BIT, durumAdimlayici, durumIzi } from "../../gorseller/hafta-5";
import type { Gorsel } from "../../gorseller/tip";

export function Durum({ g }: { g: Gorsel }) {
  const [bitler, setBitler] = useState("");
  const iz = durumIzi(bitler);
  const d = iz[iz.length - 1]!;
  const dolu = bitler.length >= AZAMI_BIT;
  const ekle = (b: string) => setBitler(bitler + b);
  const aciklama = bitler.length
    ? `x = ${bitler[bitler.length - 1]} okundu: ${iz[iz.length - 2]} → ${d}. ${d === "S101" ? "Son üç bit 1, 0, 1: z = 1." : "z = 0."}`
    : "Makine S0'da. Bir bit gir; her bit bir saat kenarında okunur.";
  return (
    <>
      <svg viewBox={`0 0 ${g.en} ${g.boy}`} role="img" aria-label={`${g.baslik}. Girilen bitler: ${bitler || "yok"}. Etkin durum ${d}, z = ${d === "S101" ? 1 : 0}.`} dangerouslySetInnerHTML={{ __html: durumAdimlayici(bitler) }} />
      <div className="etkilesim-denetim">
        <div className="etkilesim-alanlar" role="group" aria-label="Giriş biti">
          <button type="button" className="cip mono" disabled={dolu} onClick={() => ekle("0")}>
            x = 0
          </button>
          <button type="button" className="cip mono" disabled={dolu} onClick={() => ekle("1")}>
            x = 1
          </button>
          <button type="button" className="cip" disabled={!bitler.length} onClick={() => setBitler(bitler.slice(0, -1))}>
            ◀ Geri al
          </button>
          <button type="button" className="cip" disabled={!bitler.length} onClick={() => setBitler("")}>
            Reset
          </button>
          <button type="button" className="cip mono" onClick={() => setBitler("10101")}>
            Örnek: 10101
          </button>
        </div>
        <p aria-live="polite">{aciklama}</p>
      </div>
    </>
  );
}
