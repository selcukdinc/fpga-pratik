// Soru metni gibi alanlar için araç çubuklu metin kutusu. Seçili metni kalın,
// satır içi kod, kod bloğu ya da madde listesi yapar; aynı düğme geri alır.
// Metin, Markdown bileşeninin okuduğu küçük biçimde saklanır.

import { useRef, type KeyboardEvent } from "react";

type Bicim = "kalin" | "kod" | "blok" | "liste";

interface Duzenleme {
  metin: string;
  bas: number;
  son: number;
}

// Seçimi iki işaret arasına alır; zaten sarılıysa işaretleri kaldırır
function sar(m: string, bas: number, son: number, isaret: string, bos: string): Duzenleme {
  const n = isaret.length;
  if (m.slice(bas - n, bas) === isaret && m.slice(son, son + n) === isaret) {
    return { metin: m.slice(0, bas - n) + m.slice(bas, son) + m.slice(son + n), bas: bas - n, son: son - n };
  }
  const secili = m.slice(bas, son) || bos;
  return { metin: m.slice(0, bas) + isaret + secili + isaret + m.slice(son), bas: bas + n, son: bas + n + secili.length };
}

// Seçimin kapsadığı tam satırları döndürür
function satirlar(m: string, bas: number, son: number): [number, number] {
  const ilk = m.lastIndexOf("\n", bas - 1) + 1;
  const sonSatir = m.indexOf("\n", son > bas && m[son - 1] === "\n" ? son - 1 : son);
  return [ilk, sonSatir < 0 ? m.length : sonSatir];
}

export function bicimle(m: string, bas: number, son: number, b: Bicim): Duzenleme {
  if (b === "kalin") return sar(m, bas, son, "**", "kalın metin");
  if (b === "kod") return sar(m, bas, son, "`", "kod");
  const [ilk, bit] = satirlar(m, bas, son);
  const parca = m.slice(ilk, bit);
  if (b === "liste") {
    const hepsi = parca.split("\n").every((l) => l.startsWith("- "));
    const yeni = parca.split("\n").map((l) => (hepsi ? l.slice(2) : l.startsWith("- ") ? l : `- ${l}`)).join("\n");
    return { metin: m.slice(0, ilk) + yeni + m.slice(bit), bas: ilk, son: ilk + yeni.length };
  }
  // Kod bloğu: seçili satırlar ``` arasına alınır, blok zaten varsa çıkarılır
  const once = m.slice(0, ilk);
  const sonra = m.slice(bit);
  if (once.endsWith("```\n") && sonra.startsWith("\n```")) {
    const yeniOnce = once.slice(0, -4);
    return { metin: yeniOnce + parca + sonra.slice(4), bas: yeniOnce.length, son: yeniOnce.length + parca.length };
  }
  const icerik = parca || "-- VHDL kodu";
  const basa = once && !once.endsWith("\n\n") ? (once.endsWith("\n") ? "\n" : "\n\n") : "";
  const yeni = `${basa}\`\`\`\n${icerik}\n\`\`\``;
  return { metin: once + yeni + sonra, bas: once.length + basa.length + 4, son: once.length + basa.length + 4 + icerik.length };
}

const DUGMELER: { b: Bicim; ad: string; isaret: string; kisayol?: string }[] = [
  { b: "kalin", ad: "Kalın", isaret: "B", kisayol: "Ctrl+B" },
  { b: "kod", ad: "Satır içi kod", isaret: "</>", kisayol: "Ctrl+E" },
  { b: "blok", ad: "Kod bloğu", isaret: "{ }" },
  { b: "liste", ad: "Madde listesi", isaret: "•" },
];

interface Props {
  id: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  maxLength?: number;
  mono?: boolean;
}

export function MetinAlani({ id, value, onChange, rows = 6, maxLength, mono }: Props) {
  const kutu = useRef<HTMLTextAreaElement>(null);

  const uygula = (b: Bicim) => {
    const t = kutu.current;
    if (!t) return;
    const d = bicimle(value, t.selectionStart, t.selectionEnd, b);
    onChange(d.metin);
    // Değer güncellendikten sonra seçimi geri koy
    requestAnimationFrame(() => {
      t.focus();
      t.setSelectionRange(d.bas, d.son);
    });
  };

  const tus = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const b = e.key === "b" ? "kalin" : e.key === "e" ? "kod" : null;
    if (b) {
      e.preventDefault();
      uygula(b);
    }
  };

  return (
    <div className="metin-alani">
      <div className="metin-arac" role="toolbar" aria-label="Biçim" aria-controls={id}>
        {DUGMELER.map((d) => (
          <button key={d.b} type="button" className={`arac-${d.b}`} onMouseDown={(e) => e.preventDefault()} onClick={() => uygula(d.b)}
            title={d.kisayol ? `${d.ad} (${d.kisayol})` : d.ad} aria-label={d.ad}>
            {d.isaret}
          </button>
        ))}
        <span className="hint metin-ipucu">Metni seçip bir düğmeye bas.</span>
      </div>
      <textarea id={id} ref={kutu} rows={rows} maxLength={maxLength} className={mono ? "mono" : undefined} value={value}
        onChange={(e) => onChange(e.target.value)} onKeyDown={tus} />
    </div>
  );
}
