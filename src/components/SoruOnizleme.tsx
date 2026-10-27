// Yazılmakta olan bir sorunun sitede nasıl görüneceği: panelde ve soru öner sayfasında.

import type { ReactNode } from "react";
import { Markdown, inline } from "./Markdown";
import { boslukEtiketi, bosluklariAyir } from "../lib/bosluk";

interface Props {
  type: "tf" | "mcq" | "fill" | "code";
  prompt: string;
  choices: string[];
  dogruSik?: number;
  bosluk: number;
  explanation: string;
  aciklamaBasligi?: string;
  ust?: ReactNode;
}

export function SoruOnizleme({ type, prompt, choices, dogruSik, bosluk, explanation, aciklamaBasligi, ust }: Props) {
  const ayrik = type === "fill" ? bosluklariAyir(prompt, bosluk) : null;
  return (
    <article className="question">
      <header>
        <span className="q-num">Soru</span>
        {ust}
      </header>
      <Markdown text={(ayrik ? ayrik.metin : prompt) || "Soru metni burada görünür."} />
      {type === "tf" && <div className="choices"><label>○ Doğru</label><label>○ Yanlış</label></div>}
      {type === "mcq" && (
        <div className="choices">
          {choices.map((c, i) => (
            <label key={i} className={dogruSik === i ? "dogru-sik" : undefined}>
              <span className="choice-letter">{String.fromCharCode(65 + i)})</span> <span>{inline(c)}</span>
            </label>
          ))}
        </div>
      )}
      {type === "fill" && (
        <div className="choices">
          {Array.from({ length: bosluk }, (_, i) => (
            <label key={i} className="bosluk">
              <span className="bosluk-etiket">
                {boslukEtiketi(i, bosluk)}
                {ayrik?.adlar[i] && <>: {inline(ayrik.adlar[i]!)}</>}
              </span>
              <input className="mono" disabled />
            </label>
          ))}
        </div>
      )}
      {explanation && (
        <footer>
          {aciklamaBasligi && <strong>{aciklamaBasligi}</strong>}
          <Markdown text={explanation} />
        </footer>
      )}
    </article>
  );
}
