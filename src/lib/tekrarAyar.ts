// Günlük tekrar sayısı: üyede hesapta, misafirde bu tarayıcıda tutulur.

import { useState } from "react";
import { api } from "./api";
import { uye, useOturum } from "./oturum";
import { GUNLUK_TEKRAR, gunlukGecerli } from "../../shared/tekrar";
import type { Me } from "../../shared/api";

const ANAHTAR = "fpga-pratik:gunluk-tekrar";
// Menüdeki sayının yeni seçime göre güncellenmesi için
export const GUNLUK_OLAYI = "fpga-pratik:gunluk-tekrar";

function yerel(): number {
  try {
    const n = Number(localStorage.getItem(ANAHTAR));
    return localStorage.getItem(ANAHTAR) !== null && gunlukGecerli(n) ? n : GUNLUK_TEKRAR;
  } catch {
    return GUNLUK_TEKRAR;
  }
}

export function gunlukTekrar(me: Me | null): number {
  if (uye(me)) return me.gunlukTekrar !== null && gunlukGecerli(me.gunlukTekrar) ? me.gunlukTekrar : GUNLUK_TEKRAR;
  return yerel();
}

export function useGunlukTekrar(): [number, (n: number) => void] {
  const { me, setMe } = useOturum();
  const [misafir, setMisafir] = useState(yerel);
  const deger = uye(me) ? gunlukTekrar(me) : misafir;
  const sec = (n: number) => {
    if (!gunlukGecerli(n)) return;
    if (uye(me)) {
      setMe({ ...me, gunlukTekrar: n });
      void api.ayarlar.gunlukTekrar(n).then((r) => r.ok && setMe(r.data));
    } else {
      setMisafir(n);
      try {
        localStorage.setItem(ANAHTAR, String(n));
      } catch {
        // depolama kapalı: seçim bu sayfa açık kaldıkça geçerli
      }
    }
    window.dispatchEvent(new Event(GUNLUK_OLAYI));
  };
  return [deger, sec];
}
