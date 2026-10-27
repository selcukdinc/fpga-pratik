// Ders şekilleri için küçük SVG yardımcıları. Renkler sınıflarla verilir
// (styles.css'teki .g-* kuralları), böylece şekiller açık ve koyu temaya uyar.
// İşaretçi (marker) ya da kimlik kullanılmaz; aynı sayfada çok şekil olabilir.

export type Nokta = [number, number];
type Hiza = "start" | "middle" | "end";

const kac = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const n = (x: number) => Math.round(x * 10) / 10;
const pts = (p: Nokta[]) => p.map(([x, y]) => `${n(x)},${n(y)}`).join(" ");

export const kutu = (x: number, y: number, w: number, h: number, cls = "g-kutu") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" class="${cls}"/>`;

export const yazi = (x: number, y: number, s: string, cls = "", hiza: Hiza = "middle") =>
  `<text x="${x}" y="${y}" dy="0.35em" text-anchor="${hiza}" class="g-metin${cls ? ` ${cls}` : ""}">${kac(s)}</text>`;

// Alt alta satırlar; satır aralığı ara
export const satirlar = (x: number, y: number, ss: string[], cls = "", hiza: Hiza = "middle", ara = 16) =>
  ss.map((s, i) => yazi(x, y + i * ara, s, cls, hiza)).join("");

export const cizgi = (p: Nokta[], cls = "g-cizgi") => `<polyline points="${pts(p)}" class="${cls}"/>`;

// Son noktada ok ucu olan çizgi
export function ok(p: Nokta[], cls = "g-cizgi", ucCls = "g-uc") {
  const [x1, y1] = p[p.length - 2]!;
  const [x2, y2] = p[p.length - 1]!;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const u = 8;
  const g = 4;
  const sol: Nokta = [x2 - u * Math.cos(a) + g * Math.sin(a), y2 - u * Math.sin(a) - g * Math.cos(a)];
  const sag: Nokta = [x2 - u * Math.cos(a) - g * Math.sin(a), y2 - u * Math.sin(a) + g * Math.cos(a)];
  return cizgi(p, cls) + `<polygon points="${pts([[x2, y2], sol, sag])}" class="${ucCls}"/>`;
}

export const nokta = (x: number, y: number, cls = "g-uc") => `<circle cx="${x}" cy="${y}" r="3" class="${cls}"/>`;

export const yol = (d: string, cls = "g-kutu") => `<path d="${d}" class="${cls}"/>`;

// Kapılar: (x, y) sol üst köşe, girişler sol kenarda, çıkış sağ kenarın ortasında
export const ve = (x: number, y: number, w: number, h: number, cls = "g-kutu") =>
  yol(`M${x},${y} H${x + w - h / 2} A${h / 2},${h / 2} 0 0 1 ${x + w - h / 2},${y + h} H${x} Z`, cls);

export const veya = (x: number, y: number, w: number, h: number, cls = "g-kutu") =>
  yol(
    `M${x},${y} Q${x + w * 0.35},${y + h / 2} ${x},${y + h} Q${x + w * 0.75},${y + h} ${x + w},${y + h / 2} Q${x + w * 0.75},${y} ${x},${y} Z`,
    cls,
  );

export const ozelVeya = (x: number, y: number, w: number, h: number, cls = "g-kutu") =>
  veya(x, y, w, h, cls) + yol(`M${x - 6},${y} Q${x - 6 + w * 0.35},${y + h / 2} ${x - 6},${y + h}`, "g-cizgi");

// Çoklayıcı: sol kenar uzun, sağ kenar kısa yamuk
export const mux = (x: number, y: number, w: number, h: number, egim = 0.2, cls = "g-kutu") => {
  const e = h * egim;
  return `<polygon points="${pts([[x, y], [x + w, y + e], [x + w, y + h - e], [x, y + h]])}" class="${cls}"/>`;
};

export const svg = (en: number, boy: number, icerik: string) => ({ en, boy, icerik });

// ---- Dalga diyagramı ----
// Her satır bir sinyaldir; dalga dizgisindeki her karakter bir zaman dilimidir:
// '0' ve '1' seviye, 'x' bilinmeyen, 'z' yüksek empedans, '=' veri dizisindeki
// sıradaki değerle yeni bir vektör değeri, '.' önceki dilimin devamı.
// Saat için "01010101" gibi yazılır.
export interface DalgaSatiri {
  ad: string;
  dalga: string;
  veri?: string[];
  // Dalganın sınıfı; vurgulanacak sinyal için "g-dalga g-renk-a-cizgi" gibi
  cls?: string;
}

export interface DalgaSecenek {
  // Sinyal adlarına ayrılan genişlik
  etiketEn?: number;
  // Bir zaman diliminin genişliği
  adim?: number;
  // Satır yüksekliği ve satırlar arası mesafe
  boy?: number;
  ara?: number;
  // Dikey kesik çizgiler: dilim sırası (0'dan) ve üstüne yazılacak etiket
  isaretler?: { t: number; etiket?: string }[];
}

export function dalga(x: number, y: number, satirlar: DalgaSatiri[], o: DalgaSecenek = {}): string {
  const { etiketEn = 70, adim = 36, boy = 20, ara = 34, isaretler = [] } = o;
  const x0 = x + etiketEn;
  let s = "";
  for (const m of isaretler) {
    const mx = x0 + m.t * adim;
    s += cizgi([[mx, y - 8], [mx, y + (satirlar.length - 1) * ara + boy + 6]], "g-kesik");
    if (m.etiket) s += yazi(mx, y - 16, m.etiket, "g-mini g-soluk");
  }
  satirlar.forEach((sat, i) => {
    const ust = y + i * ara;
    const alt = ust + boy;
    const orta = ust + boy / 2;
    const cls = sat.cls ?? "g-dalga";
    s += yazi(x0 - 10, orta, sat.ad, "g-kod g-kucuk", "end");
    let onceki = "";
    let veriSira = 0;
    let etiket = "";
    let etiketBas = 0;
    const etiketYaz = (bitis: number) => {
      if (etiket && bitis - etiketBas >= 14) s += yazi((etiketBas + bitis) / 2, orta, etiket, "g-mini g-kod");
    };
    for (let k = 0; k < sat.dalga.length; k++) {
      let c = sat.dalga[k]!;
      const xa = x0 + k * adim;
      const xb = xa + adim;
      if (c === ".") c = onceki === "=" ? "~" : onceki;
      if (c === "0" || c === "1") {
        const yy = c === "1" ? ust : alt;
        if (onceki === "0" || onceki === "1") {
          if (onceki !== c) s += cizgi([[xa, onceki === "1" ? ust : alt], [xa, yy]], cls);
        }
        s += cizgi([[xa, yy], [xb, yy]], cls);
      } else if (c === "z") {
        s += cizgi([[xa, orta], [xb, orta]], "g-dalga-z");
      } else if (c === "x") {
        s += kutu(xa, ust, adim, boy, "g-dalga-x");
      } else if (c === "=" || c === "~") {
        if (c === "=") {
          etiketYaz(xa);
          etiket = sat.veri?.[veriSira++] ?? "";
          etiketBas = xa;
          s += yol(`M${xa},${orta} L${xa + 4},${ust} M${xa},${orta} L${xa + 4},${alt}`, cls);
          s += cizgi([[xa + 4, ust], [xb, ust]], cls) + cizgi([[xa + 4, alt], [xb, alt]], cls);
        } else {
          s += cizgi([[xa, ust], [xb, ust]], cls) + cizgi([[xa, alt], [xb, alt]], cls);
        }
      }
      onceki = c === "~" ? "=" : c;
      if (c !== "=" && c !== "~") {
        etiketYaz(xa);
        etiket = "";
      }
    }
    etiketYaz(x0 + sat.dalga.length * adim);
  });
  return s;
}

// ---- Bit dizisi ----
// Bir vektörün bitlerini soldan sağa kutucuklar halinde çizer. indisler verilirse
// her kutunun altına indisi yazılır; vurgu'daki konumlar (0 = en soldaki kutu)
// vurguCls ile boyanır.
export interface BitSecenek {
  en?: number;
  boy?: number;
  indisler?: (number | string)[];
  vurgu?: number[];
  vurguCls?: string;
  cls?: string;
}

export function bitDizisi(x: number, y: number, bitler: string | string[], o: BitSecenek = {}): string {
  const { en = 28, boy = 26, indisler, vurgu = [], vurguCls = "g-dolu g-secili", cls = "g-kutu" } = o;
  const liste = typeof bitler === "string" ? [...bitler] : bitler;
  let s = "";
  liste.forEach((b, i) => {
    const bx = x + i * en;
    s += kutu(bx, y, en, boy, vurgu.includes(i) ? vurguCls : cls) + yazi(bx + en / 2, y + boy / 2, b, "g-kod g-kucuk");
    if (indisler?.[i] !== undefined) s += yazi(bx + en / 2, y + boy + 11, String(indisler[i]), "g-mini g-soluk");
  });
  return s;
}
