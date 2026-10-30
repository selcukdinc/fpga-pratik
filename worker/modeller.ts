// Kod sorularının referans modelleri. Yalnızca sunucuda çalışır: beklenen
// çıkışlar bu fonksiyonlardan hesaplanır ve istemciye gönderilmez.
//
// Kombinasyonel model girişlerden çıkışları hesaplar. Sıralı modelde her
// yükselen kenarda durum güncellenir; çıkışlar kenardan sonra, yeni durum
// ve o anki girişlerle okunur.

import { bitler, cikislar, girisler, kontrolZamani, type KodBilgisi, type RaporSatiri, type Vektor } from "../shared/kod.ts";

type Degerler = Record<string, number>;
export type Rastgele = () => number; // [0, 1)

interface Ortak {
  // Verilmezse girişler port genişliğine göre rastgele seçilir
  uret?: (r: Rastgele, adet: number) => Vektor[];
}

export type Model =
  | (Ortak & { tur: "komb"; f: (g: Degerler) => Degerler })
  | (Ortak & { tur: "sirali"; bas: () => unknown; adim: (s: any, g: Degerler) => unknown; cikis: (s: any, g: Degerler) => Degerler });

const maske = (n: number) => 2 ** n - 1;
const bit = (v: number, i: number) => Math.floor(v / 2 ** i) % 2;
const sec = (r: Rastgele, n: number) => Math.floor(r() * n);

// Yalnızca başta ve ortada reset: sayıcıların bir turu tamamlanabilsin
function ikiReset(adet: number, rst = "rst"): Vektor[] {
  return Array.from({ length: adet }, (_, i) => ({ [rst]: i === 0 || i === adet >> 1 ? 1 : 0 }));
}

// Sıralı devrelerde ilk vektör reset, ortada bir reset ve arada bir rastgele reset
function resetli(adet: number, r: Rastgele, digerleri: (r: Rastgele) => Degerler, rst = "rst"): Vektor[] {
  const orta = adet >> 1;
  return Array.from({ length: adet }, (_, i) => ({
    ...digerleri(r),
    [rst]: i === 0 || i === orta || (i > 4 && Math.abs(i - orta) > 2 && r() < 0.05) ? 1 : 0,
  }));
}

export const MODELLER: Record<string, Model> = {
  "k-yarim-toplayici": {
    tur: "komb",
    f: ({ a, b }) => ({ s: a ^ b, c: a & b }),
  },
  "k-tam-toplayici": {
    tur: "komb",
    f: ({ a, b, cin }) => ({ s: a ^ b ^ cin, cout: (a + b + cin) >> 1 }),
  },
  "k-karsilastirici": {
    tur: "komb",
    f: ({ a, b }) => ({ eq: +(a === b), gt: +(a > b), lt: +(a < b) }),
    // Eşitlik rastgele girişlerde nadir çıktığı için ayrıca eklenir
    uret: (r, adet) =>
      Array.from({ length: adet }, (_, i) => {
        const a = sec(r, 16);
        return { a, b: i % 4 === 0 ? a : sec(r, 16) };
      }),
  },
  "k-mux4": {
    tur: "komb",
    f: ({ d, sel }) => ({ y: bit(d, sel) }),
  },
  "k-oncelik": {
    tur: "komb",
    f: ({ r }) => {
      for (let i = 3; i >= 0; i--) if (bit(r, i)) return { y: i, v: 1 };
      return { y: 0, v: 0 };
    },
  },
  "k-birler": {
    tur: "komb",
    f: ({ x }) => ({ n: [...bitler(x, 8)].filter((c) => c === "1").length }),
    uret: (r, adet) => [0, 255, ...Array.from({ length: adet - 2 }, () => sec(r, 256))].map((x) => ({ x })),
  },
  "k-sayac": {
    tur: "sirali",
    bas: () => 0,
    adim: (q: number, { rst, en }) => (rst ? 0 : en ? (q + 1) & maske(4) : q),
    cikis: (q: number) => ({ q }),
    // Sayacın 15'ten 0'a dönüşü görülsün diye en çoğunlukla 1
    uret: (r, adet) => resetli(adet, r, (r) => ({ en: r() < 0.8 ? 1 : 0 })),
  },
  "k-kenar": {
    tur: "sirali",
    bas: () => ({ once: 0, p: 0 }),
    adim: (s: { once: number }, { rst, d }) => (rst ? { once: 0, p: 0 } : { once: d, p: +(d === 1 && s.once === 0) }),
    cikis: (s: { p: number }) => ({ p: s.p }),
    uret: (r, adet) => {
      // Uzun ve kısa darbeler karışık
      let d = 0;
      return resetli(adet, r, (r) => ({ d: (d = r() < 0.35 ? 1 - d : d) }));
    },
  },
  "k-dizi101": {
    tur: "sirali",
    bas: () => ({ kay: 0, say: 0 }),
    adim: (s: { kay: number; say: number }, { rst, x }) =>
      rst ? { kay: 0, say: 0 } : { kay: ((s.kay << 1) | x) & 7, say: Math.min(s.say + 1, 3) },
    cikis: (s: { kay: number; say: number }) => ({ z: +(s.say === 3 && s.kay === 0b101) }),
    uret: (r, adet) => {
      const v = resetli(adet, r, (r) => ({ x: r() < 0.5 ? 1 : 0 }));
      // Ortadaki reset "10" ile "1" arasına düşer: reset geçmişi silmezse burada yanlış bir "101" görülür
      const orta = adet >> 1;
      v[orta - 2].x = 1;
      v[orta - 1].x = 0;
      v[orta].x = 1;
      v[orta + 1].x = 1;
      return v;
    },
  },
  "k-tek-cift": {
    tur: "komb",
    f: ({ x }) => ({ tek: x & 1, cift: 1 - (x & 1) }),
  },
  "k-isaretli-min": {
    tur: "komb",
    f: ({ a, b }) => {
      const isaretli = (v: number) => (v >= 8 ? v - 16 : v);
      return { y: isaretli(a) < isaretli(b) ? a : b };
    },
    // İşaretleri farklı çiftler sık gelsin: işaretsiz karşılaştırma burada yanılır
    uret: (r, adet) =>
      Array.from({ length: adet }, (_, i) => {
        const a = sec(r, 16);
        const b = i % 3 === 0 ? (a ^ 8) & 15 : sec(r, 16);
        return { a, b: i % 7 === 0 ? a : b };
      }),
  },
  "k-mod12": {
    tur: "sirali",
    bas: () => 0,
    adim: (q: number, { rst }) => (rst ? 0 : q === 11 ? 0 : q + 1),
    cikis: (q: number) => ({ q }),
    uret: (_r, adet) => ikiReset(adet),
  },
  "k-ucgen": {
    tur: "sirali",
    bas: () => ({ v: 0, yukari: true }),
    adim: (s: { v: number; yukari: boolean }, { rst }) => {
      if (rst) return { v: 0, yukari: true };
      if (s.yukari) return { v: s.v + 1, yukari: s.v !== 8 };
      return { v: s.v - 1, yukari: s.v === 1 };
    },
    cikis: (s: { v: number }) => ({ q: s.v }),
    uret: (_r, adet) => ikiReset(adet),
  },
};

function karistir<T>(dizi: T[], r: Rastgele): T[] {
  for (let i = dizi.length - 1; i > 0; i--) {
    const j = sec(r, i + 1);
    [dizi[i], dizi[j]] = [dizi[j], dizi[i]];
  }
  return dizi;
}

export const VARSAYILAN_ADET = 40;

export function vektorUret(b: KodBilgisi, model: Model, r: Rastgele, adet = VARSAYILAN_ADET): Vektor[] {
  if (model.uret) return model.uret(r, adet);
  const g = girisler(b);
  const toplamBit = g.reduce((t, p) => t + Math.max(p.genislik, 1), 0);
  const ayir = (k: number): Vektor => {
    const v: Vektor = {};
    for (const p of g) {
      const w = Math.max(p.genislik, 1);
      v[p.ad] = k & maske(w);
      k = Math.floor(k / 2 ** w);
    }
    return v;
  };
  // Küçük giriş uzayları kombinasyonelde karışık sırayla tamamen denenir
  if (!b.saat && toplamBit <= 6) return karistir([...Array(2 ** toplamBit).keys()], r).map(ayir);
  return Array.from({ length: adet }, () => ayir(sec(r, 2 ** toplamBit)));
}

export function beklenenCikislar(b: KodBilgisi, model: Model, vektorler: Vektor[]): Degerler[] {
  if (model.tur === "komb") return vektorler.map((v) => model.f(v));
  let s = model.bas();
  return vektorler.map((v) => {
    s = model.adim(s, v);
    return model.cikis(s, v);
  });
}

// H ve L, 1 ve 0 sayılır; geri kalan her şey (U, X, Z ...) olduğu gibi karşılaştırılır
const sade = (s: string) => s.replace(/H/g, "1").replace(/L/g, "0");

export interface Degerlendirme {
  gecen: number;
  toplam: number;
  ilkHata: number | null;
  rapor: RaporSatiri[] | null;
  ipucu: string | null;
}

export function degerlendir(b: KodBilgisi, model: Model, vektorler: Vektor[], iz: string[]): Degerlendirme {
  const g = girisler(b);
  const c = cikislar(b);
  const beklenen = beklenenCikislar(b, model, vektorler);
  const metin = (d: Degerler) => c.map((p) => bitler(d[p.ad] ?? 0, p.genislik)).join(" ");
  const ayir = (s: string): Record<string, string> | null => {
    const parca = s.trim().split(/\s+/);
    return parca.length === c.length && s ? Object.fromEntries(c.map((p, i) => [p.ad, parca[i]])) : null;
  };

  const satir = (i: number): RaporSatiri => {
    const gelen = ayir(iz[i] ?? "");
    return {
      i,
      zamanNs: kontrolZamani(b, i),
      girisler: Object.fromEntries(g.map((p) => [p.ad, bitler(vektorler[i][p.ad] ?? 0, p.genislik)])),
      beklenen: ayir(metin(beklenen[i]))!,
      gelen,
      dogru: !!gelen && sade(c.map((p) => gelen[p.ad]).join(" ")) === metin(beklenen[i]),
    };
  };

  const satirlar = vektorler.map((_, i) => satir(i));
  const gecen = satirlar.filter((s) => s.dogru).length;
  const ilk = satirlar.findIndex((s) => !s.dogru);
  if (ilk < 0) return { gecen, toplam: vektorler.length, ilkHata: null, rapor: null, ipucu: null };

  // Sıralı devrelerde hatanın öncesi de önemli: son birkaç çevrim gösterilir
  const rapor = satirlar.slice(Math.max(0, ilk - (b.saat ? 4 : 0)), ilk + 1);
  return { gecen, toplam: vektorler.length, ilkHata: ilk, rapor, ipucu: ipucu(b, satirlar, ilk, iz, metin, beklenen) };
}

function ipucu(
  b: KodBilgisi, satirlar: RaporSatiri[], ilk: number, iz: string[],
  metin: (d: Degerler) => string, beklenen: Degerler[],
): string | null {
  const s = satirlar[ilk];
  if (!s.gelen) {
    return iz.length === 0
      ? "Testbench hiçbir çıkış basamadı. Benzetim başlamadan durmuş olabilir; Messages sekmesine bak."
      : `İz ${ilk}. kontrol noktasında kesildi. Benzetim erken durmuş ya da zaman sınırına takılmış olabilir.`;
  }
  const gelenMetin = (j: number) => (satirlar[j].gelen ? sade(Object.values(satirlar[j].gelen!).join(" ")) : null);
  const gelen = gelenMetin(ilk)!;
  if (/U/.test(gelen)) return "Çıkışta 'U' var: bu çıkışa hiç değer atanmıyor olabilir ya da her durumda atanmıyor.";
  if (/X/.test(gelen)) return "Çıkışta 'X' var: aynı sinyale birden fazla yerden (iki process ya da process ile eşzamanlı atama) değer veriliyor olabilir.";

  if (b.saat) {
    if (s.girisler.rst === "1") return "Hata reset sırasında. Reset etkinken çıkışın ne olması gerektiğini kontrol et.";
    // Çıkış dizisi beklenenin bir çevrim kaydırılmış hali mi? Tek bitlik çıkışlarda tesadüfe
    // yer bırakmamak için hatadan sonraki satırların hepsine bakılır.
    const kaymaUyar = (k: number) => {
      let uyan = 0;
      let farkli = 0;
      for (let j = ilk; j < satirlar.length && j < ilk + 12; j++) {
        if (j - k < 0 || j - k >= beklenen.length || satirlar[j].girisler.rst === "1") continue;
        if (gelenMetin(j) !== metin(beklenen[j - k])) return false;
        uyan++;
        if (metin(beklenen[j - k]) !== metin(beklenen[j])) farkli++;
      }
      return uyan >= 4 && farkli >= 2;
    };
    if (kaymaUyar(1)) return "Çıkış bir saat çevrimi geriden geliyor gibi: fazladan bir yazmaç (register) olabilir.";
    if (kaymaUyar(-1)) return "Çıkış bir çevrim erken değişiyor gibi: çıkış saatten bağımsız, girişten doğrudan hesaplanıyor olabilir.";
    return null;
  }
  // Kombinasyonelde çıkış daha önceki bir girişin sonucunda takılı kaldıysa duyarlılık listesi eksik olabilir
  const genislik = cikislar(b).reduce((t, p) => t + Math.max(p.genislik, 1), 0);
  if (genislik >= 3 && beklenen.slice(0, ilk).some((d) => metin(d) === gelen)) {
    return "Çıkış daha önceki bir girişe göre kalmış gibi. Process kullandıysan duyarlılık listesinde tüm girişler var mı?";
  }
  return null;
}
