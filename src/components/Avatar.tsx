// 56 avatar çizimi. Hepsi currentColor ile çizilir: zemin rengi seçilmemişse
// temanın yazı rengini alır, seçilmişse açık zeminin üzerinde koyu kalır.
// Kimlik listesi shared/avatarlar.ts'te.

import type { ReactNode } from "react";
import { AVATARLAR } from "../../shared/avatarlar";

const L = ({ d }: { d: string }) => <path d={d} />;
const C = ({ x, y, r = 3 }: { x: number; y: number; r?: number }) => <circle cx={x} cy={y} r={r} />;

// Kutunun içinde ya da yanında kısa yazılar (D, Q, HA, LUT ...)
function T({ x, y, s = 9, children }: { x: number; y: number; s?: number; children: string }) {
  return (
    <text
      x={x}
      y={y}
      fontSize={s}
      textAnchor="middle"
      dominantBaseline="central"
      fill="currentColor"
      stroke="none"
      fontFamily="ui-monospace, Menlo, Consolas, monospace"
      fontWeight={700}
    >
      {children}
    </text>
  );
}

// Ortak kapı gövdeleri
const AND = "M10 12 H24 A12 12 0 0 1 24 36 H10 Z";
const OR = "M10 12 Q18 24 10 36 Q30 36 38 24 Q30 12 10 12 Z";
const UCGEN = "M12 12 L32 24 L12 36 Z";
const iki = "M4 18 H11 M4 30 H11";

const saatUcgeni = (x: number, y: number) => `M${x} ${y - 3} L${x + 5} ${y} L${x} ${y + 3}`;

// Uzun sözcükler iki satıra bölünür, böylece küçük boyutta da okunur
function kelime(...satirlar: string[]): ReactNode {
  const s = Math.min(10, 35 / (Math.max(...satirlar.map((x) => x.length)) * 0.62));
  return (
    <>
      <rect x={3} y={satirlar.length > 1 ? 9 : 13} width={42} height={satirlar.length > 1 ? 30 : 22} rx={5} />
      {satirlar.map((x, i) => (
        <T key={x} x={24} y={24.5 + (i - (satirlar.length - 1) / 2) * 11} s={s}>{x}</T>
      ))}
    </>
  );
}

const CIZIMLER: Record<string, ReactNode> = {
  // Kapılar
  and: <><L d={AND} /><L d={`${iki} M36 24 H44`} /></>,
  or: <><L d={OR} /><L d={"M4 18 H14 M4 30 H14 M38 24 H44"} /></>,
  not: <><L d={UCGEN} /><C x={35} y={24} /><L d="M4 24 H12 M38 24 H44" /></>,
  nand: <><L d="M8 12 H22 A12 12 0 0 1 22 36 H8 Z" /><C x={37} y={24} /><L d="M2 18 H8 M2 30 H8 M40 24 H46" /></>,
  nor: <><L d="M8 12 Q16 24 8 36 Q26 36 33 24 Q26 12 8 12 Z" /><C x={36} y={24} /><L d="M2 18 H12 M2 30 H12 M39 24 H46" /></>,
  xor: <><L d={OR} /><L d="M5 12 Q13 24 5 36" /><L d="M2 18 H9 M2 30 H9 M38 24 H44" /></>,
  xnor: <><L d="M10 12 Q18 24 10 36 Q28 36 34 24 Q28 12 10 12 Z" /><L d="M5 12 Q13 24 5 36" /><C x={37} y={24} /><L d="M2 18 H9 M2 30 H9 M40 24 H46" /></>,
  buffer: <><L d={UCGEN} /><L d="M4 24 H12 M32 24 H44" /></>,
  tristate: <><L d={UCGEN} /><L d="M4 24 H12 M32 24 H44 M22 6 V18" /></>,

  // Kombinasyonel
  "yarim-toplayici": <><rect x={12} y={10} width={24} height={28} rx={2} /><T x={24} y={24}>HA</T><L d="M4 18 H12 M4 30 H12 M36 18 H44 M36 30 H44" /></>,
  "tam-toplayici": <><rect x={12} y={8} width={24} height={32} rx={2} /><T x={24} y={24}>FA</T><L d="M4 15 H12 M4 24 H12 M4 33 H12 M36 18 H44 M36 30 H44" /></>,
  mux2: <><L d="M16 8 L32 16 L32 32 L16 40 Z" /><L d="M6 16 H16 M6 32 H16 M32 24 H42 M24 36 V44" /><T x={20.5} y={16} s={6}>0</T><T x={20.5} y={32} s={6}>1</T></>,
  mux4: <><L d="M16 4 L32 12 L32 36 L16 44 Z" /><L d="M6 12 H16 M6 20 H16 M6 28 H16 M6 36 H16 M32 24 H42" /><T x={24} y={24} s={7}>4:1</T></>,
  demux: <><L d="M16 16 L32 8 L32 40 L16 32 Z" /><L d="M6 24 H16 M32 14 H42 M32 24 H42 M32 34 H42 M24 36 V44" /></>,
  decoder: <><rect x={14} y={6} width={20} height={36} rx={2} /><T x={24} y={24} s={7}>DEC</T><L d="M6 18 H14 M6 30 H14 M34 11 H42 M34 19 H42 M34 29 H42 M34 37 H42" /></>,
  encoder: <><rect x={14} y={6} width={20} height={36} rx={2} /><T x={24} y={24} s={7}>ENC</T><L d="M6 11 H14 M6 19 H14 M6 29 H14 M6 37 H14 M34 18 H42 M34 30 H42" /></>,
  karsilastirici: <><rect x={10} y={10} width={28} height={28} rx={2} /><T x={24} y={24} s={8}>A&gt;B</T><L d="M3 18 H10 M3 30 H10 M38 24 H45" /></>,
  alu: <><L d="M8 6 L40 16 L40 32 L8 42 L8 28 L14 24 L8 20 Z" /><T x={28} y={24} s={7}>ALU</T></>,

  // Ardışıl
  dff: <><rect x={12} y={8} width={24} height={32} rx={2} /><T x={17} y={15} s={7}>D</T><T x={31} y={15} s={7}>Q</T><L d={`${saatUcgeni(12, 32)} M4 15 H12 M36 15 H44 M4 32 H12`} /></>,
  jkff: <><rect x={12} y={6} width={24} height={36} rx={2} /><T x={17} y={13} s={7}>J</T><T x={17} y={35} s={7}>K</T><T x={31} y={13} s={7}>Q</T><L d={`${saatUcgeni(12, 24)} M4 13 H12 M4 35 H12 M4 24 H12 M36 13 H44`} /></>,
  tff: <><rect x={12} y={8} width={24} height={32} rx={2} /><T x={17} y={15} s={7}>T</T><T x={31} y={15} s={7}>Q</T><L d={`${saatUcgeni(12, 32)} M4 15 H12 M36 15 H44 M4 32 H12`} /></>,
  "sr-latch": <><rect x={12} y={8} width={24} height={32} rx={2} /><T x={17} y={15} s={7}>S</T><T x={17} y={33} s={7}>R</T><T x={31} y={15} s={7}>Q</T><L d="M4 15 H12 M4 33 H12 M36 15 H44" /></>,
  "d-latch": <><rect x={12} y={8} width={24} height={32} rx={2} /><T x={17} y={15} s={7}>D</T><T x={17} y={33} s={7}>E</T><T x={31} y={15} s={7}>Q</T><L d="M4 15 H12 M4 33 H12 M36 15 H44" /></>,
  register: <><rect x={10} y={6} width={28} height={10} rx={1} /><rect x={10} y={19} width={28} height={10} rx={1} /><rect x={10} y={32} width={28} height={10} rx={1} /><L d={`${saatUcgeni(10, 37)} M4 11 H10 M38 11 H44`} /></>,
  "shift-register": <><rect x={4} y={14} width={10} height={14} /><rect x={14} y={14} width={10} height={14} /><rect x={24} y={14} width={10} height={14} /><rect x={34} y={14} width={10} height={14} /><L d="M8 36 H40 M36 33 L40 36 L36 39" /></>,
  sayici: <><rect x={10} y={8} width={28} height={32} rx={2} /><T x={24} y={20} s={10}>+1</T><L d={`${saatUcgeni(10, 33)} M4 33 H10`} /></>,
  fsm: <><C x={10} y={30} r={7} /><C x={38} y={30} r={7} /><L d="M17 30 H30 M26 26 L30 30 L26 34 M33 24 Q38 8 43 24 M40 22 L43 24 L44 20" /></>,

  // FPGA içi
  lut: <><rect x={8} y={6} width={32} height={36} rx={2} /><T x={24} y={13} s={7}>LUT</T><L d="M8 20 H40 M8 27 H40 M8 34 H40 M24 20 V42" /></>,
  clb: <><rect x={4} y={4} width={40} height={40} rx={3} /><rect x={9} y={10} width={13} height={13} /><rect x={26} y={10} width={13} height={13} /><rect x={9} y={27} width={13} height={11} /><rect x={26} y={27} width={13} height={11} /></>,
  dsp: <><rect x={6} y={8} width={36} height={32} rx={3} /><T x={17} y={24} s={13}>×</T><T x={31} y={24} s={13}>+</T></>,
  bram: <><rect x={8} y={6} width={32} height={36} rx={2} /><L d="M8 15 H40 M8 24 H40 M8 33 H40 M16 6 V42 M24 6 V42 M32 6 V42" /></>,
  iob: <><rect x={28} y={14} width={16} height={20} rx={2} /><L d="M4 19 H24 M20 15 L24 19 L20 23 M24 29 H4 M8 25 L4 29 L8 33" /></>,
  pll: <><rect x={6} y={8} width={36} height={32} rx={3} /><L d="M10 30 Q14 16 18 30 T26 30 T34 30 T42 30" /><T x={24} y={15} s={7}>PLL</T></>,
  fpga: <><rect x={11} y={11} width={26} height={26} rx={2} /><L d="M16 11 V5 M24 11 V5 M32 11 V5 M16 37 V43 M24 37 V43 M32 37 V43 M11 16 H5 M11 24 H5 M11 32 H5 M37 16 H43 M37 24 H43 M37 32 H43" /><T x={24} y={24} s={6}>FPGA</T></>,
  bitstream: <><T x={24} y={15} s={10}>1011</T><T x={24} y={33} s={10}>0110</T><L d="M6 24 H42" /></>,

  // Sinyaller
  saat: <><L d="M4 32 H9 V16 H17 V32 H25 V16 H33 V32 H41 V16 H44" /><L d="M6 40 H42" /></>,
  "yukselen-kenar": <><L d="M4 34 H22 V14 H44" /><L d="M17 25 L22 19 L27 25" /></>,
  "dusen-kenar": <><L d="M4 14 H22 V34 H44" /><L d="M17 23 L22 29 L27 23" /></>,
  ucgen: <L d="M4 32 L11 16 L18 32 L25 16 L32 32 L39 16 L44 26" />,
  kare: <L d="M4 30 H10 V16 H22 V30 H34 V16 H44" />,

  // VHDL sözcükleri
  entity: kelime("entity"),
  architecture: kelime("archi", "tecture"),
  process: kelime("process"),
  signal: kelime("signal"),
  "std-logic": kelime("std_", "logic"),
  "rising-edge": kelime("rising_", "edge"),
  "port-map": kelime("port", "map"),
  generic: kelime("generic"),
  "when-else": kelime("when", "else"),
  case: kelime("case"),

  // Araçlar
  osiloskop: <><rect x={4} y={8} width={40} height={30} rx={3} /><rect x={8} y={12} width={24} height={22} /><L d="M9 23 Q13 13 17 23 T25 23 T31 23" /><C x={38} y={16} r={2} /><C x={38} y={26} r={2} /></>,
  "lojik-analizor": <><rect x={4} y={8} width={40} height={32} rx={3} /><L d="M8 16 H14 V12 H22 V16 H40 M8 26 H18 V22 H30 V26 H40 M8 36 H12 V32 H34 V36 H40" /></>,
  breadboard: <><rect x={4} y={10} width={40} height={28} rx={3} /><L d="M4 24 H44" />{[10, 17, 24, 31, 38].flatMap((x) => [15, 19, 29, 33].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.2} fill="currentColor" stroke="none" />))}</>,
  led: <><L d="M10 14 L26 24 L10 34 Z M26 14 V34 M4 24 H10 M26 24 H34 M30 12 L37 5 M33 5 H37 V9 M35 17 L42 10 M38 10 H42 V14" /></>,
  "yedi-segment": <><rect x={8} y={4} width={32} height={40} rx={3} /><L d="M17 10 H31 M33 12 V22 M33 26 V36 M17 38 H31 M15 26 V36 M15 12 V22 M17 24 H31" /></>,
  anahtar: <><C x={10} y={30} r={3} /><C x={38} y={30} r={3} /><L d="M4 30 H7 M41 30 H44 M12 28 L34 16" /></>,
};

interface Props {
  id: string | null;
  bg?: string | null;
  size?: number;
  title?: string;
}

export function Avatar({ id, bg, size = 32, title }: Props) {
  const cizim = id ? CIZIMLER[id] : undefined;
  const ad = title ?? (id ? AVATARLAR.find((a) => a.id === id)?.ad : undefined) ?? "Avatar";
  return (
    <svg
      className="avatar"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-label={ad}
      style={bg ? { background: bg, color: "#1f1f1f" } : undefined}
    >
      <title>{ad}</title>
      <g fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        {cizim ?? <T x={24} y={25} s={22}>?</T>}
      </g>
    </svg>
  );
}

export const avatarVar = (id: string) => id in CIZIMLER;
