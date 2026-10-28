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

// NVC kaynağı Latin-1 okur ve kaynak alıntılarını UTF-8'e çevirerek basar; UTF-8
// yazılmış "ç" böylece "Ã§" olur. Böyle görünen her dizi baytlarına geri
// çevrilip UTF-8 olarak yeniden okunur. Geçerli UTF-8 çıkmayan dizi aynen kalır.
// "ş", "ğ" gibi harflerin ikinci baytı (0x80-0x9F) NVC çıktısında hiç yer
// almadığı için onlar bu yolla kurtarılamaz; kaynak alıntıları bu yüzden
// parseMessages'ta dosyanın kendisinden yeniden okunur.
const CIFT_KODLAMA = /[\u00C2-\u00F4][\u0080-\u00BF]+/g;
const utf8 = new TextDecoder("utf-8", { fatal: true });

export function cifteKodlamayiCoz(s: string): string {
  return s.replace(CIFT_KODLAMA, (dizi) => {
    try {
      return utf8.decode(Uint8Array.from(dizi, (c) => c.charCodeAt(0)));
    } catch {
      return dizi;
    }
  });
}

// Kaynak alıntısı satırı: " 8 |     r := r + 1;"
const ALINTI = /^(\s*(\d+) \| )(.*)$/;

// kaynaklar verilirse (dosya adı -> metin) alıntılanan satırlar NVC'nin
// bastığı yerine dosyanın kendisinden alınır; Türkçe karakterler bozulmaz.
export function parseMessages(lines: string[], kaynaklar: Record<string, string> = {}): SimMessage[] {
  const satirlar: Record<string, string[]> = {};
  for (const [ad, metin] of Object.entries(kaynaklar)) satirlar[ad] = metin.split(/\r?\n/);
  const out: SimMessage[] = [];
  let cur: SimMessage | null = null;

  for (const raw of lines.flatMap((l) => cifteKodlamayiCoz(stripAnsi(l)).split("\n"))) {
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
    const a = cur.file ? ALINTI.exec(raw) : null;
    const asil = a ? satirlar[cur.file!]?.[Number(a[2]) - 1] : undefined;
    cur.detail.push(asil !== undefined ? a![1] + asil : raw);
  }
  return out;
}
