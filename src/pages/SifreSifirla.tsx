import { useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { navigate } from "../lib/router";
import { useOturum } from "../lib/oturum";
import { parolaGucu } from "../../shared/hesap";
import { Alan, FormHatasi, KodAlani, ParolaGucuCubugu, useGeriSayim } from "../components/Form";

function YeniParola({ id, kimlik, tekrarSn }: { id: string; kimlik: string; tekrarSn: number }) {
  const { setMe } = useOturum();
  const [kodId, setKodId] = useState(id);
  const [kod, setKod] = useState("");
  const [parola, setParola] = useState("");
  const [tekrar, setTekrar] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [kodHata, setKodHata] = useState<string | null>(null);
  const [kalan, setKalan] = useGeriSayim(tekrarSn);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const hazir = kod.length === 4 && parolaGucu(parola).seviye > 0 && parola === tekrar;

  const gonder = async (e: FormEvent) => {
    e.preventDefault();
    setGonderiliyor(true);
    setHata(null);
    setKodHata(null);
    const r = await api.hesap.sifreDogrula(kodId, kod, parola);
    setGonderiliyor(false);
    if (!r.ok) {
      if (r.hata.alan === "kod") {
        setKod("");
        return setKodHata(r.hata.error);
      }
      return setHata(r.hata.error);
    }
    setMe(r.data);
    navigate("/sorular", { replace: true });
  };

  const yeniden = async () => {
    const r = await api.hesap.sifreIste(kimlik);
    if (!r.ok) return setHata(r.hata.error);
    setKodId(r.data.id);
    setKalan(r.data.tekrarSaniye);
  };

  return (
    <form className="hesap-sayfa" onSubmit={gonder} noValidate>
      <h2>Yeni parola</h2>
      <p>
        Bu bilgilerle kayıtlı bir hesap varsa, doğrulanmış e-posta adresine 4 haneli bir kod gönderdik. Kod 15 dakika
        geçerli.
      </p>
      <KodAlani kod={kod} setKod={setKod} hata={kodHata} />
      <Alan etiket="Yeni parola" type="password" value={parola} onDeger={setParola} autoComplete="new-password" />
      <ParolaGucuCubugu parola={parola} ilgili={[kimlik.split("@")[0] ?? ""]} />
      <Alan
        etiket="Yeni parola tekrarı"
        type="password"
        value={tekrar}
        onDeger={setTekrar}
        autoComplete="new-password"
        hata={tekrar && tekrar !== parola ? "Parolalar eşleşmiyor." : null}
      />
      <FormHatasi hata={hata} />
      <div className="form-dugmeler">
        <button className="primary" type="submit" disabled={!hazir || gonderiliyor}>
          {gonderiliyor ? "Kaydediliyor…" : "Parolayı değiştir"}
        </button>
        <button type="button" onClick={yeniden} disabled={kalan > 0}>
          {kalan > 0 ? `Kodu yeniden gönder (${kalan} sn)` : "Kodu yeniden gönder"}
        </button>
      </div>
      <p className="hint">Parola değişince tüm cihazlardaki oturumların kapanır.</p>
    </form>
  );
}

export function SifreSifirla() {
  const { epostaAcik, yuklendi } = useOturum();
  const [kimlik, setKimlik] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [adim, setAdim] = useState<{ id: string; tekrar: number } | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  if (!yuklendi) return <p className="empty">Yükleniyor…</p>;
  if (!epostaAcik) {
    return (
      <div className="hesap-sayfa">
        <h2>Parolamı unuttum</h2>
        <p className="uyari">Parola sıfırlama şu an kapalı, çünkü e-posta gönderimi henüz kurulmadı.</p>
      </div>
    );
  }
  if (adim) return <YeniParola id={adim.id} kimlik={kimlik.trim().toLowerCase()} tekrarSn={adim.tekrar} />;

  const gonder = async (e: FormEvent) => {
    e.preventDefault();
    setGonderiliyor(true);
    setHata(null);
    const r = await api.hesap.sifreIste(kimlik.trim().toLowerCase());
    setGonderiliyor(false);
    if (!r.ok) return setHata(r.hata.error);
    setAdim({ id: r.data.id, tekrar: r.data.tekrarSaniye });
  };

  return (
    <form className="hesap-sayfa" onSubmit={gonder} noValidate>
      <h2>Parolamı unuttum</h2>
      <Alan etiket="Kullanıcı adı ya da e-posta" value={kimlik} onDeger={setKimlik} autoComplete="username" autoFocus />
      <FormHatasi hata={hata} />
      <div className="form-dugmeler">
        <button className="primary" type="submit" disabled={!kimlik.trim() || gonderiliyor}>
          {gonderiliyor ? "Gönderiliyor…" : "Kod gönder"}
        </button>
        <a href="/giris">Girişe dön</a>
      </div>
    </form>
  );
}
