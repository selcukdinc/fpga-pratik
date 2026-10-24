// Basit bir VCD okuyucu: dalga ekranına sinyal başına değişim listesi verir

export interface VcdSignal {
  id: string;
  name: string;
  scope: string;
  width: number;
  // [zaman (fs), değer]; çok bitli sinyallerde değer MSB önce bit dizisidir
  changes: [number, string][];
}

export interface Vcd {
  timescaleFs: number;
  endTime: number;
  signals: VcdSignal[];
}

const UNIT_FS: Record<string, number> = { s: 1e15, ms: 1e12, us: 1e9, ns: 1e6, ps: 1e3, fs: 1 };

export function parseVcd(text: string): Vcd {
  const tokens = text.split(/\s+/).filter(Boolean);
  const byId = new Map<string, VcdSignal[]>();
  const signals: VcdSignal[] = [];
  const scope: string[] = [];
  let timescaleFs = 1;
  let time = 0;
  let i = 0;

  const skipToEnd = () => {
    while (i < tokens.length && tokens[i] !== "$end") i++;
    i++;
  };

  const record = (id: string, value: string) => {
    for (const s of byId.get(id) ?? []) {
      const last = s.changes[s.changes.length - 1];
      if (last && last[0] === time) last[1] = value;
      else if (!last || last[1] !== value) s.changes.push([time, value]);
    }
  };

  while (i < tokens.length) {
    const t = tokens[i];
    if (t === "$timescale") {
      const m = /^(\d+)?([a-z]+)$/.exec(tokens[i + 1] + (/^\d+$/.test(tokens[i + 1]) ? tokens[i + 2] : ""));
      if (m) timescaleFs = Number(m[1] ?? 1) * (UNIT_FS[m[2]] ?? 1);
      skipToEnd();
    } else if (t === "$scope") {
      scope.push(tokens[i + 2]);
      skipToEnd();
    } else if (t === "$upscope") {
      scope.pop();
      skipToEnd();
    } else if (t === "$var") {
      // $var <tip> <genişlik> <id> <ad> [aralık] $end
      const width = Number(tokens[i + 2]);
      const id = tokens[i + 3];
      const name = tokens[i + 4];
      const sig: VcdSignal = { id, name, scope: scope.join("."), width, changes: [] };
      signals.push(sig);
      byId.set(id, [...(byId.get(id) ?? []), sig]);
      skipToEnd();
    } else if (t.startsWith("$")) {
      // $dumpvars gibi bölümlerin içindeki değerler de okunmalı
      if (t === "$dumpvars" || t === "$dumpall" || t === "$dumpon" || t === "$dumpoff" || t === "$end") i++;
      else skipToEnd();
    } else if (t[0] === "#") {
      time = Number(t.slice(1)) * timescaleFs;
      i++;
    } else if (t[0] === "b" || t[0] === "B" || t[0] === "r" || t[0] === "R") {
      record(tokens[i + 1], t.slice(1).toLowerCase());
      i += 2;
    } else {
      record(t.slice(1), t[0].toLowerCase());
      i++;
    }
  }

  for (const s of signals) {
    if (s.width > 1) {
      // VCD baştaki sıfırları kırpabilir
      s.changes = s.changes.map(([tm, v]) => [tm, v.length < s.width ? v.padStart(s.width, v[0] === "1" ? "0" : v[0]) : v]);
    }
  }
  return { timescaleFs, endTime: time, signals };
}

export function bitsToNumber(bits: string, signed = false): number | null {
  if (!/^[01]+$/.test(bits)) return null;
  let n = parseInt(bits, 2);
  if (signed && bits[0] === "1") n -= 2 ** bits.length;
  return n;
}
