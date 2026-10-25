import { useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { navigate } from "../lib/router";
import { uye, useOturum } from "../lib/oturum";
import { Alan, FormHatasi } from "../components/Form";

export function Giris({ sonra }: { sonra?: string }) {
  const { me, setMe } = useOturum();
  const [kimlik, setKimlik] = useState("");
  const [parola, setParola] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  if (uye(me)) {
    return (
      <div className="hesap-sayfa">
        <p>
          <strong>{me.username}</strong> olarak giriş yaptın. <a href="/sorular">Sorulara dön</a>
        </p>
      </div>
    );
  }

  const gonder = async (e: FormEvent) => {
    e.preventDefault();
    setGonderiliyor(true);
    setHata(null);
    const r = await api.hesap.giris(kimlik, parola);
    setGonderiliyor(false);
    if (!r.ok) return setHata(r.hata.error);
    setMe(r.data);
    navigate(sonra ?? "/sorular", { replace: true });
  };

  return (
    <form className="hesap-sayfa" onSubmit={gonder} noValidate>
      <h2>Giriş</h2>
      <p className="hint">Giriş yapmadan da soruları çözebilirsin. Hesap, ilerlemeni cihazlar arasında taşımak için.</p>
      <Alan etiket="Kullanıcı adı ya da e-posta" value={kimlik} onDeger={setKimlik} autoComplete="username" autoFocus />
      <Alan etiket="Parola" type="password" value={parola} onDeger={setParola} autoComplete="current-password" />
      <FormHatasi hata={hata} />
      <div className="form-dugmeler">
        <button className="primary" type="submit" disabled={!kimlik || !parola || gonderiliyor}>
          {gonderiliyor ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
        <a href="/sifre-sifirla">Parolamı unuttum</a>
      </div>
      <p className="hint">
        Hesabın yok mu? <a href="/kayit">Kayıt ol</a>
      </p>
    </form>
  );
}
