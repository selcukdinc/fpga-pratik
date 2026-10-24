import { useEffect, useRef } from "react";
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from "@codemirror/view";
import { EditorState, StateEffect, StateField, RangeSet } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { StreamLanguage, indentUnit, syntaxHighlighting, defaultHighlightStyle, bracketMatching } from "@codemirror/language";
import { vhdl } from "@codemirror/legacy-modes/mode/vhdl";
import { Decoration, type DecorationSet } from "@codemirror/view";

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
          syntaxHighlighting(defaultHighlightStyle),
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
