import { describe, expect, it } from "vitest";
import { href, parseHash, parsePath } from "./router";

describe("yönlendirici", () => {
  it("yolları çözer ve geri üretir", () => {
    for (const r of [
      { page: "pratik" },
      { page: "sorular" },
      { page: "sorular", topic: "esz-atamalar" },
      { page: "profil", ad: "ali_42" },
      { page: "ayarlar" },
      { page: "giris", sonra: "/sorular/nitelikler" },
      { page: "yonetim", bolum: "genel" },
      { page: "yonetim", bolum: "sorular" },
      { page: "yonetim", bolum: "sorular", soru: "h3-mod-rem" },
      { page: "yonetim", bolum: "kullanicilar" },
      { page: "yonetim", bolum: "oneriler", alt: "abc" },
      { page: "yonetim", bolum: "mesajlar" },
      { page: "oner" },
      { page: "mesajlar" },
      { page: "mesajlar", id: "t-1" },
      { page: "topluluk" },
      { page: "topluluk", konu: "h3-op" },
      { page: "topluluk-tb", id: "yeni" },
      { page: "yonetim", bolum: "bildirimler" },
    ] as const) {
      const u = new URL(href(r), "https://x");
      expect(parsePath(u.pathname, u.search)).toEqual(r.page === "sorular" && !("topic" in r) ? { page: "sorular", topic: undefined } : r);
    }
  });
  it("kök adres pratik alanını açar, bilinmeyen adres bulunamadı döner", () => {
    expect(parsePath("/")).toEqual({ page: "pratik" });
    expect(parsePath("/yok-boyle")).toEqual({ page: "bulunamadi" });
  });
  it("girişten sonra başka siteye yönlendirmez", () => {
    expect(parsePath("/giris", "?sonra=https://kotu.example")).toEqual({ page: "giris", sonra: undefined });
    expect(parsePath("/giris", "?sonra=//kotu.example")).toEqual({ page: "giris", sonra: undefined });
  });
  it("eski hash adreslerini çevirir", () => {
    expect(parseHash("#/sorular/nitelikler")).toEqual({ page: "sorular", topic: "nitelikler" });
    expect(parseHash("#/ilerleme")).toEqual({ page: "ilerleme" });
    expect(parseHash("")).toBeNull();
    expect(parseHash("#baslik")).toBeNull();
  });
});
