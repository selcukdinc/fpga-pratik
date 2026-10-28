// Ders ilerlemesinin tarayıcıdaki hali. Misafirde localStorage'da, üyede hesapta
// tutulur; giriş yapılınca tarayıcıdaki ilerleme hesaptakiyle birleştirilip
// hesaba yazılır ve tarayıcıdan silinir. Bütün bileşenler aynı depoyu paylaşır.

import { useEffect, useSyncExternalStore } from "react";
import { api } from "./api";
import { uye, useOturum } from "./oturum";
import { BOS_ILERLEME, bolumIsaretle, ilerlemeBirlestir, ilerlemeDuzelt, type DersIlerleme } from "../../shared/dersIlerleme";

const ANAHTAR = "fpga-pratik:ders-ilerleme";

function yerelOku(): DersIlerleme {
  try {
    const v = localStorage.getItem(ANAHTAR);
    return v ? ilerlemeDuzelt(JSON.parse(v)) : BOS_ILERLEME;
  } catch {
    return BOS_ILERLEME;
  }
}

function yerelYaz(i: DersIlerleme | null) {
  try {
    if (i) localStorage.setItem(ANAHTAR, JSON.stringify(i));
    else localStorage.removeItem(ANAHTAR);
  } catch {
    // gizli pencere ya da kapalı depolama: ilerleme bu oturumla sınırlı kalır
  }
}

let durum: DersIlerleme = yerelOku();
// Hangi kullanıcının ilerlemesi yüklü: "misafir" ya da üyenin kimliği
let sahip: string | null = null;
const dinleyiciler = new Set<() => void>();
let zamanlayici: ReturnType<typeof setTimeout> | undefined;

function ayarla(yeni: DersIlerleme) {
  durum = yeni;
  dinleyiciler.forEach((f) => f());
}

function kaydet() {
  if (sahip === "misafir" || sahip === null) {
    yerelYaz(durum);
    return;
  }
  // Art arda değişikliklerde hesaba bir kez yazılır
  clearTimeout(zamanlayici);
  const kayit = durum;
  zamanlayici = setTimeout(() => void api.ayarlar.dersIlerlemeKaydet(kayit), 1500);
}

async function yukle(uyeKimligi: string | null) {
  const yeniSahip = uyeKimligi ?? "misafir";
  if (sahip === yeniSahip) return;
  sahip = yeniSahip;
  if (!uyeKimligi) {
    ayarla(yerelOku());
    return;
  }
  try {
    const hesapta = await api.ayarlar.dersIlerleme();
    if (sahip !== yeniSahip) return;
    const yerel = yerelOku();
    const tasinacak = Object.keys(yerel.bitenler).length > 0 || yerel.son !== null;
    const birlesik = tasinacak ? ilerlemeBirlestir(hesapta, yerel) : hesapta;
    ayarla(birlesik);
    if (tasinacak) {
      const r = await api.ayarlar.dersIlerlemeKaydet(birlesik);
      if (r.ok) yerelYaz(null);
    }
  } catch {
    // Hesaptaki ilerleme alınamadı; tarayıcıdaki gösterilir, üzerine yazılmaz
    ayarla(yerelOku());
  }
}

export function useDersIlerleme() {
  const { me, yuklendi } = useOturum();
  const kimlik = uye(me) ? me.id : null;
  useEffect(() => {
    if (yuklendi) void yukle(kimlik);
  }, [yuklendi, kimlik]);
  const ilerleme = useSyncExternalStore(
    (f) => (dinleyiciler.add(f), () => void dinleyiciler.delete(f)),
    () => durum,
  );
  return {
    ilerleme,
    isaretle: (hafta: number, bolum: number, bitti: boolean) => {
      ayarla(bolumIsaretle(durum, hafta, bolum, bitti));
      kaydet();
    },
    sonYer: (hafta: number, bolum: number) => {
      if (durum.son?.hafta === hafta && durum.son.bolum === bolum) return;
      ayarla({ ...durum, son: { hafta, bolum, zaman: Date.now() } });
      kaydet();
    },
  };
}
