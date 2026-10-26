// Gerçek adreslerle çalışan küçük yönlendirici: /pratik, /sorular/<konu>,
// /profil/<ad> ... Worker bilinmeyen adreslerde index.html döner.
// Eski #/sorular gibi bağlantılar açılışta yeni adrese çevrilir.

import { useEffect, useState } from "react";

export type Route =
  | { page: "pratik" }
  | { page: "sorular"; topic?: string; hafta?: number }
  | { page: "ilerleme" }
  | { page: "hakkinda" }
  | { page: "gizlilik" }
  | { page: "giris"; sonra?: string }
  | { page: "kayit" }
  | { page: "sifre-sifirla" }
  | { page: "profil"; ad: string }
  | { page: "ayarlar"; sekme?: AyarSekmesi }
  | { page: "oner" }
  | { page: "mesajlar"; id?: string }
  | { page: "topluluk"; konu?: string }
  | { page: "topluluk-tb"; id: string }
  | { page: "yonetim"; bolum: YonetimBolumu; soru?: string; alt?: string }
  | { page: "bulunamadi" };

export type AyarSekmesi = "profil" | "hesap" | "bildirimler" | "sil";
const AYAR_SEKMELERI: AyarSekmesi[] = ["profil", "hesap", "bildirimler", "sil"];

export type YonetimBolumu = "genel" | "sorular" | "oneriler" | "mesajlar" | "bildirimler" | "kullanicilar" | "kayit";
const YONETIM_BOLUMLERI: YonetimBolumu[] = ["genel", "sorular", "oneriler", "mesajlar", "bildirimler", "kullanicilar", "kayit"];

function parca(s: string | undefined): string | undefined {
  if (!s) return undefined;
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function parsePath(path: string, search = ""): Route {
  const [page, arg] = path.replace(/^\/+/, "").replace(/\/+$/, "").split("/");
  switch (page) {
    case "":
    case "pratik":
      return { page: "pratik" };
    case "sorular": {
      if (arg) return { page: "sorular", topic: parca(arg) };
      const hafta = Number(new URLSearchParams(search).get("hafta"));
      return Number.isInteger(hafta) && hafta > 0 ? { page: "sorular", hafta } : { page: "sorular", topic: undefined };
    }
    case "ilerleme":
    case "hakkinda":
    case "gizlilik":
    case "kayit":
    case "sifre-sifirla":
    case "oner":
      return { page };
    case "ayarlar":
      return AYAR_SEKMELERI.includes(arg as AyarSekmesi) && arg !== "profil" ? { page, sekme: arg as AyarSekmesi } : { page };
    case "mesajlar":
      return arg ? { page: "mesajlar", id: parca(arg) } : { page: "mesajlar" };
    case "topluluk": {
      // /topluluk?konu=<konu>, /topluluk/<kimlik ya da "yeni">
      if (arg) return { page: "topluluk-tb", id: parca(arg)! };
      const konu = new URLSearchParams(search).get("konu") ?? undefined;
      return konu ? { page: "topluluk", konu } : { page: "topluluk" };
    }
    case "giris": {
      // Yalnızca site içi bir yola geri dönülür
      const sonra = new URLSearchParams(search).get("sonra") ?? undefined;
      return { page: "giris", sonra: sonra?.startsWith("/") && !sonra.startsWith("//") ? sonra : undefined };
    }
    case "profil":
      return arg ? { page: "profil", ad: parca(arg)! } : { page: "bulunamadi" };
    case "yonetim": {
      // /yonetim, /yonetim/sorular, /yonetim/sorular/<kimlik ya da "yeni">
      const bolum = (arg ?? "genel") as YonetimBolumu;
      if (!YONETIM_BOLUMLERI.includes(bolum)) return { page: "bulunamadi" };
      const ucuncu = parca(path.replace(/^\/+/, "").split("/")[2]);
      if (!ucuncu) return { page: "yonetim", bolum };
      return bolum === "sorular" ? { page: "yonetim", bolum, soru: ucuncu } : { page: "yonetim", bolum, alt: ucuncu };
    }
    default:
      return { page: "bulunamadi" };
  }
}

// Eski hash adresleri: #/pratik, #/sorular/<konu>, #/ilerleme, #/hakkinda
export function parseHash(hash: string): Route | null {
  if (!hash.startsWith("#/")) return null;
  return parsePath(hash.slice(1));
}

export function href(route: Route): string {
  switch (route.page) {
    case "sorular":
      return route.topic ? `/sorular/${encodeURIComponent(route.topic)}` : route.hafta ? `/sorular?hafta=${route.hafta}` : "/sorular";
    case "ayarlar":
      return route.sekme && route.sekme !== "profil" ? `/ayarlar/${route.sekme}` : "/ayarlar";
    case "profil":
      return `/profil/${encodeURIComponent(route.ad)}`;
    case "yonetim": {
      const ek = route.soru ?? route.alt;
      return `/yonetim${route.bolum === "genel" ? "" : `/${route.bolum}`}${ek ? `/${encodeURIComponent(ek)}` : ""}`;
    }
    case "mesajlar":
      return route.id ? `/mesajlar/${encodeURIComponent(route.id)}` : "/mesajlar";
    case "topluluk":
      return route.konu ? `/topluluk?konu=${encodeURIComponent(route.konu)}` : "/topluluk";
    case "topluluk-tb":
      return `/topluluk/${encodeURIComponent(route.id)}`;
    case "giris":
      return route.sonra ? `/giris?sonra=${encodeURIComponent(route.sonra)}` : "/giris";
    case "bulunamadi":
      return "/";
    default:
      return `/${route.page}`;
  }
}

const OLAY = "fp:gezinti";

export function navigate(to: string | Route, { replace = false } = {}) {
  const url = typeof to === "string" ? to : href(to);
  if (replace) history.replaceState(null, "", url);
  else history.pushState(null, "", url);
  window.dispatchEvent(new Event(OLAY));
  if (!replace) window.scrollTo(0, 0);
}

// Site içi <a href="/..."> tıklamalarını sayfa yenilemeden karşılar
function tiklama(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.("a");
  // data-tam-sayfa: Cloudflare Access gibi sunucu tarafı bir kapıdan geçmesi gereken sayfalar tam yüklenir
  if (!a || a.target || a.hasAttribute("download") || a.hasAttribute("data-tam-sayfa")) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname.startsWith("/api/") || /\.\w+$/.test(url.pathname)) return;
  e.preventDefault();
  if (url.pathname + url.search !== location.pathname + location.search) navigate(url.pathname + url.search);
}

function mevcut(): Route {
  return parsePath(location.pathname, location.search);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => {
    const eski = parseHash(location.hash);
    if (eski) history.replaceState(null, "", href(eski));
    return mevcut();
  });
  useEffect(() => {
    const onChange = () => setRoute(mevcut());
    window.addEventListener("popstate", onChange);
    window.addEventListener(OLAY, onChange);
    document.addEventListener("click", tiklama);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener(OLAY, onChange);
      document.removeEventListener("click", tiklama);
    };
  }, []);
  return route;
}
