import { Fragment, type ReactNode } from "react";
import { terimleriAyir } from "../lib/terimler";

// Düz metindeki terimlerin ardına İngilizce karşılıklarını ekler: "VE (AND)"
function terimli(metin: string): ReactNode {
  const parcalar = terimleriAyir(metin);
  if (parcalar.length === 1 && typeof parcalar[0] === "string") return metin;
  return parcalar.map((p, i) =>
    typeof p === "string" ? (
      <Fragment key={i}>{p}</Fragment>
    ) : (
      <Fragment key={i}>
        {p.metin}
        <span className="terim-en" lang="en"> ({p.en})</span>
      </Fragment>
    ),
  );
}

// Soru metinleri için çok küçük bir alt küme: ``` kod blokları, `satır içi kod`, **kalın**
// ve satırları "- " ile başlayan paragraflardan madde listesi. terim: ders ve soru
// metinlerinde terimlerin İngilizcesi gösterilir; kod parçalarına dokunulmaz.
export function inline(text: string, terim = false): ReactNode[] {
  const duz = (s: string) => (terim ? terimli(s) : s);
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{duz(part.slice(2, -2))}</strong>;
    return <Fragment key={i}>{duz(part)}</Fragment>;
  });
}

export function Markdown({ text, terim = false }: { text: string; terim?: boolean }) {
  const blocks = text.replace(/\\n/g, "\n").split(/```(?:vhdl)?\n?([\s\S]*?)```/g);
  return (
    <div className="md">
      {blocks.map((b, i) =>
        i % 2 === 1 ? (
          <pre key={i} className="code">{b.trimEnd()}</pre>
        ) : (
          b
            .split(/\n{2,}/)
            .filter((p) => p.trim())
            .map((p, j) => {
              const satirlar = p.trim().split("\n");
              return satirlar.every((l) => l.startsWith("- ")) ? (
                <ul key={`${i}-${j}`}>
                  {satirlar.map((l, k) => <li key={k}>{inline(l.slice(2), terim)}</li>)}
                </ul>
              ) : (
                <p key={`${i}-${j}`}>{inline(p.trim(), terim)}</p>
              );
            })
        ),
      )}
    </div>
  );
}
