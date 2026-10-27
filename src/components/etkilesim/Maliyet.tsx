// G-H1-06: FPGA ve ASIC toplam maliyetini adet kaydırıcısıyla karşılaştırır.
// Her şey tarayıcıda hesaplanır; sunucuya bir şey gitmez.

import { useState } from "react";
import { kesisimAdedi, maliyetGrafigi, MALIYET_VARSAYILAN, type MaliyetDegerleri } from "../../gorseller/hafta-1";
import type { Gorsel } from "../../gorseller/tip";

const tl = (n: number) => `${Math.round(n).toLocaleString("tr-TR")} TL`;

function SayiAlani({ etiket, deger, degis, adim }: { etiket: string; deger: number; degis: (n: number) => void; adim: number }) {
  return (
    <label>
      {etiket}
      <input type="number" min={0} step={adim} value={deger} onChange={(e) => degis(Math.max(0, Number(e.target.value) || 0))} />
    </label>
  );
}

export function Maliyet({ g }: { g: Gorsel }) {
  const [d, setD] = useState<MaliyetDegerleri>(MALIYET_VARSAYILAN);
  const kes = kesisimAdedi(d);
  const fpga = d.fpga * d.adet;
  const asic = d.nre + d.asic * d.adet;
  const ust = Math.max(200_000, kes ? Math.ceil((kes * 2) / 10_000) * 10_000 : 0);
  const ayarla = (k: keyof MaliyetDegerleri) => (n: number) => setD({ ...d, [k]: n });
  return (
    <>
      <svg viewBox={`0 0 ${g.en} ${g.boy}`} role="img" aria-label={`${g.baslik}. ${g.aciklama}`} dangerouslySetInnerHTML={{ __html: maliyetGrafigi(d) }} />
      <div className="etkilesim-denetim">
        <label className="etkilesim-kaydirici">
          Üretim adedi: <strong>{d.adet.toLocaleString("tr-TR")}</strong>
          <input type="range" min={0} max={ust} step={ust / 200} value={Math.min(d.adet, ust)} onChange={(e) => ayarla("adet")(Number(e.target.value))} />
        </label>
        <div className="etkilesim-alanlar">
          <SayiAlani etiket="FPGA tanesi (TL)" deger={d.fpga} degis={ayarla("fpga")} adim={5} />
          <SayiAlani etiket="ASIC NRE (TL)" deger={d.nre} degis={ayarla("nre")} adim={100_000} />
          <SayiAlani etiket="ASIC tanesi (TL)" deger={d.asic} degis={ayarla("asic")} adim={1} />
          <button type="button" className="baglanti-dugme" onClick={() => setD(MALIYET_VARSAYILAN)}>Sıfırla</button>
        </div>
        <p aria-live="polite">
          {d.adet.toLocaleString("tr-TR")} adette FPGA <strong>{tl(fpga)}</strong>, ASIC <strong>{tl(asic)}</strong> tutar:{" "}
          <strong>{fpga === asic ? "ikisi eşit" : fpga < asic ? "FPGA daha ucuz" : "ASIC daha ucuz"}</strong>.{" "}
          {kes === null
            ? "ASIC'in tanesi FPGA'dan ucuz değilse iki doğru hiç kesişmez; FPGA her adette ucuzdur."
            : `İki seçenek ${Math.round(kes).toLocaleString("tr-TR")} adette eşitlenir: ${d.fpga}·n = ${d.nre.toLocaleString("tr-TR")} + ${d.asic}·n.`}
        </p>
      </div>
    </>
  );
}
