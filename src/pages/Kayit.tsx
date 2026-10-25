import { useEffect, useState, type FormEvent } from "react";
import { api } from "../lib/api";
import { navigate } from "../lib/router";
import { uye, useOturum } from "../lib/oturum";
import { epostaHatasi, kullaniciAdiHatasi, parolaGucu } from "../../shared/hesap";
import { Alan, FormHatasi, KodAlani, ParolaGucuCubugu, useGeriSayim } from "../components/Form";

function KodAdimi({ id, eposta, tekrar }: { id: string; eposta: string; tekrar: number }) {
  const { setMe } = useOturum();
  const [kod, setKod] = useState("");
  const [hata, setHata] = useState<string | null>(null);
  const [bilgi, setBilgi] = useState<string | null>(null);
  const [kalan, setKalan] = useGeriSayim(tekrar);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const dogrula = async (e: FormEvent) => {
    e.preventDefault();
    setGonderiliyor(true);
    setHata(null);
    const r = await api.hesap.kayitDogrula(id, kod);
    setGonderiliyor(false);
    if (!r.ok) {
      setKod("");
      return setHata(r.hata.error);
    }
    setMe(r.data);
    navigate(`/profil/${r.data.username}`, { replace: true });
  };

  const yeniden = async () => {
    setHata(null);
    const r = await api.hesap.kayitYeniden(id);
    if (!r.ok) return setHata(r.hata.error);
    setBilgi("Yeni kod gönderildi.");
    setKalan(r.data.tekrarSaniye);
  };

  return (
    <form className="hesap-sayfa" onSubmit={dogrula} noValidate>
      <h2>E-postanı doğrula</h2>
      <p>
        <strong>{eposta}</strong> adresine 4 haneli bir kod gönderdik. Kod 15 dakika geçerli.
      </p>
      <KodAlani kod={kod} setKod={setKod} hata={hata} />
      {bilgi && <p className="hint" role="status">{bilgi}</p>}
      <div className="form-dugmeler">
        <button className="primary" type="submit" disabled={kod.length !== 4 || gonderiliyor}>
          {gonderiliyor ? "Kontrol ediliyor…" : "Hesabı aç"}
        </button>
        <button type="button" onClick={yeniden} disabled={kalan > 0}>
          {kalan > 0 ? `Kodu yeniden gönder (${kalan} sn)` : "Kodu yeniden gönder"}
        </button>
      </div>
      <p className="hint">E-posta gelmediyse gereksiz (spam) klasörüne de bak.</p>
    </form>
  );
}

export function Kayit() {
  const { me, epostaAcik, yuklendi } = useOturum();
  const [ad, setAd] = useState("");
  const [parola, setParola] = useState("");
  const [tekrar, setTekrar] = useState("");
  const [eposta, setEposta] = useState("");
  const [adDurumu, setAdDurumu] = useState<{ ad: string; sebep: string | null } | null>(null);
  const [alanHata, setAlanHata] = useState<Record<string, string>>({});
  const [hata, setHata] = useState<string | null>(null);
  const [kodAdimi, setKodAdimi] = useState<{ id: string; tekrar: number } | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [dokunuldu, setDokunuldu] = useState<Record<string, boolean>>({});

  const adK = ad.trim().toLowerCase();
  const yerelAdHata = adK ? kullaniciAdiHatasi(adK) : null;

  // Kullanıcı adı yazılırken uygunluğu sorulur (yazmayı bıraktıktan kısa süre sonra)
  useEffect(() => {
    if (!adK || yerelAdHata) return;
    const t = setTimeout(() => {
      api.hesap.adUygun(adK).then(
        (r) => setAdDurumu({ ad: adK, sebep: r.sebep }),
        () => setAdDurumu(null),
      );
    }, 350);
    return () => clearTimeout(t);
  }, [adK, yerelAdHata]);

  if (!yuklendi) return <p className="empty">Yükleniyor…</p>;
  if (uye(me)) {
    return (
      <div className="hesap-sayfa">
        <p>
          Zaten <strong>{me.username}</strong> olarak giriş yaptın.
        </p>
      </div>
    );
  }
  if (!epostaAcik) {
    return (
      <div className="hesap-sayfa">
        <h2>Kayıt ol</h2>
        <p className="uyari">
          Kayıt şu an kapalı, çünkü doğrulama e-postası gönderimi henüz kurulmadı. Soruları ve simülasyon alanını giriş
          yapmadan kullanabilirsin, ilerlemen bu tarayıcıda saklanır.
        </p>
      </div>
    );
  }
  if (kodAdimi) return <KodAdimi id={kodAdimi.id} eposta={eposta.trim().toLowerCase()} tekrar={kodAdimi.tekrar} />;

  const ilgili = [adK, eposta.split("@")[0] ?? ""];
  const adHata = yerelAdHata ?? (adDurumu?.ad === adK ? adDurumu.sebep : null) ?? alanHata.username ?? null;
  const adUygun = !!adK && !yerelAdHata && adDurumu?.ad === adK && !adDurumu.sebep;
  const parolaKabul = parolaGucu(parola, ilgili).seviye > 0;
  const tekrarHata = tekrar && tekrar !== parola ? "Parolalar eşleşmiyor." : null;
  const epHata = dokunuldu.email && eposta ? epostaHatasi(eposta.trim()) : null;
  const hazir = adUygun && parolaKabul && tekrar === parola && !epostaHatasi(eposta.trim());

  const gonder = async (e: FormEvent) => {
    e.preventDefault();
    if (!hazir) return;
    setGonderiliyor(true);
    setHata(null);
    setAlanHata({});
    const r = await api.hesap.kayit({ username: adK, password: parola, email: eposta.trim().toLowerCase() });
    setGonderiliyor(false);
    if (!r.ok) {
      if (r.hata.alan) setAlanHata({ [r.hata.alan]: r.hata.error });
      else setHata(r.hata.error);
      return;
    }
    setKodAdimi({ id: r.data.id, tekrar: r.data.tekrarSaniye });
  };

  return (
    <form className="hesap-sayfa" onSubmit={gonder} noValidate>
      <h2>Kayıt ol</h2>
      <p className="hint">Misafirken çözdüğün sorular yeni hesabına taşınır.</p>
      <Alan
        etiket="Kullanıcı adı"
        value={ad}
        onDeger={(v) => setAd(v.toLowerCase())}
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={20}
        hata={adHata}
        not={adUygun ? <span className="ok">Bu ad uygun.</span> : "3-20 karakter: a-z, 0-9 ve _"}
        autoFocus
      />
      <Alan
        etiket="Parola"
        type="password"
        value={parola}
        onDeger={setParola}
        autoComplete="new-password"
        hata={alanHata.password}
        not={!parola ? "En az 10 karakter." : undefined}
      />
      <ParolaGucuCubugu parola={parola} ilgili={ilgili} />
      <Alan
        etiket="Parola tekrarı"
        type="password"
        value={tekrar}
        onDeger={setTekrar}
        autoComplete="new-password"
        hata={tekrarHata}
      />
      <Alan
        etiket="E-posta"
        type="email"
        value={eposta}
        onDeger={setEposta}
        onBlur={() => setDokunuldu({ ...dokunuldu, email: true })}
        autoComplete="email"
        hata={epHata ?? alanHata.email}
        not="Sadece doğrulama ve parolanı unutursan kullanılır."
      />
      <FormHatasi hata={hata} />
      <div className="form-dugmeler">
        <button className="primary" type="submit" disabled={!hazir || gonderiliyor}>
          {gonderiliyor ? "Gönderiliyor…" : "Kayıt ol"}
        </button>
      </div>
      <p className="hint">
        Kayıt olarak <a href="/gizlilik">gizlilik metnini</a> okuduğunu kabul edersin. Zaten hesabın var mı?{" "}
        <a href="/giris">Giriş yap</a>
      </p>
    </form>
  );
}
