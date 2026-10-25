// /mesajlar: üyenin yöneticiyle yazışmaları. Yeni konu başlatılır, cevaplar burada okunur.

import { useEffect, useId, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { href, navigate } from "../lib/router";
import { uye, useOturum } from "../lib/oturum";
import { FormHatasi } from "../components/Form";
import { YazismaGorunumu, YazismaListesi } from "../components/Yazisma";
import { KONU_SINIRI, MESAJ_SINIRI, konuHatasi, mesajHatasi, type YazismaOzeti } from "../../shared/sosyal";

function YeniMesaj() {
  const [konu, setKonu] = useState("");
  const [metin, setMetin] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [mesgul, setMesgul] = useState(false);
  const k = useId();
  const m = useId();

  const gonder = async (e: FormEvent) => {
    e.preventDefault();
    setMesgul(true);
    setHata(null);
    const r = await api.uye.yeniYazisma(konu, metin);
    setMesgul(false);
    if (!r.ok) return setHata(r.hata.error);
    navigate({ page: "mesajlar", id: r.data.id });
  };

  return (
    <form className="mesaj-form" onSubmit={gonder}>
      <h3>Yöneticiye yaz</h3>
      <p className="hint">
        Bir soruyla ilgili itirazın, hesabınla ilgili bir sorun ya da önerin varsa buraya yaz. Cevap gelince bu sayfada ve
        menüde görünür; istersen <a href="/ayarlar">Ayarlar</a>'dan e-postayla da haber alabilirsin.
      </p>
      <label htmlFor={k}>Konu</label>
      <input id={k} maxLength={KONU_SINIRI} value={konu} onChange={(e) => setKonu(e.target.value)} />
      <label htmlFor={m}>Mesaj</label>
      <textarea id={m} rows={6} maxLength={MESAJ_SINIRI} value={metin} onChange={(e) => setMetin(e.target.value)} />
      <FormHatasi hata={hata} />
      <div className="form-dugmeler">
        <button className="primary" type="submit" disabled={!!(konuHatasi(konu) ?? mesajHatasi(metin)) || mesgul}>Gönder</button>
      </div>
    </form>
  );
}

export function Mesajlar({ id }: { id?: string }) {
  const { me, yuklendi } = useOturum();
  const [liste, setListe] = useState<YazismaOzeti[] | null>(null);
  const giris = uye(me);

  useEffect(() => {
    if (giris && !id) api.uye.yazismalar().then(setListe, () => setListe([]));
  }, [giris, id]);

  if (!yuklendi) return null;
  if (!giris) {
    return (
      <div className="form-sayfa">
        <p>Yöneticiye yazmak için <a href={href({ page: "giris", sonra: "/mesajlar" })}>giriş yap</a>.</p>
      </div>
    );
  }

  if (id) {
    return (
      <div className="mesajlar-sayfa">
        <YazismaGorunumu key={id} yukle={() => api.uye.yazisma(id)} gonder={(b) => api.uye.yaz(id, b)} geri="/mesajlar" />
      </div>
    );
  }

  return (
    <div className="mesajlar-sayfa">
      <YeniMesaj />
      <section>
        <h3>Yazışmalarım</h3>
        <YazismaListesi liste={liste} bag={(y) => href({ page: "mesajlar", id: y })} bos="Henüz bir yazışman yok." />
      </section>
    </div>
  );
}
