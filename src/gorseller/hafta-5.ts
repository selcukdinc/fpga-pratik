// Hafta 5 ders şekilleri (G-H5-03 ve sonrası). İlk iki şekil index.ts'tedir.

import { bitDizisi, cizgi, dalga, kutu, mux, ok, satirlar, yazi, type Nokta } from "./cizim";
import type { Gorsel } from "./tip";

const evet = (x: number, y: number) => yazi(x, y, "✓", "g-kucuk g-kalin g-renk-c");
const hayir = (x: number, y: number) => yazi(x, y, "✗", "g-kucuk g-kalin g-renk-b");
const daire = (x: number, y: number, r: number, cls = "g-kutu") => `<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`;

// Eğrileri ok() ile çizebilmek için noktalara böler
function kuadratik(p0: Nokta, c: Nokta, p1: Nokta, n = 24): Nokta[] {
  const p: Nokta[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    p.push([u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0], u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1]]);
  }
  return p;
}

function kubik(p0: Nokta, c0: Nokta, c1: Nokta, p1: Nokta, n = 24): Nokta[] {
  const p: Nokta[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;
    const k = (a: number, b: number, c: number, d: number) => u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
    p.push([k(p0[0], c0[0], c1[0], p1[0]), k(p0[1], c0[1], c1[1], p1[1])]);
  }
  return p;
}

// 2'ye 1 çoklayıcı: w = 30, h = 70; 1 girişi y + 18, 0 girişi y + 52, çıkış (x + 30, y + 35)
function mux2(x: number, y: number, sec: string, cls = "g-kutu"): string {
  return (
    mux(x, y, 30, 70, 0.2, cls) +
    yazi(x + 6, y + 18, "1", "g-mini", "start") +
    yazi(x + 6, y + 52, "0", "g-mini", "start") +
    cizgi([[x + 15, y + 64], [x + 15, y + 76]]) +
    yazi(x + 15, y + 86, sec, "g-kod g-mini")
  );
}

// ---- when/else'in son dalı koşullu: geri besleme ----
function sonElseYok(): string {
  let s = kutu(20, 10, 600, 62, "g-kutu");
  s += satirlar(32, 24, ['y <= a when sec = "00" else', '     b when sec = "01" else', '     c when sec = "10";   -- son dal da koşullu: koşulsuz else yok'], "g-kod g-mini", "start", 17);
  s += mux2(130, 110, 'sec = "10"') + mux2(250, 100, '"01"') + mux2(370, 90, '"00"');
  s += yazi(116, 128, "c", "g-kod g-kucuk", "end") + cizgi([[122, 128], [130, 128]]);
  s += yazi(236, 118, "b", "g-kod g-kucuk", "end") + cizgi([[242, 118], [250, 118]]);
  s += yazi(356, 108, "a", "g-kod g-kucuk", "end") + cizgi([[362, 108], [370, 108]]);
  s += cizgi([[160, 145], [205, 145], [205, 152], [250, 152]]);
  s += cizgi([[280, 135], [325, 135], [325, 142], [370, 142]]);
  s += ok([[400, 125], [520, 125]]) + yazi(526, 125, "y", "g-kod g-kucuk", "start");
  // Hiçbir koşul doğru değilse y kendini sürer
  s += ok([[480, 125], [480, 226], [90, 226], [90, 162], [130, 162]], "g-cizgi g-renk-b-cizgi", "g-renk-b");
  s += `<circle cx="480" cy="125" r="3" class="g-renk-b"/>`;
  s += yazi(285, 214, "geri besleme: üç koşul da yanlışsa y eski değerini tutar", "g-mini g-renk-b");
  s += kutu(440, 80, 186, 28, "g-uyari") + yazi(533, 94, "latch: istenmeyen bellek", "g-mini g-kalin");
  s += yazi(320, 248, "Son satıra koşulsuz else c yazılırsa en sağdaki çoklayıcı kalkar, c doğrudan bağlanır ve döngü kopar.", "g-mini g-soluk");
  return s;
}

// ---- 2 bitlik std_logic seçicinin 81 değeri ----
const DOKUZ = ["U", "X", "0", "1", "Z", "W", "L", "H", "-"];

function seksenBirDeger(): string {
  const x0 = 70;
  const y0 = 44;
  const h = 22;
  let s = yazi(x0 + 4.5 * h, 14, "sec(0) →", "g-kod g-mini g-soluk") + yazi(x0 - 22, 14, "sec(1) ↓", "g-kod g-mini g-soluk");
  DOKUZ.forEach((d, k) => {
    s += yazi(x0 + k * h + h / 2, y0 - 10, `'${d}'`, "g-kod g-mini");
    s += yazi(x0 - 4, y0 + k * h + h / 2, `'${d}'`, "g-kod g-mini", "end");
  });
  DOKUZ.forEach((a, i) =>
    DOKUZ.forEach((b, j) => {
      const ikili = (a === "0" || a === "1") && (b === "0" || b === "1");
      const ornek = a === "1" && b === "X";
      s += kutu(x0 + j * h, y0 + i * h, h, h, ikili ? "g-dolu g-secili" : ornek ? "g-hata" : "g-sabit");
      if (ikili) s += yazi(x0 + j * h + h / 2, y0 + i * h + h / 2, a + b, "g-kod g-mini g-kalin");
    }),
  );
  const lx = 300;
  s += kutu(lx, 40, 22, 22, "g-dolu g-secili") + yazi(lx + 32, 51, '4 değer: "00", "01", "10", "11"', "g-kucuk", "start");
  s += yazi(lx + 32, 69, "açıkça yazılan seçenekler", "g-mini g-soluk", "start");
  s += kutu(lx, 92, 22, 22, "g-sabit") + yazi(lx + 32, 103, "77 değer: when others", "g-kucuk", "start");
  s += yazi(lx + 32, 121, "'U', 'X', 'Z' ... içeren her şey", "g-mini g-soluk", "start");
  s += kutu(lx, 144, 22, 22, "g-hata") + yazi(lx + 32, 155, 'sec = "1X"', "g-kod g-kucuk", "start");
  s += yazi(lx + 32, 173, "hiçbir seçeneğe uymaz, others dalına düşer", "g-mini g-soluk", "start");
  s += yazi(lx, 208, "9 · 9 = 81 olası değer; others yazılmazsa", "g-kucuk g-kalin", "start");
  s += yazi(lx, 226, "seçenekler tam kapsanmaz ve kod derlenmez.", "g-kucuk g-kalin", "start");
  return s;
}

// ---- process'in yaşam döngüsü ----
function processDongusu(): string {
  let s = kutu(20, 70, 130, 60, "g-sabit") + yazi(85, 92, "benzetim", "g-kucuk g-kalin") + yazi(85, 110, "başlıyor", "g-kucuk g-kalin");
  s += kutu(230, 60, 170, 80, "g-dolu g-secili") + yazi(315, 84, "çalış", "g-kalin") + yazi(315, 104, "satırlar sırayla", "g-mini") + yazi(315, 120, "yukarıdan aşağı", "g-mini");
  s += kutu(480, 60, 140, 80, "g-ton1") + yazi(550, 84, "bekle", "g-kalin") + yazi(550, 104, "askıda", "g-mini") + yazi(550, 120, "hiçbir satır çalışmaz", "g-mini");
  s += ok([[150, 100], [230, 100]]) + yazi(190, 88, "her process", "g-mini g-soluk") + yazi(190, 116, "bir kez", "g-mini g-soluk");
  s += ok([[400, 78], [480, 78]]) + yazi(440, 50, "end process", "g-mini") + yazi(440, 64, "ya da wait", "g-mini");
  s += ok([[480, 122], [400, 122]], "g-cizgi g-renk-a-cizgi", "g-renk-a") + yazi(440, 136, "uyandırıcı", "g-mini g-renk-a") + yazi(440, 150, "gelince", "g-mini g-renk-a");
  s += cizgi([[20, 172], [620, 172]], "g-bag");
  s += yazi(20, 192, "Uyandırıcı iki biçimden yalnızca biri olabilir:", "g-kucuk g-kalin", "start");
  s += kutu(20, 204, 290, 52, "g-kutu") + satirlar(32, 218, ["process (a, b)", "-- listedeki bir sinyal değişince"], "g-kod g-mini", "start", 18);
  s += kutu(330, 204, 290, 52, "g-kutu") + satirlar(342, 218, ["process ... wait for 10 ns; ...", "-- wait'teki koşul gerçekleşince"], "g-kod g-mini", "start", 18);
  s += yazi(320, 272, "Sinyal atamaları process beklemeye geçince uygulanır.", "g-mini g-soluk");
  return s;
}

// ---- Eksik hassasiyet: benzetim ve donanım ----
function eksikHassasiyet(): string {
  const etiketEn = 150;
  const adim = 38;
  const x0 = 20 + etiketEn;
  const y = 74;
  let s = kutu(20, 8, 600, 30, "g-kutu") + yazi(32, 23, "process (a) begin  y <= a and b;  end process;   -- b listede yok", "g-kod g-mini", "start");
  // y'lerin ayrıştığı dilimler
  for (const [a, b] of [[3, 6], [10, 12]] as const) s += kutu(x0 + a * adim, y + 64, (b - a) * adim, 60, "g-bolge-b");
  s += dalga(20, y, [
    { ad: "a", dalga: "111111001111" },
    { ad: "b", dalga: "000111111100" },
    { ad: "y (benzetim)", dalga: "000000001111", cls: "g-dalga g-renk-b-cizgi" },
    { ad: "y (donanım)", dalga: "000111001100", cls: "g-dalga g-renk-c-cizgi" },
  ], { etiketEn, adim, isaretler: [{ t: 3, etiket: "b↑ uyanmaz" }, { t: 6, etiket: "a↓ uyanır" }, { t: 8, etiket: "a↑ uyanır" }, { t: 10, etiket: "b↓ uyanmaz" }] });
  s += yazi(320, 222, "Kırmızı benzetim, yeşil sentezlenen AND kapısı; boyalı yerlerde ikisi farklı.", "g-mini g-soluk");
  return s;
}

// ---- if zinciri ve case ----
function ifCase(): string {
  let s = yazi(160, 14, "if / elsif: öncelikli zincir", "g-kalin") + yazi(485, 14, "case r is: her değer bir kez", "g-kalin");
  s += mux2(60, 70, "r(1)") + mux2(150, 60, "r(2)") + mux2(240, 50, "r(3)");
  s += yazi(52, 88, '"01"', "g-kod g-mini", "end") + yazi(52, 122, '"00"', "g-kod g-mini", "end");
  s += yazi(142, 78, '"10"', "g-kod g-mini", "end") + yazi(232, 68, '"11"', "g-kod g-mini", "end");
  s += cizgi([[90, 105], [120, 105], [120, 112], [150, 112]]);
  s += cizgi([[180, 95], [210, 95], [210, 102], [240, 102]]);
  s += ok([[270, 85], [300, 85]]) + yazi(306, 85, "kod", "g-kod g-mini", "start");
  s += yazi(165, 176, "r(3) çıkışa en yakın: önceliği en yüksek", "g-mini g-soluk");
  s += yazi(165, 194, "birden çok bit 1 olsa da yalnızca ilk doğru dal seçilir", "g-mini g-soluk");
  s += cizgi([[330, 30], [330, 230]], "g-kesik");
  const grup: [string, number, string, string][] = [
    ["1---", 8, '"11"', "g-dolu g-secili"],
    ["01--", 4, '"10"', "g-ton1"],
    ["001-", 2, '"01"', "g-bant-2"],
    ["0001", 1, '"00"', "g-sabit"],
    ["0000", 1, "gecerli 0", "g-uyari"],
  ];
  grup.forEach(([desen, n, cikis, cls], i) => {
    const y = 40 + i * 30;
    s += yazi(350, y + 8, desen, "g-kod g-mini", "start");
    for (let k = 0; k < n; k++) s += kutu(390 + k * 11, y + 1, 9, 14, cls);
    s += yazi(484, y + 8, `${n} değer → ${cikis}`, "g-mini", "start");
  });
  s += yazi(350, 204, "16 değerin hepsi, | ile birleştirilerek yazılmalı.", "g-mini", "start");
  s += yazi(350, 222, "case'te '-' joker değildir: \"1---\" yalnızca '-' ile eşleşir.", "g-mini g-soluk", "start");
  return s;
}

// ---- Latch dalgada ----
function latchDalga(): string {
  const etiketEn = 70;
  const adim = 40;
  const x0 = 20 + etiketEn;
  const y = 70;
  let s = kutu(20, 8, 600, 30, "g-kutu") + yazi(32, 23, "process (en, d) begin  if en = '1' then q <= d; end if;  end process;", "g-kod g-mini", "start");
  s += kutu(x0 + 6 * adim, y - 6, 4 * adim, 108, "g-bolge-a");
  s += dalga(20, y, [
    { ad: "en", dalga: "001111000011" },
    { ad: "d", dalga: "011001011010" },
    { ad: "q", dalga: "xx1001111110", cls: "g-dalga g-renk-a-cizgi" },
  ], { etiketEn, adim, isaretler: [{ t: 2, etiket: "en = 1: saydam" }, { t: 6, etiket: "en = 0: tutar" }, { t: 10, etiket: "yine saydam" }] });
  s += yazi(x0 + 8 * adim, y + 124, "d değişse de q 1'de kalır", "g-mini g-kalin");
  s += yazi(320, 222, "Latch saat beklemez: en = 1 iken q, d'yi izler; en = 0 olunca son değeri saklar.", "g-mini g-soluk");
  return s;
}

// ---- for döngüsü açılır ----
function dongiAcilir(): string {
  const d = "10100101";
  let s = kutu(20, 8, 600, 30, "g-kutu") + yazi(32, 23, "for i in d'range loop  if d(i) = '1' then sayi := sayi + 1; end if;  end loop;", "g-kod g-mini", "start");
  s += yazi(20, 60, 'd = "10100101"', "g-kod g-mini", "start");
  let sayi = 0;
  const bx = (k: number) => 44 + k * 72;
  s += yazi(28, 132, "0", "g-kod g-kucuk g-kalin", "end");
  for (let k = 0; k < 8; k++) {
    const i = 7 - k;
    const bit = d[k]!;
    if (bit === "1") sayi++;
    const x = bx(k);
    s += yazi(x + 26, 78, `d(${i}) = ${bit}`, "g-kod g-mini");
    s += ok([[x + 26, 88], [x + 26, 110]], "g-bag", "g-uc");
    s += kutu(x, 110, 52, 44, bit === "1" ? "g-dolu g-secili" : "g-dolu") + yazi(x + 26, 125, `i = ${i}`, "g-mini g-soluk") + yazi(x + 26, 141, bit === "1" ? "+1" : "+0", "g-kod g-kalin");
    s += ok([[x - 18, 132], [x, 132]]);
    s += yazi(x + 62, 170, String(sayi), "g-kod g-mini g-renk-c");
  }
  s += ok([[bx(7) + 52, 132], [bx(7) + 72, 132]]) + yazi(bx(7) + 62, 118, "n", "g-kod g-kucuk g-kalin");
  s += yazi(320, 196, "8 tur, 8 donanım kopyası: her kopya bir öncekinin sonucunu alır. Sonuç n = 4.", "g-kucuk");
  s += yazi(320, 216, "Döngü zaman içinde dönmez; i her kopyada sabit bir sayıdır.", "g-mini g-soluk");
  return s;
}

// ---- next ve exit ----
function nextExit(): string {
  const hx = (i: number) => 150 + i * 58;
  let s = kutu(20, 8, 600, 30, "g-kutu") + yazi(32, 23, "for i in 0 to 7 loop  if i mod 2 = 1 then next; end if;  t := t + i;  end loop;", "g-kod g-mini", "start");
  s += yazi(20, 66, "next", "g-kod g-kalin g-renk-a", "start") + yazi(20, 84, "turun kalanını atla", "g-mini g-soluk", "start");
  let t = 0;
  for (let i = 0; i < 8; i++) {
    const atla = i % 2 === 1;
    if (!atla) t += i;
    s += kutu(hx(i), 54, 52, 40, atla ? "g-sabit" : "g-dolu") + yazi(hx(i) + 26, 67, `i = ${i}`, "g-mini");
    s += yazi(hx(i) + 26, 83, atla ? "next" : `t = ${t}`, `g-kod g-mini${atla ? " g-renk-a" : ""}`);
  }
  s += yazi(hx(7) + 52, 106, "sonuç t = 0 + 2 + 4 + 6 = 12", "g-mini g-kalin", "end");
  s += kutu(20, 124, 600, 30, "g-kutu") + yazi(32, 139, "for i in 0 to 7 loop  if v(i) = '1' then yer := i; exit; end if;  end loop;", "g-kod g-mini", "start");
  s += yazi(20, 184, "exit", "g-kod g-kalin g-renk-b", "start") + yazi(20, 202, "döngüden çık", "g-mini g-soluk", "start");
  const v = "00101100";
  s += yazi(hx(0) - 8, 164, "v(i)", "g-kod g-mini g-soluk", "end");
  for (let i = 0; i < 8; i++) {
    const cls = i < 2 ? "g-dolu" : i === 2 ? "g-dolu g-secili" : "g-cerceve";
    s += yazi(hx(i) + 26, 164, v[i]!, `g-kod g-mini g-kalin${i > 2 ? " g-soluk" : ""}`);
    s += kutu(hx(i), 172, 52, 40, cls) + yazi(hx(i) + 26, 185, `i = ${i}`, `g-mini${i > 2 ? " g-soluk" : ""}`);
    s += yazi(hx(i) + 26, 201, i < 2 ? "devam" : i === 2 ? "exit" : "çalışmaz", `g-mini${i === 2 ? " g-kalin g-renk-b" : i > 2 ? " g-soluk" : ""}`);
  }
  s += yazi(hx(7) + 52, 226, "ilk 1 bulununca çıkar: yer = 2; v(4) ve v(5)'teki 1'lere bakılmaz", "g-mini g-kalin", "end");
  return s;
}

// ---- D flip-flop dalgası ----
function dffDalga(): string {
  const etiketEn = 60;
  const adim = 34;
  const x0 = 20 + etiketEn;
  const y = 66;
  let s = kutu(20, 8, 600, 30, "g-kutu") + yazi(32, 23, "process (clk) begin  if rising_edge(clk) then q <= d; end if;  end process;", "g-kod g-mini", "start");
  s += kutu(x0 + 8 * adim, y + 30, adim, 30, "g-bolge-b");
  s += dalga(20, y, [
    { ad: "clk", dalga: "0101010101010101" },
    { ad: "d", dalga: "0011110010001111" },
    { ad: "q", dalga: "x001111000000111", cls: "g-dalga g-renk-a-cizgi" },
  ], { etiketEn, adim, isaretler: [1, 3, 5, 7, 9, 11, 13, 15].map((t) => ({ t })) });
  for (const t of [1, 3, 5, 7, 9, 11, 13, 15]) s += ok([[x0 + t * adim, y + 30], [x0 + t * adim, y + 22]], "g-bag", "g-uc");
  s += yazi(x0 + 8.5 * adim, y + 104, "kenarlar arasındaki darbe görülmez", "g-mini g-renk-b");
  s += yazi(320, 196, "q yalnızca yükselen kenarlarda (kesik çizgiler) değişir ve o andaki d'yi alır.", "g-mini g-soluk");
  return s;
}

// ---- Asenkron ve senkron reset ----
function resetTurleri(): string {
  const etiketEn = 120;
  const adim = 30;
  const x0 = 20 + etiketEn;
  const y = 40;
  let s = kutu(x0 + 4 * adim, y - 8, adim, 150, "g-bolge-b");
  s += dalga(20, y, [
    { ad: "clk", dalga: "0101010101010101" },
    { ad: "rst", dalga: "0000111100000000", cls: "g-dalga g-renk-b-cizgi" },
    { ad: "q (asenkron)", dalga: "1111000001111111", cls: "g-dalga g-renk-a-cizgi" },
    { ad: "q (senkron)", dalga: "1111100001111111", cls: "g-dalga g-renk-c-cizgi" },
  ], { etiketEn, adim, isaretler: [1, 3, 5, 7, 9, 11, 13, 15].map((t) => ({ t })) });
  s += yazi(x0 + 4 * adim - 4, y + 82, "hemen", "g-mini g-kalin g-renk-a", "end");
  s += yazi(x0 + 5 * adim + 4, y + 112, "sonraki kenarda", "g-mini g-kalin g-renk-c", "start");
  s += yazi(320, 182, "rst bırakılınca ikisi de bir sonraki kenarda d = 1'i alır.", "g-mini g-soluk");
  s += kutu(20, 196, 296, 62, "g-kutu") + satirlar(30, 210, ["process (clk, rst)  -- rst listede", "if rst = '1' then q <= '0';", "elsif rising_edge(clk) then"], "g-kod g-mini g-renk-a", "start", 17);
  s += kutu(324, 196, 296, 62, "g-kutu") + satirlar(334, 210, ["process (clk)  -- yalnızca clk", "if rising_edge(clk) then", "  if rst = '1' then q <= '0';"], "g-kod g-mini g-renk-c", "start", 17);
  return s;
}

// ---- Sayaç sarar ----
function sayacSarar(): string {
  const w = 30;
  const x0 = 50;
  let s = yazi(x0 - 6, 30, "kenar", "g-mini g-soluk", "end") + yazi(x0 - 6, 56, "sayi", "g-mini g-soluk", "end");
  for (let k = 0; k <= 18; k++) {
    const x = x0 + k * w;
    const v = k % 16;
    const vurgu = k === 15 || k === 16;
    s += yazi(x + w / 2, 30, String(k), "g-mini g-soluk");
    s += kutu(x + 1, 44, w - 2, 24, k === 18 ? "g-dolu g-secili" : vurgu ? "g-uyari" : "g-dolu") + yazi(x + w / 2, 56, String(v), "g-kod g-mini g-kalin");
  }
  s += ok(kuadratik([x0 + 15.5 * w, 70], [x0 + 16 * w, 96], [x0 + 16.5 * w, 70]), "g-cizgi g-renk-b-cizgi", "g-renk-b");
  s += yazi(x0 + 15.3 * w, 92, "15 + 1 = 0", "g-mini g-kalin g-renk-b", "end");
  s += yazi(x0 + 19 * w, 84, "18 mod 16 = 2", "g-mini g-kalin g-renk-a", "end");
  // 15 + 1'in bitleri
  s += yazi(150, 136, "1111", "g-kod g-kucuk", "end") + yazi(160, 136, "+ 1", "g-kod g-kucuk", "start") + yazi(196, 136, "=", "g-kucuk");
  s += bitDizisi(214, 123, "10000", { en: 24, vurgu: [0], vurguCls: "g-hata" });
  s += yazi(350, 136, "→", "g-kucuk") + bitDizisi(370, 123, "0000", { en: 24 });
  s += yazi(226, 166, "beşinci bit sığmaz, atılır", "g-mini g-renk-b");
  s += yazi(320, 196, "unsigned(3 downto 0) yalnızca 0..15 tutar; 16. kenarda başa döner.", "g-mini g-soluk");
  return s;
}

// ---- Kaydırmalı kayıtçı 4 adımda ----
function kaydirma(): string {
  const adimlar: [string, string, string][] = [
    ["başlangıç", "", "0000"],
    ["1. kenar", "1", "0001"],
    ["2. kenar", "0", "0010"],
    ["3. kenar", "1", "0101"],
    ["4. kenar", "1", "1011"],
  ];
  let s = yazi(320, 14, "q <= q(2 downto 0) & din;   bitler bir sola kayar, yeni bit sağdan girer", "g-kod g-mini");
  s += yazi(284, 36, "q(3) q(2) q(1) q(0)", "g-kod g-mini g-soluk");
  let onceki = "";
  adimlar.forEach(([ad, din, q], i) => {
    const y = 48 + i * 38;
    s += yazi(150, y + 13, ad, "g-kucuk", "end");
    s += bitDizisi(228, y, q, { en: 28, vurgu: din ? [3] : [], vurguCls: "g-dolu g-secili", cls: "g-dolu" });
    if (din) {
      s += ok([[400, y + 13], [346, y + 13]], "g-cizgi g-renk-a-cizgi", "g-renk-a") + yazi(406, y + 13, `din = ${din}`, "g-kod g-mini g-renk-a", "start");
      s += ok([[226, y + 13], [190, y + 13]], "g-bag", "g-uc") + yazi(176, y + 27, `${onceki[0]} atılır`, "g-mini g-soluk", "end");
    }
    onceki = q;
  });
  s += yazi(470, 213, '"1011" = 11', "g-kod g-kucuk g-kalin", "start");
  return s;
}

// ---- Durum makinesi: "101" dedektörü ----
export type Durum = "S0" | "S1" | "S10" | "S101";
export const DURUMLAR: Durum[] = ["S0", "S1", "S10", "S101"];
// Her durumdan x = 0 ve x = 1 ile gidilen durum (örtüşen diziler de yakalanır)
export const GECIS: Record<Durum, [Durum, Durum]> = {
  S0: ["S0", "S1"],
  S1: ["S10", "S1"],
  S10: ["S0", "S101"],
  S101: ["S10", "S1"],
};
export const AZAMI_BIT = 12;

// Başlangıçtaki S0 ve her bitten sonraki durum
export function durumIzi(bitler: string): Durum[] {
  const iz: Durum[] = ["S0"];
  for (const b of bitler) iz.push(GECIS[iz[iz.length - 1]!][b === "1" ? 1 : 0]);
  return iz;
}

const MERKEZ: Record<Durum, Nokta> = { S0: [100, 150], S1: [250, 150], S10: [400, 150], S101: [550, 150] };

interface Ok {
  kim: Durum;
  x: 0 | 1;
  nok: Nokta[];
  etiket: Nokta;
}

const OKLAR: Ok[] = [
  { kim: "S0", x: 0, nok: kubik([72, 140], [26, 108], [26, 192], [71, 160]), etiket: [30, 150] },
  { kim: "S0", x: 1, nok: [[130, 150], [220, 150]], etiket: [175, 140] },
  { kim: "S1", x: 1, nok: kubik([238, 123], [215, 76], [285, 76], [262, 123]), etiket: [250, 72] },
  { kim: "S1", x: 0, nok: [[280, 150], [370, 150]], etiket: [325, 140] },
  { kim: "S10", x: 1, nok: [[430, 150], [520, 150]], etiket: [475, 140] },
  { kim: "S10", x: 0, nok: kuadratik([385, 124], [250, -16], [115, 124]), etiket: [250, 44] },
  { kim: "S101", x: 0, nok: kuadratik([535, 124], [475, 66], [415, 124]), etiket: [475, 84] },
  { kim: "S101", x: 1, nok: kuadratik([535, 176], [400, 290], [265, 176]), etiket: [400, 246] },
];

function diyagram(aktif: Durum | null, son: { kim: Durum; x: 0 | 1 } | null): string {
  let s = ok([[100, 222], [100, 182]]) + yazi(100, 232, "reset", "g-mini g-soluk");
  for (const o of OKLAR) {
    const secili = son !== null && son.kim === o.kim && son.x === o.x;
    s += ok(o.nok, secili ? "g-yol" : "g-cizgi", secili ? "g-renk-a" : "g-uc");
    s += yazi(o.etiket[0], o.etiket[1], String(o.x), `g-kod g-kucuk g-kalin${secili ? " g-renk-a" : ""}`);
  }
  for (const d of DURUMLAR) {
    const [x, y] = MERKEZ[d];
    const z = d === "S101";
    s += daire(x, y, 30, d === aktif ? "g-dolu g-secili" : z ? "g-ton1" : "g-kutu");
    s += yazi(x, y - 6, d, "g-kod g-kucuk g-kalin") + yazi(x, y + 11, `z = ${z ? 1 : 0}`, `g-kod g-mini${z ? " g-kalin g-renk-c" : " g-soluk"}`);
  }
  return s;
}

export function durumAdimlayici(bitler: string): string {
  const iz = durumIzi(bitler);
  const aktif = iz[iz.length - 1]!;
  const son = bitler.length ? { kim: iz[iz.length - 2]!, x: (bitler[bitler.length - 1] === "1" ? 1 : 0) as 0 | 1 } : null;
  let s = diyagram(aktif, son);
  const x0 = 80;
  const w = 40;
  if (bitler.length) s += yazi(x0 - 10, 284, "x", "g-kod g-mini g-soluk", "end") + yazi(x0 - 10, 308, "durum", "g-mini g-soluk", "end");
  else s += yazi(x0 - 50, 284, "Henüz bit girilmedi: makine reset sonrası S0'da.", "g-mini g-soluk", "start");
  [...bitler].forEach((b, k) => {
    const d = iz[k + 1]!;
    const x = x0 + k * w;
    s += kutu(x + 2, 272, w - 4, 24, d === "S101" ? "g-dolu g-secili" : "g-dolu") + yazi(x + w / 2, 284, b, "g-kod g-kucuk g-kalin");
    s += yazi(x + w / 2, 308, d, `g-kod g-mini${d === "S101" ? " g-kalin g-renk-c" : ""}`);
  });
  const bulunan = iz.filter((d) => d === "S101").length;
  s += yazi(620, 328, `z = ${aktif === "S101" ? 1 : 0}    "101" bulundu: ${bulunan}`, "g-kod g-mini g-kalin", "end");
  return s;
}

// ---- Diyagramdan koda ----
function diyagramdanKoda(): string {
  const kod = [
    "type durum_t is (S0, S1, S10, S101);",
    "signal d : durum_t := S0;",
    "...",
    "if rising_edge(clk) then",
    "  case d is",
    "    when S10 =>",
    "      if x = '1' then d <= S101;",
    "      else d <= S0; end if;",
    "    ...",
    "  end case;",
    "end if;",
    "z <= '1' when d = S101 else '0';",
  ];
  const ky = (k: number) => 24 + k * 18;
  let s = kutu(300, ky(0) - 9, 320, 18, "g-bant-2") + kutu(300, ky(5) - 9, 320, 54, "g-bant-3") + kutu(300, ky(11) - 9, 320, 18, "g-bant-1");
  s += satirlar(308, ky(0), kod, "g-kod g-mini", "start", 18);
  // 1: daireler = sayım tipinin değerleri
  DURUMLAR.forEach((d, k) => (s += daire(32 + k * 50, ky(0) + 6, 21, "g-kutu") + yazi(32 + k * 50, ky(0) + 6, d, "g-kod g-mini")));
  s += cizgi([[210, ky(0)], [298, ky(0)]], "g-kesik");
  s += yazi(20, ky(0) + 36, "her daire tipin bir değeri", "g-mini g-soluk", "start");
  // 2: bir dairenin okları = case dalındaki if
  s += daire(60, 124, 24, "g-dolu g-secili") + yazi(60, 124, "S10", "g-kod g-mini g-kalin");
  s += daire(200, 94, 21, "g-kutu") + yazi(200, 94, "S101", "g-kod g-mini");
  s += daire(200, 154, 21, "g-kutu") + yazi(200, 154, "S0", "g-kod g-mini");
  s += ok([[84, 116], [179, 98]]) + yazi(132, 96, "1", "g-kod g-kucuk g-kalin");
  s += ok([[84, 132], [179, 150]]) + yazi(132, 154, "0", "g-kod g-kucuk g-kalin");
  s += cizgi([[222, 124], [298, 124]], "g-kesik");
  s += yazi(20, 188, "bir daire = bir when dalı, oklar = if", "g-mini g-soluk", "start");
  // 3: dairedeki çıkış
  s += daire(46, ky(11) + 4, 22, "g-ton1") + yazi(46, ky(11) - 3, "S101", "g-kod g-mini") + yazi(46, ky(11) + 11, "z = 1", "g-kod g-mini g-renk-c");
  s += cizgi([[70, ky(11) + 4], [298, ky(11) + 4]], "g-kesik") + yazi(184, ky(11) - 8, "çıkış yalnızca duruma bağlı: Moore", "g-mini g-soluk");
  return s;
}

export const HAFTA_5_GORSELLERI: Gorsel[] = [
  {
    kod: "G-H5-03",
    baslik: "Son dal koşullu kalırsa: geri besleme",
    aciklama:
      'y <= a when sec = "00" else b when sec = "01" else c when sec = "10"; için üç çoklayıcıdan bir zincir. En sağdaki (sec = "00") çıkışa en yakın. En soldaki çoklayıcının 0 girişine y\'nin kendisi geri bağlanmış: üç koşul da yanlışsa y eski değerini tutar, bu bir latch\'tir. Son satıra koşulsuz else c yazılırsa bu döngü kopar.',
    en: 640,
    boy: 262,
    icerik: sonElseYok(),
  },
  {
    kod: "G-H5-04",
    baslik: "2 bitlik std_logic seçicinin 81 değeri",
    aciklama:
      "sec(1) satırlarda, sec(0) sütunlarda; her biri dokuz değerden birini alır: 9 · 9 = 81 hücre. Yalnızca 00, 01, 10 ve 11 hücreleri açıkça yazılan seçeneklerdir; kalan 77 hücre when others'a düşer. Örnek: sec = \"1X\" hiçbir seçeneğe uymaz.",
    en: 640,
    boy: 250,
    icerik: seksenBirDeger(),
  },
  {
    kod: "G-H5-05",
    baslik: "Bir process'in yaşam döngüsü",
    aciklama:
      "Benzetim başlarken her process bir kez çalışır. Çalış durumunda satırlar sırayla yürür; end process'e ya da bir wait'e gelince process bekler. Uyandırıcı gelince yeniden çalışır. Uyandırıcı ya hassasiyet listesidir, process (a, b), ya da wait deyimleridir; ikisi birlikte olmaz. Sinyal atamaları process beklemeye geçince uygulanır.",
    en: 640,
    boy: 282,
    icerik: processDongusu(),
  },
  {
    kod: "G-H5-06",
    baslik: "Eksik hassasiyet: benzetim ve donanım ayrışır",
    aciklama:
      "process (a) içinde y <= a and b. Dalgada a, b, benzetimdeki y ve donanımdaki y. b 1 olduğunda process uyanmaz, benzetimdeki y 0'da kalır; donanımdaki AND kapısı 1 verir. a değişince process uyanır ve iki y yeniden tutar. b 0'a düştüğünde yine ayrışırlar: benzetim 1'de kalır, donanım 0 olur.",
    en: 640,
    boy: 232,
    icerik: eksikHassasiyet(),
  },
  {
    kod: "G-H5-07",
    baslik: "if zinciri öncelikli, case her değeri bir kez yazar",
    aciklama:
      'Solda öncelikli kodlayıcının if/elsif zinciri: r(3), r(2) ve r(1)\'i sınayan üç çoklayıcı; r(3) çıkışa en yakın. Sağda aynı işin case ile yazımı: 16 değerin 8\'i (1---) "11", 4\'ü (01--) "10", 2\'si (001-) "01", 0001 "00" verir; 0000\'da gecerli = 0. case\'te \'-\' joker olmadığı için 16 değerin hepsi yazılmalıdır.',
    en: 640,
    boy: 234,
    icerik: ifCase(),
  },
  {
    kod: "G-H5-08",
    baslik: "Latch dalgada nasıl görünür",
    aciklama:
      "process (en, d) içinde else'siz if en = '1' then q <= d. en 1 iken q, d'yi hemen izler (saydam). en 0 olunca q son değerini (1) tutar; bu sırada d üç kez değişse de q değişmez. en yeniden 1 olunca q yine d'yi izler. Latch saat beklemez.",
    en: 640,
    boy: 232,
    icerik: latchDalga(),
  },
  {
    kod: "G-H5-09",
    baslik: "for döngüsü sekiz donanım kopyasına açılır",
    aciklama:
      'd = "10100101" için birler sayacı. i = 7\'den 0\'a sekiz kutu yan yana; her kutu d(i)\'yi alır ve bir öncekinin sonucuna 1 ya da 0 ekler. Ara sonuçlar 1, 1, 2, 2, 2, 3, 3, 4; çıkış n = 4. Döngü zamanda dönmez; her tur ayrı bir donanım kopyasıdır.',
    en: 640,
    boy: 228,
    icerik: dongiAcilir(),
  },
  {
    kod: "G-H5-10",
    baslik: "next turu atlar, exit döngüden çıkar",
    aciklama:
      'Üstte for i in 0 to 7 döngüsü tek i\'lerde next ile turun kalanını atlar; t yalnızca çift i\'leri toplar: 0 + 2 + 4 + 6 = 12. Altta v = "00101100" içinde ilk 1 aranır; i = 2\'de yer := 2 ve exit; kalan turlar çalışmaz.',
    en: 640,
    boy: 232,
    icerik: nextExit(),
  },
  {
    kod: "G-H5-11",
    baslik: "D flip-flop: q yalnızca yükselen kenarda değişir",
    aciklama:
      "clk, d ve q dalgaları. Her yükselen kenar kesik çizgiyle işaretli; q o andaki d'yi alır ve bir sonraki kenara kadar tutar. İki kenar arasında d'de kısa bir darbe var; o sırada kenar olmadığı için q onu görmez.",
    en: 640,
    boy: 210,
    icerik: dffDalga(),
  },
  {
    kod: "G-H5-12",
    baslik: "Asenkron ve senkron reset aynı dalgada",
    aciklama:
      "clk, rst ve iki q. rst iki kenar arasında 1 oluyor. Asenkron resetli q hemen 0'a iner; senkron resetli q bir sonraki yükselen kenarı bekler. rst bırakılınca ikisi de bir sonraki kenarda d = 1'i alır. Altta iki process'in başı: asenkronda process (clk, rst) ve rst kenardan önce; senkronda process (clk) ve rst kenarın içinde.",
    en: 640,
    boy: 266,
    icerik: resetTurleri(),
  },
  {
    kod: "G-H5-13",
    baslik: "4 bitlik sayaç 15'ten sonra 0'a sarar",
    aciklama:
      "0'dan 18'e kenar numaraları ve sayacın değeri: 0, 1, ... 15, 0, 1, 2. 15 + 1'de 1111 + 1 = 10000; beşinci bit sığmaz ve atılır, sayaç 0000 olur. 18 kenardan sonra 18 mod 16 = 2.",
    en: 640,
    boy: 210,
    icerik: sayacSarar(),
  },
  {
    kod: "G-H5-14",
    baslik: "Kaydırmalı kayıtçı dört adımda",
    aciklama:
      'q <= q(2 downto 0) & din. Başlangıçta 0000. din sırasıyla 1, 0, 1, 1 gelir; her kenarda bitler bir sola kayar, en soldaki bit atılır, yeni bit sağdan girer: 0001, 0010, 0101, 1011. "1011" = 11.',
    en: 640,
    boy: 236,
    icerik: kaydirma(),
  },
  {
    kod: "G-H5-15",
    baslik: '"101" dedektörünün durum diyagramı',
    aciklama:
      "Dört durum: S0, S1, S10, S101; reset S0'a götürür. S0: x = 0 ile S0'da kalır, x = 1 ile S1. S1: 1 ile S1'de kalır, 0 ile S10. S10: 1 ile S101, 0 ile S0. S101: 0 ile S10, 1 ile S1. Yalnızca S101'de z = 1. Etkileşimli sürümde bitler girildikçe etkin durum ve son geçiş vurgulanır.",
    en: 640,
    boy: 340,
    icerik: durumAdimlayici(""),
    etkilesim: "durum",
  },
  {
    kod: "G-H5-16",
    baslik: "Durum diyagramından koda",
    aciklama:
      "Solda diyagramın parçaları, sağda karşılık gelen kod. Dört daire, type durum_t is (S0, S1, S10, S101) tipinin değerleridir. S10 dairesi ve ondan çıkan iki ok, case içindeki when S10 dalı ve if x = '1' then d <= S101; else d <= S0; satırlarıdır. S101 dairesindeki z = 1, z <= '1' when d = S101 else '0'; atamasıdır; çıkış yalnızca duruma bağlı olduğu için makine Moore'dur.",
    en: 640,
    boy: 254,
    icerik: diyagramdanKoda(),
  },
];
