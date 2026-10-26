import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { href } from "../lib/router";
import { Avatar } from "../components/Avatar";
import { AvatarSecici } from "../components/AvatarSecici";
import { uye, useOturum } from "../lib/oturum";
import type { Profil as ProfilVerisi } from "../../shared/api";
import type { TbOzeti } from "../../shared/topluluk";

const tarih = (ms: number) => new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export function Profil({ ad }: { ad: string }) {
  const [p, setP] = useState<ProfilVerisi | null>(null);
  const [yok, setYok] = useState(false);
  const [tbler, setTbler] = useState<TbOzeti[]>([]);
  const [secici, setSecici] = useState(false);
  const { me } = useOturum();

  useEffect(() => {
    setP(null);
    setYok(false);
    setTbler([]);
    api.profil(ad).then((r) => {
      setP(r);
      if (!r.gizli) api.topluluk.tbler({ kullanici: r.username }).then(setTbler, () => {});
    }, () => setYok(true));
  }, [ad]);

  if (yok) return <p className="empty">Böyle bir kullanıcı bulunamadı.</p>;
  if (!p) return <p className="empty">Yükleniyor…</p>;
  if (p.gizli) {
    return (
      <div className="profil">
        <header className="profil-ust">
          <Avatar id={null} size={64} title="Gizli profil" />
          <div>
            <h2>{p.username}</h2>
            <p className="hint">Bu profil gizli.</p>
          </div>
        </header>
      </div>
    );
  }

  const toplam = p.konular.reduce((s, k) => s + k.total, 0);
  const dogru = p.konular.reduce((s, k) => s + k.correct, 0);

  return (
    <div className="profil">
      <header className="profil-ust">
        {p.kendisi && uye(me) ? (
          <button type="button" className="avatar-dugme" onClick={() => setSecici(true)} title="Avatarını değiştir">
            <Avatar id={me.avatar} bg={me.avatarBg} size={72} />
          </button>
        ) : (
          <Avatar id={p.avatar} bg={p.avatarBg} size={72} />
        )}
        {secici && uye(me) && <AvatarSecici me={me} kapat={() => setSecici(false)} />}
        <div>
          <h2>{p.username}</h2>
          <p className="hint">{tarih(p.joinedAt)} tarihinde katıldı</p>
          {p.kendisi && (
            <p className="hint">
              {p.publicProfile ? "Profilin herkese açık." : "Profilin gizli, bu sayfayı sadece sen görüyorsun."}{" "}
              <a href="/ayarlar">Ayarlar</a>
            </p>
          )}
        </div>
        <div className="profil-ozet">
          <strong>{dogru}</strong>
          <span>/ {toplam} soru doğru</span>
        </div>
      </header>

      <h3>Konular</h3>
      <ul className="konu-cubuklari">
        {p.konular.map((k) => {
          const pct = k.total ? Math.round((k.correct / k.total) * 100) : 0;
          return (
            <li key={k.topicId}>
              <a href={href({ page: "sorular", topic: k.topicId })}>
                H{k.week} · {k.title}
              </a>
              <div className="bar" role="img" aria-label={`%${pct}`}>
                <div style={{ width: `${pct}%` }} />
              </div>
              <span className="konu-sayi">
                {k.correct} / {k.total}
              </span>
            </li>
          );
        })}
      </ul>

      <h3>Son çözülen sorular</h3>
      {p.son.length === 0 ? (
        <p className="empty">Henüz doğru çözülmüş soru yok.</p>
      ) : (
        <ul className="son-liste">
          {p.son.map((s) => (
            <li key={s.questionId}>
              <span className="tag">H{s.week} · {s.topicTitle}</span>
              <span className="son-metin">{s.prompt}</span>
              <time className="hint" dateTime={new Date(s.at).toISOString()}>{tarih(s.at)}</time>
            </li>
          ))}
        </ul>
      )}

      {tbler.length > 0 && (
        <>
          <h3>Yayımladığı testbench'ler</h3>
          <ul className="son-liste">
            {tbler.map((t) => (
              <li key={t.id}>
                <span className="tag">{t.topicTitle}</span>
                <a className="son-metin" href={href({ page: "topluluk-tb", id: t.id })}>{t.title}</a>
                <span className="hint">★ {t.begeni} · ✓ {t.cozen}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
