import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useHesapOlcegi, useYaziOlcek } from "../lib/olcek";
import { OLCEK_SECENEKLERI, VARSAYILAN_OLCEK } from "../../shared/gorunum";

// Bu genişlikten (ölçekli piksel) itibaren kodlu sorular iki sütuna ayrılır
const GENIS_ESIK = 1100;

// Sayfaları metin boyutuna göre ölçekler ve ortalar. Genişlik, ölçek hesaba
// katılarak ölçülür: büyük yazıda iki sütun daha geç açılır.
export function OlcekliSayfa({ gizli, children }: { gizli?: boolean; children: ReactNode }) {
  const [olcek] = useYaziOlcek();
  useHesapOlcegi();
  const ref = useRef<HTMLDivElement>(null);
  const [genis, setGenis] = useState(false);

  useLayoutEffect(() => {
    const ust = ref.current?.parentElement;
    if (!ust) return;
    const olc = () => setGenis(ust.clientWidth / (olcek / 100) >= GENIS_ESIK);
    olc();
    const ro = new ResizeObserver(olc);
    ro.observe(ust);
    return () => ro.disconnect();
  }, [olcek]);

  return (
    <div ref={ref} className="sayfa-olcek" data-genis={genis || undefined} hidden={gizli}>
      {children}
    </div>
  );
}

// Üst çubuktaki A− / yüzde / A+ düğmeleri
export function OlcekDugmeleri() {
  const [olcek, sec, adim] = useYaziOlcek();
  const enKucuk = olcek === OLCEK_SECENEKLERI[0];
  const enBuyuk = olcek === OLCEK_SECENEKLERI[OLCEK_SECENEKLERI.length - 1];
  return (
    <span className="olcek-dugmeleri" role="group" aria-label="Metin boyutu">
      <button onClick={() => adim(-1)} disabled={enKucuk} aria-label="Metni küçült" title="Metni küçült">
        A<span aria-hidden="true">−</span>
      </button>
      <button className="olcek-yuzde" onClick={() => sec(VARSAYILAN_OLCEK)} disabled={olcek === VARSAYILAN_OLCEK}
        aria-label={`Metin boyutu yüzde ${olcek}. Varsayılana dön`} title="Varsayılan boyuta dön">
        %{olcek}
      </button>
      <button onClick={() => adim(1)} disabled={enBuyuk} aria-label="Metni büyüt" title="Metni büyüt">
        A<span aria-hidden="true">+</span>
      </button>
    </span>
  );
}
