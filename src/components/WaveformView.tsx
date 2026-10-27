import { useEffect, useMemo, useRef, useState } from "react";
import { bitsToNumber, type Vcd, type VcdSignal } from "../sim/vcd";

type Radix = "bin" | "hex" | "unsigned" | "signed";

interface Props {
  vcd: Vcd;
}

const ROW_H = 26;
const ANALOG_H = 120;
const RULER_H = 24;
const FS_PER_NS = 1e6;

const COLORS = {
  bg: "#000",
  grid: "#1c1c1c",
  ruler: "#9a9a9a",
  wave: "#40f040",
  unknown: "#ff4040",
  highZ: "#e0c040",
  cursor: "#ffd200",
};

function valueAt(sig: VcdSignal, t: number): string {
  let lo = 0;
  let hi = sig.changes.length - 1;
  let found = "x";
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (sig.changes[mid][0] <= t) {
      found = sig.changes[mid][1];
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
}

function format(bits: string, radix: Radix): string {
  if (bits.length === 1) return bits;
  if (!/^[01]+$/.test(bits)) return /z/.test(bits) ? "Z" : "X";
  switch (radix) {
    case "bin":
      return bits;
    case "unsigned":
      return String(bitsToNumber(bits));
    case "signed":
      return String(bitsToNumber(bits, true));
    default:
      return BigInt("0b" + bits).toString(16).toUpperCase().padStart(Math.ceil(bits.length / 4), "0");
  }
}

function niceStep(rawNs: number): number {
  const p = 10 ** Math.floor(Math.log10(rawNs));
  for (const m of [1, 2, 5, 10]) if (m * p >= rawNs) return m * p;
  return 10 * p;
}

function nsLabel(ns: number): string {
  if (ns >= 1000) return `${+(ns / 1000).toFixed(3)} us`;
  return `${+ns.toFixed(3)} ns`;
}

export function WaveformView({ vcd }: Props) {
  // Varsayılan olarak testbench'in en üst kapsamındaki sinyaller gösterilir
  const signals = useMemo(() => {
    const top = vcd.signals[0]?.scope;
    return vcd.signals.filter((s) => s.scope === top);
  }, [vcd]);

  const endNs = Math.max(vcd.endTime / FS_PER_NS, 1);
  const [view, setView] = useState({ start: 0, span: endNs });
  const [cursorNs, setCursorNs] = useState(0);
  const [radix, setRadix] = useState<Record<string, Radix>>({});
  const [analog, setAnalog] = useState<Record<string, boolean>>({});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => setView({ start: 0, span: endNs }), [endNs]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rowHeight = (s: VcdSignal) => (analog[s.id + s.name] ? ANALOG_H : ROW_H);
  const totalH = RULER_H + signals.reduce((h, s) => h + rowHeight(s), 0) + 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = totalH * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${totalH}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, totalH);

    const xOf = (ns: number) => ((ns - view.start) / view.span) * width;
    const step = niceStep(view.span / Math.max(width / 90, 1));

    // Cetvel ve ızgara
    ctx.font = "11px ui-monospace, Menlo, monospace";
    ctx.textBaseline = "middle";
    for (let t = Math.ceil(view.start / step) * step; t <= view.start + view.span; t += step) {
      const x = Math.round(xOf(t)) + 0.5;
      ctx.strokeStyle = COLORS.grid;
      ctx.beginPath();
      ctx.moveTo(x, RULER_H);
      ctx.lineTo(x, totalH);
      ctx.stroke();
      ctx.strokeStyle = COLORS.ruler;
      ctx.beginPath();
      ctx.moveTo(x, RULER_H - 6);
      ctx.lineTo(x, RULER_H);
      ctx.stroke();
      ctx.fillStyle = COLORS.ruler;
      ctx.fillText(nsLabel(t), x + 3, RULER_H / 2);
    }

    let top = RULER_H;
    for (const sig of signals) {
      const h = rowHeight(sig);
      const key = sig.id + sig.name;
      const y0 = top + 5;
      const y1 = top + h - 5;
      const points = sig.changes.map(([t, v]) => [t / FS_PER_NS, v] as const);
      const segs: { a: number; b: number; v: string }[] = [];
      for (let i = 0; i < points.length; i++) {
        const a = points[i][0];
        const b = i + 1 < points.length ? points[i + 1][0] : endNs;
        if (b < view.start || a > view.start + view.span) continue;
        segs.push({ a, b, v: points[i][1] });
      }

      ctx.lineWidth = 1.5;
      if (sig.width === 1) {
        let prevY: number | null = null;
        for (const s of segs) {
          const xa = Math.max(xOf(s.a), 0);
          const xb = Math.min(xOf(s.b), width);
          const y = s.v === "1" ? y0 : s.v === "0" ? y1 : (y0 + y1) / 2;
          ctx.strokeStyle = s.v === "0" || s.v === "1" ? COLORS.wave : s.v === "z" ? COLORS.highZ : COLORS.unknown;
          ctx.beginPath();
          if (prevY !== null) ctx.moveTo(xa, prevY);
          else ctx.moveTo(xa, y);
          ctx.lineTo(xa, y);
          ctx.lineTo(xb, y);
          ctx.stroke();
          prevY = y;
        }
      } else if (analog[key]) {
        const max = 2 ** sig.width - 1;
        const isSigned = radix[key] === "signed";
        const lo = isSigned ? -(2 ** (sig.width - 1)) : 0;
        const hi = isSigned ? 2 ** (sig.width - 1) - 1 : max;
        ctx.strokeStyle = COLORS.wave;
        ctx.beginPath();
        let first = true;
        for (const s of segs) {
          const n = bitsToNumber(s.v, isSigned);
          if (n === null) continue;
          const y = y1 - ((n - lo) / (hi - lo || 1)) * (y1 - y0);
          const x = Math.max(xOf(s.a), 0);
          if (first) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          first = false;
        }
        ctx.stroke();
        ctx.fillStyle = COLORS.ruler;
        ctx.fillText(String(hi), 4, y0 + 4);
        ctx.fillText(String(lo), 4, y1 - 4);
      } else {
        const mid = (y0 + y1) / 2;
        for (const s of segs) {
          const xa = Math.max(xOf(s.a), 0);
          const xb = Math.min(xOf(s.b), width);
          const known = /^[01]+$/.test(s.v);
          ctx.strokeStyle = known ? COLORS.wave : COLORS.unknown;
          const k = Math.min(3, (xb - xa) / 2);
          ctx.beginPath();
          ctx.moveTo(xa, mid);
          ctx.lineTo(xa + k, y0);
          ctx.lineTo(xb - k, y0);
          ctx.lineTo(xb, mid);
          ctx.lineTo(xb - k, y1);
          ctx.lineTo(xa + k, y1);
          ctx.closePath();
          ctx.stroke();
          const label = format(s.v, radix[key] ?? "hex");
          if (ctx.measureText(label).width + 8 < xb - xa) {
            ctx.fillStyle = "#fff";
            ctx.fillText(label, xa + 5, mid);
          }
        }
      }
      top += h;
    }

    const cx = Math.round(xOf(cursorNs)) + 0.5;
    if (cx >= 0 && cx <= width) {
      ctx.strokeStyle = COLORS.cursor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, totalH);
      ctx.stroke();
    }
  }, [signals, view, width, cursorNs, radix, analog, totalH, endNs]);

  // Sinyallerin değiştiği anlar (ns), imlecin yapışması ve klavyeyle gezinmesi için
  const degisimler = useMemo(() => {
    const t = new Set<number>();
    for (const sig of signals) for (const [fs] of sig.changes) t.add(fs / FS_PER_NS);
    return [...t].sort((a, b) => a - b);
  }, [signals]);

  // Fare konumunu zamana çevirir; 6 pikselden yakın bir değişim varsa ona yapışır
  const zamanOf = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const ns = Math.min(Math.max(view.start + ((clientX - r.left) / r.width) * view.span, 0), endNs);
    const esik = (6 / r.width) * view.span;
    let enYakin: number | null = null;
    for (const d of degisimler) if (Math.abs(d - ns) < esik && (enYakin === null || Math.abs(d - ns) < Math.abs(enYakin - ns))) enYakin = d;
    return enYakin ?? ns;
  };

  const sonrakiDegisim = (yon: 1 | -1) => {
    const d = yon > 0 ? degisimler.find((x) => x > cursorNs + 1e-9) : [...degisimler].reverse().find((x) => x < cursorNs - 1e-9);
    if (d === undefined) return;
    setCursorNs(d);
    // İmleç görünür alanın dışına çıkarsa görünüm kaydırılır
    setView((v) => (d < v.start || d > v.start + v.span ? { ...v, start: Math.min(Math.max(d - v.span / 2, 0), Math.max(endNs - v.span, 0)) } : v));
  };

  const zoom = (factor: number) =>
    setView((v) => {
      const span = Math.min(Math.max(v.span * factor, 1), endNs);
      const start = Math.min(Math.max(cursorNs - span / 2, 0), Math.max(endNs - span, 0));
      return { start, span };
    });

  const cycleRadix = (key: string) =>
    setRadix((r) => {
      const order: Radix[] = ["hex", "unsigned", "signed", "bin"];
      return { ...r, [key]: order[(order.indexOf(r[key] ?? "hex") + 1) % order.length] };
    });

  return (
    <div className="wave">
      <div className="wave-toolbar">
        <button onClick={() => zoom(0.5)} title="Yakınlaştır">＋</button>
        <button onClick={() => zoom(2)} title="Uzaklaştır">－</button>
        <button onClick={() => setView({ start: 0, span: endNs })} title="Tümünü sığdır">⤢</button>
        <span className="wave-time">İmleç: {nsLabel(cursorNs)}</span>
        <span className="wave-time">Sim süresi: {nsLabel(endNs)}</span>
      </div>
      <div className="wave-body">
        <div className="wave-names">
          <div className="wave-names-head" style={{ height: RULER_H }}>
            <span>Ad</span>
            <span>Değer</span>
          </div>
          {signals.map((s) => {
            const key = s.id + s.name;
            return (
              <div key={key} className="wave-name" style={{ height: rowHeight(s) }}>
                <span className="wave-signal" title={`${s.scope}.${s.name}`}>{s.name}</span>
                <span className="wave-value">{format(valueAt(s, cursorNs * FS_PER_NS), radix[key] ?? "hex")}</span>
                {s.width > 1 && (
                  <span className="wave-opts">
                    <button onClick={() => cycleRadix(key)} title="Sayı tabanı">{radix[key] ?? "hex"}</button>
                    <button
                      className={analog[key] ? "on" : ""}
                      onClick={() => setAnalog((a) => ({ ...a, [key]: !a[key] }))}
                      title="Analog gösterim (ör. üçgen dalga)"
                    >
                      ∿
                    </button>
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="wave-canvas" ref={wrapRef}>
          <canvas
            ref={canvasRef}
            tabIndex={0}
            aria-label="Dalga ekranı. İmleci taşımak için tıkla ya da sürükle; ← ve → tuşları bir önceki ya da sonraki değişime atlar."
            onPointerDown={(e) => {
              if (e.button !== 0) return;
              const el = e.currentTarget;
              el.setPointerCapture(e.pointerId);
              el.focus({ preventScroll: true });
              setCursorNs(zamanOf(e.clientX, el));
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) setCursorNs(zamanOf(e.clientX, e.currentTarget));
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                sonrakiDegisim(e.key === "ArrowRight" ? 1 : -1);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
