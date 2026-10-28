import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from "@codemirror/view";
import { EditorState, Prec, StateEffect, StateField, RangeSet } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { StreamLanguage, getIndentUnit, indentOnInput, indentService, indentUnit, syntaxHighlighting, bracketMatching } from "@codemirror/language";
import { classHighlighter } from "@lezer/highlight";
import { vhdl } from "@codemirror/legacy-modes/mode/vhdl";
import { Decoration, type DecorationSet } from "@codemirror/view";
import { vhdlGirinti } from "../lib/vhdlGirinti";

export interface EditorMark {
  line: number;
  severity: "error" | "warning";
}

const setMarks = StateEffect.define<EditorMark[]>();

// Hatalı satırları Vivado'daki gibi kırmızı/turuncu zeminle gösterir
const marksField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    deco = deco.map(tr.changes);
    for (const e of tr.effects) {
      if (!e.is(setMarks)) continue;
      const ranges = e.value
        .filter((m) => m.line >= 1 && m.line <= tr.state.doc.lines)
        .sort((a, b) => a.line - b.line)
        .map((m) => Decoration.line({ class: `cm-mark-${m.severity}` }).range(tr.state.doc.line(m.line).from));
      deco = RangeSet.of(ranges, true);
    }
    return deco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// Enter'dan sonraki girinti src/lib/vhdlGirinti.ts'teki kurallarla; hazır
// kipin kuralı "wait for"u döngü sanıyordu. end, else, elsif, when, begin ve ")"
// satırın başına yazılınca satır kendiliğinden geri gelir.
const girinti = [
  Prec.highest(
    indentService.of((ctx, pos) => {
      // ctx.lineAt Enter'ın böldüğü satırı iki ayrı satır gibi gösterir
      const satir = ctx.lineAt(pos);
      const onceki: string[] = [];
      for (let p = satir.from; p > 0 && onceki.length < 50; ) {
        const ust = ctx.lineAt(p - 1, -1);
        onceki.unshift(ust.text);
        p = ust.from;
      }
      return vhdlGirinti(onceki, satir.text.slice(pos - satir.from), getIndentUnit(ctx.state), ctx.state.tabSize);
    }),
  ),
  EditorState.languageData.of(() => [{ indentOnInput: /^\s*(end|end\s+(case|if|loop|process|generate|block|record|component)|else|elsif|when|begin|\))$/i }]),
  indentOnInput(),
];

interface Props {
  value: string;
  onChange: (text: string) => void;
  marks?: EditorMark[];
  // Değiştiğinde imleci bu satıra taşır (Messages panelinden tıklama)
  gotoLine?: { line: number; nonce: number };
  readOnly?: boolean;
}

export function VhdlEditor({ value, onChange, marks = [], gotoLine, readOnly = false }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    view.current = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          history(),
          drawSelection(),
          highlightActiveLine(),
          bracketMatching(),
          indentUnit.of("  "),
          StreamLanguage.define(vhdl),
          girinti,
          // Renkler styles.css'teki --cm-* değişkenlerinden gelir, böylece temaya uyar
          syntaxHighlighting(classHighlighter),
          keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
          marksField,
          EditorState.readOnly.of(readOnly),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) onChangeRef.current(u.state.doc.toString());
          }),
        ],
      }),
    });
    return () => view.current?.destroy();
    // Editör bir kez kurulur; dışarıdan gelen değer aşağıda eşitlenir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly]);

  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  useEffect(() => {
    view.current?.dispatch({ effects: setMarks.of(marks) });
  }, [marks]);

  useEffect(() => {
    const v = view.current;
    if (!v || !gotoLine || gotoLine.line < 1 || gotoLine.line > v.state.doc.lines) return;
    const pos = v.state.doc.line(gotoLine.line).from;
    v.dispatch({ selection: { anchor: pos }, effects: EditorView.scrollIntoView(pos, { y: "center" }) });
    v.focus();
  }, [gotoLine]);

  return <div className="vhdl-editor" ref={host} />;
}
