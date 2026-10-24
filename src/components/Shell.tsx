import type { ReactNode } from "react";
import { href, type Route } from "../lib/router";
import { REPO_URL } from "../lib/api";
import type { Topic } from "../../shared/api";

interface Props {
  route: Route;
  topics: Topic[];
  currentWeek: number | null;
  title: string;
  status?: string;
  children: ReactNode;
}

function NavLink({ to, current, children }: { to: Route; current: Route; children: ReactNode }) {
  const active =
    to.page === current.page && (to.page !== "sorular" || (current.page === "sorular" && to.topic === current.topic));
  return (
    <a className={`nav-link${active ? " active" : ""}`} href={href(to)} aria-current={active ? "page" : undefined}>
      {children}
    </a>
  );
}

export function Shell({ route, topics, currentWeek, title, status, children }: Props) {
  return (
    <div className="shell">
      <header className="topbar">
        <a className="brand" href="#/pratik">
          <img src="/favicon.svg" alt="" width={18} height={18} />
          FPGA Pratik
        </a>
        <span className="topbar-status">{status}</span>
        <nav className="topbar-links" aria-label="Proje bağlantıları">
          <a href={REPO_URL} target="_blank" rel="noreferrer">★ GitHub'da yıldızla</a>
          <a href={`${REPO_URL}/issues/new`} target="_blank" rel="noreferrer">Sorun bildir</a>
        </nav>
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

        <div className="nav-section">İLERLEME</div>
        <NavLink to={{ page: "ilerleme" }} current={route}>Konu bazlı durum</NavLink>

        <div className="nav-section">PROJE</div>
        <NavLink to={{ page: "hakkinda" }} current={route}>Hakkında</NavLink>
      </aside>

      <main className="workspace">
        <div className="section-header">{title}</div>
        <div className="workspace-body">{children}</div>
      </main>
    </div>
  );
}
