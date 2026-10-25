import { useState, type FormEvent, type ReactNode } from "react";
import { api, type Sonuc } from "../lib/api";
import { href, navigate } from "../lib/router";
import { uye, useOturum } from "../lib/oturum";
import { KULLANICI_ADI_DEGISIM_GUN, kullaniciAdiHatasi, parolaGucu } from "../../shared/hesap";
import { AVATARLAR, AVATAR_ZEMINLERI } from "../../shared/avatarlar";
import { Avatar } from "../components/Avatar";
import { Alan, FormHatasi, KodAlani, ParolaGucuCubugu } from "../components/Form";
import type { Me } from "../../shared/api";

function Bolum({ baslik, children }: { baslik: string; children: ReactNode }) {
  return (
    <section className="ayar-bolum">
      <h3>{baslik}</h3>
      {children}
    </section>
  );
}

// Her bölümün kendi gönderim durumu ve mesajı olur
function useGonderim() {
  const [hata, setHata] = useState<string | null>(null);
  const [tamam, setTamam] = useState<string | null>(null);
  const [mesgul, setMesgul] = useState(false);
  async function calistir<T>(is: () => Promise<Sonuc<T>>, basari: string, sonra?: (d: T) => void) {
    setMesgul(true);
    setHata(null);
    setTamam(null);
    const r = await is();
    setMesgul(false);
    if (!r.ok) return setHata(r.hata.error);
    setTamam(basari);
    sonra?.(r.data);
  }
  const mesaj = (
    <>
      <FormHatasi hata={hata} />
      {tamam && <p className="ok" role="status">{tamam}</p>}
    </>
  );
  return { calistir, mesgul, mesaj };
}

function ProfilAyari({ me }: { me: Me }) {
  const { setMe } = useOturum();
  const [avatar, setAvatar] = useState(me.avatar ?? AVATARLAR[0]!.id);
  const [zemin, setZemin] = useState<string | null>(me.avatarBg);
  const [acik, setAcik] = useState(me.publicProfile);
  const [bildirim, setBildirim] = useState(me.notifyEmail);
  const g = useGonderim();
  const gruplar = [...new Set(AVATARLAR.map((a) => a.grup))];

  const kaydet = (e: FormEvent) => {
    e.preventDefault();
    void g.calistir(() => api.ayarlar.profil({ avatar, avatarBg: zemin, publicProfile: acik, notifyEmail: bildirim }), "Kaydedildi.", setMe);
  };

  return (
    <Bolum baslik="Profil ve avatar">
      <form onSubmit={kaydet}>
        <div className="avatar-onizleme">
          <Avatar id={avatar} bg={zemin} size={64} />
          <fieldset className="zeminler">
            <legend>Zemin rengi</legend>
            <label className={`zemin${zemin === null ? " secili" : ""}`} title="Zeminsiz">
              <input type="radio" name="zemin" checked={zemin === null} onChange={() => setZemin(null)} />
              <span className="zemin-yok" aria-hidden="true" />
              <span className="sr-only">Zeminsiz</span>
            </label>
            {AVATAR_ZEMINLERI.map((z) => (
              <label key={z} className={`zemin${zemin === z ? " secili" : ""}`} title={z}>
                <input type="radio" name="zemin" checked={zemin === z} onChange={() => setZemin(z)} />
                <span style={{ background: z }} aria-hidden="true" />
                <span className="sr-only">Renk {z}</span>
              </label>
            ))}
          </fieldset>
        </div>

        {gruplar.map((grup) => (
          <fieldset key={grup} className="avatar-grup">
            <legend>{grup}</legend>
            {AVATARLAR.filter((a) => a.grup === grup).map((a) => (
              <label key={a.id} className={`avatar-sec${avatar === a.id ? " secili" : ""}`} title={a.ad}>
                <input type="radio" name="avatar" checked={avatar === a.id} onChange={() => setAvatar(a.id)} />
                <Avatar id={a.id} bg={zemin} size={40} />
              </label>
            ))}
          </fieldset>
        ))}

        <label className="onay">
          <input type="checkbox" checked={acik} onChange={(e) => setAcik(e.target.checked)} />
          Profilim ve ilerlemem herkese açık olsun
        </label>
        <p className="hint">Kapalıyken profil sayfanı sadece sen görürsün, diğerleri "Bu profil gizli" yazısını görür.</p>
        <label className="onay">
          <input type="checkbox" checked={bildirim} onChange={(e) => setBildirim(e.target.checked)} />
          Yönetici mesajıma cevap verince e-postayla haber ver
        </label>
        {g.mesaj}
        <button className="primary" type="submit" disabled={g.mesgul}>Kaydet</button>
      </form>
    </Bolum>
  );
}

function KullaniciAdiAyari({ me }: { me: Me & { username: string } }) {
  const { setMe } = useOturum();
  const [yeni, setYeni] = useState(me.username);
  const g = useGonderim();
  const sonraki = (me.usernameChangedAt ?? 0) + KULLANICI_ADI_DEGISIM_GUN * 86_400_000;
  const kilitli = sonraki > Date.now();
  const yeniK = yeni.trim().toLowerCase();

  const kaydet = (e: FormEvent) => {
    e.preventDefault();
    void g.calistir(() => api.ayarlar.kullaniciAdi(yeniK), "Kullanıcı adın değişti.", (m) => {
      setMe(m);
      navigate("/ayarlar", { replace: true });
    });
  };

  return (
    <Bolum baslik="Kullanıcı adı">
      <form onSubmit={kaydet}>
        <Alan
          etiket="Kullanıcı adı"
          value={yeni}
          onDeger={(v) => setYeni(v.toLowerCase())}
          maxLength={20}
          disabled={kilitli}
          hata={yeniK !== me.username ? kullaniciAdiHatasi(yeniK) : null}
          not={
            kilitli
              ? `${new Date(sonraki).toLocaleDateString("tr-TR")} tarihinden sonra yeniden değiştirebilirsin.`
              : `${KULLANICI_ADI_DEGISIM_GUN} günde bir değiştirilebilir. Profil adresin de değişir.`
          }
        />
        {g.mesaj}
        <button type="submit" disabled={kilitli || yeniK === me.username || !!kullaniciAdiHatasi(yeniK) || g.mesgul}>
          Değiştir
        </button>
      </form>
    </Bolum>
  );
}

function EpostaAyari({ me }: { me: Me }) {
  const { setMe, epostaAcik } = useOturum();
  const [yeni, setYeni] = useState("");
  const [parola, setParola] = useState("");
  const [kod, setKod] = useState("");
  const [kodId, setKodId] = useState<string | null>(null);
  const g = useGonderim();

  const iste = (e: FormEvent) => {
    e.preventDefault();
    void g.calistir(() => api.ayarlar.eposta(yeni.trim().toLowerCase(), parola), "Yeni adrese kod gönderildi.", (d) =>
      setKodId(d.id),
    );
  };
  const dogrula = (e: FormEvent) => {
    e.preventDefault();
    void g.calistir(() => api.ayarlar.epostaDogrula(kodId!, kod), "E-postan değişti.", (m) => {
      setMe(m);
      setKodId(null);
      setYeni("");
      setParola("");
      setKod("");
    });
  };

  return (
    <Bolum baslik="E-posta">
      <p>
        Şu anki adresin: <strong>{me.email}</strong>
      </p>
      {!epostaAcik ? (
        <p className="hint">E-posta gönderimi açılınca buradan değiştirebileceksin.</p>
      ) : kodId ? (
        <form onSubmit={dogrula}>
          <KodAlani kod={kod} setKod={setKod} />
          {g.mesaj}
          <button className="primary" type="submit" disabled={kod.length !== 4 || g.mesgul}>Doğrula</button>
        </form>
      ) : (
        <form onSubmit={iste}>
          <Alan etiket="Yeni e-posta" type="email" value={yeni} onDeger={setYeni} autoComplete="email" />
          <Alan etiket="Parolan" type="password" value={parola} onDeger={setParola} autoComplete="current-password" />
          {g.mesaj}
          <button type="submit" disabled={!yeni || !parola || g.mesgul}>Kod gönder</button>
        </form>
      )}
    </Bolum>
  );
}

function ParolaAyari({ me }: { me: Me }) {
  const [mevcut, setMevcut] = useState("");
  const [yeni, setYeni] = useState("");
  const [tekrar, setTekrar] = useState("");
  const g = useGonderim();
  const ilgili = [me.username ?? "", (me.email ?? "").split("@")[0] ?? ""];

  const kaydet = (e: FormEvent) => {
    e.preventDefault();
    void g.calistir(() => api.ayarlar.parola(mevcut, yeni), "Parolan değişti. Diğer cihazlardaki oturumlar kapatıldı.", () => {
      setMevcut("");
      setYeni("");
      setTekrar("");
    });
  };

  return (
    <Bolum baslik="Parola">
      <form onSubmit={kaydet}>
        <Alan etiket="Mevcut parola" type="password" value={mevcut} onDeger={setMevcut} autoComplete="current-password" />
        <Alan etiket="Yeni parola" type="password" value={yeni} onDeger={setYeni} autoComplete="new-password" />
        <ParolaGucuCubugu parola={yeni} ilgili={ilgili} />
        <Alan
          etiket="Yeni parola tekrarı"
          type="password"
          value={tekrar}
          onDeger={setTekrar}
          autoComplete="new-password"
          hata={tekrar && tekrar !== yeni ? "Parolalar eşleşmiyor." : null}
        />
        {g.mesaj}
        <button type="submit" disabled={!mevcut || parolaGucu(yeni, ilgili).seviye === 0 || yeni !== tekrar || g.mesgul}>
          Parolayı değiştir
        </button>
      </form>
    </Bolum>
  );
}

function OturumAyari() {
  const g = useGonderim();
  return (
    <Bolum baslik="Oturumlar">
      <p className="hint">Başka bir bilgisayarda açık kalan oturumların varsa hepsini buradan kapatabilirsin.</p>
      {g.mesaj}
      <button onClick={() => g.calistir(() => api.ayarlar.oturumlariKapat(), "Diğer tüm oturumlar kapatıldı.")} disabled={g.mesgul}>
        Diğer cihazlardan çıkış yap
      </button>
    </Bolum>
  );
}

function HesapSilme({ me }: { me: Me & { username: string } }) {
  const { setMe } = useOturum();
  const [parola, setParola] = useState("");
  const [onay, setOnay] = useState("");
  const g = useGonderim();

  const sil = (e: FormEvent) => {
    e.preventDefault();
    void g.calistir(() => api.ayarlar.hesabiSil(parola), "Hesabın silindi.", () => {
      setMe(null);
      navigate("/", { replace: true });
    });
  };

  return (
    <Bolum baslik="Hesabı sil">
      <form onSubmit={sil}>
        <p className="hint">
          Hesabın, tüm denemelerin ve oturumların kalıcı olarak silinir. Bu işlem geri alınamaz.
        </p>
        <Alan etiket="Parolan" type="password" value={parola} onDeger={setParola} autoComplete="current-password" />
        <Alan etiket={`Onaylamak için kullanıcı adını yaz (${me.username})`} value={onay} onDeger={setOnay} />
        {g.mesaj}
        <button className="tehlike" type="submit" disabled={!parola || onay !== me.username || g.mesgul}>
          Hesabımı kalıcı olarak sil
        </button>
      </form>
    </Bolum>
  );
}

export function Ayarlar() {
  const { me, yuklendi } = useOturum();
  if (!yuklendi) return <p className="empty">Yükleniyor…</p>;
  if (!uye(me)) {
    return (
      <div className="hesap-sayfa">
        <p>
          Ayarlar için <a href={href({ page: "giris", sonra: "/ayarlar" })}>giriş yapmalısın</a>.
        </p>
      </div>
    );
  }
  return (
    <div className="ayarlar">
      <p className="hint">
        Profil sayfan: <a href={href({ page: "profil", ad: me.username })}>/profil/{me.username}</a>
      </p>
      <ProfilAyari me={me} />
      <KullaniciAdiAyari key={me.username} me={me} />
      <EpostaAyari me={me} />
      <ParolaAyari me={me} />
      <OturumAyari />
      <HesapSilme me={me} />
    </div>
  );
}
