// Ders benzetimlerinde mesajlar ve dalga ekranı kodun altında mı, sağında mı?
// Tercih bu tarayıcıda saklanır ve sayfadaki bütün benzetimlere birlikte uygulanır.

import { useEffect, useState } from "react";

const ANAHTAR = "fpga-pratik:mini-yan";
const OLAY = "fpga-pratik:mini-duzen";

function oku(): boolean {
  try {
    return localStorage.getItem(ANAHTAR) === "1";
  } catch {
    return false;
  }
}

export function useMiniYan(): [boolean, (v: boolean) => void] {
  const [yan, setYan] = useState(oku);
  useEffect(() => {
    const guncelle = () => setYan(oku());
    window.addEventListener(OLAY, guncelle);
    window.addEventListener("storage", guncelle);
    return () => {
      window.removeEventListener(OLAY, guncelle);
      window.removeEventListener("storage", guncelle);
    };
  }, []);
  const sec = (v: boolean) => {
    try {
      if (v) localStorage.setItem(ANAHTAR, "1");
      else localStorage.removeItem(ANAHTAR);
    } catch {
      // Depolama kapalıysa tercih yalnızca bu sayfada geçerli olur
    }
    setYan(v);
    window.dispatchEvent(new Event(OLAY));
  };
  return [yan, sec];
}
