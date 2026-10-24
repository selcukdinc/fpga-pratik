import { Fragment, type ReactNode } from "react";

// Soru metinleri için çok küçük bir alt küme: ``` kod blokları, `satır içi kod`, **kalın**
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Markdown({ text }: { text: string }) {
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
            .map((p, j) => <p key={`${i}-${j}`}>{inline(p.trim())}</p>)
        ),
      )}
    </div>
  );
}
