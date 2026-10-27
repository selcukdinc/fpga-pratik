// Metin boyutu: tüm sayfalar (simülasyon alanı dışında) bu oranla büyür ya da
// küçülür. Seçim tarayıcıda saklanır; hesapla girildiyse hesaba da yazılır.
// index.html'deki betik ilk çizimden önce aynı değeri uygular.

import { useEffect, useSyncExternalStore } from "react";
import { api } from "./api";
import { uye, useOturum } from "./oturum";
import { OLCEK_SECENEKLERI, VARSAYILAN_OLCEK, olcekGecerli } from "../../shared/gorunum";

const ANAHTAR = "fpga-pratik:yazi-olcek";

function oku(): number {
  try {
    const o = Number(localStorage.getItem(ANAHTAR));
    if (olcekGecerli(o)) return o;
  } catch {
    // depolama kapalı
  }
  return VARSAYILAN_OLCEK;
}

let olcek = oku();
const dinleyenler = new Set<() => void>();

function uygula(o: number) {
  document.documentElement.style.setProperty("--yazi-olcek", String(o / 100));
}

function degistir(o: number) {
  if (o === olcek) return;
  olcek = o;
  uygula(o);
  try {
    if (o === VARSAYILAN_OLCEK) localStorage.removeItem(ANAHTAR);
    else localStorage.setItem(ANAHTAR, String(o));
  } catch {
    // kaydedilemese de bu oturumda geçerli
  }
  dinleyenler.forEach((f) => f());
}

const abone = (f: () => void) => {
  dinleyenler.add(f);
  return () => dinleyenler.delete(f);
};

export const yaziOlcegi = () => olcek;

let kayitZamanlayici: ReturnType<typeof setTimeout> | undefined;

// [geçerli yüzde, seç, bir basamak büyüt/küçült]
export function useYaziOlcek(): [number, (o: number) => void, (yon: 1 | -1) => void] {
  const o = useSyncExternalStore(abone, yaziOlcegi);
  const { me, setMe } = useOturum();
  const hesap = uye(me);

  const sec = (yeni: number) => {
    if (!olcekGecerli(yeni)) return;
    degistir(yeni);
    // Art arda basışlarda hesaba bir kez yazılır
    if (!hesap) return;
    clearTimeout(kayitZamanlayici);
    kayitZamanlayici = setTimeout(() => {
      void api.ayarlar.gorunum(yeni).then((r) => r.ok && setMe(r.data));
    }, 700);
  };
  const adim = (yon: 1 | -1) => {
    const i = OLCEK_SECENEKLERI.indexOf(o);
    const j = Math.min(OLCEK_SECENEKLERI.length - 1, Math.max(0, i + yon));
    sec(OLCEK_SECENEKLERI[j]!);
  };
  return [o, sec, adim];
}

// Giriş yapılınca hesaptaki boyut bu tarayıcıya gelir
export function useHesapOlcegi() {
  const { me } = useOturum();
  const kayitli = uye(me) ? me.yaziOlcek : null;
  useEffect(() => {
    if (kayitli !== null && olcekGecerli(kayitli)) degistir(kayitli);
  }, [me?.id, kayitli]);
}
