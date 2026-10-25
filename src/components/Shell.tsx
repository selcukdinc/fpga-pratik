import { useEffect, useRef, useState, type ReactNode } from "react";
import { href, navigate, type Route } from "../lib/router";
import { REPO_URL, api } from "../lib/api";
import { TEMA_ADI, TEMA_SIRASI, useTema } from "../lib/tema";
import { uye, useOturum } from "../lib/oturum";
import { Avatar } from "./Avatar";
import { inline } from "./Markdown";
import type { Topic } from "../../shared/api";

interface Props {
  route: Route;
  topics: Topic[];
  currentWeek: number | null;
  title: string;
  status?: string;
  duyuru?: string | null;
  children: ReactNode;
}

function NavLink({ to, current, children }: { to: Route; current: Route; children: ReactNode }) {
  const active =
    (to.page === current.page || (to.page === "topluluk" && current.page === "topluluk-tb")) && (to.page !== "sorular" || (current.page === "sorular" && to.topic === current.topic));
  return (
    <a className={`nav-link${active ? " active" : ""}`} href={href(to)} aria-current={active ? "page" : undefined}>
      {children}
    </a>
  );
}

const TEMA_ISARETI = { sistem: "◐", acik: "☀", koyu: "☾" } as const;

function TemaDugmesi() {
  const [tema, sec] = useTema();
  const sonraki = TEMA_SIRASI[(TEMA_SIRASI.indexOf(tema) + 1) % TEMA_SIRASI.length]!;
  return (
    <button
      className="tema-dugmesi"
      onClick={() => sec(sonraki)}
      title={`Tema: ${TEMA_ADI[tema]}. Tıkla: ${TEMA_ADI[sonraki]}`}
      aria-label={`Tema: ${TEMA_ADI[tema]}. ${TEMA_ADI[sonraki]} temaya geç`}
    >
      <span aria-hidden="true">{TEMA_ISARETI[tema]}</span> {TEMA_ADI[tema]}
    </button>
  );
}

function HesapAlani({ route }: { route: Route }) {
  const { me, yuklendi, setMe } = useOturum();
  const menu = useRef<HTMLDetailsElement>(null);
  const [okunmamis, setOkunmamis] = useState({ mesaj: 0, oneri: 0 });
  const giris = uye(me);

  // Sayfa değişince menü kapanır, okunmamış sayısı tazelenir
  useEffect(() => {
    if (menu.current) menu.current.open = false;
    if (giris) api.uye.okunmamis().then(setOkunmamis, () => {});
  }, [route, giris]);

  if (!yuklendi) return <span className="hesap-alani" />;
  if (!uye(me)) {
    const sonra = route.page === "giris" || route.page === "kayit" ? undefined : location.pathname;
    return (
      <span className="hesap-alani">
        <a href={href({ page: "giris", sonra })}>Giriş</a>
        <a className="kayit-link" href="/kayit">Kayıt ol</a>
      </span>
    );
  }

  const cikis = async () => {
    await api.hesap.cikis();
    setMe(null);
    navigate("/");
  };

  const toplam = okunmamis.mesaj + okunmamis.oneri;
  const rozet = (n: number) => (n > 0 ? <span className="sayi-rozeti">{n}</span> : null);

  return (
    <details className="hesap-alani hesap-menu" ref={menu}>
      <summary aria-label={toplam > 0 ? `${me.username}, ${toplam} okunmamış` : undefined}>
        <Avatar id={me.avatar} bg={me.avatarBg} size={22} />
        <span>{me.username}</span>
        {rozet(toplam)}
      </summary>
      <div className="hesap-menu-liste" role="menu">
        <a role="menuitem" href={href({ page: "profil", ad: me.username })}>Profilim</a>
        <a role="menuitem" href="/mesajlar">Mesajlarım {rozet(okunmamis.mesaj)}</a>
        <a role="menuitem" href="/oner">Soru öner {rozet(okunmamis.oneri)}</a>
        <a role="menuitem" href="/ayarlar">Ayarlar</a>
        {me.role === "admin" && <a role="menuitem" href="/yonetim" data-tam-sayfa>Yönetim paneli</a>}
        <button role="menuitem" onClick={cikis}>Çıkış yap</button>
      </div>
    </details>
  );
}

export function Shell({ route, topics, currentWeek, title, status, duyuru, children }: Props) {
  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="/pratik">
          <img src="/favicon.svg" alt="" width={18} height={18} />
          FPGA Pratik
        </a>
        <span className="topbar-status">{status}</span>
        <nav className="topbar-links" aria-label="Proje bağlantıları">
          <a href={REPO_URL} target="_blank" rel="noreferrer">★ GitHub'da yıldızla</a>
          <a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">Sorun bildir</a>
        </nav>
        <TemaDugmesi />
        <HesapAlani route={route} />
      </header>

      <aside className="flow-nav" aria-label="Flow Navigator">
        <div className="panel-title">FLOW NAVIGATOR</div>

        <div className="nav-section">PRATİK</div>
        <NavLink to={{ page: "pratik" }} current={route}>▶ Simülasyon alanı</NavLink>

        <div className="nav-section">
          SORU HAVUZU{currentWeek !== null && <span className="nav-week"> · {currentWeek}. haftaya kadar</span>}
        </div>
        <NavLink to={{ page: "sorular" }} current={route}>Tüm sorular</NavLink>
        {topics.map((t) => (
          <NavLink key={t.id} to={{ page: "sorular", topic: t.id }} current={route}>
            <span className="nav-sub">H{t.week} · {t.title}</span>
          </NavLink>
        ))}

        <div className="nav-section">TOPLULUK</div>
        <NavLink to={{ page: "topluluk" }} current={route}>Testbench'ler</NavLink>

        <div className="nav-section">İLERLEME</div>
        <NavLink to={{ page: "ilerleme" }} current={route}>Konu bazlı durum</NavLink>

        <div className="nav-section">PROJE</div>
        <NavLink to={{ page: "hakkinda" }} current={route}>Hakkında</NavLink>
        <NavLink to={{ page: "gizlilik" }} current={route}>Gizlilik</NavLink>
      </aside>

      <main className="workspace">
        {duyuru && (
          <div className="duyuru" role="status">
            {inline(duyuru)}
          </div>
        )}
        <div className="section-header">{title}</div>
        <div className="workspace-body">{children}</div>
      </main>
    </div>
  );
}
