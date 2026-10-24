// Giriş yapan kullanıcı bilgisi tüm sayfalarla paylaşılır

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Me } from "../../shared/api";
import { api } from "./api";

interface Oturum {
  me: Me | null;
  yuklendi: boolean;
  epostaAcik: boolean;
  setMe: (me: Me | null) => void;
  yenile: () => Promise<void>;
}

const Baglam = createContext<Oturum | null>(null);

export function OturumSaglayici({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [yuklendi, setYuklendi] = useState(false);
  const [epostaAcik, setEpostaAcik] = useState(false);

  const yenile = useCallback(async () => {
    try {
      const r = await api.me();
      setEpostaAcik(r.epostaAcik);
      setMe(r.id ? (r as Me) : null);
    } catch {
      setMe(null);
    } finally {
      setYuklendi(true);
    }
  }, []);

  useEffect(() => {
    void yenile();
  }, [yenile]);

  return <Baglam.Provider value={{ me, yuklendi, epostaAcik, setMe, yenile }}>{children}</Baglam.Provider>;
}

export function useOturum(): Oturum {
  const o = useContext(Baglam);
  if (!o) throw new Error("OturumSaglayici eksik");
  return o;
}

export const uye = (me: Me | null): me is Me & { username: string } => me?.kind === "member" && !!me.username;
