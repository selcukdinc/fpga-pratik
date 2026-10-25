// Paylaşılan içerik için "Bildir" düğmesi: bir neden seçilir, gönderilir.

import { useId, useState } from "react";
import { api } from "../lib/api";
import { NEDENLER, type BildirimTuru } from "../../shared/topluluk";

export function BildirDugmesi({ tur, id, bildirdim }: { tur: BildirimTuru; id: string; bildirdim: boolean }) {
  const [acik, setAcik] = useState(false);
  const [neden, setNeden] = useState<string>(NEDENLER[0]);
  const [bitti, setBitti] = useState(bildirdim);
  const [hata, setHata] = useState<string | null>(null);
  const secim = useId();

  if (bitti) return <span className="hint">Bildirildi</span>;
  if (!acik) {
    return (
      <button className="baglanti-dugme" onClick={() => setAcik(true)}>
        Bildir
      </button>
    );
  }
  const gonder = async () => {
    const r = await api.topluluk.bildir(tur, id, neden);
    if (!r.ok) return setHata(r.hata.error);
    setBitti(true);
  };
  return (
    <span className="bildir-kutusu">
      <label htmlFor={secim} className="sr-only">Bildirme nedeni</label>
      <select id={secim} value={neden} onChange={(e) => setNeden(e.target.value)}>
        {NEDENLER.map((n) => <option key={n}>{n}</option>)}
      </select>
      <button onClick={gonder}>Gönder</button>
      <button className="baglanti-dugme" onClick={() => setAcik(false)}>Vazgeç</button>
      {hata && <span className="bad">{hata}</span>}
    </span>
  );
}
