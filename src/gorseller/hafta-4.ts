// Hafta 4 ders şekilleri (G-H4-04 ve sonrası). İlk üç şekil index.ts'tedir.

import { bitDizisi, cizgi, kutu, nokta, ok, satirlar, yazi, yol } from "./cizim";
import type { Gorsel } from "./tip";

const evet = (x: number, y: number) => yazi(x, y, "✓", "g-kucuk g-kalin g-renk-c");
const hayir = (x: number, y: number) => yazi(x, y, "✗", "g-kucuk g-kalin g-renk-b");

// ---- Kapsam haritası ----
function kapsamHaritasi(): string {
  let s = kutu(10, 10, 620, 250, "g-cerceve") + yazi(22, 26, "architecture rtl of ornek", "g-kod g-kucuk g-kalin", "start");
  s += kutu(24, 40, 592, 44, "g-bant-2");
  s += yazi(36, 54, "bildirim bölümü (architecture ile begin arası)", "g-mini g-soluk", "start");
  s += yazi(36, 72, "constant N : integer := 8;    signal s : std_logic;", "g-kod g-mini", "start");
  const proc = (x: number, ad: string, deg: string) => {
    let p = kutu(x, 112, 270, 118, "g-kutu") + yazi(x + 10, 126, `${ad} : process`, "g-kod g-mini g-kalin", "start");
    p += kutu(x + 10, 136, 250, 28, "g-bant-3") + yazi(x + 18, 150, `variable ${deg} : integer;`, "g-kod g-mini", "start");
    p += yazi(x + 10, 178, "begin", "g-kod g-mini", "start");
    p += yazi(x + 22, 196, `${deg} := ...;  s <= ...;`, "g-kod g-mini", "start");
    p += yazi(x + 10, 214, "end process;", "g-kod g-mini", "start");
    return p;
  };
  s += proc(30, "p1", "v1") + proc(334, "p2", "v2");
  // s her yerden görünür
  s += ok([[165, 84], [165, 110]], "g-cizgi g-renk-c-cizgi", "g-renk-c") + ok([[470, 84], [470, 110]], "g-cizgi g-renk-c-cizgi", "g-renk-c");
  s += evet(182, 98) + yazi(194, 98, "s ve N görünür", "g-mini g-renk-c", "start");
  s += evet(487, 98) + yazi(499, 98, "s ve N görünür", "g-mini g-renk-c", "start");
  // v1 p2'den görünmez
  s += cizgi([[300, 150], [334, 150]], "g-kesik") + hayir(317, 138);
  s += yazi(320, 248, "variable yalnızca kendi process'inde yaşar; değeri dışarı bir sinyal üzerinden taşınır.", "g-mini g-soluk");
  return s;
}

// ---- Sinyal takası, değişken takası ----
function takas(): string {
  const deger = (x: number, y: number, ad: string, v: string, cls = "g-dolu") => kutu(x, y, 58, 26, cls) + yazi(x + 29, y + 13, `${ad} = ${v}`, "g-kod g-mini");
  let s = yazi(160, 14, "Sinyallerle", "g-kalin") + yazi(480, 14, "Değişkenlerle", "g-kalin");
  // Sol
  s += yazi(20, 44, "önce", "g-mini g-soluk", "start") + deger(60, 31, "a", "1") + deger(126, 31, "b", "2");
  s += kutu(20, 70, 270, 44, "g-kutu") + satirlar(32, 84, ["a <= b;  -- b'nin eski değeri: 2", "b <= a;  -- a'nın eski değeri: 1"], "g-kod g-mini", "start", 16);
  s += cizgi([[20, 132], [290, 132]], "g-kesik g-renk-a-cizgi") + yazi(24, 142, "process bekler: ikisi birlikte yazılır", "g-mini g-renk-a", "start");
  s += yazi(20, 170, "sonra", "g-mini g-soluk", "start") + deger(60, 157, "a", "2", "g-dolu g-secili") + deger(126, 157, "b", "1", "g-dolu g-secili");
  s += evet(204, 170) + yazi(216, 170, "takas oldu", "g-mini g-renk-c", "start");
  // Sağ
  s += cizgi([[320, 24], [320, 236]], "g-kesik");
  s += yazi(340, 44, "önce", "g-mini g-soluk", "start") + deger(380, 31, "v1", "1") + deger(446, 31, "v2", "2");
  s += kutu(340, 70, 280, 44, "g-kutu") + satirlar(352, 84, ["v1 := v2;  -- v1 hemen 2 olur", "v2 := v1;  -- yeni v1'i okur: 2"], "g-kod g-mini", "start", 16);
  s += yazi(340, 170, "sonra", "g-mini g-soluk", "start") + deger(380, 157, "v1", "2", "g-hata") + deger(446, 157, "v2", "2", "g-hata");
  s += hayir(524, 170) + yazi(536, 170, "1 kayboldu", "g-mini g-renk-b", "start");
  s += yazi(340, 200, "Doğrusu üçüncü bir değişkenle:", "g-mini g-soluk", "start");
  s += yazi(340, 218, "t := v1;  v1 := v2;  v2 := t;", "g-kod g-mini g-renk-c", "start");
  return s;
}

// ---- Birler sayacı: sinyal ve değişken ----
function birlerSayaci(): string {
  const din = "10110001";
  let s = yazi(20, 14, 'din = "10110001" (7 downto 0): dört tane 1 var', "g-kucuk", "start");
  const kolon = [60, 130, 290, 470];
  const basliklar = ["i", "din(i)", "temp sinyal: okunan → plan", "v değişken"];
  basliklar.forEach((b, k) => (s += yazi(kolon[k]!, 40, b, "g-mini g-kalin")));
  s += cizgi([[20, 50], [620, 50]], "g-bag");
  let v = 0;
  let plan = "0";
  for (let i = 0; i < 8; i++) {
    const y = 64 + i * 22;
    const bit = din[7 - i]!;
    if (bit === "1") {
      v++;
      plan = "1";
    }
    if (bit === "1") s += kutu(20, y - 11, 600, 22, "g-bolge-a");
    s += yazi(kolon[0]!, y, String(i), "g-kod g-mini") + yazi(kolon[1]!, y, bit, "g-kod g-mini");
    s += yazi(kolon[2]!, y, bit === "1" ? "temp = 0 → temp <= 1" : "atama yok", `g-kod g-mini${bit === "1" ? "" : " g-soluk"}`);
    s += yazi(kolon[3]!, y, `v = ${v}`, "g-kod g-mini g-renk-c");
  }
  s += cizgi([[20, 236], [620, 236]], "g-bag");
  s += yazi(kolon[2]!, 252, `sonuç: temp = ${plan}`, "g-kod g-mini g-kalin g-renk-b") + yazi(kolon[3]!, 252, `sonuç: v = ${v}`, "g-kod g-mini g-kalin g-renk-c");
  s += yazi(320, 276, "Sinyal process içinde hep eski değerini (0) verir; her atama yalnızca son planı ezer.", "g-mini g-soluk");
  return s;
}

// ---- Delta adımları ----
function deltaAdimlari(): string {
  const x = (t: number) => 60 + t * 22;
  let s = ok([[40, 40], [620, 40]]) + yazi(626, 40, "t", "g-kod g-kucuk", "start");
  for (const t of [0, 10, 20]) s += cizgi([[x(t), 34], [x(t), 46]]) + yazi(x(t), 58, `${t} ns`, "g-mini g-kod");
  // 10 ns büyüteç
  s += yol(`M${x(10) - 8},48 L120,82 M${x(10) + 8},48 L600,82`, "g-kesik");
  s += kutu(40, 82, 580, 150, "g-cerceve") + yazi(52, 96, "10 ns anını büyüt: uyarıcının a <= '1' satırı 10 ns + 0'da çalışır, sonra zaman ilerlemeden üç adım", "g-mini g-soluk", "start");
  const sutun = ["10 ns + 1", "10 ns + 2", "10 ns + 3"];
  const satir: [string, string[]][] = [
    ["a", ["0 → 1", "1", "1"]],
    ["b <= not a", ["1", "1 → 0", "0"]],
    ["c <= b and en", ["1", "1", "1 → 0"]],
  ];
  sutun.forEach((ad, k) => (s += yazi(250 + k * 120, 116, ad, "g-kod g-mini g-kalin g-renk-a")));
  satir.forEach(([ad, degerler], r) => {
    const y = 140 + r * 30;
    s += yazi(180, y, ad, "g-kod g-mini", "end");
    degerler.forEach((d, k) => {
      const degisti = d.includes("→");
      s += kutu(210 + k * 120, y - 11, 80, 22, degisti ? "g-dolu g-secili" : "g-kutu") + yazi(250 + k * 120, y, d, "g-kod g-mini");
    });
  });
  s += ok([[290, 140], [330, 170]], "g-bag", "g-uc") + ok([[410, 170], [450, 200]], "g-bag", "g-uc");
  s += yazi(330, 250, "Her delta, bir önceki adımda değişen sinyallerin okuyucularını çalıştırır. Değişen kalmayınca zaman 20 ns'ye geçer.", "g-mini g-soluk");
  return s;
}

// ---- Etkileşimli delta adımlayıcı ----
export const DELTA_KOD = [
  "process",
  "  variable v, x : integer := 0;",
  "begin",
  "  v := 1;",
  "  v := v + 1;",
  "  s <= v;",
  "  s <= s + 1;",
  "  x := s;",
  "  wait for 0 ns;",
  "  x := s;",
  "  wait;",
  "end process;",
];

export interface DeltaAdim {
  // Vurgulanan satır (DELTA_KOD içindeki sıra); -1: henüz başlamadı
  satir: number;
  v: number;
  x: number;
  s: number;
  plan: string;
  delta: number;
  aciklama: string;
}

export const DELTA_ADIMLARI: DeltaAdim[] = [
  { satir: -1, v: 0, x: 0, s: 0, plan: "yok", delta: 0, aciklama: "Benzetim başlıyor: v, x ve s sıfır, bekleyen sinyal ataması yok." },
  { satir: 3, v: 1, x: 0, s: 0, plan: "yok", delta: 0, aciklama: "v := 1; değişken hemen 1 olur." },
  { satir: 4, v: 2, x: 0, s: 0, plan: "yok", delta: 0, aciklama: "v := v + 1; bir önceki satırın sonucunu (1) görür: v = 2." },
  { satir: 5, v: 2, x: 0, s: 0, plan: "s = 2", delta: 0, aciklama: "s <= v; s değişmez, yalnızca s = 2 planlanır." },
  { satir: 6, v: 2, x: 0, s: 0, plan: "s = 1", delta: 0, aciklama: "s <= s + 1; s hâlâ 0 olduğu için 0 + 1 = 1 planlanır ve önceki plan (2) ezilir." },
  { satir: 7, v: 2, x: 0, s: 0, plan: "s = 1", delta: 0, aciklama: "x := s; sinyal henüz güncellenmedi, x eski değeri (0) alır." },
  { satir: 8, v: 2, x: 0, s: 1, plan: "yok", delta: 1, aciklama: "wait for 0 ns; process bekler, bir delta geçer ve plan uygulanır: s = 1. Zaman hâlâ 0 ns." },
  { satir: 9, v: 2, x: 1, s: 1, plan: "yok", delta: 1, aciklama: "x := s; artık yeni değer okunur: x = 1." },
];

export function deltaAdimlayici(i: number): string {
  const a = DELTA_ADIMLARI[i]!;
  let s = kutu(10, 10, 300, DELTA_KOD.length * 17 + 14, "g-kutu");
  DELTA_KOD.forEach((satir, k) => {
    const y = 26 + k * 17;
    if (k === a.satir) s += kutu(12, y - 8, 296, 17, "g-bolge-a") + yazi(20, y, "▶", "g-mini g-renk-a", "start");
    s += yazi(34, y, satir, `g-kod g-mini${k === a.satir ? " g-kalin" : ""}`, "start");
  });
  const kutuDeger = (x: number, y: number, ad: string, deger: string, tur: string, vurgu: boolean) =>
    kutu(x, y, 140, 46, vurgu ? "g-dolu g-secili" : "g-dolu") + yazi(x + 70, y + 15, ad, "g-mini g-soluk") + yazi(x + 70, y + 33, deger, "g-kod g-kalin") + yazi(x + 146, y + 23, tur, "g-mini g-soluk", "start");
  const onceki = DELTA_ADIMLARI[Math.max(0, i - 1)]!;
  s += kutuDeger(340, 14, "v (değişken)", String(a.v), "hemen", i > 0 && a.v !== onceki.v);
  s += kutuDeger(340, 70, "x (değişken)", String(a.x), "hemen", i > 0 && a.x !== onceki.x);
  s += kutuDeger(340, 126, "s (sinyal)", String(a.s), "delta sonra", i > 0 && a.s !== onceki.s);
  s += kutu(340, 182, 140, 30, a.plan === "yok" ? "g-cerceve" : "g-ton1") + yazi(410, 197, `plan: ${a.plan}`, "g-kod g-mini");
  s += yazi(10, 240, `zaman: 0 ns + ${a.delta}`, "g-kod g-kucuk g-kalin g-renk-a", "start");
  s += yazi(180, 240, `adım ${i} / ${DELTA_ADIMLARI.length - 1}`, "g-mini g-soluk", "start");
  return s;
}

// ---- Geçerli ve geçersiz isimler ----
function isimKarti(): string {
  const gecerli: [string, string][] = [
    ["veri_1", "harf, rakam, tek alt çizgi"],
    ["Sayac2", "rakam başta değil"],
    ["s_ayac", "alt çizgi ortada"],
    ["SAYAC", "sayac ile aynı isim"],
  ];
  const gecersiz: [string, string][] = [
    ["1veri", "rakamla başlıyor"],
    ["veri_", "alt çizgiyle bitiyor"],
    ["veri__1", "iki alt çizgi yan yana"],
    ["entity", "ayrılmış sözcük"],
    ["veri-1", "tire kullanılamaz"],
  ];
  let s = kutu(10, 10, 300, 210, "g-kutu") + kutu(10, 10, 300, 26, "g-dolu") + yazi(160, 23, "Geçerli", "g-kucuk g-kalin g-renk-c");
  gecerli.forEach(([ad, not], i) => {
    const y = 56 + i * 32;
    s += evet(26, y) + yazi(42, y, ad, "g-kod g-kucuk", "start") + yazi(140, y, not, "g-mini g-soluk", "start");
  });
  s += kutu(330, 10, 300, 210, "g-kutu") + kutu(330, 10, 300, 26, "g-hata") + yazi(480, 23, "Geçersiz", "g-kucuk g-kalin g-renk-b");
  gecersiz.forEach(([ad, not], i) => {
    const y = 56 + i * 32;
    s += hayir(346, y) + yazi(362, y, ad, "g-kod g-kucuk", "start") + yazi(460, y, not, "g-mini g-soluk", "start");
  });
  s += yazi(320, 238, "VHDL büyük/küçük harf ayırmaz: Sayac, SAYAC ve sayac aynı isimdir.", "g-mini g-soluk");
  return s;
}

// ---- Güç merdiveni ----
function gucMerdiveni(): string {
  const basamak: [number, string, string[], string, string][] = [
    [0, "güçlü", ["'0'", "'1'", "'X'"], "kapı çıkışları; çelişirse 'X'", "g-dolu g-secili"],
    [1, "zayıf", ["'L'", "'H'", "'W'"], "çekme dirençleri; çelişirse 'W'", "g-ton1"],
    [2, "sürmez", ["'Z'"], "yüksek empedans, hattı bırakır", "g-sabit"],
  ];
  let s = yazi(20, 14, "Daha güçlü olan kazanır", "g-kucuk g-kalin", "start");
  basamak.forEach(([k, ad, degerler, not, cls]) => {
    const y = 30 + k * 56;
    const x = 20 + k * 30;
    s += kutu(x, y, 250, 44, cls) + yazi(x + 12, y + 22, ad, "g-kucuk g-kalin", "start");
    degerler.forEach((d, j) => (s += yazi(x + 110 + j * 44, y + 22, d, "g-kod g-kalin")));
    s += yazi(x + 262, y + 22, not, "g-mini", "start");
  });
  s += ok([[10, 196], [10, 40]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
  s += kutu(20, 206, 600, 44, "g-cerceve");
  s += yazi(32, 220, "Merdivenin dışında:", "g-mini g-kalin", "start");
  s += yazi(32, 238, "'U' başlangıç değeri verilmemiş (yalnızca benzetimde)    '-' önemsiz (don't care)", "g-kod g-mini", "start");
  return s;
}

// ---- std_logic çözümleme tablosu ----
const DEGERLER = ["U", "X", "0", "1", "Z", "W", "L", "H", "-"];
// Satır s1, sütun s2 (std_logic_1164'teki resolution_table)
const COZUM = ["UUUUUUUUU", "UXXXXXXXX", "UX0X0000X", "UXX11111X", "UX01ZWLHX", "UX01WWWWX", "UX01LWLWX", "UX01HWWHX", "UXXXXXXXX"];

export const cozumle = (a: string, b: string) => COZUM[DEGERLER.indexOf(a)]![DEGERLER.indexOf(b)]!;

function cozumTablosu(): string {
  const tx = 40;
  const ty = 20;
  const w = 32;
  const h = 24;
  let s = yazi(tx + 14, ty + h / 2, "s1\\s2", "g-mini g-soluk");
  DEGERLER.forEach((d, i) => {
    s += yazi(tx + w + i * w + w / 2, ty + h / 2, `'${d}'`, "g-kod g-mini g-kalin");
    s += yazi(tx + w / 2, ty + h + i * h + h / 2, `'${d}'`, "g-kod g-mini g-kalin");
    DEGERLER.forEach((_, j) => {
      const r = COZUM[i]![j]!;
      const ornek = (DEGERLER[i] === "0" && DEGERLER[j] === "1") || (DEGERLER[i] === "Z" && DEGERLER[j] === "1") || (DEGERLER[i] === "0" && DEGERLER[j] === "H") || (DEGERLER[i] === "L" && DEGERLER[j] === "H");
      const cls = ornek ? "g-dolu g-secili" : r === "X" ? "g-hata" : r === "U" ? "g-sabit" : r === "W" ? "g-ton1" : "g-kutu";
      s += kutu(tx + w + j * w, ty + h + i * h, w, h, cls) + yazi(tx + w + j * w + w / 2, ty + h + i * h + h / 2, r, `g-kod g-mini${ornek ? " g-kalin" : ""}`);
    });
  });
  const lx = 380;
  s += yazi(lx, 30, "Mavi kutular derste geçen örnekler:", "g-mini g-kalin", "start");
  s += satirlar(lx, 52, ["'0' ile '1'  →  'X'", "'Z' ile '1'  →  '1'", "'0' ile 'H'  →  '0'", "'L' ile 'H'  →  'W'"], "g-kod g-mini", "start", 18);
  s += satirlar(lx, 136, ["Tablo simetriktir: sıra önemsiz.", "'U' her şeyi 'U' yapar.", "'-' çözümlemede 'X' gibi davranır.", "'Z' karşısındakini değiştirmez."], "g-mini g-soluk", "start", 18);
  s += kutu(lx, 214, 14, 14, "g-hata") + yazi(lx + 20, 221, "çakışma 'X'", "g-mini", "start");
  s += kutu(lx + 110, 214, 14, 14, "g-ton1") + yazi(lx + 130, 221, "zayıf çakışma 'W'", "g-mini", "start");
  return s;
}

// ---- Çekme direnci ----
function cekmeDirenci(): string {
  const panel = (x0: number, baslik: string, surucu: string, hat: string, not: string) => {
    let s = yazi(x0 + 140, 16, baslik, "g-kucuk g-kalin");
    // VCC ve direnç
    s += cizgi([[x0 + 180, 34], [x0 + 220, 34]]) + yazi(x0 + 200, 26, "VCC", "g-mini g-soluk");
    s += cizgi([[x0 + 200, 34], [x0 + 200, 50]]);
    let d = `M${x0 + 200},50`;
    for (let k = 0; k < 6; k++) d += ` L${x0 + 200 + (k % 2 ? -8 : 8)},${56 + k * 8}`;
    d += ` L${x0 + 200},${104}`;
    s += yol(d, "g-cizgi") + cizgi([[x0 + 200, 104], [x0 + 200, 130]]) + yazi(x0 + 214, 78, "direnç", "g-mini g-soluk", "start");
    // Sürücü
    s += `<polygon points="${x0 + 56},110 ${x0 + 90},130 ${x0 + 56},150" class="g-kutu"/>`;
    s += yazi(x0 + 50, 130, "sürücü", "g-mini g-soluk", "end");
    s += cizgi([[x0 + 90, 130], [x0 + 260, 130]], hat === "'0'" ? "g-cizgi" : "g-yol") + nokta(x0 + 200, 130);
    s += yazi(x0 + 120, 120, surucu, "g-kod g-mini g-kalin");
    s += yazi(x0 + 230, 120, "hat", "g-mini g-soluk");
    s += kutu(x0 + 90, 156, 140, 30, "g-dolu g-secili") + yazi(x0 + 160, 171, `hat = ${hat}`, "g-kod g-kucuk g-kalin");
    s += yazi(x0 + 160, 206, not, "g-mini g-soluk");
    return s;
  };
  let s = panel(0, "Sürücü bırakırsa", "'Z'", "'H'", "direnç hattı zayıf 1'e çeker");
  s += panel(320, "Sürücü 0 verirse", "'0'", "'0'", "güçlü '0' zayıf 'H'yi yener");
  s += cizgi([[316, 20], [316, 210]], "g-kesik");
  return s;
}

// ---- Çoklu sürücü ----
function cokluSurucu(): string {
  let s = yazi(20, 14, "E : bit_vector(2 downto 0)", "g-kod g-kucuk", "start");
  s += kutu(20, 34, 180, 26, "g-sabit") + yazi(30, 47, "E <= not H;", "g-kod g-mini", "start");
  s += kutu(20, 92, 180, 26, "g-sabit") + yazi(30, 105, "E(2) <= '0';", "g-kod g-mini", "start");
  const bx = 300;
  s += bitDizisi(bx, 60, ["E(2)", "E(1)", "E(0)"], { en: 56, boy: 30, vurgu: [0], vurguCls: "g-hata" });
  s += ok([[200, 47], [bx + 28, 47], [bx + 28, 58]], "g-cizgi") + ok([[200, 47], [bx + 84, 47], [bx + 84, 58]], "g-cizgi") + ok([[200, 47], [bx + 140, 47], [bx + 140, 58]], "g-cizgi");
  s += ok([[200, 105], [bx + 14, 105], [bx + 14, 92]], "g-cizgi g-renk-b-cizgi", "g-renk-b");
  s += yazi(bx + 190, 66, "E(2)'nin iki sürücüsü var:", "g-mini g-renk-b", "start") + yazi(bx + 190, 82, "multiple driven hatası", "g-mini g-renk-b g-kalin", "start");
  s += cizgi([[20, 136], [620, 136]], "g-kesik");
  s += yazi(20, 156, "Çözüm: tek atamada birleştir", "g-kucuk g-kalin g-renk-c", "start");
  s += kutu(20, 170, 280, 26, "g-sabit") + yazi(30, 183, "E <= '0' & not H(1 downto 0);", "g-kod g-mini", "start");
  s += bitDizisi(bx + 30, 168, ["'0'", "not H(1)", "not H(0)"], { en: 70, boy: 30 });
  s += ok([[300, 183], [bx + 28, 183]]);
  s += yazi(320, 222, "Mimarideki her eşzamanlı atama ayrı bir sürücüdür. bit ve std_ulogic çözümlenmez.", "g-mini g-soluk");
  return s;
}

// ---- Dönüşüm haritası ----
function donusumHaritasi(): string {
  const dugum = (x: number, y: number, ad: string, cls = "g-dolu") => kutu(x - 80, y - 18, 160, 36, cls) + yazi(x, y, ad, "g-kod g-kucuk g-kalin");
  const SLV: [number, number] = [320, 34];
  const U: [number, number] = [120, 140];
  const S: [number, number] = [520, 140];
  const I: [number, number] = [320, 246];
  let s = dugum(...SLV, "std_logic_vector") + dugum(...U, "unsigned") + dugum(...S, "signed") + dugum(...I, "integer", "g-ton1");
  // slv <-> unsigned
  s += ok([[240, 40], [140, 40], [140, 120]], "g-cizgi g-renk-a-cizgi", "g-renk-a") + yazi(148, 84, "unsigned(v)", "g-kod g-mini g-renk-a", "start");
  s += ok([[100, 122], [100, 28], [238, 28]], "g-cizgi") + yazi(170, 16, "std_logic_vector(u)", "g-kod g-mini");
  // slv <-> signed
  s += ok([[400, 40], [500, 40], [500, 120]], "g-cizgi g-renk-a-cizgi", "g-renk-a") + yazi(492, 84, "signed(v)", "g-kod g-mini g-renk-a", "end");
  s += ok([[540, 122], [540, 28], [402, 28]], "g-cizgi") + yazi(470, 16, "std_logic_vector(s)", "g-kod g-mini");
  // unsigned <-> integer
  s += ok([[140, 158], [140, 240], [238, 240]], "g-cizgi g-renk-c-cizgi", "g-renk-c") + yazi(150, 224, "to_integer(u)", "g-kod g-mini g-renk-c", "start");
  s += ok([[240, 256], [100, 256], [100, 160]], "g-cizgi") + yazi(30, 272, "to_unsigned(n, genişlik)", "g-kod g-mini", "start");
  // signed <-> integer
  s += ok([[500, 158], [500, 240], [402, 240]], "g-cizgi g-renk-c-cizgi", "g-renk-c") + yazi(490, 224, "to_integer(s)", "g-kod g-mini g-renk-c", "end");
  s += ok([[400, 256], [540, 256], [540, 160]], "g-cizgi") + yazi(610, 272, "to_signed(n, genişlik)", "g-kod g-mini", "end");
  // slv -> integer doğrudan yok
  s += cizgi([[320, 54], [320, 226]], "g-kesik") + hayir(320, 120) + satirlar(332, 140, ["doğrudan yok:", "önce unsigned", "ya da signed"], "g-mini g-renk-b", "start", 14);
  return s;
}

// ---- İkiye tümleyen ----
function ikiyeTumleyen(): string {
  const satir = (y: number, etiket: string, bitler: string, not: string, vurgu: number[] = []) =>
    yazi(150, y + 13, etiket, "g-mini", "end") + bitDizisi(160, y, bitler, { en: 30, boy: 26, vurgu }) + yazi(290, y + 13, not, "g-mini g-soluk", "start");
  let s = yazi(20, 14, "to_signed(-3, 4)", "g-kod g-kucuk g-kalin", "start");
  s += satir(30, "3", "0011", "önce mutlak değer");
  s += satir(70, "bitleri tersle", "1100", "her bit tersine döner");
  s += satir(110, "1 ekle", "1101", '= -3, yani "1101"', [0, 1, 2, 3]);
  s += ok([[175, 58], [175, 68]]) + ok([[175, 98], [175, 108]]);
  s += cizgi([[20, 150], [620, 150]], "g-kesik");
  s += yazi(20, 168, 'Geri okuma: "1010" signed kaç?', "g-kucuk g-kalin", "start");
  s += bitDizisi(160, 184, "1010", { en: 30, boy: 26, vurgu: [0], vurguCls: "g-hata" });
  s += yazi(150, 197, "en soldaki 1: negatif", "g-mini", "end");
  s += yazi(290, 197, "tersle 0101, 1 ekle 0110 = 6, yani -6", "g-mini g-soluk", "start");
  s += yazi(290, 222, "ya da ağırlıklarla: -8 + 2 = -6", "g-mini g-soluk", "start");
  return s;
}

// ---- resize ----
function resizeSekli(): string {
  const satir = (y: number, baslik: string, giris: string, cikis: string, eklenen: string, not: string) => {
    let s = yazi(20, y - 14, baslik, "g-kod g-kucuk g-kalin", "start");
    s += bitDizisi(300 + 4 * 28, y, giris, { en: 28, boy: 26 });
    s += yazi(290, y + 13, "giriş", "g-mini g-soluk", "end");
    s += bitDizisi(300, y + 40, cikis, { en: 28, boy: 26, vurgu: [0, 1, 2, 3], vurguCls: eklenen === "işaret" ? "g-dolu g-secili" : "g-ton1" });
    s += yazi(290, y + 53, "sonuç", "g-mini g-soluk", "end");
    s += yazi(300 + 2 * 28, y + 80, not, `g-mini ${eklenen === "işaret" ? "g-renk-a" : "g-soluk"}`);
    return s;
  };
  let s = satir(28, "resize(signed'(\"1010\"), 8)", "1010", "11111010", "işaret", "işaret biti (1) çoğaltılır: -6 kalır");
  s += satir(146, "resize(unsigned'(\"1010\"), 8)", "1010", "00001010", "sıfır", "sola sıfır eklenir: 10 kalır");
  return s;
}

// ---- Tabanlar: X"333" = O"1463" ----
function tabanGruplama(): string {
  const bitler = "001100110011";
  const en = 34;
  const bx = (640 - bitler.length * en) / 2;
  let s = yazi(bx - 10, 20, 'X"333"', "g-kod g-kucuk g-kalin g-renk-a", "end");
  for (let k = 0; k < 3; k++) {
    const x = bx + k * 4 * en;
    s += yol(`M${x + 2},34 V28 H${x + 4 * en - 2} V34`, "g-cizgi g-renk-a-cizgi") + yazi(x + 2 * en, 20, "3", "g-kod g-kalin g-renk-a");
  }
  s += bitDizisi(bx, 42, bitler, { en, boy: 30 });
  const sekizlik = ["1", "4", "6", "3"];
  for (let k = 0; k < 4; k++) {
    const x = bx + k * 3 * en;
    s += yol(`M${x + 2},78 V84 H${x + 3 * en - 2} V78`, "g-cizgi g-renk-c-cizgi") + yazi(x + 1.5 * en, 98, sekizlik[k]!, "g-kod g-kalin g-renk-c");
  }
  s += yazi(bx - 10, 98, 'O"1463"', "g-kod g-kucuk g-kalin g-renk-c", "end");
  s += yazi(320, 126, "Aynı 12 bit: onaltılıkta dörderli, sekizlikte üçerli gruplanır.", "g-mini g-soluk");
  s += kutu(20, 142, 600, 56, "g-sabit");
  s += yazi(32, 158, 'B"1010_0101"   X"A5" (8 bit)   O"17" = "001111"', "g-kod g-mini", "start");
  s += yazi(32, 180, "16#FF# = 255   2#1010# = 10   tamsayılar da tabanla yazılır", "g-kod g-mini", "start");
  return s;
}

// ---- Diziler: dizinin dizisi ve 2 boyutlu dizi ----
function diziler(): string {
  let s = yazi(20, 14, "type bellek_t is array (0 to 15) of", "g-kod g-mini", "start") + yazi(20, 28, "  std_logic_vector(7 downto 0);", "g-kod g-mini", "start");
  const en = 24;
  for (let r = 0; r < 5; r++) {
    const y = 46 + r * 30;
    if (r === 4) {
      s += yazi(70 + 4 * en, y + 10, "...  ram(15)", "g-mini g-soluk");
      continue;
    }
    const kelime = ["00010010", "10100000", "11110000", "01011011"][r]!;
    s += yazi(60, y + 12, `ram(${r})`, "g-kod g-mini", "end");
    s += bitDizisi(70, y, kelime, { en, boy: 24, vurgu: r === 3 ? [7] : [], cls: r === 3 ? "g-dolu" : "g-kutu" });
  }
  s += ok([[70 + 8 * en + 30, 140], [70 + 8 * en + 4, 140]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
  s += satirlar(70 + 8 * en + 34, 132, ["ram(3)(0)", "4. kelimenin", "en düşük biti"], "g-mini g-renk-a", "start", 14);
  s += yazi(150, 220, "dizinin dizisi: iki ayrı parantez", "g-mini g-soluk");
  s += cizgi([[340, 10], [340, 236]], "g-kesik");
  // 2 boyutlu
  s += yazi(360, 14, "type matris_t is array", "g-kod g-mini", "start") + yazi(360, 28, "  (0 to 3, 0 to 3) of std_logic;", "g-kod g-mini", "start");
  const mx = 400;
  for (let c = 0; c < 4; c++) s += yazi(mx + c * 46 + 23, 52, String(c), "g-mini g-soluk");
  for (let r = 0; r < 4; r++) {
    s += yazi(mx - 10, 74 + r * 32, String(r), "g-mini g-soluk", "end");
    for (let c = 0; c < 4; c++) {
      const sec = r === 2 && c === 1;
      s += kutu(mx + c * 46, 60 + r * 32, 46, 30, sec ? "g-dolu g-secili" : "g-kutu") + yazi(mx + c * 46 + 23, 75 + r * 32, sec ? "w(2,1)" : "", "g-kod g-mini");
    }
  }
  s += yazi(490, 200, "satır 2, sütun 1: w(2, 1)", "g-mini g-renk-a");
  s += yazi(490, 220, "gerçek 2B dizi: tek parantez, virgül", "g-mini g-soluk");
  return s;
}

// ---- Dilim ve birleştirme ----
function dilimler(): string {
  const en = 32;
  let s = yazi(20, 14, 'a : std_logic_vector(7 downto 0) := "10110010";', "g-kod g-kucuk", "start");
  s += bitDizisi(120, 30, "10110010", { en, boy: 28, indisler: [7, 6, 5, 4, 3, 2, 1, 0], vurgu: [0, 1, 2, 3] });
  s += yol(`M122,68 V74 H${120 + 4 * en - 2} V68`, "g-cizgi g-renk-a-cizgi") + yazi(120 + 2 * en, 90, 'a(7 downto 4) = "1011"', "g-kod g-mini g-renk-a");
  s += hayir(420, 44) + yazi(434, 44, "a(4 to 7): hata", "g-kod g-mini g-renk-b", "start");
  s += yazi(434, 62, "dilimin yönü bildirimle aynı olmalı", "g-mini g-soluk", "start");
  s += cizgi([[20, 106], [620, 106]], "g-kesik");
  s += yazi(20, 124, 'b : std_logic_vector(3 downto 0) := "1100";   b(1 downto 0) & b(3 downto 2)', "g-kod g-mini", "start");
  s += bitDizisi(120, 140, "1100", { en, boy: 28, indisler: [3, 2, 1, 0], vurgu: [2, 3], vurguCls: "g-ton1" });
  s += bitDizisi(400, 140, "0011", { en, boy: 28, vurgu: [0, 1], vurguCls: "g-ton1" });
  s += ok([[200, 186], [200, 200], [430, 200], [430, 172]], "g-cizgi g-renk-c-cizgi", "g-renk-c");
  s += ok([[136, 186], [136, 212], [496, 212], [496, 172]], "g-bag", "g-uc");
  s += yazi(560, 154, '= "0011"', "g-kod g-kucuk g-kalin", "start");
  s += yazi(320, 234, "Alt iki bit sola, üst iki bit sağa yazılır.", "g-mini g-soluk");
  return s;
}

// ---- Aralık ve bit sayısı ----
function aralikBitleri(): string {
  const satir: [string, number, string][] = [
    ["integer range 0 to 15", 4, "16 değer"],
    ["integer range 0 to 100", 7, "6 bit en çok 63"],
    ["integer range 0 to 255", 8, "256 değer"],
    ["integer range -8 to 7", 4, "işaretli, 4 bit"],
    ["integer range -63 to 63", 7, "6 değer + 1 işaret"],
    ["integer (aralıksız)", 32, "aralık verilmezse"],
  ];
  let s = "";
  satir.forEach(([ad, bit, not], i) => {
    const y = 20 + i * 36;
    s += yazi(200, y + 12, ad, "g-kod g-mini", "end");
    const goster = Math.min(bit, 12);
    for (let k = 0; k < goster; k++) s += kutu(212 + k * 18, y + 2, 16, 20, i >= 3 && i < 5 && k === 0 ? "g-dolu g-secili" : "g-dolu");
    if (bit > 12) s += yazi(212 + 12 * 18 + 8, y + 12, "...", "g-mini", "start");
    s += yazi(212 + 13 * 18 + 16, y + 12, `${bit} bit`, "g-kod g-mini g-kalin", "start");
    s += yazi(212 + 13 * 18 + 70, y + 12, not, "g-mini g-soluk", "start");
  });
  s += kutu(212, 238, 16, 14, "g-dolu g-secili") + yazi(234, 245, "işaret biti", "g-mini", "start");
  return s;
}

export const HAFTA_4_GORSELLERI: Gorsel[] = [
  {
    kod: "G-H4-04",
    baslik: "Kim neyi görür: kapsam haritası",
    aciklama:
      "Bir architecture'ın içinde üstte bildirim bölümü: constant N ve signal s. Altta iki process, p1 ve p2; her birinin içinde kendi değişkeni (v1, v2). İki process de s ve N'yi görür. p1'in v1 değişkeni p2'den görünmez.",
    en: 640,
    boy: 266,
    icerik: kapsamHaritasi(),
  },
  {
    kod: "G-H4-05",
    baslik: "Takas: sinyalle olur, değişkenle olmaz",
    aciklama:
      "Solda a = 1, b = 2 sinyalleri; a <= b; b <= a; iki satır da eski değerleri okur, process beklerken birlikte yazılır: a = 2, b = 1. Sağda v1 = 1, v2 = 2 değişkenleri; v1 := v2; v1'i hemen 2 yapar, v2 := v1; yeni değeri okur: ikisi de 2. Doğrusu üçüncü bir değişkenle: t := v1; v1 := v2; v2 := t;",
    en: 640,
    boy: 232,
    icerik: takas(),
  },
  {
    kod: "G-H4-06",
    baslik: "Birler sayacı: sinyal ve değişken",
    aciklama:
      "din = 10110001 için i = 0'dan 7'ye bir tablo. din(i) = 1 olan satırlarda sinyal sürümü her seferinde temp'in eski değerini (0) okur ve temp <= 1 planlar; sonuç temp = 1. Değişken sürümü 1, 1, 1, 1, 2, 3, 3, 4 diye artar; sonuç v = 4.",
    en: 640,
    boy: 288,
    icerik: birlerSayaci(),
  },
  {
    kod: "G-H4-07",
    baslik: "Delta döngüsü: zaman ilerlemeden atılan adımlar",
    aciklama:
      "Zaman ekseninde 0, 10 ve 20 ns. 10 ns anı büyütülmüş: uyarıcı a <= '1' satırını 10 ns + 0'da çalıştırır; 10 ns + 1'de a 0'dan 1'e geçer; 10 ns + 2'de b <= not a sonucu b 1'den 0'a geçer; 10 ns + 3'te c <= b and en sonucu c 1'den 0'a geçer. Değişen sinyal kalmayınca zaman 20 ns'ye ilerler.",
    en: 640,
    boy: 262,
    icerik: deltaAdimlari(),
  },
  {
    kod: "G-H4-08",
    baslik: "Delta adımlayıcı",
    aciklama:
      "Solda bir process'in kodu, sağda v, x değişkenleri, s sinyali ve bekleyen atama. Başlangıçta hepsi 0. Etkileşimli sürümde satır satır ilerlenir: v hemen 1 ve 2 olur; s <= v ve s <= s + 1 yalnızca plan yapar (son plan s = 1); x := s eski değeri 0 okur; wait for 0 ns ile bir delta geçer ve s = 1 olur; ikinci x := s 1 okur.",
    en: 640,
    boy: 252,
    icerik: deltaAdimlayici(0),
    etkilesim: "delta",
  },
  {
    kod: "G-H4-09",
    baslik: "Geçerli ve geçersiz isimler",
    aciklama:
      "Geçerli: veri_1, Sayac2, s_ayac, SAYAC (sayac ile aynı isim). Geçersiz: 1veri (rakamla başlıyor), veri_ (alt çizgiyle bitiyor), veri__1 (iki alt çizgi yan yana), entity (ayrılmış sözcük), veri-1 (tire kullanılamaz).",
    en: 640,
    boy: 248,
    icerik: isimKarti(),
  },
  {
    kod: "G-H4-10",
    baslik: "std_logic güç merdiveni",
    aciklama:
      "Üç basamak. En üstte güçlü değerler '0', '1' ve çelişkide 'X'. Ortada zayıf değerler 'L', 'H' ve çelişkide 'W'; çekme dirençlerini modeller. En altta 'Z': hattı sürmez. Daha güçlü olan kazanır. Merdivenin dışında 'U' (başlangıç değeri yok, yalnızca benzetim) ve '-' (önemsiz).",
    en: 640,
    boy: 258,
    icerik: gucMerdiveni(),
  },
  {
    kod: "G-H4-11",
    baslik: "std_logic çözümleme tablosunun tamamı",
    aciklama:
      "Dokuz değer için 9'a 9 tablo; satır bir sürücünün, sütun diğerinin değeri. 'U' her şeyi 'U' yapar. '0' ile '1' 'X', 'Z' ile '1' '1', '0' ile 'H' '0', 'L' ile 'H' 'W' verir. 'Z' karşısındakini değiştirmez. '-' çözümlemede 'X' gibi davranır. Tablo simetriktir.",
    en: 640,
    boy: 266,
    icerik: cozumTablosu(),
  },
  {
    kod: "G-H4-12",
    baslik: "Çekme direnci: 'H' ve güçlü '0'",
    aciklama:
      "Bir hat bir dirençle VCC'ye bağlı, ayrıca bir sürücüye. Solda sürücü 'Z' bırakıyor; direnç hattı zayıf 1'e çeker: hat = 'H'. Sağda sürücü '0' veriyor; güçlü '0' zayıf 'H'yi yener: hat = '0'.",
    en: 640,
    boy: 216,
    icerik: cekmeDirenci(),
  },
  {
    kod: "G-H4-13",
    baslik: "Çoklu sürücü: iki atama, bir bit",
    aciklama:
      "E bit_vector(2 downto 0). E <= not H; E'nin üç bitini sürer; E(2) <= '0'; E(2)'yi ikinci kez sürer. E(2) iki sürücülü olduğu için multiple driven hatası. Çözüm tek atama: E <= '0' & not H(1 downto 0);",
    en: 640,
    boy: 232,
    icerik: cokluSurucu(),
  },
  {
    kod: "G-H4-14",
    baslik: "Tip dönüşüm haritası",
    aciklama:
      "Dört tip: üstte std_logic_vector, solda unsigned, sağda signed, altta integer. std_logic_vector'den unsigned(v) ve signed(v) ile sayıya, std_logic_vector(...) ile geri. unsigned ve signed'dan to_integer ile tamsayıya; tamsayıdan to_unsigned(n, genişlik) ve to_signed(n, genişlik) ile vektöre. std_logic_vector ile integer arasında doğrudan dönüşüm yok.",
    en: 640,
    boy: 284,
    icerik: donusumHaritasi(),
  },
  {
    kod: "G-H4-15",
    baslik: "İkiye tümleyen: tersle ve 1 ekle",
    aciklama:
      "to_signed(-3, 4): 3 = 0011, bitleri tersle 1100, 1 ekle 1101. Geri okuma: 1010'un en soldaki biti 1 olduğu için negatif; tersle 0101, 1 ekle 0110 = 6, yani -6. Ağırlıklarla da -8 + 2 = -6.",
    en: 640,
    boy: 232,
    icerik: ikiyeTumleyen(),
  },
  {
    kod: "G-H4-16",
    baslik: "resize: işaret ve sıfır genişletme",
    aciklama:
      "resize(signed'(\"1010\"), 8) = 11111010: işaret biti 1 dört kez çoğaltılır, değer -6 kalır. resize(unsigned'(\"1010\"), 8) = 00001010: sola dört sıfır eklenir, değer 10 kalır.",
    en: 640,
    boy: 240,
    icerik: resizeSekli(),
  },
  {
    kod: "G-H4-17",
    baslik: "Aynı bitler, iki taban",
    aciklama:
      "12 bit 001100110011. Dörderli gruplanınca 0011 0011 0011 = X\"333\". Üçerli gruplanınca 001 100 110 011 = O\"1463\". Altta örnekler: B\"1010_0101\", X\"A5\" 8 bittir, O\"17\" = 001111, 16#FF# = 255, 2#1010# = 10.",
    en: 640,
    boy: 210,
    icerik: tabanGruplama(),
  },
  {
    kod: "G-H4-18",
    baslik: "Dizinin dizisi ve 2 boyutlu dizi",
    aciklama:
      "Solda bellek_t: 16 kelimelik, her kelime 8 bit. ram(0)'dan ram(3)'e kelimeler görünüyor; ram(3)(0), 4. kelimenin en sağdaki biti, vurgulu. Sağda 4'e 4 matris_t; satır 2, sütun 1'deki eleman w(2, 1) vurgulu.",
    en: 640,
    boy: 238,
    icerik: diziler(),
  },
  {
    kod: "G-H4-19",
    baslik: "Dilimler ve birleştirme",
    aciklama:
      "a = 10110010, 7 downto 0. Soldaki dört kutu a(7 downto 4) = 1011. a(4 to 7) hatadır, çünkü dilimin yönü bildirimle aynı olmalı. Altta b = 1100; b(1 downto 0) = 00 sola, b(3 downto 2) = 11 sağa yazılır: 0011.",
    en: 640,
    boy: 246,
    icerik: dilimler(),
  },
  {
    kod: "G-H4-20",
    baslik: "Aralıktan bit sayısına",
    aciklama:
      "Her satırda bir aralık ve gereken bit kutuları: 0 to 15 4 bit, 0 to 100 7 bit, 0 to 255 8 bit, -8 to 7 4 bit (biri işaret), -63 to 63 7 bit (biri işaret), aralıksız integer 32 bit.",
    en: 640,
    boy: 260,
    icerik: aralikBitleri(),
  },
];
