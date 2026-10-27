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
