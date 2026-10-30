// Hafta 6 ders şekilleri: saat darbesi, kenar tetikleme, sayıcılar, saat
// bölme, üçgen dalga ve uygulamalar.

import { bitDizisi, cizgi, dalga, kutu, nokta, ok, satirlar, yazi, type Nokta } from "./cizim";
import type { Gorsel } from "./tip";

const evet = (x: number, y: number) => yazi(x, y, "✓", "g-kucuk g-kalin g-renk-c");
const hayir = (x: number, y: number) => yazi(x, y, "✗", "g-kucuk g-kalin g-renk-b");
const daire = (x: number, y: number, r: number, cls = "g-kutu") => `<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`;
// İki uçlu ok: ölçü çizgisi
const olcu = (x1: number, x2: number, y: number, cls = "g-cizgi") => ok([[(x1 + x2) / 2, y], [x1, y]], cls) + ok([[(x1 + x2) / 2, y], [x2, y]], cls);

// ---- Saat darbesinin parçaları ----
function saatAnatomisi(): string {
  const ust = 64;
  const alt = 112;
  const yari = 80;
  const x0 = 40;
  const p: Nokta[] = [[x0, alt]];
  const yukselen: number[] = [];
  const dusen: number[] = [];
  for (let k = 0; k < 3; k++) {
    const r = x0 + 60 + k * 2 * yari;
    yukselen.push(r);
    dusen.push(r + yari);
    p.push([r, alt], [r, ust], [r + yari, ust], [r + yari, alt]);
  }
  p.push([x0 + 60 + 6 * yari, alt]);
  let s = cizgi(p, "g-seri-a");
  for (const x of yukselen) s += ok([[x - 10, alt - 4], [x - 2, ust + 10]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
  for (const x of dusen) s += ok([[x + 2, ust + 4], [x + 10, alt - 10]], "g-cizgi g-renk-b-cizgi", "g-renk-b");
  s += yazi(yukselen[0]!, ust - 26, "yükselen kenar (0 → 1)", "g-mini g-kalin g-renk-a");
  s += yazi(dusen[0]! - 6, alt + 18, "düşen kenar (1 → 0)", "g-mini g-kalin g-renk-b", "end");
  // Periyot: iki yükselen kenar arası
  s += olcu(yukselen[1]!, yukselen[2]!, 30) + yazi((yukselen[1]! + yukselen[2]!) / 2, 18, "T: periyot", "g-mini g-kalin");
  s += cizgi([[yukselen[1]!, 34], [yukselen[1]!, ust]], "g-kesik") + cizgi([[yukselen[2]!, 34], [yukselen[2]!, ust]], "g-kesik");
  // Yüksek ve alçak süre
  s += olcu(yukselen[1]!, dusen[1]!, alt + 20) + yazi((yukselen[1]! + dusen[1]!) / 2, alt + 34, "yüksek süre", "g-mini");
  s += olcu(dusen[1]!, yukselen[2]!, alt + 20) + yazi((dusen[1]! + yukselen[2]!) / 2, alt + 34, "alçak süre", "g-mini");
  s += yazi(x0 - 8, ust, "1", "g-kod g-mini g-soluk", "end") + yazi(x0 - 8, alt, "0", "g-kod g-mini g-soluk", "end");
  s += kutu(20, 170, 600, 52, "g-dolu");
  s += yazi(32, 186, "f = 1 / T      görev oranı = yüksek süre / T  (bu saatte %50)", "g-kod g-mini g-kalin", "start");
  s += yazi(32, 206, "T = 10 ns ↔ f = 100 MHz      T = 20 ns ↔ f = 50 MHz      T = 1 µs ↔ f = 1 MHz", "g-kod g-mini", "start");
  return s;
}

// ---- Hangi geçiş hangi koşulu tetikler ----
function kenarTablosu(): string {
  const sutun = [["clk'event and", "clk = '1'"], ["rising_edge(clk)"], ["clk'event and", "clk = '0'"], ["falling_edge(clk)"]];
  // [geçiş, dört sütunun sonucu]
  const satir: [string, boolean[]][] = [
    ["'0' → '1'", [true, true, false, false]],
    ["'1' → '0'", [false, false, true, true]],
    ["'X' → '1'", [true, false, false, false]],
    ["'U' → '1'", [true, false, false, false]],
    ["'0' → 'H'", [false, true, false, false]],
    ["'H' → 'L'", [false, false, false, true]],
  ];
  const x0 = 110;
  const w = 128;
  const h = 26;
  const y0 = 46;
  let s = kutu(20, y0 - 36, 600, 36, "g-ton0");
  s += yazi(65, y0 - 18, "geçiş", "g-mini g-kalin");
  sutun.forEach((c, j) => (s += satirlar(x0 + j * w + w / 2, y0 - (c.length === 2 ? 26 : 18), c, "g-kod g-mini g-kalin", "middle", 15)));
  satir.forEach(([g, sonuc], i) => {
    const y = y0 + i * h;
    s += kutu(20, y, 600, h, i >= 2 ? "g-sabit" : "g-kutu");
    s += yazi(65, y + h / 2, g, "g-kod g-mini");
    sonuc.forEach((v, j) => (s += v ? evet(x0 + j * w + w / 2, y + h / 2) : hayir(x0 + j * w + w / 2, y + h / 2)));
  });
  const yAlt = y0 + satir.length * h + 18;
  s += satirlar(20, yAlt, [
    "rising_edge, önceki değer '0' ya da 'L' ve yeni değer '1' ya da 'H' iken doğrudur;",
    "'X' ya da 'U'dan gelen geçişi kenar saymaz. 'U' → '1' benzetimin başında, ilk değeri",
    "verilmemiş bir saatte görülür: 'event yazımı bunu da kenar sayar.",
  ], "g-mini g-soluk", "start", 16);
  return s;
}

// ---- Kenar seçimi: aynı girişler, iki farklı kenar ----
// Her saat yarım periyodu iki dilimdir; girişler kenarların arasında değişir.
export type KenarSecimi = "yukselen" | "dusen" | "ikisi";
const DILIM = 24;
const SAAT = Array.from({ length: DILIM }, (_, k) => (Math.floor(k / 2) % 2 ? "1" : "0")).join("");
export const KENAR_GIRIS = {
  sec: "000000000111111111100000",
  g1: "111111100001111111111111",
  g2: "000000000001100000000000",
};

// Kenarların dilim sıraları ve çıkışın dalga dizgisi
export function kenarCikisi(tur: "yukselen" | "dusen"): { kenarlar: number[]; dalga: string } {
  const kenarlar: number[] = [];
  for (let k = 1; k < DILIM; k++) if (SAAT[k] !== SAAT[k - 1] && SAAT[k] === (tur === "yukselen" ? "1" : "0")) kenarlar.push(k);
  let y = "x";
  let d = "";
  for (let k = 0; k < DILIM; k++) {
    if (kenarlar.includes(k)) y = KENAR_GIRIS.sec[k] === "0" ? KENAR_GIRIS.g1[k]! : KENAR_GIRIS.g2[k]!;
    d += y;
  }
  return { kenarlar, dalga: d };
}

export function kenarOyunu(secim: KenarSecimi): string {
  const etiketEn = 90;
  const adim = 22;
  const x0 = 20 + etiketEn;
  const y = 44;
  const yk = kenarCikisi("yukselen");
  const dk = kenarCikisi("dusen");
  const satir = [
    { ad: "clk", dalga: SAAT },
    { ad: "sec", dalga: KENAR_GIRIS.sec },
    { ad: "giris_1", dalga: KENAR_GIRIS.g1 },
    { ad: "giris_2", dalga: KENAR_GIRIS.g2 },
  ];
  if (secim !== "dusen") satir.push({ ad: "y (yükselen)", dalga: yk.dalga, cls: "g-dalga g-renk-a-cizgi" } as (typeof satir)[0]);
  if (secim !== "yukselen") satir.push({ ad: "y (düşen)", dalga: dk.dalga, cls: "g-dalga g-renk-c-cizgi" } as (typeof satir)[0]);
  const isaret = secim === "dusen" ? dk.kenarlar : yk.kenarlar;
  let s = kutu(x0 + 7 * adim, y + 2 * 34 - 6, 4 * adim, 32, "g-bolge-b") + kutu(x0 + 11 * adim, y + 3 * 34 - 6, 2 * adim, 32, "g-bolge-b");
  s += dalga(20, y, satir, { etiketEn, adim, isaretler: isaret.map((t) => ({ t })) });
  if (secim === "ikisi") for (const t of dk.kenarlar) s += cizgi([[x0 + t * adim, y - 4], [x0 + t * adim, y + 22]], "g-cizgi g-renk-c-cizgi");
  const yAlt = y + satir.length * 34 + 8;
  const not =
    secim === "yukselen"
      ? "Yükselen kenarlar (kesik çizgiler) giris_1'deki düşüşü de giris_2'deki kısa darbeyi de kaçırır."
      : secim === "dusen"
        ? "Düşen kenarlar iki kısa olaya da denk gelir: y önce 0'a iner, sonra bir periyot boyunca 1 olur."
        : "İki çıkış aynı girişleri yarım periyot arayla örnekler; kısa olayları yalnızca düşen kenar yakalar.";
  s += yazi(320, yAlt, not, "g-mini g-kalin");
  s += yazi(320, yAlt + 18, "sec = '0' iken y <= giris_1, sec = '1' iken y <= giris_2; değer yalnızca seçilen kenarda alınır.", "g-mini g-soluk");
  return s;
}

// ---- Sayıcının RTL şeması ----
function sayacRtl(): string {
  let s = yazi(40, 40, "clk", "g-kod g-kucuk", "end") + cizgi([[46, 40], [300, 40], [300, 112], [330, 112]]);
  // Toplayıcı
  s += daire(200, 120, 26, "g-dolu") + yazi(200, 120, "+", "g-kalin");
  s += yazi(200, 164, "toplayıcı", "g-mini g-soluk");
  s += yazi(120, 108, "1", "g-kod g-kucuk", "end") + ok([[126, 108], [176, 112]]);
  s += ok([[230, 120], [330, 120]]) + yazi(280, 132, "sayi + 1", "g-kod g-mini");
  // Kayıtçı
  s += kutu(330, 92, 90, 64, "g-dolu g-secili");
  s += yazi(342, 112, "▷ C", "g-mini", "start") + yazi(342, 132, "D", "g-mini", "start") + yazi(408, 122, "Q", "g-mini", "end");
  s += yazi(375, 172, "4 flip-flop (kayıtçı)", "g-mini g-soluk");
  s += ok([[420, 124], [540, 124]], "g-cizgi") + yazi(546, 124, "count", "g-kod g-kucuk", "start");
  // Geri besleme
  s += nokta(470, 124) + ok([[470, 124], [470, 196], [140, 196], [140, 132], [176, 128]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
  s += yazi(300, 210, "geri besleme: toplayıcı kayıtçının çıkışını okur", "g-mini g-renk-a");
  s += kutu(20, 228, 600, 42, "g-dolu");
  s += satirlar(32, 241, ["sayi <= sayi + 1;   →  toplayıcı + her kenarda yükleyen kayıtçı", "count <= std_logic_vector(sayi);   →  yalnızca bir tel, donanım eklemez"], "g-kod g-mini", "start", 16);
  return s;
}

// ---- 4 bitlik sayıcı dijital ve analog ----
function testereDisi(): string {
  const w = 26;
  const x0 = 60;
  const n = 20;
  let s = yazi(x0 - 8, 24, "sayi", "g-kod g-mini g-soluk", "end");
  for (let k = 0; k < n; k++) s += kutu(x0 + k * w + 1, 12, w - 2, 24, k % 16 === 15 ? "g-uyari" : "g-dolu") + yazi(x0 + k * w + w / 2, 24, String(k % 16), "g-kod g-mini");
  const alt = 196;
  const olcek = 8.5;
  const p: Nokta[] = [];
  for (let k = 0; k < n; k++) {
    const v = alt - (k % 16) * olcek;
    if (k > 0) p.push([x0 + k * w, alt - ((k - 1) % 16) * olcek]);
    p.push([x0 + k * w, v]);
  }
  p.push([x0 + n * w, alt - ((n - 1) % 16) * olcek]);
  s += cizgi([[x0, alt], [x0 + n * w, alt]], "g-bag") + cizgi([[x0, alt], [x0, alt - 15 * olcek - 6]], "g-bag");
  s += yazi(x0 - 6, alt, "0", "g-mini g-soluk", "end") + yazi(x0 - 6, alt - 15 * olcek, "15", "g-mini g-soluk", "end");
  s += cizgi(p, "g-seri-a");
  s += olcu(x0, x0 + 16 * w, 58) + yazi(x0 + 8 * w, 48, "periyot = 16 · T", "g-mini g-kalin");
  s += yazi(x0 + 16 * w - 8, alt - 40, "15'ten 0'a", "g-mini g-renk-b", "end") + yazi(x0 + 16 * w - 8, alt - 26, "düşer", "g-mini g-renk-b", "end");
  s += yazi(320, 222, "Dalga ekranındaki ∿ düğmesi aynı değerleri basamaklı bir çizgi olarak gösterir: testere dişi.", "g-mini g-soluk");
  return s;
}

// ---- Mod-10 sayıcı halkası ----
function modOn(): string {
  const cx = 160;
  const cy = 130;
  const r = 92;
  const konum = (k: number): Nokta => [cx + r * Math.sin((2 * Math.PI * k) / 10), cy - r * Math.cos((2 * Math.PI * k) / 10)];
  let s = "";
  for (let k = 0; k < 10; k++) {
    const [ax, ay] = konum(k);
    const [bx, by] = konum((k + 1) % 10);
    const d = Math.hypot(bx - ax, by - ay);
    const ux = (bx - ax) / d;
    const uy = (by - ay) / d;
    const son = k === 9;
    s += ok([[ax + ux * 19, ay + uy * 19], [bx - ux * 19, by - uy * 19]], son ? "g-yol" : "g-cizgi", son ? "g-renk-a" : "g-uc");
  }
  for (let k = 0; k < 10; k++) {
    const [x, y] = konum(k);
    s += daire(x, y, 17, k === 9 ? "g-dolu g-secili" : k === 0 ? "g-ton1" : "g-kutu") + yazi(x, y, String(k), "g-kod g-kucuk g-kalin");
  }
  s += yazi(cx, cy - 8, "mod-10", "g-kalin") + yazi(cx, cy + 10, "10 durum", "g-mini g-soluk");
  s += yazi(cx - 52, cy - r - 4, "9 → 0", "g-mini g-kalin g-renk-a", "end");
  const kod = [
    "if rising_edge(clk) then",
    "  if sayi = 9 then",
    "    sayi <= (others => '0');",
    "  else",
    "    sayi <= sayi + 1;",
    "  end if;",
    "end if;",
  ];
  s += kutu(330, 30, 290, 132, "g-dolu") + kutu(332, 53, 286, 36, "g-bant-2");
  s += satirlar(342, 44, kod, "g-kod g-mini", "start", 18);
  s += yazi(330, 186, "0..9 için 4 bit gerekir (2³ = 8 yetmez).", "g-mini", "start");
  s += yazi(330, 206, "sayi = 10 yazılırsa 0..10 sayılır: 11 durum.", "g-mini g-renk-b", "start");
  s += yazi(330, 226, "Karşılaştırma son değerle yapılır: N - 1.", "g-mini g-soluk", "start");
  return s;
}

// ---- Saat bölme: mod-4 sayıcı, tik ve yavaş saat ----
function saatBolme(): string {
  const n = 24;
  const clk = Array.from({ length: n }, (_, k) => (k % 2 ? "1" : "0")).join("");
  let sayi = "";
  let tik = "";
  let yavas = "";
  const veri: string[] = [];
  let v = 0;
  let yv = 0;
  for (let k = 0; k < n; k++) {
    if (k === 0) {
      sayi += "=";
      veri.push("0");
    } else if (clk[k] === "1") {
      // yükselen kenar: tik o anda 1 ise yavas döner
      if (v === 3) yv = 1 - yv;
      v = (v + 1) % 4;
      sayi += "=";
      veri.push(String(v));
    } else sayi += ".";
    tik += v === 3 ? "1" : "0";
    yavas += String(yv);
  }
  const etiketEn = 80;
  const adim = 22;
  const x0 = 20 + etiketEn;
  const kenarlar = [...clk].flatMap((c, k) => (k > 0 && c === "1" ? [k] : []));
  let s = dalga(20, 30, [
    { ad: "clk", dalga: clk },
    { ad: "sayi", dalga: sayi, veri },
    { ad: "tik", dalga: tik, cls: "g-dalga g-renk-a-cizgi" },
    { ad: "yavas", dalga: yavas, cls: "g-dalga g-renk-c-cizgi" },
  ], { etiketEn, adim, isaretler: kenarlar.map((t) => ({ t })) });
  s += olcu(x0 + 5 * adim, x0 + 13 * adim, 176) + yazi(x0 + 9 * adim, 190, "tik: 4 saat periyodu", "g-mini g-renk-a");
  s += olcu(x0 + 7 * adim, x0 + 23 * adim, 206) + yazi(x0 + 15 * adim, 220, "yavas: 8 saat periyodu", "g-mini g-renk-c");
  s += yazi(320, 246, "tik <= '1' when sayi = 3 else '0';   yavas, tik = '1' iken her kenarda tersine döner.", "g-kod g-mini");
  return s;
}

// ---- Üçgen dalga: periyot hesabı (etkileşimli) ----
export const UCGEN_TEPELER = [4, 8, 16, 32];
export const UCGEN_SAATLER = [10, 20, 40];

// Yukarı sayarken TEPE - 1'de, aşağı sayarken 1'de yön değişir: 0, 1, ..., TEPE, ..., 1, 0, ...
export function ucgenDizisi(tepe: number, adet: number): number[] {
  const d: number[] = [];
  let v = 0;
  let yukari = true;
  for (let k = 0; k < adet; k++) {
    d.push(v);
    if (yukari) {
      if (v === tepe - 1) yukari = false;
      v++;
    } else {
      if (v === 1) yukari = true;
      v--;
    }
  }
  return d;
}

const bitSayisi = (enCok: number) => Math.max(1, Math.ceil(Math.log2(enCok + 1)));
const sureYaz = (ns: number) => (ns >= 1000 ? `${(ns / 1000).toLocaleString("tr-TR")} µs` : `${ns} ns`);

export function ucgenOyunu(tepe: number, tclk: number): string {
  const adet = 4 * tepe + 1;
  const d = ucgenDizisi(tepe, adet);
  const x0 = 50;
  const en = 560;
  const w = en / (adet - 1);
  const alt = 170;
  const boy = 120;
  const y = (v: number) => alt - (v / tepe) * boy;
  const p: Nokta[] = [];
  d.forEach((v, k) => {
    if (k > 0) p.push([x0 + k * w, y(d[k - 1]!)]);
    p.push([x0 + k * w, y(v)]);
  });
  let s = cizgi([[x0, alt], [x0 + en, alt]], "g-bag") + cizgi([[x0, alt], [x0, y(tepe) - 8]], "g-bag");
  s += yazi(x0 - 6, alt, "0", "g-mini g-soluk", "end") + yazi(x0 - 6, y(tepe), String(tepe), "g-mini g-kalin", "end");
  s += cizgi(p, "g-seri-a");
  s += cizgi([[x0 + 2 * tepe * w, alt + 4], [x0 + 2 * tepe * w, y(tepe) - 10]], "g-kesik");
  s += olcu(x0, x0 + 2 * tepe * w, 30) + yazi(x0 + tepe * w, 18, `periyot = 2 · ${tepe} saat`, "g-mini g-kalin");
  const periyot = 2 * tepe * tclk;
  s += kutu(20, 196, 600, 50, "g-dolu");
  s += yazi(32, 212, `saat T = ${tclk} ns, tepe = ${tepe}:  üçgen periyodu = 2 · ${tepe} · ${tclk} ns = ${sureYaz(periyot)}`, "g-kod g-mini g-kalin", "start");
  s += yazi(32, 232, `0..${tepe} için ${bitSayisi(tepe)} bit gerekir; her basamak ${tclk} ns sürer.`, "g-mini", "start");
  return s;
}

// ---- Yön değişimi: doğru ve yanlış karşılaştırma ----
function ucgenDonus(): string {
  const dogru = ucgenDizisi(4, 15);
  // Yanlış: sayi = TEPE ve sayi = 0 ile denetlenir, 3 bitlik unsigned sarar
  const yanlis: number[] = [];
  let v = 0;
  let yukari = true;
  for (let k = 0; k < 15; k++) {
    yanlis.push(v);
    if (yukari) {
      if (v === 4) yukari = false;
      v = (v + 1) % 8;
    } else {
      if (v === 0) yukari = true;
      v = (v + 7) % 8;
    }
  }
  const ciz = (d: number[], ust: number, baslik: string, kod: string, cls: string) => {
    const x0 = 60;
    const w = 36;
    const olcek = 10;
    const alt = ust + 84;
    let s = yazi(20, ust - 14, baslik, "g-kucuk g-kalin", "start") + yazi(620, ust - 14, kod, "g-kod g-mini", "end");
    const p: Nokta[] = [];
    d.forEach((v, k) => {
      if (k > 0) p.push([x0 + k * w, alt - d[k - 1]! * olcek]);
      p.push([x0 + k * w, alt - v * olcek]);
      s += yazi(x0 + k * w + w / 2, alt + 12, String(v), `g-kod g-mini${v > 4 ? " g-kalin g-renk-b" : ""}`);
    });
    p.push([x0 + d.length * w, alt - d[d.length - 1]! * olcek]);
    s += cizgi([[x0, alt], [x0 + d.length * w, alt]], "g-bag") + cizgi(p, cls);
    return s;
  };
  let s = ciz(dogru, 30, "Doğru: yön TEPE - 1'de ve 1'de değişir", "if sayi = TEPE - 1 ...  if sayi = 1 ...", "g-seri-a");
  s += ciz(yanlis, 160, "Yanlış: yön TEPE'de ve 0'da değişir", "if sayi = TEPE ...  if sayi = 0 ...", "g-seri-b");
  s += yazi(320, 278, "yukari sinyali bir kenar geç güncellenir: tepe 5'e taşar, 0'dan sonra 0 - 1 = 7 sıçraması olur (3 bit, TEPE = 4).", "g-mini g-soluk");
  return s;
}

// ---- Tek mi çift mi: yalnızca en düşük bitin ağırlığı tektir ----
function tekCift(): string {
  let s = yazi(320, 20, 'x = "0110"  (3 downto 0)', "g-kod g-kucuk g-kalin");
  const agirlik = ["8", "4", "2", "1"];
  const x0 = 200;
  s += bitDizisi(x0, 44, "0110", { en: 60, boy: 34, vurgu: [3], vurguCls: "g-dolu g-secili", cls: "g-dolu" });
  agirlik.forEach((a, i) => {
    s += yazi(x0 + i * 60 + 30, 96, `x(${3 - i})`, "g-kod g-mini g-soluk");
    s += yazi(x0 + i * 60 + 30, 114, `ağırlık ${a}`, `g-mini${i === 3 ? " g-kalin g-renk-a" : ""}`);
  });
  s += yazi(320, 142, "0·8 + 1·4 + 1·2 + 0·1 = 6: çift", "g-kod g-mini");
  s += yazi(320, 170, "8, 4 ve 2 çift sayılardır; toplamı tek yapabilecek tek ağırlık x(0)'ınkidir (1).", "g-mini");
  s += kutu(150, 186, 340, 30, "g-bant-2") + yazi(320, 201, "tek <= x(0);    cift <= not x(0);", "g-kod g-mini g-kalin");
  return s;
}

// ---- İşaretli ve işaretsiz sıralama ----
function isaretliSira(): string {
  const w = 36;
  const x0 = 32;
  const kodlar = Array.from({ length: 16 }, (_, k) => k.toString(2).padStart(4, "0"));
  const signed = (k: number) => (k >= 8 ? k - 16 : k);
  let s = yazi(20, 20, "unsigned: küçükten büyüğe", "g-kucuk g-kalin", "start");
  kodlar.forEach((k, i) => {
    const vurgu = k === "0101" ? "g-dolu g-secili" : k === "1100" ? "g-uyari" : "g-dolu";
    s += kutu(x0 + i * w + 1, 32, w - 2, 22, vurgu) + yazi(x0 + i * w + w / 2, 43, String(i), "g-kod g-mini g-kalin");
    s += yazi(x0 + i * w + w / 2, 64, k, "g-kod g-mini g-soluk");
  });
  s += yazi(20, 96, "signed: küçükten büyüğe (en soldaki bit işarettir)", "g-kucuk g-kalin", "start");
  const sirali = [...kodlar.keys()].sort((a, b) => signed(a) - signed(b));
  sirali.forEach((k, i) => {
    const kod = kodlar[k]!;
    const vurgu = kod === "0101" ? "g-dolu g-secili" : kod === "1100" ? "g-uyari" : "g-dolu";
    s += kutu(x0 + i * w + 1, 108, w - 2, 22, vurgu) + yazi(x0 + i * w + w / 2, 119, String(signed(k)), "g-kod g-mini g-kalin");
    s += yazi(x0 + i * w + w / 2, 140, kod, "g-kod g-mini g-soluk");
  });
  s += kutu(20, 160, 600, 50, "g-dolu");
  s += yazi(32, 176, 'a = "0101", b = "1100":  unsigned 5 < 12, küçük olan a.   signed 5 > -4, küçük olan b.', "g-kod g-mini", "start");
  s += yazi(32, 196, "Aynı bitler, farklı yorum: karşılaştırmadan önce signed(...) ya da unsigned(...) seç.", "g-mini g-kalin", "start");
  return s;
}

// ---- Ödül kodu akışı ----
function odulAkisi(): string {
  let s = kutu(20, 20, 150, 44, "g-dolu") + satirlar(95, 34, ["süre, sıra", "(integer)"], "g-kod g-mini", "middle", 16);
  // Karar
  s += `<polygon points="250,20 320,46 250,72 180,46" class="g-kutu"/>` + yazi(250, 46, "süre < 10 ?", "g-kod g-mini g-kalin");
  s += ok([[170, 42], [180, 46]]);
  s += ok([[320, 46], [400, 46]]) + yazi(360, 36, "evet", "g-mini g-renk-c");
  s += kutu(400, 30, 120, 32, "g-dolu g-secili") + yazi(460, 46, '"111"  rekor', "g-kod g-mini g-kalin");
  s += ok([[250, 72], [250, 100]]) + yazi(258, 86, "hayır", "g-mini g-renk-b", "start");
  s += kutu(180, 100, 140, 28, "g-ton1") + yazi(250, 114, "case sıra is", "g-kod g-mini g-kalin");
  const dallar: [string, string][] = [
    ["when 1", '"001"'],
    ["when 2", '"010"'],
    ["when 3", '"011"'],
    ["when 4", '"100"'],
    ["when 5", '"101"'],
    ["when others", '"110"'],
  ];
  dallar.forEach(([w, k], i) => {
    const x = 30 + i * 98;
    s += cizgi([[250, 128], [x + 44, 150]], "g-bag");
    s += kutu(x, 150, 88, 48, i === 5 ? "g-sabit" : "g-dolu") + yazi(x + 44, 164, w, "g-kod g-mini") + yazi(x + 44, 184, k, "g-kod g-mini g-kalin");
  });
  s += kutu(20, 212, 600, 44, "g-uyari");
  s += yazi(32, 226, 'Bit dizgisinde yalnızca std_logic karakterleri olur: "002" yazılamaz, 2. sıranın kodu "010"dur.', "g-mini g-kalin", "start");
  s += yazi(32, 244, '"10 saniyenin altında" < 10 demektir; <= 10 yazılırsa tam 10 saniye de rekor sayılır.', "g-mini", "start");
  return s;
}

export const HAFTA_6_GORSELLERI: Gorsel[] = [
  {
    kod: "G-H6-01",
    baslik: "Saat darbesinin parçaları",
    aciklama:
      "Üç periyotluk bir kare dalga. Her yükselen kenar (0'dan 1'e) ve düşen kenar (1'den 0'a) okla işaretli. İki yükselen kenar arası T, periyottur; bir periyot yüksek ve alçak süreden oluşur. f = 1 / T; görev oranı yüksek sürenin T'ye oranıdır, bu saatte %50. Örnekler: 10 ns ↔ 100 MHz, 20 ns ↔ 50 MHz, 1 µs ↔ 1 MHz.",
    en: 640,
    boy: 232,
    icerik: saatAnatomisi(),
  },
  {
    kod: "G-H6-02",
    baslik: "Hangi geçiş hangi kenar koşulunu sağlar",
    aciklama:
      "Satırlarda geçişler, sütunlarda dört yazım: clk'event and clk = '1', rising_edge(clk), clk'event and clk = '0', falling_edge(clk). 0 → 1 iki yükselen yazımı da sağlar; 1 → 0 iki düşen yazımı. X → 1 ve U → 1 yalnızca 'event and clk = '1' yazımını sağlar; rising_edge bunları kenar saymaz. 0 → H yalnızca rising_edge'i, H → L yalnızca falling_edge'i sağlar.",
    en: 640,
    boy: 276,
    icerik: kenarTablosu(),
  },
  {
    kod: "G-H6-03",
    baslik: "Aynı girişler, yükselen ya da düşen kenar",
    aciklama:
      "clk, sec, giris_1 ve giris_2 dalgaları; girişler kenarların arasında değişir. sec = 0 iken y giris_1'i, sec = 1 iken giris_2'yi alır. Yükselen kenarla örneklenen y, giris_1'deki kısa düşüşü ve giris_2'deki kısa darbeyi kaçırır; düşen kenarla örneklenen y ikisini de yakalar. Etkileşimli sürümde kenar türü seçilir ya da iki çıkış birlikte gösterilir.",
    en: 640,
    boy: 270,
    icerik: kenarOyunu("ikisi"),
    etkilesim: "kenar",
  },
  {
    kod: "G-H6-04",
    baslik: "Sayıcı bir toplayıcı ve bir kayıtçıdır",
    aciklama:
      "clk kayıtçının saat girişine bağlı. Toplayıcı 1 ile kayıtçının çıkışını toplar ve sonucu kayıtçının D girişine verir; kayıtçının çıkışı hem count çıkışına hem de geri besleme ile toplayıcıya gider. sayi <= sayi + 1 toplayıcıyı ve her kenarda yükleyen kayıtçıyı, count <= std_logic_vector(sayi) yalnızca bir teli tanımlar.",
    en: 640,
    boy: 280,
    icerik: sayacRtl(),
  },
  {
    kod: "G-H6-05",
    baslik: "4 bitlik sayıcının testere dişi",
    aciklama:
      "Üstte 20 saat boyunca sayının değerleri: 0'dan 15'e, sonra yine 0'dan. Altta aynı değerlerin analog gösterimi: her kenarda bir basamak çıkan, 15'ten 0'a düşen bir testere dişi. Periyot 16 saat periyodudur.",
    en: 640,
    boy: 232,
    icerik: testereDisi(),
  },
  {
    kod: "G-H6-06",
    baslik: "Mod-10 sayıcı: 0'dan 9'a ve yeniden 0",
    aciklama:
      "Bir halka üzerinde 0'dan 9'a on durum; her kenarda bir sonrakine geçilir, 9'dan 0'a dönen ok vurgulu. Yanda kod: if sayi = 9 then sayi sıfırlanır, else sayi + 1. 0..9 için 4 bit gerekir. sayi = 10 yazılsaydı 0..10 sayılır, 11 durum olurdu; karşılaştırma N - 1 ile yapılır.",
    en: 640,
    boy: 244,
    icerik: modOn(),
  },
  {
    kod: "G-H6-07",
    baslik: "Saat bölme: mod-4 sayıcı, tik ve yavaş saat",
    aciklama:
      "clk, mod-4 sayının değerleri (0, 1, 2, 3 tekrar eder), tik ve yavas. tik sayi = 3 iken bir saat periyodu boyunca 1 olur, yani her 4 saatte bir gelir. yavas, tik = 1 iken her kenarda tersine döner; periyodu 8 saattir. tik bir enable olarak kullanılır; yeni bir saat üretilmez.",
    en: 640,
    boy: 258,
    icerik: saatBolme(),
  },
  {
    kod: "G-H6-08",
    baslik: "Üçgen dalganın periyodu",
    aciklama:
      "Yukarı ve aşağı sayan bir sayının basamaklı grafiği: 0'dan tepe değerine çıkar, yeniden 0'a iner. Bir periyot 2 · tepe saat sürer; üçgenin periyodu 2 · tepe · T'dir. Varsayılan çizimde tepe 8 ve T = 10 ns: periyot 160 ns, 0..8 için 4 bit. Etkileşimli sürümde tepe değeri ve saat periyodu seçilir.",
    en: 640,
    boy: 252,
    icerik: ucgenOyunu(8, 10),
    etkilesim: "ucgen",
  },
  {
    kod: "G-H6-09",
    baslik: "Yön değişimi bir kenar erken denetlenir",
    aciklama:
      "Üstte doğru üçgen, tepe 4: 0, 1, 2, 3, 4, 3, 2, 1, 0... Yön, yukarı sayarken 3'te, aşağı sayarken 1'de değiştirilir; yukari sinyali bir kenar geç güncellendiği için dönüş tam 4'te ve 0'da olur. Altta yön 4'te ve 0'da değiştirilen sürüm: sayı 5'e taşar, 0'dan sonra 3 bitlik unsigned 0 - 1 = 7'ye sıçrar.",
    en: 640,
    boy: 290,
    icerik: ucgenDonus(),
  },
  {
    kod: "G-H6-10",
    baslik: "Tek ya da çift: yalnızca en düşük bit",
    aciklama:
      'x = "0110" bitleri ve ağırlıkları 8, 4, 2, 1. 0·8 + 1·4 + 1·2 + 0·1 = 6, çift. 8, 4 ve 2 çift olduğu için sayıyı tek yapabilecek tek ağırlık x(0)\'ınkidir: tek <= x(0); cift <= not x(0);',
    en: 640,
    boy: 226,
    icerik: tekCift(),
  },
  {
    kod: "G-H6-11",
    baslik: "Aynı 4 bit: unsigned ve signed sıralama",
    aciklama:
      'Üstte 16 kod unsigned olarak 0\'dan 15\'e sıralı. Altta aynı kodlar signed olarak -8\'den 7\'ye sıralı; 1 ile başlayanlar negatiftir ve en başa geçer. a = "0101" ve b = "1100" işaretli: unsigned 5 < 12, küçük a; signed 5 > -4, küçük b.',
    en: 640,
    boy: 220,
    icerik: isaretliSira(),
  },
  {
    kod: "G-H6-12",
    baslik: "Ödül kodu: if ve case",
    aciklama:
      'süre ve sıra tamsayı girişleri. süre < 10 ise kod "111" (rekor). Değilse case sıra is: 1 için "001", 2 için "010", 3 için "011", 4 için "100", 5 için "101", others için "110". Bit dizgisinde yalnızca std_logic karakterleri olduğu için "002" yazılamaz. "10 saniyenin altında" < 10 demektir; <= 10 tam 10 saniyeyi de rekor sayar.',
    en: 640,
    boy: 264,
    icerik: odulAkisi(),
  },
];
