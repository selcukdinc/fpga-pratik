// Hafta 3 ders şekilleri (G-H3-03 ve sonrası). İlk iki şekil index.ts'tedir.

import { bitDizisi, cizgi, dalga, kutu, nokta, ok, ozelVeya, satirlar, ve, veya, yazi, yol, type Nokta } from "./cizim";
import type { Gorsel } from "./tip";

// ---- Port modları ----
function portModlari(): string {
  const modlar: { ad: string; satir: [string, boolean][] }[] = [
    { ad: "in", satir: [["içeride okunur", true], ["içeride yazılamaz", false]] },
    { ad: "out", satir: [["içeride yazılır", true], ["içeride okunamaz", false]] },
    { ad: "inout", satir: [["iki yönlü: dışarıdan", true], ["ve içeriden sürülür", true]] },
    { ad: "buffer", satir: [["yazılır, geri okunur", true], ["tek kaynak sürer", false]] },
  ];
  let s = "";
  modlar.forEach((m, i) => {
    const px = 8 + i * 158;
    const sinir = px + 58;
    s += yazi(px + 75, 16, m.ad, "g-kod g-kalin");
    s += kutu(sinir, 34, 88, 92, "g-kutu");
    s += yazi(px + 28, 46, "dışarı", "g-mini g-soluk") + yazi(sinir + 44, 46, "mimari", "g-mini g-soluk");
    s += kutu(sinir - 4, 81, 8, 8, "g-pin");
    if (m.ad === "in") s += ok([[px + 6, 85], [px + 124, 85]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
    if (m.ad === "out") s += ok([[px + 130, 85], [px + 8, 85]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
    if (m.ad === "inout") {
      s += ok([[px + 6, 76], [px + 124, 76]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
      s += ok([[px + 130, 96], [px + 8, 96]], "g-cizgi g-renk-c-cizgi", "g-renk-c");
    }
    if (m.ad === "buffer") {
      s += ok([[px + 130, 85], [px + 8, 85]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
      s += nokta(sinir + 16, 85, "g-renk-a") + ok([[sinir + 16, 85], [sinir + 16, 62], [sinir + 60, 62], [sinir + 60, 76]], "g-cizgi g-renk-c-cizgi", "g-renk-c");
      s += yazi(sinir + 44, 112, "geri okuma", "g-mini g-renk-c");
    }
    if (m.ad === "out") s += yazi(sinir + 44, 112, "yalnızca yazılır", "g-mini g-soluk");
    if (m.ad === "in") s += yazi(sinir + 44, 112, "yalnızca okunur", "g-mini g-soluk");
    m.satir.forEach(([metin, olur], k) => {
      s += yazi(px + 4, 146 + k * 18, olur ? "✓" : "✗", `g-kucuk g-kalin ${olur ? "g-renk-c" : "g-renk-b"}`, "start");
      s += yazi(px + 18, 146 + k * 18, metin, "g-mini", "start");
    });
  });
  s += yazi(320, 194, "Oklar verinin yönünü gösterir. out'un içeriden okunamaması VHDL-93 kuralıdır.", "g-mini g-soluk");
  return s;
}

// ---- Bir entity, iki architecture ----
function ikiMimari(): string {
  let s = kutu(20, 56, 170, 96, "g-dolu") + yazi(105, 72, "entity ve_kapisi", "g-kod g-kucuk g-kalin");
  s += satirlar(32, 96, ["a, b : in  std_logic;", "y    : out std_logic"], "g-kod g-mini", "start", 16);
  s += yazi(105, 138, "dış görünüş tek", "g-mini g-soluk");
  const kart = (y: number, ad: string, kod: string[], secili: boolean) => {
    let k = kutu(270, y, 350, 24 + kod.length * 15 + 8, secili ? "g-kutu g-secili" : "g-kutu");
    k += yazi(282, y + 13, `architecture ${ad} of ve_kapisi`, "g-kod g-mini g-kalin", "start");
    k += satirlar(294, y + 34, kod, "g-kod g-mini", "start", 15);
    return k;
  };
  s += kart(14, "kapi", ["y <= a and b;"], false);
  s += kart(82, "tablo", ["y <= '1' when a = '1' and b = '1'", "     else '0';"], true);
  s += ok([[190, 90], [230, 90], [230, 40], [266, 40]]) + ok([[230, 90], [230, 112], [266, 112]]);
  s += kutu(20, 178, 380, 26, "g-sabit") + yazi(30, 191, "u1 : entity work.ve_kapisi(tablo) port map (...);", "g-kod g-mini", "start");
  s += ok([[400, 191], [446, 191], [446, 150]], "g-yol", "g-renk-a");
  s += yazi(456, 186, "parantezdeki ad", "g-mini g-renk-a", "start") + yazi(456, 202, "mimariyi seçer", "g-mini g-renk-a", "start");
  return s;
}

// ---- Tam toplayıcı kapıları ----
function tamToplayici(): string {
  const deger = (x: number, y: number, v: string) => yazi(x, y, v, "g-mini g-kod g-kalin g-renk-a");
  let s = yazi(20, 14, "Örnek: a = 1, b = 0, cin = 1", "g-kucuk g-renk-a", "start");
  // Çerçeveler: iki yarım toplayıcı
  s += kutu(136, 34, 72, 112, "g-cerceve") + yazi(172, 26, "yarım topl. 1", "g-mini g-soluk");
  s += kutu(288, 38, 72, 150, "g-cerceve") + yazi(324, 200, "yarım topl. 2", "g-mini g-soluk");
  // Girişler
  s += yazi(34, 48, "a", "g-kod g-kucuk", "end") + cizgi([[40, 48], [150, 48]]) + deger(60, 38, "1");
  s += yazi(34, 66, "b", "g-kod g-kucuk", "end") + cizgi([[40, 66], [150, 66]]) + deger(60, 76, "0");
  s += nokta(110, 48) + cizgi([[110, 48], [110, 108], [150, 108]]);
  s += nokta(124, 66) + cizgi([[124, 66], [124, 126], [150, 126]]);
  s += yazi(34, 158, "cin", "g-kod g-kucuk", "end") + cizgi([[40, 158], [300, 158]]) + deger(60, 148, "1");
  s += nokta(262, 158) + cizgi([[262, 158], [262, 75], [300, 75]]);
  // 1. yarım toplayıcı
  s += ozelVeya(150, 40, 44, 34) + ve(150, 100, 44, 34);
  // p = a xor b
  s += cizgi([[194, 57], [300, 57]]) + yazi(220, 50, "p", "g-kod g-mini g-soluk") + deger(234, 50, "1");
  s += nokta(244, 57) + cizgi([[244, 57], [244, 176], [300, 176]]);
  // 2. yarım toplayıcı
  s += ozelVeya(300, 49, 44, 34) + ve(300, 150, 44, 34);
  s += ok([[344, 66], [596, 66]]) + yazi(602, 66, "s", "g-kod g-kucuk g-kalin", "start") + deger(560, 56, "0");
  // g = a and b, t = p and cin
  s += cizgi([[194, 117], [410, 117], [410, 128], [450, 128]]) + yazi(388, 108, "ab", "g-kod g-mini g-soluk") + deger(406, 108, "0");
  s += cizgi([[344, 167], [420, 167], [420, 152], [450, 152]]) + yazi(394, 178, "cin·p", "g-kod g-mini g-soluk") + deger(424, 178, "1");
  s += veya(444, 118, 46, 46);
  s += ok([[490, 141], [596, 141]]) + yazi(602, 141, "cout", "g-kod g-kucuk g-kalin", "start") + deger(560, 131, "1");
  s += yazi(320, 222, "s = a xor b xor cin    cout = ab + cin(a xor b)", "g-kod g-mini");
  return s;
}

// ---- 4 bitlik dalgalı elde toplayıcısı ----
function dalgaliElde(): string {
  const a = "0111";
  const b = "0011";
  // Bit i için elde girişi ve çıkışlar (i = 0 en sağdaki)
  const c = [0];
  const top: number[] = [];
  for (let i = 0; i < 4; i++) {
    const ai = +a[3 - i]!;
    const bi = +b[3 - i]!;
    const t = ai + bi + c[i]!;
    top.push(t & 1);
    c.push(t >> 1);
  }
  let s = "";
  for (let i = 0; i < 4; i++) {
    const x = 470 - i * 140;
    const y = 64;
    s += kutu(x, y, 96, 60, "g-dolu") + yazi(x + 48, y + 22, `FA${i}`, "g-kalin g-kucuk") + yazi(x + 48, y + 42, `bit ${i}`, "g-mini g-soluk");
    s += ok([[x + 30, 32], [x + 30, y]]) + yazi(x + 30, 26, `a${i}=${a[3 - i]}`, "g-mini g-kod");
    s += ok([[x + 66, 32], [x + 66, y]]) + yazi(x + 66, 26, `b${i}=${b[3 - i]}`, "g-mini g-kod");
    s += ok([[x + 48, y + 60], [x + 48, y + 92]]) + yazi(x + 48, y + 104, `s${i} = ${top[i]}`, "g-kucuk g-kod g-kalin");
    // elde: sağdaki kutudan bu kutuya
    const gx = x + 96;
    if (i === 0) s += ok([[gx + 44, y + 30], [gx, y + 30]], "g-yol", "g-renk-a") + yazi(gx + 22, y + 20, "cin=0", "g-mini g-kod");
    else s += ok([[gx + 44, y + 30], [gx, y + 30]], "g-yol", "g-renk-a") + yazi(gx + 22, y + 20, `c${i}=${c[i]}`, "g-mini g-kod g-renk-a");
  }
  s += ok([[40, 94], [8, 94]], "g-yol", "g-renk-a") + yazi(24, 84, `cout=${c[4]}`, "g-mini g-kod g-renk-a");
  s += yazi(320, 200, `"${a}" (7) + "${b}" (3) = "${top.slice().reverse().join("")}" (10). Elde sağdan sola zincirle ilerler; en uzun yol,`, "g-mini g-soluk");
  s += yazi(320, 216, "bit 0'da doğan eldenin dört kutudan geçip cout'a ulaştığı yoldur.", "g-mini g-soluk");
  return s;
}

// ---- Operatör öncelik merdiveni ----
function oncelikMerdiveni(): string {
  const basamak: [string, string][] = [
    ["**  abs  not", "çeşitli"],
    ["*  /  mod  rem", "çarpma"],
    ["+  -  (işaret: -a)", "işaret"],
    ["+  -  &", "toplama"],
    ["sll srl sla sra rol ror", "kaydırma"],
    ["=  /=  <  <=  >  >=", "ilişkisel"],
    ["and or nand nor xor xnor", "mantıksal"],
  ];
  let s = yazi(20, 14, "en yüksek öncelik", "g-mini g-renk-a", "start");
  basamak.forEach(([op, ad], i) => {
    const x = 20 + i * 14;
    const y = 26 + i * 32;
    s += kutu(x, y, 250, 26, i === 0 || i === 6 ? "g-dolu g-secili" : "g-dolu");
    s += yazi(x + 10, y + 13, op, "g-kod g-mini", "start") + yazi(x + 244, y + 13, ad, "g-mini g-soluk", "end");
  });
  s += yazi(104, 260, "en düşük; aralarında sıra yok", "g-mini g-renk-a", "start");
  // Örnekler
  const ox = 400;
  const ornek: [string, string, boolean][] = [
    ["not a and b", "(not a) and b", true],
    ["a + b * c", "a + (b * c)", true],
    ['"10" & a + b', "\"10\" & a, sonra + b", true],
    ["a and b or c", "derlenmez: parantez şart", false],
    ["a nand b nand c", "derlenmez: zincirlenemez", false],
  ];
  s += yazi(ox, 20, "Yazılan", "g-kucuk g-kalin", "start");
  ornek.forEach(([yazilan, anlam, olur], i) => {
    const y = 46 + i * 44;
    s += yazi(ox, y, yazilan, "g-kod g-kucuk", "start");
    s += yazi(ox + 8, y + 18, `→ ${anlam}`, `g-mini ${olur ? "g-kod g-renk-c" : "g-renk-b"}`, "start");
  });
  return s;
}

// ---- Kaydırma ve döndürme ----
function kaydirma(): string {
  const en = 30;
  const hucre = (x0: number, y0: number, baslik: string, giris: string, kaydir: number, dondur: boolean, not: string) => {
    // kaydir > 0 sola, < 0 sağa
    const n = giris.length;
    const bx = x0 + 96;
    const cikis: string[] = [];
    const yeni: number[] = [];
    for (let j = 0; j < n; j++) {
      const k = j + kaydir;
      if (k >= 0 && k < n) cikis.push(giris[k]!);
      else if (dondur) cikis.push(giris[(k + n) % n]!);
      else {
        cikis.push("0");
        yeni.push(j);
      }
    }
    let s = yazi(x0 + 8, y0 + 8, baslik, "g-kod g-kucuk g-kalin", "start");
    s += yazi(x0 + 8, y0 + 36, "önce", "g-mini g-soluk", "start") + bitDizisi(bx, y0 + 24, giris, { en, boy: 24 });
    s += yazi(x0 + 8, y0 + 88, "sonra", "g-mini g-soluk", "start");
    s += bitDizisi(bx, y0 + 76, cikis, { en, boy: 24, vurgu: dondur ? [kaydir > 0 ? n - 1 : 0] : yeni, vurguCls: dondur ? "g-dolu g-secili" : "g-ton1" });
    for (let i = 0; i < n; i++) {
      const j = i - kaydir;
      const x1 = bx + i * en + en / 2;
      if (j >= 0 && j < n) s += ok([[x1, y0 + 50], [bx + j * en + en / 2, y0 + 74]], "g-bag", "g-uc");
      else if (!dondur) {
        const xd = bx + j * en;
        s += ok([[x1, y0 + 50], [xd + en / 2, y0 + 74]], "g-bag", "g-uc") + kutu(xd, y0 + 76, en, 24, "g-cerceve") + yazi(xd + en / 2, y0 + 88, giris[i]!, "g-kod g-mini g-soluk");
      }
    }
    if (dondur) {
      // Uçtan çıkan bit öbür uçtan girer: kutuların dışından dolaşan ok
      const sol = bx + en / 2;
      const sag = bx + (n - 1) * en + en / 2;
      if (kaydir > 0) s += ok([[sol, y0 + 24], [sol, y0 + 16], [bx + n * en + 14, y0 + 16], [bx + n * en + 14, y0 + 88], [bx + n * en, y0 + 88]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
      else s += ok([[sag, y0 + 24], [sag, y0 + 16], [bx - 14, y0 + 16], [bx - 14, y0 + 112], [sol, y0 + 112], [sol, y0 + 100]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
    }
    s += yazi(x0 + 8, y0 + 126, not, "g-mini g-soluk", "start");
    return s;
  };
  let s = hucre(0, 4, 'x sll 1 = "0110"', "1011", 1, false, "soldaki bit düşer, sağdan '0' girer");
  s += hucre(320, 4, 'x srl 2 = "0010"', "1011", -2, false, "sağdaki iki bit düşer, soldan '0' girer");
  s += hucre(0, 140, '"1001" rol 1 = "0011"', "1001", 1, true, "soldan çıkan bit sağdan girer");
  s += hucre(320, 140, '"1001" ror 1 = "1100"', "1001", -1, true, "sağdan çıkan bit soldan girer");
  s += cizgi([[320, 10], [320, 272]], "g-kesik");
  return s;
}

// ---- mod ve rem sayı doğrusunda ----
function modRem(): string {
  const x = (v: number) => 200 + v * 17;
  const y = 96;
  let s = yazi(20, 14, "-7'yi 3'e böl", "g-kucuk g-kalin", "start");
  s += cizgi([[x(-10.5), y], [x(10.5), y]], "g-cizgi");
  for (let v = -10; v <= 10; v++) {
    const kat = v % 3 === 0;
    s += cizgi([[x(v), y - (kat ? 6 : 3)], [x(v), y + (kat ? 6 : 3)]], kat ? "g-cizgi" : "g-bag");
    if (kat) s += yazi(x(v), y + 18, String(v), "g-mini g-kod");
  }
  s += nokta(x(-7), y, "g-renk-b") + yazi(x(-7), y + 18, "-7", "g-mini g-kod g-kalin g-renk-b");
  // rem: bölüm sıfıra doğru, -7 / 3 = -2, kat -6
  s += yol(`M${x(-6)},${y - 8} Q${(x(-6) + x(-7)) / 2},${y - 36} ${x(-7)},${y - 8}`, "g-cizgi g-renk-a-cizgi");
  s += yazi(x(-6.5), y - 44, "rem = -1", "g-kucuk g-kod g-kalin g-renk-a");
  s += yazi(x(-6.5), y - 60, "-7 / 3 = -2, kat -6", "g-mini g-soluk");
  s += ok([[x(0) - 2, y - 26], [x(-5.6), y - 26]], "g-bag", "g-uc") + yazi(x(0) + 4, y - 26, "sıfıra doğru", "g-mini g-soluk", "start");
  // mod: bölüm aşağı yuvarlanır, kat -9
  s += yol(`M${x(-9)},${y + 30} Q${(x(-9) + x(-7)) / 2},${y + 58} ${x(-7)},${y + 30}`, "g-cizgi g-renk-c-cizgi");
  s += yazi(x(-6.4), y + 52, "mod = 2", "g-kucuk g-kod g-kalin g-renk-c", "start");
  s += yazi(20, y + 82, "-7 / 3 aşağı yuvarlanırsa -3, kat -9", "g-mini g-soluk", "start");
  s += yazi(20, 214, "rem'in işareti bölünenden (-7), mod'un işareti bölenden (3) gelir.", "g-mini g-soluk", "start");
  // Tablo
  const tx = 396;
  const kolon = [tx + 16, tx + 60, tx + 124, tx + 200];
  ["a", "b", "a rem b", "a mod b"].forEach((b, i) => (s += yazi(kolon[i]!, 26, b, "g-kucuk g-kalin g-kod")));
  s += cizgi([[tx, 38], [tx + 238, 38]], "g-bag");
  const satir: [number, number][] = [[7, 3], [-7, 3], [7, -3], [-7, -3]];
  satir.forEach(([a, b], r) => {
    const yy = 56 + r * 30;
    const rem = a % b;
    const mod = ((a % b) + b) % b;
    if (a === -7 && b === 3) s += kutu(tx, yy - 13, 238, 26, "g-bolge-a");
    [a, b, rem, mod].forEach((v, i) => (s += yazi(kolon[i]!, yy, String(v), `g-kod g-kucuk${i === 2 ? " g-renk-a" : i === 3 ? " g-renk-c" : ""}`)));
  });
  s += satirlar(tx, 186, ["Pozitif sayılarda ikisi eşit.", "İşaretler farklıysa ayrılırlar."], "g-mini g-soluk", "start", 15);
  return s;
}

// ---- 4 bitlik sayı çemberi ----
function sayiCemberi(): string {
  const cx = 160;
  const cy = 156;
  const r = 104;
  const aci = (k: number) => ((-90 + k * 22.5) * Math.PI) / 180;
  const p = (k: number, rr: number): Nokta => [cx + rr * Math.cos(aci(k)), cy + rr * Math.sin(aci(k))];
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" class="g-bag"/>`;
  // 12 + 5: 12'den saat yönünde beş adım
  const yayNok: Nokta[] = [];
  for (let t = 0; t <= 40; t++) yayNok.push(p(12 + (5 * t) / 40, r));
  s += ok(yayNok, "g-yol", "g-renk-a");
  for (let k = 0; k < 16; k++) {
    const [x, y] = p(k, r);
    const bit = k.toString(2).padStart(4, "0");
    const isaretli = k >= 8 ? k - 16 : k;
    const vurgu = k === 12 || k === 1;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" class="${vurgu ? "g-renk-a" : "g-uc"}"/>`;
    const [bx, by] = p(k, r + 22);
    s += yazi(bx, by, bit, `g-mini g-kod${vurgu ? " g-kalin g-renk-a" : ""}`);
    const [ux, uy] = p(k, r - 18);
    s += yazi(ux, uy, String(k), `g-mini${vurgu ? " g-kalin g-renk-a" : ""}`);
    const [sx, sy] = p(k, r - 40);
    s += yazi(sx, sy, String(isaretli), "g-mini g-renk-c");
  }
  // Taşma sınırları
  const sinir = (k: number, cls: string) => {
    const [x1, y1] = p(k, r - 10);
    const [x2, y2] = p(k, r + 10);
    return cizgi([[x1, y1], [x2, y2]], cls);
  };
  s += sinir(-0.5, "g-cizgi g-renk-a-cizgi") + sinir(7.5, "g-cizgi g-renk-c-cizgi");
  s += yazi(cx, cy - 6, "unsigned", "g-mini") + yazi(cx, cy + 10, "signed", "g-mini g-renk-c");
  // Açıklama
  const tx = 330;
  s += yazi(tx, 30, "Toplam 4 bite sığmazsa çember döner:", "g-kucuk g-kalin", "start");
  s += satirlar(tx, 56, ["unsigned  12 + 5 = 17 → 17 - 16 = 1", "unsigned   2 - 3 = -1 → -1 + 16 = 15", "signed    -7 - 6 = -13 → -13 + 16 = 3"], "g-kod g-mini", "start", 20);
  s += cizgi([[tx, 132], [tx + 18, 132]], "g-yol") + yazi(tx + 26, 132, "12'den 5 adım: 15'ten 0'a geçip 1'e gelir", "g-mini", "start");
  s += cizgi([[tx, 160], [tx + 18, 160]], "g-cizgi g-renk-a-cizgi") + yazi(tx + 26, 160, "unsigned taşma sınırı (15 → 0)", "g-mini", "start");
  s += cizgi([[tx, 182], [tx + 18, 182]], "g-cizgi g-renk-c-cizgi") + yazi(tx + 26, 182, "signed taşma sınırı (7 → -8)", "g-mini", "start");
  s += satirlar(tx, 216, ["Çemberin dışında bitler, içinde aynı bitlerin", "unsigned ve signed değeri var.", "numeric_std taşmada uyarı vermez."], "g-mini g-soluk", "start", 15);
  return s;
}

// ---- Bir bit genişletip eldeyi tutmak ----
function genisletme(): string {
  const en = 28;
  const panel = (x0: number, baslik: string, a: string, b: string, sonuc: string, atilan: boolean, not: string[]) => {
    const n = sonuc.length;
    const sag = x0 + 210;
    const bx = sag - n * en;
    let s = yazi(x0, 16, baslik, "g-kucuk g-kalin", "start");
    const genis = !atilan;
    s += bitDizisi(bx, 34, a, { en, boy: 24, vurgu: genis ? [0] : [], vurguCls: "g-ton1" }) + yazi(sag + 10, 46, genis ? "'0' & a" : "a", "g-kod g-mini", "start");
    s += yazi(bx - 10, 76, "+", "g-kalin", "end");
    s += bitDizisi(bx, 64, b, { en, boy: 24, vurgu: genis ? [0] : [], vurguCls: "g-ton1" }) + yazi(sag + 10, 76, genis ? "'0' & b" : "b", "g-kod g-mini", "start");
    s += cizgi([[bx - 30, 98], [sag, 98]]);
    s += bitDizisi(bx, 106, sonuc, { en, boy: 24, vurgu: genis ? [0] : [], vurguCls: "g-dolu g-secili" });
    if (atilan) {
      const xd = bx - en - 10;
      s += kutu(xd, 106, en, 24, "g-hata") + yazi(xd + en / 2, 118, "1", "g-kod g-kucuk");
      s += cizgi([[xd + 4, 110], [xd + en - 4, 126]], "g-cizgi g-renk-b-cizgi") + yazi(xd + en / 2, 144, "atılır", "g-mini g-renk-b");
    } else s += yazi(bx + en / 2, 144, "elde", "g-mini g-renk-a");
    s += satirlar(x0, 172, not, "g-mini g-soluk", "start", 15);
    return s;
  };
  let s = panel(20, "4 bit + 4 bit → 4 bit", "1100", "0101", "0001", true, ["12 + 5 = 17 sığmaz; sonuç 1 olur.", "Hata ya da uyarı çıkmaz."]);
  s += panel(350, "('0' & a) + ('0' & b) → 5 bit", "01100", "00101", "10001", false, ["Önce iki tarafı bir bit genişlet:", "sonuç 10001 = 17, elde 5. bitte kalır."]);
  s += cizgi([[330, 10], [330, 200]], "g-kesik");
  return s;
}

// ---- Dizi öznitelikleri: downto ve to ----
function diziYonu(): string {
  const en = 34;
  const bx = 160;
  const satir = (y: number, ad: string, indisler: number[], solEtiket: string[], sagEtiket: string[], ek: string[]) => {
    let s = yazi(bx - 14, y + 14, ad, "g-kod g-kucuk", "end");
    indisler.forEach((ind, i) => {
      const uc = i === 0 || i === indisler.length - 1;
      s += kutu(bx + i * en, y, en, 28, uc ? "g-dolu g-secili" : "g-kutu") + yazi(bx + i * en + en / 2, y + 14, String(ind), "g-kod g-kucuk");
    });
    const sonX = bx + (indisler.length - 1) * en + en / 2;
    s += satirlar(bx + en / 2, y - 34, solEtiket, "g-mini g-kod g-renk-a", "middle", 13);
    s += satirlar(sonX, y - 34, sagEtiket, "g-mini g-kod g-renk-a", "middle", 13);
    s += ok([[bx + en / 2, y - 10], [bx + en / 2, y - 2]], "g-cizgi g-renk-a-cizgi", "g-renk-a") + ok([[sonX, y - 10], [sonX, y - 2]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
    s += satirlar(bx + indisler.length * en + 24, y - 6, ek, "g-mini g-kod", "start", 15);
    return s;
  };
  let s = satir(52, "d(7 downto 0)", [7, 6, 5, 4, 3, 2, 1, 0], ["'left = 7", "'high = 7"], ["'right = 0", "'low = 0"], ["'length = 8", "'range =", "  7 downto 0"]);
  s += satir(146, "x(0 to 7)", [0, 1, 2, 3, 4, 5, 6, 7], ["'left = 0", "'low = 0"], ["'right = 7", "'high = 7"], ["'length = 8", "'range =", "  0 to 7"]);
  s += yazi(320, 196, "'left ve 'right yazılış sırasını izler: hep soldaki ve sağdaki kutu.", "g-mini g-soluk");
  s += yazi(320, 212, "'high ve 'low yönden bağımsızdır: hep en büyük ve en küçük indis.", "g-mini g-soluk");
  return s;
}

// ---- Etkileşimli öznitelik gezgini ----
export const OZ_ARALIKLARI = ["7 downto 0", "0 to 7", "6 downto 1", "5 to 12"] as const;
export const OZ_OZNITELIKLER = ["left", "right", "high", "low", "length", "range", "reverse_range"] as const;
export type OzAralik = (typeof OZ_ARALIKLARI)[number];
export type OzAd = (typeof OZ_OZNITELIKLER)[number];

export function aralikIndisleri(aralik: string): number[] {
  const m = /^(\d+) (downto|to) (\d+)$/.exec(aralik);
  if (!m) return [];
  const a = +m[1]!;
  const b = +m[3]!;
  const liste: number[] = [];
  if (m[2] === "downto") for (let i = a; i >= b; i--) liste.push(i);
  else for (let i = a; i <= b; i++) liste.push(i);
  return liste;
}

// Özniteliğin değeri ve şekilde vurgulanacak kutuların konumları (0 = en soldaki kutu)
export function oznitelikSonuc(aralik: string, oz: OzAd): { deger: string; kutular: number[] } {
  const ind = aralikIndisleri(aralik);
  const n = ind.length;
  const enBuyuk = Math.max(...ind);
  const enKucuk = Math.min(...ind);
  const hepsi = ind.map((_, i) => i);
  const asagi = aralik.includes("downto");
  switch (oz) {
    case "left":
      return { deger: String(ind[0]), kutular: [0] };
    case "right":
      return { deger: String(ind[n - 1]), kutular: [n - 1] };
    case "high":
      return { deger: String(enBuyuk), kutular: [ind.indexOf(enBuyuk)] };
    case "low":
      return { deger: String(enKucuk), kutular: [ind.indexOf(enKucuk)] };
    case "length":
      return { deger: String(n), kutular: hepsi };
    case "range":
      return { deger: aralik, kutular: hepsi };
    case "reverse_range":
      return { deger: asagi ? `${ind[n - 1]} to ${ind[0]}` : `${ind[n - 1]} downto ${ind[0]}`, kutular: hepsi };
  }
}

export function oznitelikGezgini(aralik: string, oz: OzAd): string {
  const ind = aralikIndisleri(aralik);
  const n = ind.length;
  const en = 52;
  const bx = (640 - n * en) / 2;
  const { deger, kutular } = oznitelikSonuc(aralik, oz);
  let s = yazi(320, 18, `signal d : std_logic_vector(${aralik});`, "g-kod g-kucuk");
  ind.forEach((v, i) => {
    const sec = kutular.includes(i);
    s += kutu(bx + i * en, 70, en, 40, sec ? "g-dolu g-secili" : "g-kutu") + yazi(bx + i * en + en / 2, 90, `d(${v})`, `g-kod g-mini${sec ? " g-kalin" : ""}`);
  });
  s += yazi(bx - 10, 90, "sol", "g-mini g-soluk", "end") + yazi(bx + n * en + 10, 90, "sağ", "g-mini g-soluk", "start");
  if (kutular.length === 1) {
    const x = bx + kutular[0]! * en + en / 2;
    s += ok([[x, 42], [x, 66]], "g-cizgi g-renk-a-cizgi", "g-renk-a") + yazi(x, 34, `d'${oz}`, "g-kod g-kucuk g-renk-a");
  } else if (oz === "length") {
    s += cizgi([[bx, 56], [bx, 64]], "g-cizgi g-renk-a-cizgi") + cizgi([[bx + n * en, 56], [bx + n * en, 64]], "g-cizgi g-renk-a-cizgi");
    s += cizgi([[bx, 60], [bx + n * en, 60]], "g-cizgi g-renk-a-cizgi") + yazi(320, 44, `d'length: ${n} kutu`, "g-kod g-kucuk g-renk-a");
  } else {
    const ters = oz === "reverse_range";
    s += ok(ters ? [[bx + n * en, 58], [bx, 58]] : [[bx, 58], [bx + n * en, 58]], "g-cizgi g-renk-a-cizgi", "g-renk-a");
    s += yazi(320, 42, ters ? `d'reverse_range: sağdan sola, ${deger}` : `d'range: soldan sağa, ${deger}`, "g-kod g-kucuk g-renk-a");
  }
  s += yazi(320, 140, `d'${oz} = ${deger}`, "g-kod g-kalin");
  const not: Record<OzAd, string> = {
    left: "Yazılışta soldaki indis; yöne bağlıdır.",
    right: "Yazılışta sağdaki indis; yöne bağlıdır.",
    high: "En büyük indis; yönden bağımsızdır.",
    low: "En küçük indis; yönden bağımsızdır.",
    length: "Eleman sayısı: büyük indis - küçük indis + 1.",
    range: "Döngüde for i in d'range loop yazılırsa i bu sırayla dolaşır.",
    reverse_range: "Aynı indisler, ters sırada.",
  };
  s += yazi(320, 168, not[oz], "g-mini g-soluk");
  return s;
}

// ---- others ile toplu atama ----
function othersSirasi(): string {
  const en = 40;
  const satir = (y: number, baslik: string, indisler: number[], sonuc: string) => {
    let s = yazi(20, y - 18, baslik, "g-kod g-kucuk", "start");
    indisler.forEach((ind, i) => {
      const bir = ind === 1;
      s += kutu(150 + i * en, y, en, 30, bir ? "g-dolu g-secili" : "g-kutu") + yazi(150 + i * en + en / 2, y + 15, bir ? "'1'" : "'0'", `g-kod g-kucuk${bir ? " g-kalin g-renk-a" : ""}`);
      s += yazi(150 + i * en + en / 2, y + 42, `v(${ind})`, `g-mini g-kod${bir ? " g-renk-a" : " g-soluk"}`);
    });
    s += yazi(140, y + 15, "v =", "g-kod g-kucuk", "end");
    s += ok([[320, y + 15], [372, y + 15]]) + yazi(384, y + 15, `"${sonuc}"`, "g-kod g-kalin", "start");
    return s;
  };
  let s = yazi(320, 14, "v <= (1 => '1', others => '0');", "g-kod g-kucuk g-kalin");
  s += satir(62, "std_logic_vector(3 downto 0)", [3, 2, 1, 0], "0010");
  s += satir(152, "std_logic_vector(0 to 3)", [0, 1, 2, 3], "0100");
  s += ok([[150, 234], [310, 234]], "g-bag") + yazi(320, 234, "dizgi her zaman soldaki kutudan başlayarak okunur", "g-mini g-soluk", "start");
  return s;
}

// ---- Sinyal öznitelikleri dalgada ----
// Bir anı gösteren dikey çizgi ve tepesinde nokta
const an = (x: number, taban: number, boy: number, renk: "a" | "c" | "" = "") =>
  cizgi([[x, taban], [x, taban - boy]], renk ? `g-cizgi g-renk-${renk}-cizgi` : "g-cizgi") + `<circle cx="${x}" cy="${taban - boy}" r="3" class="${renk ? `g-renk-${renk}` : "g-uc"}"/>`;

function sinyalOznitelikleri(): string {
  const x0 = 20 + 120;
  const adim = 46;
  const olaylar = [2, 5, 8];
  let s = dalga(20, 30, [
    { ad: "s", dalga: "0011100011" },
    { ad: "s'last_value", dalga: "=.=..=..=.", veri: ["'0'", "'0'", "'1'", "'0'"] },
  ], { etiketEn: 120, adim, boy: 20, ara: 46, isaretler: olaylar.map((t) => ({ t, etiket: "olay" })) });
  // s'event satırı: yalnızca olay anlarında true
  const ey = 150;
  s += yazi(x0 - 10, ey - 10, "s'event", "g-kod g-kucuk", "end");
  s += cizgi([[x0, ey], [x0 + 10 * adim, ey]], "g-bag");
  for (const t of olaylar) s += an(x0 + t * adim, ey, 22, "a");
  s += yazi(x0 + 10 * adim + 6, ey - 4, "true", "g-mini g-renk-a", "start");
  // s'stable: olay anları dışında true
  const sy = 196;
  s += yazi(x0 - 10, sy - 10, "s'stable", "g-kod g-kucuk", "end");
  let d = `M${x0},${sy - 22}`;
  for (const t of olaylar) {
    const x = x0 + t * adim;
    d += ` H${x - 3} V${sy} H${x + 3} V${sy - 22}`;
  }
  d += ` H${x0 + 10 * adim}`;
  s += yol(d, "g-dalga g-renk-c-cizgi");
  s += yazi(x0 + 10 * adim + 6, sy - 22, "true", "g-mini g-renk-c", "start");
  s += yazi(x0 + 10 * adim + 6, sy, "false", "g-mini g-soluk", "start");
  s += yazi(320, 226, "'event yalnızca değişim anında true'dur; 'stable onun tersidir. 'last_value değişimden önceki değeri tutar.", "g-mini g-soluk");
  s += yazi(320, 244, "Sentezde yalnızca 'event ve 'stable kullanılabilir; 'last_value benzetim içindir.", "g-mini g-soluk");
  return s;
}

// ---- Saat kenarları ----
function saatKenarlari(): string {
  const x0 = 20 + 176;
  const adim = 40;
  const yukselen = [1, 3, 5, 7, 9];
  const dusen = [2, 4, 6, 8];
  let s = dalga(20, 30, [{ ad: "clk", dalga: "0101010101" }], { etiketEn: 176, adim, boy: 22 });
  const satir = (y: number, ad: string, anlar: number[], renk: "a" | "c" | "") => {
    let r = yazi(x0 - 10, y - 8, ad, "g-kod g-mini", "end") + cizgi([[x0, y], [x0 + 10 * adim, y]], "g-bag");
    for (const t of anlar) r += an(x0 + t * adim, y, 18, renk);
    return r;
  };
  s += satir(94, "clk'event", [...yukselen, ...dusen], "");
  s += satir(136, "rising_edge(clk)", yukselen, "a");
  s += satir(178, "falling_edge(clk)", dusen, "c");
  s += kutu(20, 196, 600, 58, "g-sabit");
  s += yazi(32, 210, "Yükselen kenar, üçü aynı:", "g-mini g-renk-a g-kalin", "start");
  s += yazi(32, 228, "clk'event and clk = '1'    not clk'stable and clk = '1'    rising_edge(clk)", "g-kod g-mini", "start");
  s += yazi(32, 245, "Düşen kenar: clk'event and clk = '0'  ya da  falling_edge(clk)", "g-kod g-mini g-renk-c", "start");
  return s;
}

// ---- Sayım tipi şeridi ----
function sayimSeridi(): string {
  const en = 84;
  const bx = 150;
  let s = yazi(20, 14, "type durum is (bekle, ileri, geri, dur);", "g-kod g-kucuk", "start");
  const degerler = ["bekle", "ileri", "geri", "dur"];
  s += yazi(bx - 14, 40, "'pos", "g-kod g-mini", "end") + yazi(bx - 14, 64, "değer", "g-mini", "end") + yazi(bx - 14, 92, "kod", "g-mini", "end");
  degerler.forEach((d, i) => {
    const x = bx + i * en;
    const vurgu = i === 2 || i === 3;
    s += yazi(x + en / 2 - 4, 40, String(i), `g-kod g-kucuk${i === 2 ? " g-kalin g-renk-a" : ""}`);
    s += kutu(x, 50, en - 8, 28, vurgu ? "g-dolu g-secili" : "g-dolu") + yazi(x + en / 2 - 4, 64, d, "g-kod g-kucuk");
    s += yazi(x + en / 2 - 4, 92, i.toString(2).padStart(2, "0"), "g-kod g-mini g-soluk");
  });
  s += yazi(bx + en / 2 - 4, 112, "durum'left", "g-kod g-mini g-renk-a");
  s += yazi(bx + 3 * en + en / 2 - 4, 112, "durum'high", "g-kod g-mini g-renk-a");
  s += satirlar(bx + 4 * en + 4, 40, ["durum'pos(geri) = 2", "durum'val(3) = dur"], "g-kod g-mini g-renk-a", "start", 16);
  s += yazi(bx + 4 * en + 4, 80, "başlangıç değeri", "g-mini g-soluk", "start") + yazi(bx + 4 * en + 4, 94, "yoksa 'left: bekle", "g-mini g-soluk", "start");
  // İkinci şerit: enum_encoding
  s += cizgi([[20, 128], [620, 128]], "g-kesik");
  s += yazi(20, 146, "type color is (red, green, blue, white);", "g-kod g-kucuk", "start");
  s += yazi(20, 164, 'attribute enum_encoding of color : type is "11 00 10 01";', "g-kod g-mini g-renk-a", "start");
  const renkler = ["red", "green", "blue", "white"];
  const kodlar = ["11", "00", "10", "01"];
  s += yazi(bx - 14, 194, "değer", "g-mini", "end") + yazi(bx - 14, 222, "sıralı", "g-mini", "end") + yazi(bx - 14, 242, "enum_encoding", "g-mini g-renk-a", "end");
  renkler.forEach((d, i) => {
    const x = bx + i * en;
    s += kutu(x, 180, en - 8, 28, "g-dolu") + yazi(x + en / 2 - 4, 194, d, "g-kod g-kucuk");
    s += yazi(x + en / 2 - 4, 222, i.toString(2).padStart(2, "0"), "g-kod g-mini g-soluk");
    s += yazi(x + en / 2 - 4, 242, kodlar[i]!, "g-kod g-mini g-kalin g-renk-a");
  });
  s += satirlar(bx + 4 * en + 4, 194, ["Dizgideki kodlar", "aynı sırayla", "değerlere verilir."], "g-mini g-soluk", "start", 15);
  return s;
}

// ---- Kullanıcı tanımlı öznitelik ----
function kullaniciOzniteligi(): string {
  const kart = (x: number, no: string, ad: string, kod: string[], not: string) => {
    let s = kutu(x, 30, 192, 104, "g-kutu") + kutu(x, 30, 192, 24, "g-dolu");
    s += yazi(x + 10, 42, `${no}. ${ad}`, "g-kucuk g-kalin", "start");
    s += satirlar(x + 10, 72, kod, "g-kod g-mini", "start", 16);
    s += yazi(x + 96, 150, not, "g-mini g-soluk");
    return s;
  };
  let s = kart(14, "1", "Bildirim", ["attribute number_of_inputs", "  : integer;"], "ad ve tip");
  s += kart(224, "2", "Belirtim", ["attribute number_of_inputs", "  of nand3 : signal", "  is 3;"], "hangi nesneye, hangi değer");
  s += kart(434, "3", "Okuma", ["nand3'number_of_inputs", "", "-- değeri 3"], "nesne'öznitelik");
  s += ok([[206, 82], [222, 82]]) + ok([[416, 82], [432, 82]]);
  s += kutu(14, 168, 612, 30, "g-sabit");
  s += yazi(320, 183, "attribute ad of hedef : sınıf is değer;", "g-kod g-kucuk");
  s += yazi(320, 214, "sınıf: hedefin türü (signal, entity, type, ...)", "g-mini g-soluk");
  return s;
}

// ---- GENERIC: aynı parite, iki genişlik ----
function pariteZinciri(x0: number, n: number): string {
  const gy = 132;
  let s = yazi(x0, 106, `u${n} : generic map (N => ${n})`, "g-kod g-mini g-kalin", "start");
  // İlk girişin hattı
  s += cizgi([[x0 + 10, 186], [x0 + 10, gy + 6], [x0 + 30, gy + 6]]) + yazi(x0 + 10, 198, "d(0)", "g-mini g-kod");
  for (let k = 0; k < n - 1; k++) {
    const gx = x0 + 30 + k * 34;
    s += ozelVeya(gx, gy, 24, 24);
    s += cizgi([[gx - 10, 186], [gx - 10, gy + 18], [gx + 2, gy + 18]]);
    if (k > 0) s += yazi(gx - 10, 198 + (k % 2) * 12, `d(${k + 1})`, "g-mini g-kod");
    else s += yazi(gx - 10, 210, "d(1)", "g-mini g-kod");
    if (k < n - 2) s += cizgi([[gx + 24, gy + 12], [gx + 29, gy + 12], [gx + 29, gy + 6], [gx + 36, gy + 6]]);
    else s += ok([[gx + 24, gy + 12], [gx + 46, gy + 12]]) + yazi(gx + 50, gy + 12, "p", "g-kod g-kucuk", "start");
  }
  s += yazi(x0, 236, `${n} giriş, ${n - 1} XOR kapısı`, "g-mini g-renk-a", "start");
  return s;
}

function genericParite(): string {
  let s = kutu(220, 10, 200, 52, "g-dolu") + satirlar(320, 26, ["entity parite", "generic (N : positive := 8)"], "g-kod g-mini", "middle", 18);
  s += ok([[260, 62], [120, 92]]) + ok([[380, 62], [470, 92]]);
  s += pariteZinciri(30, 4) + pariteZinciri(330, 8);
  s += cizgi([[310, 100], [310, 240]], "g-kesik");
  s += yazi(320, 260, "Aynı kod; N derleme anında sabitlenir ve for i in d'range döngüsü N'ye göre açılır.", "g-mini g-soluk");
  return s;
}

export const HAFTA_3_GORSELLERI: Gorsel[] = [
  {
    kod: "G-H3-03",
    baslik: "Port modları: veri hangi yöne akar?",
    aciklama:
      "Dört panel. in: ok dışarıdan mimariye; içeride okunur, yazılamaz. out: ok mimariden dışarıya; içeride yazılır ama VHDL-93'te okunamaz. inout: iki ok, biri içeri biri dışarı; hem dışarıdan hem içeriden sürülür. buffer: ok dışarıya, ayrıca port değeri mimariye geri döner; yazılır ve geri okunur ama tek kaynak sürer.",
    en: 640,
    boy: 204,
    icerik: portModlari(),
  },
  {
    kod: "G-H3-04",
    baslik: "Bir entity, iki architecture",
    aciklama:
      "Solda entity ve_kapisi: a ve b giriş, y çıkış. Sağda bu entity'nin iki mimarisi: kapi (y <= a and b) ve tablo (y <= '1' when a = '1' and b = '1' else '0'). Alttaki örnekleme satırı entity work.ve_kapisi(tablo) yazarak tablo mimarisini seçer.",
    en: 640,
    boy: 214,
    icerik: ikiMimari(),
  },
  {
    kod: "G-H3-05",
    baslik: "Tam toplayıcı: iki yarım toplayıcı ve bir VEYA",
    aciklama:
      "a ve b birinci yarım toplayıcıya girer: XOR çıkışı p, AND çıkışı ab. p ve cin ikinci yarım toplayıcıya girer: XOR çıkışı s, AND çıkışı cin·p. ab ile cin·p VEYA'lanır ve cout olur. Örnekte a = 1, b = 0, cin = 1: p = 1, ab = 0, cin·p = 1, s = 0, cout = 1.",
    en: 640,
    boy: 234,
    icerik: tamToplayici(),
  },
  {
    kod: "G-H3-06",
    baslik: "4 bitlik toplayıcı: elde zinciri",
    aciklama:
      "Dört tam toplayıcı yan yana; bit 0 en sağda. a = 0111 ve b = 0011. Elde sağdan sola ilerler: cin = 0, c1 = 1, c2 = 1, c3 = 1, cout = 0. Toplam bitleri s3 s2 s1 s0 = 1010, yani 10.",
    en: 640,
    boy: 226,
    icerik: dalgaliElde(),
  },
  {
    kod: "G-H3-07",
    baslik: "Operatör öncelik merdiveni",
    aciklama:
      "Yukarıdan aşağı yedi basamak: ** abs not; * / mod rem; işaret + -; toplama + - &; kaydırma; ilişkisel; mantıksal. Yukarıdaki basamak önce uygulanır. Sağda örnekler: not a and b, (not a) and b demektir; a + b * c, a + (b * c) demektir; a and b or c ve a nand b nand c derlenmez.",
    en: 640,
    boy: 270,
    icerik: oncelikMerdiveni(),
  },
  {
    kod: "G-H3-08",
    baslik: "Kaydırma ve döndürme bit bit",
    aciklama:
      "Dört kutu. x = 1011 için sll 1: bitler bir sola kayar, soldaki 1 düşer, sağdan 0 girer: 0110. srl 2: bitler iki sağa kayar, sağdaki iki bit düşer, soldan iki 0 girer: 0010. 1001 için rol 1: soldan çıkan 1 sağdan girer: 0011. ror 1: sağdan çıkan 1 soldan girer: 1100.",
    en: 640,
    boy: 280,
    icerik: kaydirma(),
  },
  {
    kod: "G-H3-09",
    baslik: "mod ve rem sayı doğrusunda",
    aciklama:
      "-10'dan 10'a bir sayı doğrusu; 3'ün katları işaretli, -7 vurgulu. rem için bölüm sıfıra doğru yuvarlanır: -7 / 3 = -2, kat -6, kalan -1. mod için bölüm aşağı yuvarlanır: kat -9, kalan 2. Sağdaki tablo: 7 ve 3 için ikisi de 1; -7 ve 3 için rem -1, mod 2; 7 ve -3 için rem 1, mod -2; -7 ve -3 için ikisi de -1.",
    en: 640,
    boy: 226,
    icerik: modRem(),
  },
  {
    kod: "G-H3-10",
    baslik: "4 bitlik sayı çemberi: taşma sarar",
    aciklama:
      "0000'dan 1111'e on altı bit deseni bir çemberin çevresinde. İç halkada unsigned değerleri 0-15, daha içte signed değerleri; 1000'dan itibaren signed değer -8'den başlar. 12'den saat yönünde beş adımlık ok 15'ten 0'a geçip 1'de biter: 12 + 5 = 17, 4 bitte 1 olur. Unsigned taşma sınırı 15 ile 0 arasında, signed taşma sınırı 7 ile -8 arasında.",
    en: 640,
    boy: 300,
    icerik: sayiCemberi(),
  },
  {
    kod: "G-H3-11",
    baslik: "Eldeyi tutmak için bir bit genişlet",
    aciklama:
      "Solda 4 bitlik toplama: 1100 + 0101 = 0001; beşinci bitteki elde 1 atılır. Sağda iki işlenen önce '0' ile genişletilir: 01100 + 00101 = 10001, yani 17; elde beşinci bitte kalır.",
    en: 640,
    boy: 206,
    icerik: genisletme(),
  },
  {
    kod: "G-H3-12",
    baslik: "downto ve to: öznitelikler hangi kutuyu gösterir?",
    aciklama:
      "Üstte d(7 downto 0): kutular soldan sağa 7'den 0'a. 'left ve 'high soldaki kutu (7), 'right ve 'low sağdaki kutu (0). Altta x(0 to 7): kutular 0'dan 7'ye; 'left ve 'low soldaki kutu (0), 'right ve 'high sağdaki kutu (7). İkisinde de 'length 8.",
    en: 640,
    boy: 222,
    icerik: diziYonu(),
  },
  {
    kod: "G-H3-13",
    baslik: "Öznitelik gezgini",
    aciklama:
      "signal d : std_logic_vector(7 downto 0) kutuları soldan sağa d(7)'den d(0)'a. d'left seçili: soldaki d(7) kutusu vurgulu, sonuç d'left = 7. Etkileşimli sürümde aralık (7 downto 0, 0 to 7, 6 downto 1, 5 to 12) ve öznitelik (left, right, high, low, length, range, reverse_range) seçilir.",
    en: 640,
    boy: 184,
    icerik: oznitelikGezgini("7 downto 0", "left"),
    etkilesim: "oznitelik",
  },
  {
    kod: "G-H3-14",
    baslik: "others ile atama: sonuç indis sırasıyla yazılır",
    aciklama:
      "v <= (1 => '1', others => '0') ataması iki vektörde. 3 downto 0'da kutular v(3), v(2), v(1), v(0) sırasında; v(1) sağdan ikinci kutudur ve sonuç 0010. 0 to 3'te kutular v(0), v(1), v(2), v(3); v(1) soldan ikinci kutudur ve sonuç 0100.",
    en: 640,
    boy: 244,
    icerik: othersSirasi(),
  },
  {
    kod: "G-H3-15",
    baslik: "'event, 'stable ve 'last_value bir dalgada",
    aciklama:
      "s sinyali 2. dilimde 0'dan 1'e, 5. dilimde 1'den 0'a, 8. dilimde 0'dan 1'e geçer. s'event yalnızca bu üç anda true'dur; s'stable bu anlar dışında hep true'dur. s'last_value başta '0', ilk değişimden sonra '0', ikinci değişimden sonra '1', üçüncüden sonra '0' olur.",
    en: 640,
    boy: 252,
    icerik: sinyalOznitelikleri(),
  },
  {
    kod: "G-H3-16",
    baslik: "Kenar algılama: hangi yazım hangi kenarı yakalar?",
    aciklama:
      "Bir saat dalgası ve altında üç satır. clk'event her kenarda, yükselen ve düşen kenarların hepsinde true'dur. rising_edge(clk) yalnızca yükselen, falling_edge(clk) yalnızca düşen kenarlarda true'dur. Alttaki kutu: clk'event and clk = '1', not clk'stable and clk = '1' ve rising_edge(clk) yükselen kenar için aynıdır; clk'event and clk = '0' düşen kenardır.",
    en: 640,
    boy: 262,
    icerik: saatKenarlari(),
  },
  {
    kod: "G-H3-17",
    baslik: "Sayım tipi: değer, konum ve kod",
    aciklama:
      "Üst şerit: durum tipinin değerleri bekle, ileri, geri, dur; konumları 0, 1, 2, 3; sıralı kodları 00, 01, 10, 11. durum'left = bekle, durum'high = dur, durum'pos(geri) = 2, durum'val(3) = dur. Alt şerit: color tipinin red, green, blue, white değerleri sıralı kodlamada 00, 01, 10, 11; enum_encoding \"11 00 10 01\" ile 11, 00, 10, 01 olur.",
    en: 640,
    boy: 254,
    icerik: sayimSeridi(),
  },
  {
    kod: "G-H3-18",
    baslik: "Kullanıcı tanımlı öznitelik: bildir, bağla, oku",
    aciklama:
      "Üç kart soldan sağa. 1. Bildirim: attribute number_of_inputs : integer. 2. Belirtim: attribute number_of_inputs of nand3 : signal is 3. 3. Okuma: nand3'number_of_inputs, değeri 3. Altta genel biçim: attribute ad of hedef : sınıf is değer.",
    en: 640,
    boy: 226,
    icerik: kullaniciOzniteligi(),
  },
  {
    kod: "G-H3-19",
    baslik: "GENERIC: aynı parite, iki genişlik",
    aciklama:
      "Üstte tek bir entity parite, generic (N : positive := 8). Altta iki örnek. Solda generic map (N => 4): d(0)'dan d(3)'e dört giriş, zincirlenmiş üç XOR kapısı. Sağda N => 8: sekiz giriş, yedi XOR kapısı. İkisinin de çıkışı p.",
    en: 640,
    boy: 270,
    icerik: genericParite(),
  },
];
