// Hafta 1 ders şekilleri (G-H1-04 ve sonrası). İlk üç şekil index.ts'tedir.

import { bitDizisi, cizgi, dalga, kutu, nokta, ok, satirlar, ve, yazi, yol, type Nokta } from "./cizim";
import type { Gorsel } from "./tip";

const sayi = (n: number) => Math.round(n).toLocaleString("tr-TR");

// 3x3 CLB'lik küçük bir yonga; secili CLB'ler ve yollar vurgulanır
function miniYonga(x: number, y: number, secili: [number, number][], yollar: Nokta[][]): string {
  let s = kutu(x, y, 170, 140, "g-kutu g-yonga");
  const cx = (c: number) => x + 20 + c * 50;
  const cy = (r: number) => y + 18 + r * 42;
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const sec = secili.some(([a, b]) => a === r && b === c);
      s += kutu(cx(c), cy(r), 32, 24, sec ? "g-dolu g-secili" : "g-sabit");
    }
  for (const p of yollar) s += cizgi(p.map(([c, r]) => [x + c, y + r] as Nokta), "g-yol");
  return s;
}

function bitstreamYukleme(): string {
  let s = "";
  const satir = (y: number, ad: string, bitler: string, devre: string, secili: [number, number][], yollar: Nokta[][]) => {
    s += yazi(20, y + 12, ad, "g-kalin", "start");
    s += bitDizisi(20, y + 30, bitler, { en: 20, boy: 22 });
    s += yazi(20, y + 68, "yapılandırma dosyası", "g-mini g-soluk", "start");
    s += ok([[268, y + 41], [330, y + 41]]) + yazi(299, y + 28, "yükle", "g-mini g-soluk");
    s += miniYonga(340, y - 28, secili, yollar);
    s += ok([[516, y + 41], [540, y + 41]]) + yazi(546, y + 41, devre, "g-kalin g-renk-a", "start");
  };
  // Yollar CLB'lerin arasındaki kanallardan geçer (x = 61, 111; y = 51, 93)
  satir(40, "Bitstream A", "101100100110", "toplayıcı", [[0, 0], [1, 1], [1, 2]], [[[52, 30], [61, 30], [61, 72], [70, 72]], [[102, 72], [120, 72]]]);
  satir(200, "Bitstream B", "010011101001", "sayaç", [[0, 2], [2, 0], [2, 1]], [[[52, 114], [70, 114]], [[102, 114], [111, 114], [111, 30], [120, 30]]]);
  s += yazi(425, 330, "Aynı yonga, iki farklı devre", "g-kucuk g-soluk");
  return s;
}

function anahtarKutusu(): string {
  const [x, y, w] = [130, 70, 110];
  const sol: Nokta = [x, y + w / 2];
  const sag: Nokta = [x + w, y + w / 2];
  const ust: Nokta = [x + w / 2, y];
  const alt: Nokta = [x + w / 2, y + w];
  let s = kutu(x, y, w, w, "g-kutu g-yonga");
  s += cizgi([[20, sol[1]], sol], "g-cizgi") + cizgi([sag, [x + w + 90, sag[1]]], "g-cizgi");
  s += cizgi([[ust[0], 20], ust], "g-cizgi") + cizgi([alt, [alt[0], y + w + 50]], "g-cizgi");
  s += yazi(20, sol[1] - 12, "sol", "g-mini g-soluk", "start") + yazi(x + w + 90, sag[1] - 12, "sağ", "g-mini g-soluk", "end");
  s += yazi(ust[0] + 8, 22, "üst", "g-mini g-soluk", "start") + yazi(alt[0] + 8, y + w + 46, "alt", "g-mini g-soluk", "start");
  const baglar: [string, Nokta, Nokta, boolean][] = [
    ["sol-üst", sol, ust, true],
    ["sol-sağ", sol, sag, false],
    ["sol-alt", sol, alt, false],
    ["üst-sağ", ust, sag, false],
    ["üst-alt", ust, alt, false],
    ["sağ-alt", sag, alt, true],
  ];
  for (const [, a, b, acik] of baglar) {
    const orta: Nokta = [(a[0] + b[0]) / 2 + (a[0] === b[0] || a[1] === b[1] ? 0 : (x + w / 2 - (a[0] + b[0]) / 2) * 0.5), (a[1] + b[1]) / 2 + (a[0] === b[0] || a[1] === b[1] ? 0 : (y + w / 2 - (a[1] + b[1]) / 2) * 0.5)];
    s += yol(`M${a[0]},${a[1]} Q${orta[0]},${orta[1]} ${b[0]},${b[1]}`, acik ? "g-yol" : "g-kesik");
  }
  for (const p of [sol, sag, ust, alt]) s += nokta(p[0], p[1]);
  // Yapılandırma bitleri tablosu
  const tx = 380;
  s += yazi(tx, 24, "Yapılandırma bitleri", "g-kalin", "start");
  baglar.forEach(([ad, , , acik], i) => {
    const ty = 52 + i * 26;
    s += yazi(tx, ty, ad, "g-kucuk", "start");
    s += bitDizisi(tx + 80, ty - 11, acik ? "1" : "0", { en: 24, boy: 22, vurgu: acik ? [0] : [] });
    s += yazi(tx + 114, ty, acik ? "bağlı" : "açık", acik ? "g-mini g-renk-a" : "g-mini g-soluk", "start");
  });
  s += satirlar(tx, 222, ["1 olan bit, iki teli birbirine bağlayan", "anahtarı kapatır. Bitstream bu bitlerin", "hepsini birden yazar."], "g-mini g-soluk", "start", 14);
  return s;
}

export interface MaliyetDegerleri {
  // FPGA'nın tanesi, ASIC'in bir kerelik maliyeti (NRE) ve tanesi; TL
  fpga: number;
  nre: number;
  asic: number;
  // İşaretlenen üretim adedi
  adet: number;
}

export const MALIYET_VARSAYILAN: MaliyetDegerleri = { fpga: 50, nre: 2_000_000, asic: 10, adet: 20_000 };

export const kesisimAdedi = (d: MaliyetDegerleri) => (d.fpga > d.asic ? d.nre / (d.fpga - d.asic) : null);

// Ölçekli maliyet grafiği; etkileşimli şekil de aynı fonksiyonla çizilir
export function maliyetGrafigi(d: MaliyetDegerleri): string {
  const [x0, x1, y0, yUst] = [80, 610, 250, 30];
  const kes = kesisimAdedi(d);
  const ham = Math.max(d.adet * 1.25, kes ? kes * 2 : 0, 1000);
  const kuvvet = 10 ** Math.floor(Math.log10(ham));
  const xMax = Math.ceil(ham / kuvvet) * kuvvet;
  const fpga = (n: number) => d.fpga * n;
  const asic = (n: number) => d.nre + d.asic * n;
  const yMax = Math.max(fpga(xMax), asic(xMax)) * 1.05;
  const px = (n: number) => x0 + (n / xMax) * (x1 - x0);
  const py = (m: number) => y0 - (m / yMax) * (y0 - yUst);
  let s = ok([[x0, y0], [x0, yUst - 12]]) + ok([[x0, y0], [x1 + 18, y0]]);
  for (let i = 0; i <= 4; i++) {
    const n = (xMax / 4) * i;
    s += cizgi([[px(n), y0], [px(n), y0 + 4]]) + yazi(px(n), y0 + 15, sayi(n), "g-mini g-soluk");
    const m = (yMax / 4) * i;
    s += cizgi([[x0 - 4, py(m)], [x0, py(m)]]) + yazi(x0 - 7, py(m), kisaTL(m), "g-mini g-soluk", "end");
  }
  s += yazi((x0 + x1) / 2, y0 + 32, "Üretim adedi", "g-kucuk");
  s += yazi(x0 + 6, yUst - 14, "Toplam maliyet (TL)", "g-kucuk", "start");
  s += cizgi([[px(0), py(fpga(0))], [px(xMax), py(fpga(xMax))]], "g-seri-a");
  s += cizgi([[px(0), py(asic(0))], [px(xMax), py(asic(xMax))]], "g-seri-b");
  s += yazi(px(xMax) - 4, py(fpga(xMax)) + (fpga(xMax) > asic(xMax) ? -12 : 14), "FPGA", "g-kalin g-renk-a", "end");
  s += yazi(px(xMax) - 4, py(asic(xMax)) + (asic(xMax) >= fpga(xMax) ? -12 : 14), "ASIC", "g-kalin g-renk-b", "end");
  if (kes !== null && kes <= xMax) {
    s += cizgi([[px(kes), py(fpga(kes))], [px(kes), y0]], "g-kesik") + nokta(px(kes), py(fpga(kes)));
    s += yazi(px(kes) + 8, py(fpga(kes)) + 18, `kesişim: ${sayi(kes)} adet`, "g-kucuk", "start");
  }
  // Seçilen adet: iki seçeneğin toplam maliyeti
  const ax = px(d.adet);
  s += cizgi([[ax, yUst], [ax, y0]], "g-cizgi g-renk-c-cizgi");
  s += nokta(ax, py(fpga(d.adet)), "g-uc g-renk-a") + nokta(ax, py(asic(d.adet)), "g-uc g-renk-b");
  s += yazi(ax + (ax > 450 ? -6 : 6), yUst + 8, `${sayi(d.adet)} adet`, "g-mini g-renk-c", ax > 450 ? "end" : "start");
  return s;
}

function kisaTL(m: number): string {
  if (m >= 1e6) return `${(m / 1e6).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} mn`;
  if (m >= 1e3) return `${(m / 1e3).toLocaleString("tr-TR", { maximumFractionDigits: 0 })} bin`;
  return sayi(m);
}

function gelistirmeDongusu(): string {
  let s = "";
  const akis = (y: number, ad: string, adimlar: string[], sure: string, donus: string, cls: string, uc: string, renk: string) => {
    s += yazi(20, y + 20, ad, "g-kalin", "start");
    adimlar.forEach((a, i) => {
      const x = 90 + i * 108;
      s += kutu(x, y, 92, 40, "g-dolu") + yazi(x + 46, y + 20, a, "g-kucuk");
      if (i < adimlar.length - 1) s += ok([[x + 92, y + 20], [x + 106, y + 20]]);
    });
    const son = 90 + (adimlar.length - 1) * 108 + 46;
    s += ok([[son, y + 40], [son, y + 62], [136, y + 62], [136, y + 42]], cls, uc);
    s += yazi((son + 136) / 2, y + 74, donus, `g-mini ${renk}`);
    s += yazi(son + 56, y + 20, sure, "g-mini g-soluk", "start");
  };
  akis(20, "ASIC", ["Tasarım", "Doğrulama", "Maske", "Üretim", "Test"], "", "hata: yeni maske ve üretim turu (aylar, çok pahalı)", "g-cizgi g-renk-b-cizgi", "g-uc g-renk-b", "g-renk-b");
  akis(130, "FPGA", ["Tasarım", "Sentez", "Bitstream", "Test"], "", "hata: kodu düzelt, yeniden yükle (dakikalar)", "g-cizgi g-renk-c-cizgi", "g-uc g-renk-c", "g-renk-c");
  return s;
}

function esneklikVerim(): string {
  const yongalar: [string, string[]][] = [
    ["CPU", ["komutları sırayla", "yürütür"]],
    ["GPU", ["binlerce basit", "çekirdek"]],
    ["FPGA", ["yeniden kurulabilen", "özel donanım"]],
    ["ASIC", ["silikona kazınmış", "özel donanım"]],
  ];
  let s = ok([[300, 30], [40, 30]], "g-cizgi g-renk-a-cizgi", "g-uc g-renk-a") + yazi(310, 30, "esneklik ve kullanım kolaylığı", "g-kucuk g-renk-a", "start");
  s += ok([[340, 196], [600, 196]], "g-cizgi g-renk-c-cizgi", "g-uc g-renk-c") + yazi(330, 196, "performans ve güç verimliliği", "g-kucuk g-renk-c", "end");
  yongalar.forEach(([ad, alt], i) => {
    const x = 40 + i * 146;
    s += kutu(x, 64, 122, 46, `g-dolu g-ton${i % 3}`) + yazi(x + 61, 87, ad, "g-kalin");
    s += satirlar(x + 61, 134, alt, "g-mini g-soluk", "middle", 14);
    if (i < 3) s += ok([[x + 122, 87], [x + 144, 87]]);
  });
  return s;
}

function sekizToplayici(): string {
  const adim = 30;
  const x0 = 110;
  let s = dalga(40, 30, [{ ad: "clk", dalga: "01".repeat(8) }], { etiketEn: 70, adim, boy: 18 });
  for (let c = 0; c < 8; c++) s += yazi(x0 + c * 60 + 30, 62, `${c + 1}`, "g-mini g-soluk");
  s += yazi(x0 - 10, 90, "CPU", "g-kalin", "end");
  for (let c = 0; c < 8; c++) s += kutu(x0 + c * 60 + 4, 78, 52, 24, "g-dolu g-ton0") + yazi(x0 + c * 60 + 30, 90, `+${c + 1}`, "g-mini g-kod");
  s += yazi(x0 - 10, 170, "FPGA", "g-kalin", "end");
  for (let k = 0; k < 8; k++) s += kutu(x0 + 4, 116 + k * 15, 52, 13, "g-dolu g-ton1") + yazi(x0 + 30, 122.5 + k * 15, `+${k + 1}`, "g-mini g-kod");
  s += satirlar(x0 + 80, 150, ["8 ayrı toplayıcı donanımı aynı saat kenarında", "birlikte çalışır: 8 toplama 1 çevrimde biter.", "CPU'nun tek yürütme birimi aynı iş için 8 çevrim harcar."], "g-kucuk", "start", 17);
  return s;
}

function olcekSeridi(): string {
  const [x0, x1] = [40, 600];
  const px = (g: number) => x0 + (Math.log10(g) / 7) * (x1 - x0);
  let s = "";
  const bolgeler: [string, number, number, string][] = [
    ["SSI", 1, 20, "g-bant-1"],
    ["MSI", 20, 100, "g-bant-2"],
    ["LSI", 100, 5000, "g-bant-3"],
    ["VLSI", 5000, 1e7, "g-bant-2"],
  ];
  for (const [ad, a, b, cls] of bolgeler) {
    s += kutu(px(a), 70, px(b) - px(a), 34, cls) + yazi((px(a) + px(b)) / 2, 87, ad, "g-kalin");
  }
  for (const [g, et] of [[1, "1"], [20, "20"], [100, "100"], [5000, "5.000"]] as const) s += yazi(px(g), 116, et, "g-mini");
  for (let k = 1; k <= 7; k++) s += cizgi([[px(10 ** k), 104], [px(10 ** k), 108]], "g-bag");
  s += yazi(px(1e7) - 4, 116, "10 milyon →", "g-mini g-soluk", "end");
  const isaret = (g: number, y: number, satir: string[]) => {
    s += cizgi([[px(g), 104], [px(g), y - 8]], "g-kesik") + nokta(px(g), 104);
    s += satirlar(px(g), y, satir, "g-mini", "middle", 13);
  };
  isaret(4, 150, ["7400", "4 kapı"]);
  isaret(50, 150, ["74LS90", "sayıcı"]);
  isaret(1500, 150, ["ilk", "mikroişlemciler"]);
  isaret(2e6, 150, ["günümüz işlemcileri", "ve FPGA'lar"]);
  s += yazi(x0, 40, "Kapı sayısı (logaritmik ölçek: her çentik 10 kat)", "g-kucuk g-soluk", "start");
  return s;
}

// İki girişli NAND sembolü ve bacak numaraları
function nand(x: number, y: number, a: string, b: string, cikis: string): string {
  let s = ve(x, y, 34, 26, "g-kutu") + `<circle cx="${x + 38}" cy="${y + 13}" r="4" class="g-kutu"/>`;
  s += cizgi([[x - 14, y + 7], [x, y + 7]]) + cizgi([[x - 14, y + 19], [x, y + 19]]) + cizgi([[x + 42, y + 13], [x + 56, y + 13]]);
  s += yazi(x - 18, y + 7, a, "g-mini g-kod", "end") + yazi(x - 18, y + 19, b, "g-mini g-kod", "end") + yazi(x + 60, y + 13, cikis, "g-mini g-kod", "start");
  return s;
}

function entegre7400(): string {
  const [x, y, w, h] = [150, 60, 340, 150];
  let s = kutu(x, y, w, h, "g-kutu g-yonga") + yol(`M${x},${y + h / 2 - 10} A10,10 0 0 1 ${x},${y + h / 2 + 10}`, "g-cizgi");
  for (let i = 0; i < 7; i++) {
    const px = x + 30 + i * 47;
    s += kutu(px - 6, y + h, 12, 14, "g-pin") + yazi(px, y + h + 26, String(i + 1), "g-mini g-kod");
    s += kutu(px - 6, y - 14, 12, 14, "g-pin") + yazi(px, y - 24, String(14 - i), "g-mini g-kod");
  }
  s += nand(x + 40, y + 92, "1", "2", "3") + nand(x + 210, y + 92, "4", "5", "6");
  s += nand(x + 40, y + 28, "13", "12", "11") + nand(x + 210, y + 28, "10", "9", "8");
  s += yazi(x + 30, y - 40, "VCC (14)", "g-mini g-renk-b") + yazi(x + 30 + 6 * 47, y + h + 42, "GND (7)", "g-mini g-soluk");
  s += satirlar(x + w + 18, y + 50, ["4 adet iki girişli", "NAND kapısı", "= 4 kapı", "→ SSI"], "g-kucuk", "start", 17);
  s += yazi(x + w / 2, y + h / 2, "7400", "g-kalin g-soluk");
  return s;
}

function kararAgaci(): string {
  let s = "";
  const soru = (x: number, y: number, w: number, metin: string[]) => {
    s += kutu(x, y, w, 20 + metin.length * 15, "g-dolu") + satirlar(x + w / 2, y + 17, metin, "g-kucuk", "middle", 15);
  };
  const sonuc = (x: number, y: number, ad: string, alt: string[], cls: string) => {
    s += kutu(x, y, 150, 26 + alt.length * 14, cls) + yazi(x + 75, y + 14, ad, "g-kalin");
    s += satirlar(x + 75, y + 31, alt, "g-mini g-soluk", "middle", 13);
  };
  soru(190, 10, 260, ["İş paralel mi, zamanlaması kesin mi?"]);
  s += ok([[230, 45], [110, 80]]) + yazi(150, 56, "hayır", "g-mini g-soluk", "end");
  sonuc(35, 82, "CPU", ["sırayla ilerleyen, sık", "değişen yazılım işleri"], "g-kutu");
  s += ok([[410, 45], [470, 80]]) + yazi(452, 56, "evet", "g-mini g-soluk", "start");
  soru(330, 82, 280, ["Tasarım kesinleşti mi ve", "çok yüksek adette mi üretilecek?"]);
  s += ok([[400, 132], [310, 172]]) + yazi(340, 148, "hayır", "g-mini g-soluk", "end");
  s += ok([[540, 132], [540, 172]]) + yazi(548, 152, "evet", "g-mini g-soluk", "start");
  sonuc(230, 174, "FPGA", ["az ya da orta adet,", "sahada güncellenebilir"], "g-dolu g-secili");
  sonuc(465, 174, "ASIC", ["NRE adetlere bölünür,", "birim maliyet en düşük"], "g-kutu");
  s += ok([[380, 196], [462, 196]], "g-kesik") + yazi(421, 238, "önce FPGA'da", "g-mini g-soluk") + yazi(421, 251, "prototip", "g-mini g-soluk");
  return s;
}

export const HAFTA_1_GORSELLERI: Gorsel[] = [
  {
    kod: "G-H1-04",
    baslik: "Bitstream yükleme: aynı yonga, iki farklı devre",
    aciklama: "Solda iki farklı bit dizisi (bitstream A ve B) var. A yüklendiğinde yongadaki bazı CLB'ler ve bağlantılar bir toplayıcı oluşturacak şekilde kurulur; B yüklendiğinde aynı yongada başka CLB'ler ve yollar seçilir ve devre bir sayaç olur.",
    en: 640,
    boy: 344,
    icerik: bitstreamYukleme(),
  },
  {
    kod: "G-H1-05",
    baslik: "Anahtar kutusu ve yapılandırma bitleri",
    aciklama: "Dört yönden gelen tellerin buluştuğu bir anahtar kutusu. Altı olası bağlantıdan sol-üst ve sağ-alt bağlı, diğerleri açık. Yanındaki tablo her bağlantının yapılandırma bitini gösteriyor: bit 1 ise anahtar kapalıdır ve teller birbirine bağlanır.",
    en: 640,
    boy: 270,
    icerik: anahtarKutusu(),
  },
  {
    kod: "G-H1-06",
    baslik: "FPGA ve ASIC toplam maliyeti: kesişim noktası",
    aciklama: "Ölçekli grafik. FPGA'nın toplam maliyeti tane fiyatı çarpı adet, ASIC'inki NRE artı tane fiyatı çarpı adettir. Varsayılan değerlerde (FPGA tanesi 50 TL, ASIC NRE 2.000.000 TL ve tanesi 10 TL) iki doğru 50.000 adette kesişir. Değerler değiştirilebilir.",
    en: 640,
    boy: 290,
    icerik: maliyetGrafigi(MALIYET_VARSAYILAN),
    etkilesim: "maliyet",
  },
  {
    kod: "G-H1-07",
    baslik: "Hata düzeltme döngüsü: ASIC ve FPGA",
    aciklama: "ASIC'te tasarım, doğrulama, maske, üretim ve test adımları var; testte hata çıkarsa yeni maske ve üretim turu gerekir, bu aylar sürer ve pahalıdır. FPGA'da tasarım, sentez, bitstream ve test adımları var; hata çıkarsa kod düzeltilip dakikalar içinde yeniden yüklenir.",
    en: 640,
    boy: 230,
    icerik: gelistirmeDongusu(),
  },
  {
    kod: "G-H1-08",
    baslik: "En esnekten en verimliye: CPU, GPU, FPGA, ASIC",
    aciklama: "Dört yonga soldan sağa sıralı: CPU, GPU, FPGA, ASIC. Sola doğru esneklik ve kullanım kolaylığı, sağa doğru performans ve güç verimliliği artar.",
    en: 640,
    boy: 214,
    icerik: esneklikVerim(),
  },
  {
    kod: "G-H1-09",
    baslik: "8 toplama: CPU 8 çevrim, FPGA 1 çevrim",
    aciklama: "Üstte 8 periyotluk bir saat dalgası. CPU satırında her çevrimde bir toplama yapılır, 8 toplama 8 çevrim sürer. FPGA satırında 8 ayrı toplayıcı ilk çevrimde aynı anda çalışır.",
    en: 640,
    boy: 250,
    icerik: sekizToplayici(),
  },
  {
    kod: "G-H1-10",
    baslik: "Entegre ölçekleri: kapı sayısı şeridi",
    aciklama: "Logaritmik bir kapı sayısı ekseni dört banda ayrılmış: SSI 1-20, MSI 20-100, LSI 100-5000, VLSI 5000 ve üzeri. 7400 (4 kapı) SSI'da, 74LS90 sayıcı MSI'da, ilk mikroişlemciler LSI'da, günümüz işlemcileri ve FPGA'lar VLSI'nın çok ötesinde.",
    en: 640,
    boy: 190,
    icerik: olcekSeridi(),
  },
  {
    kod: "G-H1-11",
    baslik: "7400 entegresinin içi",
    aciklama: "14 bacaklı bir entegre. İçinde dört tane iki girişli NAND kapısı var: 1 ve 2 girişli kapının çıkışı 3, 4 ve 5'inki 6, 9 ve 10'unki 8, 12 ve 13'ünki 11 numaralı bacaktadır. 14 besleme (VCC), 7 topraktır (GND). Toplam 4 kapı olduğu için SSI sınıfındadır.",
    en: 640,
    boy: 270,
    icerik: entegre7400(),
  },
  {
    kod: "G-H1-12",
    baslik: "CPU, FPGA ya da ASIC: hangisi?",
    aciklama: "Karar ağacı. İş paralel ve zamanlaması kesin değilse CPU uygundur. Öyleyse ikinci soru: tasarım kesinleşti mi ve çok yüksek adette mi üretilecek? Evetse ASIC, hayırsa FPGA. ASIC'e gitmeden önce tasarım FPGA'da prototiplenir.",
    en: 640,
    boy: 262,
    icerik: kararAgaci(),
  },
];
