import { useEffect, useRef, useState, type ReactNode } from "react";
import { href, navigate, type Route } from "../lib/router";
import { api } from "../lib/api";
import { TEMA_ADI, TEMA_SIRASI, useTema } from "../lib/tema";
import { uye, useOturum } from "../lib/oturum";
import { Avatar } from "./Avatar";
import { inline } from "./Markdown";

interface Props {
  route: Route;
  currentWeek: number | null;
  title: string;
  status?: string;
  duyuru?: string | null;
  children: ReactNode;
}

// Menüdeki simgeler: 24x24 çizgi çizimler, renk currentColor'dan gelir
const IKONLAR = {
  pratik: "M7 5l12 7-12 7z",
  ders: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 5v16M8 7h7M8 11h7",
  sorular: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  topluluk: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3.3 2.7-5 6-5s6 1.7 6 5M16 5.5a3 3 0 010 5.5M18 15c2 .6 3 2.2 3 5",
  ilerleme: "M4 20V11M10 20V5M16 20v-6M2 20h20",
  hakkinda: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5v.5",
  gizlilik: "M12 3l8 3v6c0 4.6-3.4 7.8-8 9-4.6-1.2-8-4.4-8-9V6z",
  daralt: "M15 6l-6 6 6 6",
  genislet: "M9 6l6 6-6 6",
  menu: "M4 7h16M4 12h16M4 17h16",
} as const;

export function Ikon({ ad, boyut = 16 }: { ad: keyof typeof IKONLAR; boyut?: number }) {
  return (
    <svg className="ikon" width={boyut} height={boyut} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={IKONLAR[ad]} />
    </svg>
  );
}

// Bir menü öğesi, ilgili alt sayfalarda da etkin görünür (ör. /topluluk/<id>, /sorular/<konu>)
const ETKIN: Partial<Record<Route["page"], Route["page"][]>> = {
  topluluk: ["topluluk", "topluluk-tb"],
  sorular: ["sorular"],
};

function NavLink({ to, current, ikon, children, ek }: {
  to: Route; current: Route; ikon: keyof typeof IKONLAR; children: ReactNode; ek?: ReactNode;
}) {
  const active = (ETKIN[to.page] ?? [to.page]).includes(current.page);
  const ad = typeof children === "string" ? children : undefined;
  return (
    <a className={`nav-link${active ? " active" : ""}`} href={href(to)} aria-current={active ? "page" : undefined} title={ad}>
      <Ikon ad={ikon} />
      <span className="nav-ad">{children}</span>
      {ek}
    </a>
  );
}

const DAR = "fpga-pratik:menu-dar";
function darOku(): boolean {
  try {
    return localStorage.getItem(DAR) === "1";
  } catch {
    return false;
  }
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

export function Shell({ route, currentWeek, title, status, duyuru, children }: Props) {
  const [dar, setDar] = useState(darOku);
  const [menuAcik, setMenuAcik] = useState(false);

  // Mobilde sayfa değişince menü kapanır
  useEffect(() => setMenuAcik(false), [route]);

  const darDegistir = (d: boolean) => {
    setDar(d);
    try {
      localStorage.setItem(DAR, d ? "1" : "0");
    } catch {
      // kaydedilemezse oturum boyunca geçerli
    }
  };

  return (
    <div className={`shell${dar ? " dar" : ""}${menuAcik ? " menu-acik" : ""}`}>
      <header className="topbar">
        <button className="menu-dugmesi icon" onClick={() => setMenuAcik(!menuAcik)} aria-expanded={menuAcik} aria-controls="ana-menu" aria-label="Menü">
          <Ikon ad="menu" boyut={20} />
        </button>
        <a className="brand" href="/pratik">
          <img src="/favicon.svg" alt="" width={18} height={18} />
          FPGA Pratik
        </a>
        <span className="topbar-status">{status}</span>
        <TemaDugmesi />
        <HesapAlani route={route} />
      </header>

      <div className="menu-perde" onClick={() => setMenuAcik(false)} aria-hidden="true" />
      <aside className="flow-nav" id="ana-menu" aria-label="Ana menü">
        <div className="panel-title">
          <span className="nav-ad">FLOW NAVIGATOR</span>
          <button className="icon menu-daralt" onClick={() => darDegistir(!dar)} aria-label={dar ? "Menüyü genişlet" : "Menüyü daralt"} title={dar ? "Menüyü genişlet" : "Menüyü daralt"}>
            <Ikon ad={dar ? "genislet" : "daralt"} />
          </button>
        </div>

        <div className="nav-section">PRATİK</div>
        <NavLink to={{ page: "pratik" }} current={route} ikon="pratik">Simülasyon alanı</NavLink>

        <div className="nav-section">ÇALIŞ</div>
        <NavLink to={{ page: "ders" }} current={route} ikon="ders">Dersler</NavLink>
        <NavLink to={{ page: "sorular" }} current={route} ikon="sorular"
          ek={currentWeek !== null && <span className="nav-rozet" title={`Sorular ${currentWeek}. haftaya kadar açık`}>H{currentWeek}</span>}>
          Soru havuzu
        </NavLink>
        <NavLink to={{ page: "ilerleme" }} current={route} ikon="ilerleme">İlerlemem</NavLink>

        <div className="nav-section">TOPLULUK</div>
        <NavLink to={{ page: "topluluk" }} current={route} ikon="topluluk">Testbench'ler</NavLink>

        <div className="nav-section">PROJE</div>
        <NavLink to={{ page: "hakkinda" }} current={route} ikon="hakkinda">Hakkında</NavLink>
        <NavLink to={{ page: "gizlilik" }} current={route} ikon="gizlilik">Gizlilik</NavLink>
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
