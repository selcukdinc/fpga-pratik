// Kod sorularında "Başkaları nerede takıldı?": üyelerin paylaştığı sonuçlar ve
// kendi sonucunu paylaşma. Kod yalnızca ayrıca işaretlenirse gönderilir.

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { href } from "../lib/router";
import { uye, useOturum } from "../lib/oturum";
import { Avatar } from "./Avatar";
import { BildirDugmesi } from "./Bildir";
import type { Paylasimlar as Liste } from "../../shared/topluluk";

const tarih = (ms: number) => new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });

interface Props {
  soruId: string;
  kod: string;
  // Bu oturumda sınandıysa paylaşılabilir; skor sunucudaki son denemeden alınır
  sinandi: boolean;
}

export function Paylasimlar({ soruId, kod, sinandi }: Props) {
  const { me } = useOturum();
  const [acik, setAcik] = useState(false);
  const [veri, setVeri] = useState<Liste | null>(null);
  const [kodEkle, setKodEkle] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const giris = uye(me);

  const yukle = () => api.topluluk.paylasimlar(soruId).then(setVeri, () => setHata("Paylaşımlar yüklenemedi."));
  useEffect(() => {
    if (giris && (acik || sinandi) && !veri) void yukle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giris, acik, sinandi]);

  if (!giris) {
    return (
      <p className="hint">
        Başkalarının bu soruda nerede takıldığını görmek ve kendi sonucunu paylaşmak için{" "}
        <a href={href({ page: "giris", sonra: location.pathname })}>giriş yap</a>.
      </p>
    );
  }

  const benim = veri?.liste.find((p) => p.benim);
  const digerleri = veri?.liste.filter((p) => !p.benim) ?? [];

  const paylas = async () => {
    setHata(null);
    setMesaj(null);
    const r = await api.topluluk.paylas(soruId, kodEkle ? kod : null);
    if (!r.ok) return setHata(r.hata.error);
    setMesaj(kodEkle ? "Sonucun ve kodun paylaşıldı." : "Sonucun paylaşıldı.");
    void yukle();
  };
  const kaldir = async () => {
    const r = await api.topluluk.paylasimiKaldir(soruId);
    if (!r.ok) return setHata(r.hata.error);
    setMesaj("Paylaşımın kaldırıldı.");
    void yukle();
  };

  return (
    <div className="paylasimlar">
      {sinandi && veri && (
        <div className="paylas-kutusu">
          <strong>Sonucunu paylaş</strong>
          <span className="hint">
            Giriş yapmış diğer üyeler skorunu ve ilk takıldığın kontrol noktasını görür. Kodun sen işaretlemedikçe paylaşılmaz.
          </span>
          {veri.kodAcik && (
            <label className="onay">
              <input type="checkbox" checked={kodEkle} disabled={!veri.kodPaylasabilir} onChange={(e) => setKodEkle(e.target.checked)} />
              Kodumu da ekle
              {!veri.kodPaylasabilir && <span className="hint"> (yeni hesaplar ilk 24 saat kod paylaşamaz)</span>}
            </label>
          )}
          <div className="kod-dugmeler">
            <button onClick={paylas}>{benim ? "Paylaşımı son sonucumla güncelle" : "Paylaş"}</button>
            {benim && <button className="baglanti-dugme" onClick={kaldir}>Paylaşımı kaldır</button>}
          </div>
        </div>
      )}
      {hata && <p className="bad">{hata}</p>}
      {mesaj && <p className="ok" role="status">{mesaj}</p>}

      <details onToggle={(e) => setAcik((e.target as HTMLDetailsElement).open)}>
        <summary>Başkaları nerede takıldı?{veri && ` (${digerleri.length})`}</summary>
        {!veri ? (
          <p className="empty">Yükleniyor…</p>
        ) : veri.liste.length === 0 ? (
          <p className="empty">Henüz kimse sonucunu paylaşmadı.</p>
        ) : (
          <ul className="paylasim-listesi">
            {veri.liste.map((p) => (
              <li key={p.id} className={p.benim ? "benim" : undefined}>
                <div className="paylasim-ust">
                  <Avatar id={p.avatar} bg={p.avatarBg} size={20} />
                  {p.username ? <a href={href({ page: "profil", ad: p.username })}>@{p.username}</a> : <span>silinmiş hesap</span>}
                  {p.benim && <span className="tag">sen</span>}
                  {p.gizli && <span className="tag durum-rejected">bildirimler yüzünden gizlendi</span>}
                  <span className={p.gecen === p.toplam ? "ok" : undefined}>
                    {p.gecen}/{p.toplam}
                  </span>
                  <span className="hint">
                    {p.ilkHata === null ? "hepsi geçti" : `ilk hata: kontrol noktası #${p.ilkHata}`} · {tarih(p.createdAt)}
                  </span>
                  {!p.benim && <BildirDugmesi tur="paylasim" id={p.id} bildirdim={p.bildirdim} />}
                </div>
                <div className="kod-ilerleme" aria-hidden>
                  <span style={{ width: `${(p.gecen / p.toplam) * 100}%` }} />
                </div>
                {p.kod && (
                  <details>
                    <summary>Kodu</summary>
                    <pre className="log">{p.kod}</pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </details>
    </div>
  );
}
