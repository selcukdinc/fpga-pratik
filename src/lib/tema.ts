// Tema tercihi: sistem, açık ya da koyu. index.html'deki küçük betik ilk çizimden
// önce aynı kuralı uygular; bu modül sonradan yapılan seçimleri yönetir.

import { useEffect, useState } from "react";

export type Tema = "sistem" | "acik" | "koyu";

const ANAHTAR = "tema";
const sistemKoyu = () => matchMedia("(prefers-color-scheme: dark)");

function oku(): Tema {
  try {
    const t = localStorage.getItem(ANAHTAR);
    if (t === "acik" || t === "koyu") return t;
  } catch {
    // Gizli pencere ya da kapalı depolama: sistem ayarıyla devam
  }
  return "sistem";
}

function uygula(t: Tema) {
  const koyu = t === "koyu" || (t === "sistem" && sistemKoyu().matches);
  document.documentElement.dataset.theme = koyu ? "dark" : "light";
}

export const TEMA_SIRASI: Tema[] = ["sistem", "acik", "koyu"];
export const TEMA_ADI: Record<Tema, string> = { sistem: "Sistem", acik: "Aydınlık", koyu: "Karanlık" };

export function useTema(): [Tema, (t: Tema) => void] {
  const [tema, setTema] = useState<Tema>(oku);

  useEffect(() => {
    uygula(tema);
    if (tema !== "sistem") return;
    const mq = sistemKoyu();
    const degisti = () => uygula("sistem");
    mq.addEventListener("change", degisti);
    return () => mq.removeEventListener("change", degisti);
  }, [tema]);

  const sec = (t: Tema) => {
    try {
      if (t === "sistem") localStorage.removeItem(ANAHTAR);
      else localStorage.setItem(ANAHTAR, t);
    } catch {
      // Kaydedilemese de bu oturum için uygulanır
    }
    setTema(t);
  };
  return [tema, sec];
}
