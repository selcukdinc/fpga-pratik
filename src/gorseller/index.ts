// Ders şekilleri. Hepsi bizim çizimimizdir; hocanın sunumlarından görsel alınmaz.
// Ders metninde tek başına bir paragraf olarak [[G-H1-01]] yazılınca şekil o yere konur.
// Kod biçimi: G-H<hafta>-<sıra>. Bir şekli düzeltmek isteyen kodunu söyler; kodlar
// değiştirilmez, silinen bir şeklin kodu yeniden kullanılmaz.

import { cizgi, kutu, mux, nokta, ok, ozelVeya, satirlar, ve, veya, yazi, yol, type Nokta } from "./cizim";

import type { Gorsel } from "./tip";
import { HAFTA_1_GORSELLERI } from "./hafta-1";
import { HAFTA_2_GORSELLERI } from "./hafta-2";
import { HAFTA_3_GORSELLERI } from "./hafta-3";
import { HAFTA_4_GORSELLERI } from "./hafta-4";
import { HAFTA_5_GORSELLERI } from "./hafta-5";

export type { Gorsel } from "./tip";

function fpgaYapisi(): string {
  const sutunX = [75, 155, 235, 315];
  const satirY = [80, 156, 232];
  const kanalX = [60, 140, 220, 300, 380];
  const kanalY = [66, 140, 216, 296];
  let s = kutu(20, 20, 400, 320, "g-kutu g-yonga");
  for (const x of kanalX) s += cizgi([[x, 66], [x, 296]], "g-bag");
  for (const y of kanalY) s += cizgi([[60, y], [380, y]], "g-bag");
  for (const x of kanalX) for (const y of kanalY) s += kutu(x - 5, y - 5, 10, 10, "g-anahtar");
  for (const x of sutunX) for (const y of satirY) s += kutu(x, y, 50, 44, "g-dolu") + yazi(x + 25, y + 22, "CLB", "g-kucuk");
  for (const x of sutunX) {
    s += cizgi([[x + 25, 42], [x + 25, 66]], "g-bag") + kutu(x + 11, 26, 28, 16, "g-io");
    s += cizgi([[x + 25, 296], [x + 25, 318]], "g-bag") + kutu(x + 11, 318, 28, 16, "g-io");
  }
  for (const y of satirY) {
    s += cizgi([[42, y + 22], [60, y + 22]], "g-bag") + kutu(26, y + 8, 16, 28, "g-io");
    s += cizgi([[380, y + 22], [398, y + 22]], "g-bag") + kutu(398, y + 8, 16, 28, "g-io");
  }
  // Örnek bir yol: giriş bloğundan bir CLB'ye, oradan başka bir CLB'ye
  s += cizgi([[42, 102], [60, 102], [75, 102]], "g-yol");
  s += cizgi([[125, 102], [140, 102], [140, 140], [220, 140], [220, 178], [235, 178]], "g-yol");
  s += kutu(75, 80, 50, 44, "g-dolu g-secili") + yazi(100, 102, "CLB", "g-kucuk");
  s += kutu(235, 156, 50, 44, "g-dolu g-secili") + yazi(260, 178, "CLB", "g-kucuk");
  s += kutu(26, 88, 16, 28, "g-io g-secili");
  // Lejant
  const lx = 448;
  s += kutu(lx, 40, 30, 22, "g-dolu") + satirlar(lx + 40, 44, ["CLB: mantık bloğu", "(LUT, flip-flop, çoklayıcı)"], "g-kucuk", "start", 15);
  s += kutu(lx + 7, 98, 16, 16, "g-io") + satirlar(lx + 40, 100, ["IOB: giriş/çıkış bloğu", "(yonganın bacakları)"], "g-kucuk", "start", 15);
  s += cizgi([[lx, 152], [lx + 30, 152]], "g-bag") + yazi(lx + 40, 152, "Programlanabilir bağlantı", "g-kucuk", "start");
  s += kutu(lx + 10, 182, 10, 10, "g-anahtar") + satirlar(lx + 40, 180, ["Anahtar kutusu: kanalları", "birbirine bağlar"], "g-kucuk", "start", 15);
  s += cizgi([[lx, 232], [lx + 30, 232]], "g-yol") + satirlar(lx + 40, 232, ["Yapılandırmayla kurulmuş", "örnek bir bağlantı"], "g-kucuk", "start", 15);
  s += yazi(lx, 300, "Yonga içinde binlerce CLB olur;", "g-kucuk g-soluk", "start");
  s += yazi(lx, 316, "burada 12 tanesi çizildi.", "g-kucuk g-soluk", "start");
  return s;
}

function adetMaliyet(): string {
  const x0 = 70, x1 = 600, y0 = 250, yUst = 30;
  const fpga = (u: number) => 240 - 200 * u;
  const asic = (u: number) => 150 - 40 * u;
  const kx = x0 + 0.5625 * (x1 - x0);
  const ky = fpga(0.5625);
  let s = kutu(x0, yUst, kx - x0, y0 - yUst, "g-bolge-a") + kutu(kx, yUst, x1 - kx, y0 - yUst, "g-bolge-b");
  s += yazi((x0 + kx) / 2, 44, "Az adet: FPGA ucuz", "g-kucuk g-soluk");
  s += yazi((kx + x1) / 2, 44, "Çok adet: ASIC ucuz", "g-kucuk g-soluk");
  s += ok([[x0, y0], [x0, yUst - 10]]) + ok([[x0, y0], [x1 + 20, y0]]);
  s += `<g transform="rotate(-90 ${x0 - 14} 140)">${yazi(x0 - 14, 140, "Toplam maliyet", "g-kucuk")}</g>`;
  s += yazi((x0 + x1) / 2, y0 + 20, "Üretim adedi", "g-kucuk");
  s += cizgi([[x0, fpga(0)], [x1, fpga(1)]], "g-seri-a");
  s += cizgi([[x0, asic(0)], [x1, asic(1)]], "g-seri-b");
  s += yazi(x1 - 4, fpga(1) - 12, "FPGA", "g-kalin g-renk-a", "end");
  s += yazi(x1 - 4, asic(1) + 16, "ASIC", "g-kalin g-renk-b", "end");
  s += cizgi([[kx, ky], [kx, y0]], "g-kesik") + nokta(kx, ky);
  s += yazi(kx + 8, ky + 22, "kesişme noktası", "g-kucuk", "start");
  // NRE: ASIC'in sıfır adette bile ödenen bir kerelik maliyeti
  s += ok([[x0 + 14, y0], [x0 + 14, asic(0) + 2]], "g-cizgi g-renk-b-cizgi", "g-uc g-renk-b");
  s += satirlar(x0 + 22, 166, ["NRE: bir kerelik", "maliyet"], "g-kucuk g-renk-b", "start", 15);
  return s;
}

function cpuFpga(): string {
  let s = yazi(160, 20, "İşlemci: sırayla", "g-kalin") + yazi(480, 20, "FPGA: aynı anda", "g-kalin");
  const isler = ["topla", "kıyasla", "say"];
  // İşlemci: tek bir yürütme birimi her adımda bir iş yapar
  s += yazi(66, 110, "CPU", "g-kucuk", "end");
  isler.forEach((is, i) => {
    s += kutu(76 + i * 72, 95, 68, 30, `g-dolu g-ton${i}`) + yazi(110 + i * 72, 110, is, "g-kucuk");
  });
  // FPGA: her işin kendi donanımı var, hepsi her çevrimde çalışır
  const birimler = ["toplayıcı", "karşılaştırıcı", "sayaç"];
  birimler.forEach((b, j) => {
    const y = 55 + j * 40;
    s += yazi(432, y + 15, b, "g-kucuk", "end");
    for (let i = 0; i < 3; i++) s += kutu(442 + i * 60, y, 56, 30, `g-dolu g-ton${j}`) + yazi(470 + i * 60, y + 15, isler[j]!, "g-kucuk");
  });
  for (const [x, w] of [[76, 216], [442, 180]] as const) {
    s += ok([[x, 190], [x + w + 16, 190]]);
    for (let i = 0; i < 3; i++) {
      const adim = w / 3;
      s += yazi(x + adim * i + adim / 2, 204, `${i + 1}. çevrim`, "g-kucuk g-soluk");
    }
  }
  s += yazi(184, 230, "3 çevrimde her iş 1 kez", "g-kucuk");
  s += yazi(532, 230, "3 çevrimde her iş 3 kez", "g-kucuk");
  return s;
}

function promPalPla(): string {
  const yapilar: [string, boolean, boolean, string][] = [
    ["PROM", false, true, "VE dizisi tüm 2ⁿ terimi üretir"],
    ["PAL", true, false, "terimler çıkışlar arasında paylaşılmaz"],
    ["PLA", true, true, "terimler birden çok çıkışta kullanılabilir"],
  ];
  let s = "";
  yapilar.forEach(([ad, veProg, veyaProg, not], i) => {
    const x = 12 + i * 212;
    s += yazi(x + 98, 18, ad, "g-kalin");
    s += ok([[x + 50, 34], [x + 50, 56]]) + yazi(x + 58, 42, "girişler", "g-kucuk g-soluk", "start");
    s += kutu(x + 10, 58, 80, 70, veProg ? "g-prog" : "g-sabit");
    s += satirlar(x + 50, 82, ["VE dizisi", veProg ? "programlanır" : "sabit"], veProg ? "g-kucuk g-renk-a" : "g-kucuk g-soluk", "middle", 18);
    s += ok([[x + 90, 93], [x + 112, 93]]);
    s += kutu(x + 114, 58, 80, 70, veyaProg ? "g-prog" : "g-sabit");
    s += satirlar(x + 154, 82, ["VEYA dizisi", veyaProg ? "programlanır" : "sabit"], veyaProg ? "g-kucuk g-renk-a" : "g-kucuk g-soluk", "middle", 18);
    s += ok([[x + 154, 128], [x + 154, 150]]) + yazi(x + 146, 142, "çıkışlar", "g-kucuk g-soluk", "end");
    const parca = not.split(" ");
    const orta = Math.ceil(parca.length / 2);
    s += satirlar(x + 102, 172, [parca.slice(0, orta).join(" "), parca.slice(orta).join(" ")], "g-kucuk", "middle", 15);
  });
  s += kutu(150, 212, 22, 14, "g-prog") + yazi(180, 219, "programlanabilir", "g-kucuk", "start");
  s += kutu(330, 212, 22, 14, "g-sabit") + yazi(360, 219, "üretimde sabitlenmiş", "g-kucuk", "start");
  return s;
}

function clbIci(): string {
  let s = kutu(50, 20, 530, 190, "g-cerceve") + yazi(62, 36, "CLB (basitleştirilmiş)", "g-kucuk g-soluk", "start");
  ["a", "b", "c", "d"].forEach((g, i) => {
    const y = 80 + i * 20;
    s += yazi(22, y, g, "g-kucuk g-kod", "end") + cizgi([[28, y], [110, y]]);
  });
  s += kutu(110, 60, 100, 100, "g-dolu") + satirlar(160, 98, ["LUT", "4 giriş, 16 bit"], "g-kucuk", "middle", 18);
  s += cizgi([[210, 110], [230, 110]]) + nokta(230, 110);
  s += ok([[230, 110], [230, 60], [300, 60]]);
  s += ok([[230, 110], [230, 150], [450, 150]]);
  s += kutu(300, 40, 90, 60) + yazi(310, 60, "D", "g-kucuk", "start") + yazi(382, 60, "Q", "g-kucuk", "end");
  s += yazi(345, 80, "flip-flop", "g-kucuk g-soluk");
  s += yol("M337,100 L345,92 L353,100", "g-cizgi") + cizgi([[345, 100], [345, 200]]) + yazi(355, 194, "saat", "g-kucuk", "start");
  s += ok([[390, 60], [420, 60], [420, 70], [450, 70]]);
  s += mux(450, 40, 30, 130, 0.15) + yazi(458, 70, "1", "g-kucuk", "start") + yazi(458, 150, "0", "g-kucuk", "start");
  s += cizgi([[465, 160], [465, 186]]) + yazi(474, 186, "seçim biti", "g-kucuk g-soluk", "start");
  s += ok([[480, 105], [612, 105]]) + yazi(546, 94, "çıkış", "g-kucuk");
  s += yazi(360, 122, "kayıtlı yol", "g-kucuk g-soluk", "start");
  s += yazi(360, 162, "kayıtsız yol", "g-kucuk g-soluk", "start");
  return s;
}

function lut2(): string {
  const deger = ["0", "0", "0", "1"];
  const adres = ["00", "01", "10", "11"];
  let s = yazi(145, 22, "Tablo belleği", "g-kucuk g-soluk");
  adres.forEach((a, i) => {
    const y = 40 + i * 36;
    const bir = deger[i] === "1";
    s += yazi(112, y + 18, `ba = ${a}`, "g-kucuk g-kod", "end");
    s += kutu(120, y, 50, 36, bir ? "g-dolu g-secili" : "g-kutu") + yazi(145, y + 18, deger[i]!, bir ? "g-kalin g-renk-a g-kod" : "g-kod");
    s += cizgi([[170, y + 18], [260, y + 18]]);
  });
  s += mux(260, 40, 40, 144, 0.2);
  adres.forEach((a, i) => (s += yazi(265, 58 + i * 36, a, "g-mini g-kod", "start")));
  s += cizgi([[280, 169], [280, 206]]) + yazi(290, 206, "seçim: b & a (adres)", "g-kucuk", "start");
  s += ok([[300, 112], [372, 112]]) + yazi(380, 112, "y", "g-kod", "start");
  s += satirlar(
    420,
    50,
    ['TABLO = "1000"', "Yalnızca ba = 11 iken y = 1,", "yani bu bir AND kapısı.", "", 'Tabloya "0110" yazılırsa XOR,', '"1110" yazılırsa OR olur.', "Donanım aynı, içerik farklı."],
    "g-kucuk",
    "start",
    18,
  );
  return s;
}

function tasarimAkisi(): string {
  const adimlar: [string, string[]][] = [
    ["Tasarım girişi", ["VHDL kodu"]],
    ["Benzetim", ["testbench ile"]],
    ["Sentez", ["netlist üretir"]],
    ["Uygulama", ["yerleştirme +", "yönlendirme"]],
    ["Bitstream", ["yongaya yükle"]],
  ];
  let s = "";
  adimlar.forEach(([ad, alt], i) => {
    const x = 10 + i * 126;
    s += kutu(x, 64, 104, 62, i < 2 ? "g-dolu g-secili" : "g-dolu");
    s += yazi(x + 52, alt.length > 1 ? 80 : 84, ad, "g-kalin");
    s += satirlar(x + 52, alt.length > 1 ? 98 : 104, alt, "g-kucuk g-soluk", "middle", 14);
    if (i < 4) s += ok([[x + 104, 95], [x + 124, 95]]);
  });
  s += cizgi([[14, 52], [14, 44], [232, 44], [232, 52]], "g-cizgi g-renk-c-cizgi") + yazi(123, 32, "Bu sitede, tarayıcında", "g-kucuk g-renk-c");
  s += cizgi([[266, 52], [266, 44], [610, 44], [610, 52]]) + yazi(438, 32, "Vivado gibi bir araçta", "g-kucuk");
  s += ok([[188, 126], [188, 150], [62, 150], [62, 128]]) + yazi(125, 164, "hata varsa koda dön", "g-kucuk g-soluk");
  s += ok([[440, 126], [440, 150], [314, 150], [314, 128]]) + yazi(377, 164, "zamanlama tutmazsa", "g-kucuk g-soluk");
  return s;
}

function yapisalDavranissal(): string {
  let s = yazi(170, 14, "Yapısal: bileşenleri bağla", "g-kalin") + yazi(512, 14, "Davranışsal: işlevi anlat", "g-kalin");
  const g = (p: Nokta[]) => p.map(([x, y]) => [x, y + 26] as Nokta);
  s += yazi(30, 46, "cin", "g-kucuk g-kod", "end") + ok(g([[36, 20], [160, 20], [160, 55], [170, 55]]));
  s += yazi(30, 71, "a", "g-kucuk g-kod", "end") + ok(g([[36, 45], [60, 45]]));
  s += yazi(30, 101, "b", "g-kucuk g-kod", "end") + ok(g([[36, 75], [60, 75]]));
  s += kutu(60, 56, 70, 60, "g-dolu") + satirlar(95, 78, ["yarım", "toplayıcı"], "g-kucuk", "middle", 15);
  s += ok(g([[130, 45], [150, 45], [150, 85], [170, 85]]));
  s += kutu(170, 66, 70, 60, "g-dolu") + satirlar(205, 88, ["yarım", "toplayıcı"], "g-kucuk", "middle", 15);
  s += ok(g([[130, 75], [140, 75], [140, 140], [272, 140]]));
  s += ok(g([[240, 85], [255, 85], [255, 120], [272, 120]]));
  s += veya(268, 136, 40, 40) + yazi(288, 186, "VEYA", "g-mini g-soluk");
  s += ok(g([[240, 55], [334, 55]])) + yazi(340, 81, "s", "g-kucuk g-kod", "start");
  s += ok(g([[308, 130], [334, 130]])) + yazi(340, 156, "cout", "g-kucuk g-kod", "start");
  // Davranışsal: aynı devre tek bir kutu, içi bir ifade
  s += cizgi([[384, 30], [384, 196]], "g-kesik");
  [["a", 70], ["b", 100], ["cin", 130]].forEach(([ad, y]) => {
    s += yazi(422, y as number, ad as string, "g-kucuk g-kod", "end") + ok([[428, y as number], [450, y as number]]);
  });
  s += kutu(450, 50, 124, 100, "g-dolu");
  s += yazi(512, 72, "tam toplayıcı", "g-kucuk g-kalin");
  s += yazi(512, 100, "a + b + cin", "g-kod");
  s += yazi(512, 128, "araç devreyi kurar", "g-mini g-soluk");
  s += ok([[574, 85], [594, 85]]) + yazi(598, 85, "s", "g-kucuk g-kod", "start");
  s += ok([[574, 115], [594, 115]]) + yazi(598, 115, "cout", "g-kucuk g-kod", "start");
  return s;
}

function ucBolum(): string {
  const bantlar: [number, number, string, string[], string, string[]][] = [
    [16, 50, "g-bant-1", ["library ieee;", "use ieee.std_logic_1164.all;"], "1. Kütüphaneler", ["hangi tiplerin ve fonksiyonların", "kullanılacağını söyler"]],
    [76, 82, "g-bant-2", ["entity yarim_toplayici is", "  port (a, b : in  std_logic;", "        s, c : out std_logic);", "end entity;"], "2. entity", ["dış görünüş: portlar,", "yani kutunun bacakları"]],
    [168, 82, "g-bant-3", ["architecture rtl of yarim_toplayici is", "begin", "  s <= a xor b;  c <= a and b;", "end architecture;"], "3. architecture", ["iç yapı: kutunun içinde", "ne olduğu"]],
  ];
  let s = "";
  for (const [y, h, cls, kod, ad, not] of bantlar) {
    s += kutu(16, y, 330, h, cls);
    s += satirlar(26, y + 16, kod, "g-kod g-kucuk", "start", 16);
    s += cizgi([[352, y + 4], [358, y + 4], [358, y + h - 4], [352, y + h - 4]]) + cizgi([[358, y + h / 2], [366, y + h / 2]]);
    s += yazi(376, y + h / 2 - 10, ad, "g-kalin", "start");
    s += satirlar(376, y + h / 2 + 8, not, "g-kucuk g-soluk", "start", 15);
  }
  return s;
}

function yarimToplayici(): string {
  let s = kutu(170, 30, 300, 160) + yazi(180, 44, "entity yarim_toplayici", "g-kod g-kucuk", "start");
  s += kutu(200, 56, 250, 122, "g-cerceve") + yazi(208, 166, "architecture rtl", "g-kod g-mini g-soluk", "start");
  s += yazi(66, 68, "a : in", "g-kod g-kucuk", "start") + cizgi([[60, 80], [240, 80]]) + nokta(240, 80);
  s += yazi(66, 128, "b : in", "g-kod g-kucuk", "start") + cizgi([[60, 140], [260, 140]]) + nokta(260, 140);
  s += cizgi([[240, 80], [240, 72], [302, 72]]) + cizgi([[240, 80], [240, 132], [300, 132]]);
  s += cizgi([[260, 140], [260, 88], [302, 88]]) + cizgi([[260, 140], [260, 148], [300, 148]]);
  s += ozelVeya(300, 64, 42, 32) + yazi(372, 70, "XOR", "g-mini g-soluk");
  s += ve(300, 124, 40, 32) + yazi(372, 130, "AND", "g-mini g-soluk");
  s += cizgi([[342, 80], [580, 80]]) + yazi(576, 68, "s : out", "g-kod g-kucuk", "end");
  s += cizgi([[340, 140], [580, 140]]) + yazi(576, 128, "c : out", "g-kod g-kucuk", "end");
  for (const y of [80, 140]) s += kutu(166, y - 4, 8, 8, "g-pin") + kutu(466, y - 4, 8, 8, "g-pin");
  s += yazi(320, 208, "entity dışarıdan görünen portlardır; architecture kutunun içini anlatır.", "g-kucuk g-soluk");
  return s;
}

function sinyalDegisken(): string {
  let s = yazi(150, 18, "variable: hemen", "g-kalin") + yazi(470, 18, "signal: process beklerken", "g-kalin");
  const sol: [string, string][] = [["v := 1;", "v = 1"], ["v := v + 1;", "v = 2"], ["v := v * 10;", "v = 20"]];
  const sag: [string, string][] = [["s <= 1;", "plan: s = 1"], ["s <= s + 1;", "plan: s = 0 + 1"], ["s_sonuc <= s * 10;", "plan: 0 * 10"]];
  sol.forEach(([k, d], i) => {
    const y = 44 + i * 40;
    s += kutu(20, y, 150, 28, "g-kutu") + yazi(30, y + 14, k, "g-kod g-kucuk", "start");
    s += ok([[172, y + 14], [200, y + 14]]) + kutu(204, y + 2, 76, 24, "g-dolu g-secili") + yazi(242, y + 14, d, "g-kod g-kucuk");
  });
  sag.forEach(([k, d], i) => {
    const y = 44 + i * 40;
    s += kutu(330, y, 160, 28, "g-kutu") + yazi(340, y + 14, k, "g-kod g-kucuk", "start");
    s += ok([[492, y + 14], [508, y + 14]], "g-kesik") + yazi(514, y + 14, d, "g-kod g-mini g-soluk", "start");
  });
  s += yazi(150, 180, "Her satır bir öncekinin", "g-kucuk") + yazi(150, 196, "sonucunu görür.", "g-kucuk");
  s += yazi(410, 176, "Process içindeyken s hâlâ 0. Aynı sinyale", "g-kucuk g-soluk") + yazi(410, 192, "iki atama varsa sonuncusu geçerli olur.", "g-kucuk g-soluk");
  s += cizgi([[330, 214], [630, 214]], "g-kesik g-renk-a-cizgi") + yazi(336, 226, "wait / process sonu", "g-mini g-renk-a", "start");
  s += kutu(400, 234, 210, 26, "g-dolu g-secili") + yazi(505, 247, "s = 1,  s_sonuc = 0", "g-kod g-kucuk");
  return s;
}

function ayniBitler(): string {
  let s = yazi(150, 62, "bitler", "g-kucuk", "end") + yazi(150, 32, "indis", "g-kucuk g-soluk", "end");
  const isaretli = [-8, 4, 2, 1];
  for (let i = 0; i < 4; i++) {
    const x = 170 + i * 64;
    s += yazi(x + 26, 32, String(3 - i), "g-kod g-kucuk g-soluk");
    s += kutu(x, 44, 52, 36, "g-dolu") + yazi(x + 26, 62, "1", "g-kod g-kalin");
    s += yazi(x + 26, 112, String(8 >> i), "g-kod");
    s += yazi(x + 26, 150, String(isaretli[i]), i === 0 ? "g-kod g-kalin g-renk-b" : "g-kod");
  }
  s += yazi(150, 112, "unsigned ağırlık", "g-kucuk", "end") + yazi(150, 150, "signed ağırlık", "g-kucuk", "end");
  s += yazi(436, 112, "8 + 4 + 2 + 1 = 15", "g-kod", "start");
  s += yazi(436, 150, "−8 + 4 + 2 + 1 = −1", "g-kod", "start");
  s += yazi(320, 186, 'Aynı "1111" bitleri: signed\'da en soldaki bitin ağırlığı eksidir.', "g-kucuk g-soluk");
  return s;
}

function cozumleme(): string {
  // İki üç durumlu tampon aynı hatta
  let s = "";
  for (const [y, ad, en] of [[60, "s1", "en1"], [150, "s2", "en2"]] as const) {
    s += yazi(26, y, ad === "s1" ? "x1" : "x2", "g-kod g-kucuk", "end") + cizgi([[32, y], [100, y]]);
    s += `<polygon points="100,${y - 20} 140,${y} 100,${y + 20}" class="g-kutu"/>`;
    s += cizgi([[120, ad === "s1" ? y - 30 : y + 30], [120, ad === "s1" ? y - 10 : y + 10]]) + yazi(128, ad === "s1" ? y - 32 : y + 32, en, "g-kod g-mini", "start");
    s += cizgi([[140, y], [200, y], [200, 105]]) + yazi(170, y - 10, ad, "g-kod g-mini g-soluk");
  }
  s += nokta(200, 105) + cizgi([[200, 105], [270, 105]], "g-yol") + yazi(280, 105, "hat", "g-kod g-kucuk", "start");
  s += yazi(150, 206, "en = '0' iken tampon 'Z' bırakır", "g-kucuk g-soluk");
  // Çözümleme tablosu
  const d = ["0", "1", "Z"];
  const tablo = [["0", "X", "0"], ["X", "1", "1"], ["0", "1", "Z"]];
  const tx = 400, ty = 40, h = 38;
  s += yazi(tx + 20, ty + 18, "s1 \\ s2", "g-mini g-soluk");
  d.forEach((v, i) => {
    s += yazi(tx + 60 + i * h + h / 2, ty + 18, v, "g-kod g-kalin");
    s += yazi(tx + 40, ty + h + i * h + h / 2, v, "g-kod g-kalin", "end");
    d.forEach((_, j) => {
      const sonuc = tablo[i]![j]!;
      s += kutu(tx + 60 + j * h, ty + h + i * h, h, h, sonuc === "X" ? "g-hata" : "g-kutu");
      s += yazi(tx + 60 + j * h + h / 2, ty + h + i * h + h / 2, sonuc, sonuc === "X" ? "g-kod g-kalin g-renk-b" : "g-kod");
    });
  });
  s += yazi(tx + 117, ty + 4 * h + 18, "iki güçlü değer çakışırsa 'X'", "g-kucuk g-soluk");
  return s;
}

function oncelikliSecim(): string {
  let s = yazi(160, 14, "when/else: öncelikli zincir", "g-kalin") + yazi(500, 14, "with/select: paralel seçim", "g-kalin");
  s += yazi(24, 60, "a", "g-kod g-kucuk", "end") + cizgi([[30, 60], [230, 60]]);
  s += yazi(24, 130, "b", "g-kod g-kucuk", "end") + cizgi([[30, 130], [130, 130]]);
  s += yazi(24, 170, "c", "g-kod g-kucuk", "end") + cizgi([[30, 170], [130, 170]]);
  s += mux(130, 110, 30, 80) + yazi(136, 130, "1", "g-mini", "start") + yazi(136, 170, "0", "g-mini", "start");
  s += cizgi([[160, 150], [195, 150], [195, 100], [230, 100]]);
  s += mux(230, 40, 30, 80) + yazi(236, 60, "1", "g-mini", "start") + yazi(236, 100, "0", "g-mini", "start");
  s += ok([[260, 80], [312, 80]]) + yazi(318, 80, "y", "g-kod g-kucuk", "start");
  s += cizgi([[145, 186], [145, 200]]) + kutu(95, 200, 100, 26, "g-dolu") + yazi(145, 213, 'sec = "01"', "g-kod g-mini");
  s += cizgi([[245, 116], [245, 200]]) + kutu(205, 200, 100, 26, "g-dolu g-secili") + yazi(255, 213, 'sec = "00"', "g-kod g-mini");
  s += yazi(170, 244, "ilk koşul çıkışa en yakın: önceliği en yüksek", "g-mini g-soluk");
  s += cizgi([[352, 30], [352, 250]], "g-kesik");
  const giris: [string, string][] = [["a", '"00"'], ["b", '"01"'], ["c", '"10"'], ["d", "others"]];
  giris.forEach(([ad, deger], i) => {
    const y = 60 + i * 40;
    s += yazi(404, y, ad, "g-kod g-kucuk", "end") + cizgi([[410, y], [470, y]]) + yazi(440, y - 10, deger, "g-kod g-mini g-soluk");
  });
  s += mux(470, 40, 40, 160, 0.15) + ok([[510, 120], [566, 120]]) + yazi(572, 120, "y", "g-kod g-kucuk", "start");
  s += cizgi([[490, 197], [490, 226]]) + yazi(500, 224, "sec", "g-kod g-kucuk", "start");
  s += yazi(500, 244, "her değer bir kez, öncelik yok", "g-mini g-soluk");
  return s;
}

function latch(): string {
  let s = yazi(165, 14, "Eksik atama", "g-kalin") + yazi(480, 14, "Her yolda atama", "g-kalin");
  s += kutu(20, 28, 290, 92, "g-kutu") + satirlar(32, 46, ["if en = '1' then", "  q <= d;", "end if;", "-- en = '0' iken q ne olacak?"], "g-kod g-kucuk", "start", 18);
  s += kutu(335, 28, 290, 92, "g-kutu") + satirlar(347, 42, ["if en = '1' then", "  q <= d;", "else", "  q <= '0';", "end if;"], "g-kod g-kucuk", "start", 16);
  s += ok([[165, 122], [165, 140]]) + ok([[480, 122], [480, 140]]);
  s += yazi(66, 160, "d", "g-kod g-kucuk", "end") + cizgi([[72, 160], [115, 160]]);
  s += yazi(66, 186, "en", "g-kod g-kucuk", "end") + cizgi([[72, 186], [115, 186]]);
  s += kutu(115, 146, 104, 54, "g-uyari") + yazi(167, 166, "latch", "g-kalin") + yazi(167, 184, "eski değeri tutar", "g-mini");
  s += ok([[219, 173], [262, 173]]) + yazi(268, 173, "q", "g-kod g-kucuk", "start");
  s += yazi(165, 218, "Çoğunlukla istenmeyen bir bellek", "g-kucuk g-renk-d");
  s += yazi(410, 160, "d", "g-kod g-kucuk", "end") + cizgi([[416, 160], [460, 160]]);
  s += yazi(410, 186, "en", "g-kod g-kucuk", "end") + cizgi([[416, 186], [460, 186]]);
  s += ve(460, 150, 44, 46, "g-dolu") + ok([[504, 173], [556, 173]]) + yazi(562, 173, "q", "g-kod g-kucuk", "start");
  s += yazi(480, 218, "Kombinasyonel: q = en VE d", "g-kucuk g-renk-c");
  return s;
}

export const GORSELLER: Gorsel[] = [
  {
    kod: "G-H1-01",
    baslik: "FPGA'nın genel yapısı",
    aciklama: "Yonganın ortasında ızgara biçiminde dizilmiş CLB'ler, aralarında programlanabilir bağlantı kanalları ve kesişimlerde anahtar kutuları; kenarlarda giriş/çıkış blokları. Bir giriş bloğundan bir CLB'ye, oradan başka bir CLB'ye giden örnek yol vurgulanmış.",
    en: 640,
    boy: 360,
    icerik: fpgaYapisi(),
  },
  {
    kod: "G-H1-02",
    baslik: "Üretim adedine göre FPGA ve ASIC maliyeti",
    aciklama: "Yatay eksen üretim adedi, dikey eksen toplam maliyet. FPGA sıfırdan başlayıp dik yükselir; ASIC yüksek bir bir kerelik maliyetle (NRE) başlar ama yavaş yükselir. Kesişme noktasının solunda FPGA, sağında ASIC daha ucuzdur. Ölçeksizdir.",
    en: 640,
    boy: 290,
    icerik: adetMaliyet(),
  },
  {
    kod: "G-H1-03",
    baslik: "İşlemci sırayla, FPGA aynı anda çalışır",
    aciklama: "İşlemci üç çevrimde toplama, karşılaştırma ve saymayı birer kez sırayla yapar. FPGA'da her işin kendi donanımı vardır; üç çevrimde her iş üçer kez yapılır.",
    en: 640,
    boy: 244,
    icerik: cpuFpga(),
  },
  ...HAFTA_1_GORSELLERI,
  {
    kod: "G-H2-01",
    baslik: "PROM, PAL ve PLA'da hangi dizi programlanır",
    aciklama: "Üç yapı yan yana: PROM'da VE dizisi sabit, VEYA dizisi programlanır. PAL'de VE dizisi programlanır, VEYA dizisi sabittir. PLA'da ikisi de programlanır.",
    en: 640,
    boy: 236,
    icerik: promPalPla(),
  },
  {
    kod: "G-H2-02",
    baslik: "Bir CLB'nin içi",
    aciklama: "Dört giriş bir LUT'a girer. LUT çıkışı hem bir flip-flop'a hem doğrudan bir çoklayıcıya gider. Çoklayıcı, yapılandırma bitine göre kayıtlı (flip-flop çıkışı) ya da kayıtsız yolu çıkışa verir.",
    en: 640,
    boy: 220,
    icerik: clbIci(),
  },
  {
    kod: "G-H2-03",
    baslik: "2 girişli LUT: tablo ve çoklayıcı",
    aciklama: "Dört hücreli bir bellekte 0, 0, 0, 1 değerleri var. b ve a girişleri çoklayıcının seçim girişidir; ba = 11 iken çıkış 1 olur, yani tablo bir AND kapısı kurar.",
    en: 640,
    boy: 220,
    icerik: lut2(),
  },
  {
    kod: "G-H2-04",
    baslik: "FPGA tasarım akışı",
    aciklama: "Tasarım girişi, benzetim, sentez, uygulama (yerleştirme ve yönlendirme) ve bitstream adımları soldan sağa sıralı. İlk iki adım bu sitede tarayıcıda yapılır. Benzetimde hata çıkarsa koda, zamanlama tutmazsa sentez öncesine dönülür.",
    en: 640,
    boy: 176,
    icerik: tasarimAkisi(),
  },
  {
    kod: "G-H2-05",
    baslik: "Yapısal ve davranışsal modelleme",
    aciklama: "Solda tam toplayıcı iki yarım toplayıcı ve bir VEYA kapısının bağlanmasıyla kurulmuş. Sağda aynı devre tek bir kutu; içinde yalnızca a + b + cin ifadesi var ve devreyi sentez aracı kurar.",
    en: 640,
    boy: 204,
    icerik: yapisalDavranissal(),
  },
  ...HAFTA_2_GORSELLERI,
  {
    kod: "G-H3-01",
    baslik: "Bir VHDL dosyasının üç bölümü",
    aciklama: "Yarım toplayıcı dosyası üç renkli banda ayrılmış: kütüphane bildirimleri, portları tanımlayan entity ve içini anlatan architecture.",
    en: 640,
    boy: 262,
    icerik: ucBolum(),
  },
  {
    kod: "G-H3-02",
    baslik: "Yarım toplayıcı: entity ve architecture",
    aciklama: "Dış kutu entity'dir; a ve b giriş, s ve c çıkış portlarıdır. İçindeki architecture'da a ve b hem bir XOR kapısına (s) hem bir AND kapısına (c) bağlanır.",
    en: 640,
    boy: 220,
    icerik: yarimToplayici(),
  },
  ...HAFTA_3_GORSELLERI,
  {
    kod: "G-H4-01",
    baslik: "Değişken hemen, sinyal process beklerken güncellenir",
    aciklama: "Solda değişkene üç atama: değer sırayla 1, 2 ve 20 olur. Sağda sinyale atamalar yalnızca planlanır; process içindeyken s hâlâ 0'dır. wait çizgisinden sonra s = 1 ve s_sonuc = 0 olur.",
    en: 640,
    boy: 266,
    icerik: sinyalDegisken(),
  },
  {
    kod: "G-H4-02",
    baslik: "Aynı bitler, iki farklı sayı",
    aciklama: "Dört bitin hepsi 1. unsigned ağırlıklar 8, 4, 2, 1 olduğu için değer 15; signed'da en soldaki bitin ağırlığı -8 olduğu için değer -1.",
    en: 640,
    boy: 200,
    icerik: ayniBitler(),
  },
  {
    kod: "G-H4-03",
    baslik: "std_logic çözümlemesi: iki sürücü bir hat",
    aciklama: "İki üç durumlu tamponun çıkışları s1 ve s2 aynı hatta bağlı. Yanındaki tablo hattın değerini veriyor: biri Z ise diğeri geçer, 0 ile 1 çakışırsa X olur.",
    en: 640,
    boy: 230,
    icerik: cozumleme(),
  },
  ...HAFTA_4_GORSELLERI,
  {
    kod: "G-H5-01",
    baslik: "when/else öncelikli zincir, with/select paralel çoklayıcı",
    aciklama: "Solda iki tane 2'ye 1 çoklayıcı zincir oluşturur: çıkışa en yakın olan sec = 00 koşulunu sınar ve en yüksek önceliğe sahiptir. Sağda tek bir 4'e 1 çoklayıcı sec'in değerine göre a, b, c ya da d'yi seçer.",
    en: 640,
    boy: 254,
    icerik: oncelikliSecim(),
  },
  {
    kod: "G-H5-02",
    baslik: "Eksik atama latch üretir",
    aciklama: "Solda else dalı olmayan if: en = 0 iken q'ya atama yapılmadığı için sentez bir latch üretir. Sağda her dalda atama var; devre yalnızca q = en VE d olan bir kapıdır.",
    en: 640,
    boy: 230,
    icerik: latch(),
  },
  ...HAFTA_5_GORSELLERI,
];

export const gorselBul = (kod: string) => GORSELLER.find((g) => g.kod === kod);

// Ders metnindeki şekil satırları: tek başına bir paragraf olan [[G-H1-01]]
export const SEKIL_DESENI = /^\[\[(G-H\d+-\d+)\]\]$/;
