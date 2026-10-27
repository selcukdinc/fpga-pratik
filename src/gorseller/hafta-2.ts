// Hafta 2 ders şekilleri (G-H2-06 ve sonrası). İlk beş şekil index.ts'tedir.

import { cizgi, dalga, kutu, mux, nokta, ok, ozelVeya, satirlar, ve, veya, yazi, yol } from "./cizim";
import type { Gorsel } from "./tip";

// Bağlantı işareti: programlanmış bağlantı ×, sabit bağlantı nokta
const carpi = (x: number, y: number, cls = "g-renk-a-cizgi g-cizgi") =>
  cizgi([[x - 4, y - 4], [x + 4, y + 4]], cls) + cizgi([[x - 4, y + 4], [x + 4, y - 4]], cls);

// Örnek fonksiyonlar: F1 = AB + B'C, F2 = AB + BC'
// F1'in doğruluk tablosu A, B, C sırasıyla 000'dan 111'e
const F1 = [0, 1, 0, 0, 0, 1, 1, 1];

function dogrulukTablosu(): string {
  const x = 20;
  const y0 = 46;
  const h = 26;
  const kolon = [x + 16, x + 46, x + 76, x + 118];
  let s = "";
  ["A", "B", "C", "F1"].forEach((b, i) => (s += yazi(kolon[i]!, 26, b, "g-kalin g-kod")));
  s += cizgi([[x, 38], [x + 260, 38]], "g-bag") + cizgi([[x + 96, 14], [x + 96, y0 + 8 * h]], "g-bag");
  // B'C satırları (001, 101) mavi, AB satırları (110, 111) yeşil
  const grup = (r: number) => (r === 1 || r === 5 ? "a" : r >= 6 ? "c" : "");
  const minterim = ["A'B'C'", "A'B'C", "A'BC'", "A'BC", "AB'C'", "AB'C", "ABC'", "ABC"];
  for (let r = 0; r < 8; r++) {
    const y = y0 + r * h;
    const g = grup(r);
    if (g) s += kutu(x, y, 260, h, g === "a" ? "g-bolge-a" : "g-bolge-b");
    const bit = [(r >> 2) & 1, (r >> 1) & 1, r & 1, F1[r]!];
    bit.forEach((b, i) => (s += yazi(kolon[i]!, y + h / 2, String(b), i === 3 && b ? "g-kod g-kalin" : "g-kod")));
    if (F1[r]) s += yazi(x + 150, y + h / 2, minterim[r]!, `g-kod g-kucuk ${g === "a" ? "g-renk-a" : "g-renk-c"}`, "start");
  }
  // Sağ taraf: iki yazım
  const sx = 310;
  s += yazi(sx, 52, "1 olan satırların hepsi (minterimler):", "g-kucuk g-soluk", "start");
  s += yazi(sx, 76, "F1 = A'B'C + AB'C + ABC' + ABC", "g-kod g-kucuk", "start");
  s += yazi(sx, 96, "PROM bu dört terimi doğrudan kullanır", "g-mini g-soluk", "start");
  s += ok([[sx + 140, 116], [sx + 140, 146]]) + yazi(sx + 150, 131, "komşu satırları birleştir", "g-mini g-soluk", "start");
  s += yazi(sx, 170, "Sadeleşmiş çarpımların toplamı:", "g-kucuk g-soluk", "start");
  s += yazi(sx, 196, "F1 =", "g-kod", "start") + yazi(sx + 40, 196, "B'C", "g-kod g-kalin g-renk-a", "start");
  s += yazi(sx + 72, 196, "+", "g-kod", "start") + yazi(sx + 90, 196, "AB", "g-kod g-kalin g-renk-c", "start");
  s += satirlar(sx, 224, ["B'C: 001 ve 101 satırları (A ne olursa olsun)", "AB: 110 ve 111 satırları (C ne olursa olsun)", "PAL ve PLA bu iki terimi kurar"], "g-mini g-soluk", "start", 16);
  return s;
}

// VE-VEYA dizisi şekli. Sütunlar: A, A', B, B', C, C'. Her satır bir çarpım terimi.
interface DiziSatiri {
  ad: string;
  // Terime bağlı sütunlar (0..5)
  sutun: number[];
  // Terimin bağlı olduğu çıkışlar (0: F1, 1: F2)
  cikis: number[];
}

function diziSekli(satirlar_: DiziSatiri[], veProg: boolean, veyaProg: boolean, notlar: string[]): string {
  const sx = (k: number) => 60 + k * 34;
  const rh = 24;
  const y0 = 66;
  const yAlt = y0 + (satirlar_.length - 1) * rh + 16;
  const orX = [370, 420];
  let s = "";
  // Giriş sütunları
  ["A", "A'", "B", "B'", "C", "C'"].forEach((ad, k) => {
    s += yazi(sx(k), 24, ad, "g-kod g-kucuk");
    s += cizgi([[sx(k), 36], [sx(k), yAlt]], "g-bag");
  });
  s += kutu(40, 44, 246 - 40 + 18, yAlt - 44 + 4, veProg ? "g-cerceve" : "g-cerceve");
  s += yazi(150, yAlt + 18, veProg ? "VE dizisi: programlanır" : "VE dizisi: sabit", `g-mini ${veProg ? "g-renk-a" : "g-soluk"}`);
  s += yazi(395, yAlt + 18 + 52, veyaProg ? "VEYA dizisi: programlanır" : "VEYA dizisi: sabit", `g-mini ${veyaProg ? "g-renk-a" : "g-soluk"}`);
  // VEYA sütunları ve kapıları (aşağı bakan)
  orX.forEach((x, i) => {
    s += cizgi([[x, 50], [x, yAlt + 6]], "g-bag");
    const gy = yAlt + 6;
    s += `<g transform="rotate(90 ${x} ${gy + 12})">${veya(x - 18, gy, 36, 24)}</g>`;
    s += ok([[x, gy + 30], [x, gy + 44]]) + yazi(x + 14, gy + 40, i ? "F2" : "F1", "g-kod g-kalin", "start");
  });
  satirlar_.forEach((r, i) => {
    const y = y0 + i * rh;
    s += cizgi([[44, y], [262, y]], "g-cizgi");
    s += ve(262, y - 9, 28, 18);
    s += cizgi([[290, y], [440, y]], "g-cizgi");
    s += yazi(300, y - 8, r.ad, "g-mini g-kod", "start");
    for (const k of r.sutun) s += veProg ? carpi(sx(k), y) : nokta(sx(k), y);
    for (const c of r.cikis) s += veyaProg ? carpi(orX[c]!, y) : nokta(orX[c]!, y);
  });
  // Lejant ve notlar
  const lx = 466;
  s += carpi(lx + 6, 30) + yazi(lx + 18, 30, "programlanmış bağlantı", "g-mini", "start");
  s += nokta(lx + 6, 50) + yazi(lx + 18, 50, "üretimde sabit bağlantı", "g-mini", "start");
  s += satirlar(lx, 80, notlar, "g-kucuk", "start", 18);
  return s;
}

const MINTERIMLER: DiziSatiri[] = ["A'B'C'", "A'B'C", "A'BC'", "A'BC", "AB'C'", "AB'C", "ABC'", "ABC"].map((ad, m) => ({
  ad,
  sutun: [(m >> 2) & 1 ? 0 : 1, (m >> 1) & 1 ? 2 : 3, m & 1 ? 4 : 5],
  cikis: [F1[m] ? [0] : [], [2, 6, 7].includes(m) ? [1] : []].flat(),
}));

function prom(): string {
  return diziSekli(MINTERIMLER, false, true, ["8 terim: 3 girişin", "bütün birleşimleri.", "", "F1: 4 bağlantı", "(001, 101, 110, 111)", "F2: 3 bağlantı", "(010, 110, 111)", "", "Sadeleştirme işe", "yaramaz; her minterim", "zaten hazırdır."]);
}

function pal(): string {
  const satir: DiziSatiri[] = [
    { ad: "AB", sutun: [0, 2], cikis: [0] },
    { ad: "B'C", sutun: [3, 4], cikis: [0] },
    { ad: "AB", sutun: [0, 2], cikis: [1] },
    { ad: "BC'", sutun: [2, 5], cikis: [1] },
  ];
  return diziSekli(satir, true, false, ["Her çıkışa iki terim", "ayrılmış (sabit).", "", "AB iki çıkışta da", "gerektiği için iki kez", "kurulur: 4 terim."]);
}

function pla(): string {
  const satir: DiziSatiri[] = [
    { ad: "AB", sutun: [0, 2], cikis: [0, 1] },
    { ad: "B'C", sutun: [3, 4], cikis: [0] },
    { ad: "BC'", sutun: [2, 5], cikis: [1] },
  ];
  return diziSekli(satir, true, true, ["AB bir kez kurulur,", "iki çıkış da kullanır:", "3 terim yeter.", "", "Esneklik bedeli: iki", "programlanır dizi,", "daha yavaş ve pahalı."]);
}

function tarihce(): string {
  const yil = (y: number) => 40 + ((y - 1964) / 24) * 560;
  let s = ok([[30, 96], [616, 96]]);
  for (let y = 1965; y <= 1985; y += 5) s += cizgi([[yil(y), 92], [yil(y), 100]], "g-bag") + yazi(yil(y), 112, String(y), "g-mini g-soluk");
  const olaylar: [number, string, string[], boolean][] = [
    [1966, "PROM", ["sabit VE,", "programlanır VEYA"], true],
    [1975, "PLA", ["iki dizi de", "programlanır"], false],
    [1980, "PAL", ["programlanır VE,", "sabit VEYA"], true],
    [1982, "CPLD", ["PAL blokları +", "bağlantı matrisi"], false],
    [1985, "FPGA", ["LUT'lu bloklar", "ızgarası"], true],
  ];
  for (const [y, ad, not, ust] of olaylar) {
    const x = yil(y);
    s += nokta(x, 96, "g-renk-a");
    if (ust) {
      s += cizgi([[x, 62], [x, 92]], "g-kesik") + yazi(x, 14, `${ad} · ${y}`, "g-kalin g-kucuk") + satirlar(x, 32, not, "g-mini g-soluk", "middle", 14);
    } else {
      s += cizgi([[x, 100], [x, 128]], "g-kesik") + yazi(x, 140, `${ad} · ${y}`, "g-kalin g-kucuk") + satirlar(x, 158, not, "g-mini g-soluk", "middle", 14);
    }
  }
  return s;
}

function cpld(): string {
  let s = kutu(20, 14, 600, 236, "g-kutu g-yonga") + yazi(34, 30, "CPLD", "g-kalin g-kucuk", "start");
  // Ortada bağlantı matrisi
  s += kutu(250, 70, 140, 124, "g-prog") + satirlar(320, 118, ["programlanabilir", "bağlantı", "matrisi"], "g-kucuk g-renk-a", "middle", 16);
  const blok = (x: number, y: number, ad: string, sag: boolean) => {
    let b = kutu(x, y, 150, 74, "g-dolu") + yazi(x + 75, y + 16, ad, "g-kucuk g-kalin");
    b += kutu(x + 10, y + 28, 60, 36, "g-sabit") + satirlar(x + 40, y + 40, ["VE-VEYA", "(PAL gibi)"], "g-mini", "middle", 13);
    b += kutu(x + 80, y + 28, 60, 36, "g-sabit") + satirlar(x + 110, y + 40, ["makro", "hücre"], "g-mini", "middle", 13);
    // matrise bağlantı
    const mx = sag ? 390 : 250;
    const bx = sag ? x : x + 150;
    b += cizgi([[bx, y + 46], [mx, y + 46 > 132 ? 170 : 94]], "g-yol");
    // dış bacaklar
    const ix = sag ? x + 150 : x - 22;
    b += kutu(ix, y + 30, 22, 26, "g-io") + cizgi([[sag ? x + 150 : x, y + 43], [sag ? x + 150 : x, y + 43]]);
    return b;
  };
  s += blok(70, 34, "Mantık bloğu 1", false) + blok(70, 152, "Mantık bloğu 2", false);
  s += blok(420, 34, "Mantık bloğu 3", true) + blok(420, 152, "Mantık bloğu 4", true);
  s += kutu(262, 222, 22, 14, "g-io") + yazi(290, 229, "giriş/çıkış bacakları", "g-mini g-soluk", "start");
  return s;
}

// Basit bir CLB: LUT -> (FF) -> MUX; kayitli true ise FF yolu vurgulanır
function miniClb(x: number, y: number, kayitli: boolean): string {
  let s = kutu(x, y, 280, 140, "g-cerceve");
  s += yazi(x + 10, y + 14, kayitli ? "seçim = 1: kayıtlı yol" : "seçim = 0: kayıtsız yol", "g-kucuk g-kalin g-renk-a", "start");
  s += kutu(x + 14, y + 44, 56, 56, "g-dolu") + yazi(x + 42, y + 72, "LUT", "g-kucuk");
  const yolCls = (v: boolean) => (v ? "g-yol" : "g-cizgi");
  // LUT çıkışından ayrılma
  s += cizgi([[x + 70, y + 72], [x + 92, y + 72]], "g-yol") + nokta(x + 92, y + 72, kayitli ? "g-uc" : "g-uc");
  s += cizgi([[x + 92, y + 72], [x + 92, y + 46], [x + 120, y + 46]], yolCls(kayitli));
  s += kutu(x + 120, y + 30, 56, 34) + yazi(x + 148, y + 47, "FF", "g-kucuk");
  s += yol(`M${x + 140},${y + 64} L${x + 148},${y + 57} L${x + 156},${y + 64}`, "g-cizgi");
  s += cizgi([[x + 176, y + 46], [x + 210, y + 46]], yolCls(kayitli));
  s += cizgi([[x + 92, y + 72], [x + 92, y + 104], [x + 210, y + 104]], yolCls(!kayitli));
  s += mux(x + 210, y + 30, 22, 90, 0.15) + yazi(x + 214, y + 46, "1", "g-mini", "start") + yazi(x + 214, y + 104, "0", "g-mini", "start");
  s += ok([[x + 232, y + 75], [x + 272, y + 75]], "g-yol");
  s += yazi(x + 252, y + 64, "y", "g-kod g-kucuk");
  return s;
}

function clbYolu(): string {
  let s = miniClb(20, 10, false) + miniClb(340, 10, true);
  s += yazi(20, 172, "Aynı LUT çıkışı (f), iki yoldan çıkışa giderse:", "g-kucuk g-soluk", "start");
  s += dalga(20, 206, [
    { ad: "saat", dalga: "0101010101" },
    { ad: "f (LUT)", dalga: "0011110000" },
    { ad: "y, seçim=0", dalga: "0011110000", cls: "g-dalga g-renk-b-cizgi" },
    { ad: "y, seçim=1", dalga: "0001111000", cls: "g-dalga g-renk-a-cizgi" },
  ], { etiketEn: 120, adim: 40, boy: 18, ara: 32, isaretler: [1, 3, 5, 7, 9].map((t) => ({ t, etiket: "↑" })) });
  return s;
}

// 3 girişli LUT: 8 bit ve 2:1 çoklayıcı ağacı. Girişler cba = 101 iken seçilen yol vurgulanır
function lut3(): string {
  const bitler = [0, 0, 0, 1, 0, 1, 1, 1];
  const secim = 5;
  let s = yazi(66, 16, "8 bit bellek", "g-mini g-soluk");
  const y = (i: number) => 30 + i * 30;
  bitler.forEach((b, i) => {
    const sec = i === secim;
    s += yazi(28, y(i) + 12, `${(i >> 2) & 1}${(i >> 1) & 1}${i & 1}`, "g-mini g-kod g-soluk", "end");
    s += kutu(36, y(i), 60, 24, sec ? "g-dolu g-secili" : "g-kutu") + yazi(66, y(i) + 12, String(b), sec ? "g-kod g-kalin g-renk-a" : "g-kod");
  });
  // 1. kademe: 4 MUX, a ile seçer
  const k1x = 140;
  const k2x = 240;
  const k3x = 340;
  const muxH = 44;
  const k1y = (j: number) => y(2 * j) - 4 + 0;
  for (let j = 0; j < 4; j++) {
    const my = k1y(j);
    const yolda = j === secim >> 1;
    for (let t = 0; t < 2; t++) {
      const i = 2 * j + t;
      const giris = my + 10 + t * 24;
      s += cizgi([[96, y(i) + 12], [124, y(i) + 12], [124, giris], [k1x, giris]], i === secim ? "g-yol" : "g-cizgi");
    }
    s += mux(k1x, my, 24, muxH + 0, 0.18, yolda ? "g-kutu g-secili" : "g-kutu");
  }
  // 2. kademe: 2 MUX, b ile seçer
  for (let j = 0; j < 2; j++) {
    const my = (k1y(2 * j) + k1y(2 * j + 1)) / 2 + 2;
    for (let t = 0; t < 2; t++) {
      const kaynak = 2 * j + t;
      const cy = k1y(kaynak) + muxH / 2;
      const giris = my + 10 + t * 24;
      const yolda = kaynak === secim >> 1;
      s += cizgi([[k1x + 24, cy], [k1x + 60, cy], [k1x + 60, giris], [k2x, giris]], yolda ? "g-yol" : "g-cizgi");
    }
    s += mux(k2x, my, 24, muxH, 0.18, j === secim >> 2 ? "g-kutu g-secili" : "g-kutu");
  }
  // 3. kademe: 1 MUX, c ile seçer
  const k2orta = (j: number) => (k1y(2 * j) + k1y(2 * j + 1)) / 2 + 2 + muxH / 2;
  const my3 = (k2orta(0) + k2orta(1)) / 2 - muxH / 2;
  for (let t = 0; t < 2; t++) {
    const cy = k2orta(t);
    const giris = my3 + 10 + t * 24;
    s += cizgi([[k2x + 24, cy], [k2x + 60, cy], [k2x + 60, giris], [k3x, giris]], t === secim >> 2 ? "g-yol" : "g-cizgi");
  }
  s += mux(k3x, my3, 24, muxH, 0.18, "g-kutu g-secili");
  s += ok([[k3x + 24, my3 + muxH / 2], [k3x + 70, my3 + muxH / 2]], "g-yol") + yazi(k3x + 80, my3 + muxH / 2, "y = 1", "g-kod g-kalin g-renk-a", "start");
  // Seçim girişleri
  s += yazi(k1x + 12, 278, "a = 1", "g-kod g-kucuk") + yazi(k2x + 12, 278, "b = 0", "g-kod g-kucuk") + yazi(k3x + 12, 278, "c = 1", "g-kod g-kucuk");
  s += yazi(k1x + 12, 294, "1. kademe", "g-mini g-soluk") + yazi(k2x + 12, 294, "2. kademe", "g-mini g-soluk") + yazi(k3x + 12, 294, "3. kademe", "g-mini g-soluk");
  s += satirlar(476, 40, ["Girişler: c b a = 1 0 1", "Adres 101 = 5", "", "a ilk kademede, b ikinci", "kademede, c sonuncuda", "seçer. Sonuçta 5 numaralı", "hücredeki bit çıkışa gelir.", "", "Bu tablo (00010111)", "çoğunluk fonksiyonudur:", "en az iki giriş 1 ise", "çıkış 1."], "g-kucuk", "start", 18);
  return s;
}

// ---- Etkileşimli LUT ----
// TABLO dizgisi ders örneğindeki gibi soldan sağa ba = 11, 10, 01, 00 sırasıyla yazılır
export const LUT_ISLEVLERI: Record<string, { ad: string; ifade: string }> = {
  "0000": { ad: "sabit 0", ifade: "'0'" },
  "1000": { ad: "AND", ifade: "a and b" },
  "0100": { ad: "b VE a değil", ifade: "b and not a" },
  "1100": { ad: "yalnızca b", ifade: "b" },
  "0010": { ad: "a VE b değil", ifade: "a and not b" },
  "1010": { ad: "yalnızca a", ifade: "a" },
  "0110": { ad: "XOR", ifade: "a xor b" },
  "1110": { ad: "OR", ifade: "a or b" },
  "0001": { ad: "NOR", ifade: "a nor b" },
  "1001": { ad: "XNOR", ifade: "a xnor b" },
  "0101": { ad: "a'nın tersi", ifade: "not a" },
  "1101": { ad: "b VEYA a değil", ifade: "b or not a" },
  "0011": { ad: "b'nin tersi", ifade: "not b" },
  "1011": { ad: "a VEYA b değil", ifade: "a or not b" },
  "0111": { ad: "NAND", ifade: "a nand b" },
  "1111": { ad: "sabit 1", ifade: "'1'" },
};

export const LUT_VARSAYILAN = "1000";

// Çizimde tablo yukarıdan aşağı ba = 00, 01, 10, 11 sırasıyla durur
export function lutOyunu(tablo: string): string {
  const satirAdresi = ["00", "01", "10", "11"];
  const bit = (adres: number) => tablo[3 - adres]!;
  let s = yazi(150, 18, "TABLO belleği", "g-kucuk g-soluk");
  for (let i = 0; i < 4; i++) {
    const y = 34 + i * 40;
    const bir = bit(i) === "1";
    s += yazi(110, y + 20, `ba = ${satirAdresi[i]}`, "g-kucuk g-kod", "end");
    s += kutu(122, y, 56, 40, bir ? "g-dolu g-secili" : "g-kutu") + yazi(150, y + 20, bit(i), bir ? "g-kalin g-renk-a g-kod" : "g-kod");
    s += cizgi([[178, y + 20], [240, y + 20]]);
  }
  s += mux(240, 34, 40, 160, 0.2);
  s += cizgi([[260, 178], [260, 214]]) + yazi(270, 212, "seçim: b & a", "g-kucuk", "start");
  s += ok([[280, 114], [330, 114]]) + yazi(338, 114, "y", "g-kod", "start");
  const f = LUT_ISLEVLERI[tablo];
  s += yazi(380, 54, `TABLO = "${tablo}"`, "g-kod", "start");
  s += yazi(380, 92, f ? f.ad : "", "g-kalin g-renk-a", "start");
  s += yazi(380, 124, f ? `y <= ${f.ifade};` : "", "g-kod g-kucuk", "start");
  s += satirlar(380, 166, ["Donanım hep aynı: 4 hücre ve", "bir çoklayıcı. Değişen yalnızca", "hücrelerdeki bitler."], "g-mini g-soluk", "start", 15);
  return s;
}

function kaynakHaritasi(): string {
  let s = kutu(20, 14, 440, 252, "g-kutu g-yonga");
  // Kenarda IOB halkası
  for (let x = 40; x < 450; x += 26) s += kutu(x, 20, 16, 10, "g-io") + kutu(x, 250, 16, 10, "g-io");
  for (let y = 44; y < 240; y += 24) s += kutu(26, y, 10, 14, "g-io") + kutu(444, y, 10, 14, "g-io");
  // Sütunlar: CLB, CLB, BRAM, CLB, DSP, CLB, CLB
  const sutunlar: ("clb" | "bram" | "dsp")[] = ["clb", "clb", "bram", "clb", "clb", "dsp", "clb", "clb"];
  let x = 52;
  for (const t of sutunlar) {
    if (t === "clb") {
      for (let y = 40; y < 236; y += 22) s += kutu(x, y, 30, 16, "g-dolu");
      x += 40;
    } else {
      for (let y = 40; y < 200; y += 48) s += kutu(x, y, 34, 40, t === "bram" ? "g-ton1" : "g-bant-1");
      x += 44;
    }
  }
  // Saat yönetimi (PLL) sol ortada
  s += kutu(x, 112, 48, 50, "g-prog") + yazi(x + 24, 137, "PLL", "g-kucuk g-renk-a");
  // Lejant
  const lx = 482;
  s += kutu(lx, 32, 22, 14, "g-dolu") + satirlar(lx + 30, 32, ["CLB", "LUT ve flip-floplar"], "g-kucuk", "start", 15);
  s += kutu(lx, 76, 22, 22, "g-ton1") + satirlar(lx + 30, 80, ["Blok RAM", "hazır bellek"], "g-kucuk", "start", 15);
  s += kutu(lx, 120, 22, 22, "g-bant-1") + satirlar(lx + 30, 124, ["DSP dilimi", "hızlı çarpıcı"], "g-kucuk", "start", 15);
  s += kutu(lx, 164, 22, 22, "g-prog") + satirlar(lx + 30, 168, ["PLL", "saat üretir"], "g-kucuk", "start", 15);
  s += kutu(lx + 4, 210, 16, 10, "g-io") + satirlar(lx + 30, 208, ["IOB", "bacak bağlantısı"], "g-kucuk", "start", 15);
  return s;
}

// Tasarım akışı adım adım: aynı tam toplayıcı
function akisPaneli(x: number, y: number, no: number, baslik: string, girdi: string): string {
  return kutu(x, y, 190, 170, "g-cerceve") + yazi(x + 10, y + 14, `${no}. ${baslik}`, "g-kucuk g-kalin", "start") + yazi(x + 10, y + 160, girdi, "g-mini g-soluk", "start");
}

function miniIzgara(x: number, y: number, secili: [number, number][]): string {
  let s = "";
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const sec = secili.some(([a, b]) => a === r && b === c);
      s += kutu(x + c * 44, y + r * 34, 30, 22, sec ? "g-dolu g-secili" : "g-sabit");
    }
  return s;
}

function akisAdimAdim(): string {
  let s = "";
  // 1. Kod
  s += akisPaneli(10, 10, 1, "Kod", "girdi: VHDL dosyası");
  s += satirlar(20, 46, ["s <= a xor b", "     xor cin;", "cout <= (a and b) or", "  (cin and", "   (a xor b));"], "g-kod g-mini", "start", 16);
  // 2. Netlist
  s += akisPaneli(225, 10, 2, "Sentez: netlist", "kapılar ve bağlantıları");
  s += yazi(238, 50, "a,b", "g-mini g-kod", "end") + yazi(238, 128, "a,b", "g-mini g-kod", "end");
  s += ozelVeya(245, 40, 30, 20) + ozelVeya(320, 36, 30, 20);
  s += ve(245, 118, 30, 20) + ve(320, 90, 30, 20) + veya(362, 104, 32, 26);
  s += cizgi([[275, 50], [300, 50], [300, 42], [320, 42]]) + nokta(300, 50, "g-uc");
  s += cizgi([[300, 50], [300, 96], [320, 96]]);
  s += cizgi([[308, 56], [320, 56]]) + cizgi([[308, 106], [320, 106]]) + yazi(306, 70, "cin", "g-mini g-kod", "end");
  s += cizgi([[350, 46], [400, 46]]) + yazi(404, 46, "s", "g-mini g-kod", "start");
  s += cizgi([[350, 100], [356, 100], [356, 110], [366, 110]]);
  s += cizgi([[275, 128], [340, 128], [340, 124], [366, 124]]);
  s += cizgi([[394, 117], [400, 117]]) + yazi(372, 146, "cout", "g-mini g-kod", "start");
  // 3. Eşleme
  s += akisPaneli(440, 10, 3, "Eşleme", "LUT ve FF'lere dağıtılır");
  s += kutu(470, 40, 120, 40, "g-dolu") + satirlar(530, 53, ["LUT3 → s", "a, b, cin"], "g-mini g-kod", "middle", 15);
  s += kutu(470, 96, 120, 40, "g-dolu") + satirlar(530, 109, ["LUT3 → cout", "a, b, cin"], "g-mini g-kod", "middle", 15);
  // 4. Yerleştirme
  s += akisPaneli(110, 200, 4, "Yerleştirme", "hangi CLB, hangi bacak?");
  s += miniIzgara(150, 228, [[0, 1], [1, 2]]);
  s += yazi(209, 239, "s", "g-mini g-kod g-renk-a") + yazi(253, 273, "co", "g-mini g-kod g-renk-a");
  s += kutu(126, 232, 10, 14, "g-io g-secili") + kutu(286, 232, 10, 14, "g-io g-secili") + kutu(286, 266, 10, 14, "g-io g-secili");
  // 5. Yönlendirme
  s += akisPaneli(340, 200, 5, "Yönlendirme", "teller kurulur, gecikme belli olur");
  s += miniIzgara(380, 228, [[0, 1], [1, 2]]);
  s += kutu(356, 232, 10, 14, "g-io g-secili") + kutu(516, 232, 10, 14, "g-io g-secili") + kutu(516, 266, 10, 14, "g-io g-secili");
  s += cizgi([[366, 239], [372, 239], [372, 256], [416, 256], [416, 239], [424, 239]], "g-yol");
  s += cizgi([[416, 256], [460, 256], [460, 273], [468, 273]], "g-yol");
  s += cizgi([[454, 239], [516, 239]], "g-yol") + cizgi([[498, 273], [516, 273]], "g-yol");
  // Oklar
  s += ok([[200, 95], [222, 95]]) + ok([[415, 95], [437, 95]]);
  s += ok([[535, 180], [535, 190], [205, 190], [205, 199]]);
  s += ok([[300, 290], [337, 290]]);
  s += ok([[530, 290], [560, 290]]) + yazi(566, 290, "bitstream", "g-kucuk g-kalin", "start");
  return s;
}

function ucModelleme(): string {
  let s = "";
  const panel = (x: number, y: number, w: number, h: number, baslik: string, alt: string, kod: string[]) => {
    s += kutu(x, y, w, h, "g-kutu") + kutu(x, y, w, 24, "g-dolu");
    s += yazi(x + 10, y + 12, baslik, "g-kucuk g-kalin", "start") + yazi(x + w - 10, y + 12, alt, "g-mini g-soluk", "end");
    s += satirlar(x + 12, y + 42, kod, "g-kod g-mini", "start", 15);
  };
  panel(10, 10, 300, 128, "Yapısal", "bileşenleri bağla", [
    "u1 : entity work.ha",
    "  port map (a, b, s1, c1);",
    "u2 : entity work.ha",
    "  port map (s1, cin, s, c2);",
    "cout <= c1 or c2;",
  ]);
  panel(10, 150, 300, 92, "Veri akışı", "eşzamanlı atamalar", [
    "s    <= a xor b xor cin;",
    "cout <= (a and b) or",
    "        (cin and (a xor b));",
  ]);
  panel(326, 10, 304, 232, "Davranışsal", "process içinde anlat", [
    "process (a, b, cin)",
    "  variable n : integer;",
    "begin",
    "  n := 0;",
    "  if a = '1' then n := n + 1; end if;",
    "  if b = '1' then n := n + 1; end if;",
    "  if cin = '1' then n := n + 1; end if;",
    "  -- tek sayıda 1 varsa s = 1",
    "  if n mod 2 = 1 then s <= '1';",
    "  else s <= '0'; end if;",
    "  if n >= 2 then cout <= '1';",
    "  else cout <= '0'; end if;",
    "end process;",
  ]);
  s += yazi(320, 262, "Üçü de aynı tam toplayıcıyı tanımlar; sentez aracı üçünden de aynı devreyi kurabilir.", "g-mini g-soluk");
  return s;
}

function vivadoSihirbazi(): string {
  const adimlar: [string, string[]][] = [
    ["Create Project", ["yeni proje"]],
    ["Project Name", ["ad ve klasör"]],
    ["Project Type", ["RTL Project"]],
    ["Add Sources", [".vhd dosyaları"]],
    ["Add Constraints", [".xdc (bacaklar)"]],
    ["Default Part", ["xc7a100t", "csg324-1"]],
  ];
  let s = yazi(12, 14, "Yeni proje sihirbazı", "g-kucuk g-soluk", "start");
  adimlar.forEach(([ad, not], i) => {
    const x = 12 + i * 104;
    const vurgu = i === 2 || i === 5;
    s += kutu(x, 26, 96, 72, vurgu ? "g-prog" : "g-dolu");
    s += yazi(x + 48, 40, `${i + 1}.`, "g-mini g-soluk");
    s += yazi(x + 48, 56, ad, "g-mini g-kalin");
    s += satirlar(x + 48, not.length > 1 ? 72 : 78, not, `g-mini ${vurgu ? "g-renk-a g-kod" : "g-soluk"}`, "middle", 13);
    if (i < adimlar.length - 1) s += ok([[x + 96, 62], [x + 104, 62]]);
  });
  s += ok([[580, 98], [580, 116], [60, 116], [60, 130]]);
  s += yazi(12, 146, "Flow Navigator (proje açıldıktan sonra soldaki menü)", "g-kucuk g-soluk", "start");
  const akis: [string, string][] = [
    ["Run Simulation", "davranışı dene"],
    ["Run Synthesis", "netlist"],
    ["Run Implementation", "yerleştir, yönlendir"],
    ["Generate Bitstream", ".bit dosyası"],
    ["Program Device", "karta yükle"],
  ];
  akis.forEach(([ad, not], i) => {
    const x = 12 + i * 124;
    s += kutu(x, 158, 112, 50, "g-sabit");
    s += yazi(x + 55, 175, ad, "g-mini g-kalin");
    s += yazi(x + 55, 194, not, "g-mini g-soluk");
    if (i < akis.length - 1) s += ok([[x + 112, 183], [x + 124, 183]]);
  });
  s += yazi(12, 230, "Mavi kutular derste en çok karıştırılan iki seçim: proje türü ve parça numarası.", "g-mini g-soluk", "start");
  return s;
}

export const HAFTA_2_GORSELLERI: Gorsel[] = [
  {
    kod: "G-H2-06",
    baslik: "Doğruluk tablosundan çarpımların toplamına",
    aciklama:
      "A, B, C girişli F1 fonksiyonunun doğruluk tablosu. F1, 001, 101, 110 ve 111 satırlarında 1'dir. Bu dört satır minterim olarak yazılırsa F1 = A'B'C + AB'C + ABC' + ABC olur. 001 ile 101 satırları birleşip B'C, 110 ile 111 satırları birleşip AB terimini verir: F1 = B'C + AB.",
    en: 640,
    boy: 270,
    icerik: dogrulukTablosu(),
  },
  {
    kod: "G-H2-07",
    baslik: "PROM'da F1 ve F2",
    aciklama:
      "Üstte A, A', B, B', C, C' sütunları. VE dizisinde 8 satır var, her satır bir minterimdir ve bağlantıları üretimde sabittir. VEYA dizisinde F1 sütunu 001, 101, 110, 111 minterimlerine; F2 sütunu 010, 110, 111 minterimlerine programlanmış bağlantıyla bağlı.",
    en: 640,
    boy: 330,
    icerik: prom(),
  },
  {
    kod: "G-H2-08",
    baslik: "PAL'de F1 ve F2",
    aciklama:
      "VE dizisi programlanmış: dört satır AB, B'C, AB ve BC' terimlerini kurar. VEYA dizisi sabit: ilk iki satır F1'e, son iki satır F2'ye ayrılmış. AB terimi iki çıkışta da gerektiği için iki kez kurulur.",
    en: 640,
    boy: 234,
    icerik: pal(),
  },
  {
    kod: "G-H2-09",
    baslik: "PLA'da F1 ve F2",
    aciklama:
      "İki dizi de programlanmış. Üç satır AB, B'C ve BC' terimlerini kurar. AB satırı hem F1'e hem F2'ye bağlı, yani terim paylaşılır. B'C yalnızca F1'e, BC' yalnızca F2'ye gider.",
    en: 640,
    boy: 210,
    icerik: pla(),
  },
  {
    kod: "G-H2-10",
    baslik: "Programlanabilir mantığın zaman çizgisi",
    aciklama:
      "1964'ten 1988'e uzanan bir eksende beş olay: 1966 PROM (sabit VE, programlanır VEYA), 1975 PLA (iki dizi de programlanır), 1980 PAL (programlanır VE, sabit VEYA), 1982 CPLD (PAL blokları ve bağlantı matrisi), 1985 FPGA (LUT'lu blokların ızgarası).",
    en: 640,
    boy: 184,
    icerik: tarihce(),
  },
  {
    kod: "G-H2-11",
    baslik: "CPLD: PAL benzeri bloklar ve bağlantı matrisi",
    aciklama:
      "Bir CPLD yongası. Ortada programlanabilir bağlantı matrisi, sağında ve solunda ikişer mantık bloğu var. Her blok PAL benzeri bir VE-VEYA yapısı ve makro hücrelerden oluşur. Bloklar birbirine yalnızca ortadaki matris üzerinden bağlanır; dış kenarda giriş/çıkış bacakları var.",
    en: 640,
    boy: 264,
    icerik: cpld(),
  },
  {
    kod: "G-H2-12",
    baslik: "CLB'de iki yol: kayıtlı ve kayıtsız",
    aciklama:
      "Solda çoklayıcının seçimi 0: LUT çıkışı flip-flopu atlayıp doğrudan çıkışa gider. Sağda seçim 1: LUT çıkışı flip-floptan geçer. Altta dalga: f değiştiği anda kayıtsız y de değişir; kayıtlı y ise yalnızca saatin yükselen kenarlarında f'nin o anki değerini alır, bu yüzden bir kenar sonra değişir.",
    en: 640,
    boy: 350,
    icerik: clbYolu(),
  },
  {
    kod: "G-H2-13",
    baslik: "3 girişli LUT: 8 bit ve çoklayıcı ağacı",
    aciklama:
      "Sekiz bellek hücresinde 0, 0, 0, 1, 0, 1, 1, 1 değerleri var. Üç kademe 2'ye 1 çoklayıcı var: ilk kademe a, ikinci b, üçüncü c ile seçer. c b a = 1 0 1 iken seçilen yol vurgulanmış; 5 numaralı hücredeki 1 çıkışa gelir. Bu tablo çoğunluk fonksiyonudur.",
    en: 640,
    boy: 304,
    icerik: lut3(),
  },
  {
    kod: "G-H2-14",
    baslik: "LUT'a bit yaz, kapıyı gör",
    aciklama:
      "2 girişli bir LUT: dört bellek hücresi ve bir çoklayıcı. Hücrelerde 0, 0, 0, 1 var, yani TABLO = \"1000\" ve bu bir AND kapısıdır. Etkileşimli sürümde hücrelere tıklayınca TABLO ve kurulan kapı değişir.",
    en: 640,
    boy: 226,
    icerik: lutOyunu(LUT_VARSAYILAN),
    etkilesim: "lut",
  },
  {
    kod: "G-H2-15",
    baslik: "Bir FPGA'nın kaynak haritası",
    aciklama:
      "Yonganın kenarları giriş/çıkış bloklarıyla çevrili. İçeride CLB sütunlarının arasına bir blok RAM sütunu ve bir DSP sütunu yerleşmiş. Sağ tarafta saat üreten bir PLL bloğu var.",
    en: 640,
    boy: 280,
    icerik: kaynakHaritasi(),
  },
  {
    kod: "G-H2-16",
    baslik: "Tasarım akışı adım adım: tam toplayıcı",
    aciklama:
      "Beş panel. 1: tam toplayıcının VHDL kodu. 2: sentez sonrası netlist, iki XOR, iki AND ve bir OR kapısı. 3: eşleme, s ve cout birer 3 girişli LUT'a yerleşecek şekilde dağıtılır. 4: yerleştirme, iki LUT ızgaradaki iki CLB'ye konur. 5: yönlendirme, giriş bacağından CLB'lere ve çıkışlara teller kurulur. Sonunda bitstream üretilir.",
    en: 640,
    boy: 380,
    icerik: akisAdimAdim(),
  },
  {
    kod: "G-H2-17",
    baslik: "Aynı tam toplayıcı, üç modelleme",
    aciklama:
      "Yapısal: iki yarım toplayıcı entity work.ha ile örneklenir, elde çıkışları VEYA'lanır. Veri akışı: s ve cout iki eşzamanlı atamayla yazılır. Davranışsal: bir process girişlerdeki 1'leri sayar; sayı tekse s, en az ikiyse cout 1 olur.",
    en: 640,
    boy: 276,
    icerik: ucModelleme(),
  },
  {
    kod: "G-H2-18",
    baslik: "Vivado: yeni proje ve akış",
    aciklama:
      "Üst sırada yeni proje sihirbazının adımları: Create Project, Project Name, Project Type (RTL Project), Add Sources, Add Constraints, Default Part (xc7a100tcsg324-1). Alt sırada Flow Navigator'daki akış: Run Simulation, Run Synthesis, Run Implementation, Generate Bitstream, Program Device.",
    en: 640,
    boy: 244,
    icerik: vivadoSihirbazi(),
  },
];
