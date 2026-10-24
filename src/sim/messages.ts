// NVC çıktısını Vivado'daki Messages paneli için yapılandırılmış kayıtlara çevirir

export type Severity = "error" | "warning" | "note" | "failure" | "fatal";

export interface SimMessage {
  severity: Severity;
  text: string;
  file?: string;
  line?: number;
  // Hata yerini gösteren kaynak alıntısı ve işaretçi satırları
  detail: string[];
}

// Renk kodları ve OSC 8 bağlantıları
const ANSI = /\x1b\[[0-9;]*m|\x1b\]8;;[^\x07]*\x07/g;

const HEADER = /^\*\* (Error|Warning|Note|Failure|Fatal):\s?(.*)$/;
const LOCATION = /^\s*>\s+(\S+?):(\d+)\s*$/;
const AT_LOCATION = /\bat (\S+?):(\d+)\s*$/;

export function stripAnsi(s: string): string {
  return s.replace(ANSI, "");
}

export function parseMessages(lines: string[]): SimMessage[] {
  const out: SimMessage[] = [];
  let cur: SimMessage | null = null;

  for (const raw of lines.flatMap((l) => stripAnsi(l).split("\n"))) {
    const h = HEADER.exec(raw);
    if (h) {
      cur = { severity: h[1].toLowerCase() as Severity, text: h[2], detail: [] };
      out.push(cur);
      continue;
    }
    if (!cur || raw.trim() === "") continue;

    const loc = LOCATION.exec(raw);
    if (loc && cur.file === undefined) {
      cur.file = loc[1];
      cur.line = Number(loc[2]);
      continue;
    }
    // Uzun mesajlar bir sonraki satıra girintili devam eder
    if (/^ {10}\S/.test(raw) && cur.detail.length === 0) {
      cur.text = cur.text.trimEnd() + " " + raw.trim();
      continue;
    }
    // report/assert mesajlarının konumu "Process :tb:_p1 at tb.vhd:22" biçiminde gelir
    const at = AT_LOCATION.exec(raw);
    if (at && cur.file === undefined && /^\s*Process\b/.test(raw)) {
      cur.file = at[1];
      cur.line = Number(at[2]);
    }
    cur.detail.push(raw);
  }
  return out;
}
