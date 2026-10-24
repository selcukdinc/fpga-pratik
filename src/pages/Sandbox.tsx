import { useEffect, useMemo, useState } from "react";
import { VhdlEditor, type EditorMark } from "../components/VhdlEditor";
import { MessagesPanel } from "../components/MessagesPanel";
import { WaveformView } from "../components/WaveformView";
import { checkSyntax, simulate, type SimFile, type VhdlStd } from "../sim/simulator";
import { triangleExample } from "../sim/examples";
import type { SimMessage } from "../sim/messages";
import type { Vcd } from "../sim/vcd";

const STORAGE_KEY = "fpga-pratik:pratik-alani";

interface Workspace {
  files: SimFile[];
  top: string;
  stopTime: string;
  std: VhdlStd;
}

function loadWorkspace(): Workspace {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Workspace;
  } catch {
    // gizli pencere vb.: örnek projeyle başla
  }
  return { ...triangleExample, std: "1993" };
}

type Tab = "messages" | "log";

interface Props {
  onStatus: (s: string) => void;
}

export function Sandbox({ onStatus }: Props) {
  const [ws, setWs] = useState<Workspace>(loadWorkspace);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState<null | "check" | "sim">(null);
  const [messages, setMessages] = useState<SimMessage[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [vcd, setVcd] = useState<Vcd | null>(null);
  const [tab, setTab] = useState<Tab>("messages");
  const [gotoLine, setGotoLine] = useState<{ line: number; nonce: number }>();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ws));
    } catch {
      // kaydedilemezse oturum boyunca bellekte kalır
    }
  }, [ws]);

  const file = ws.files[Math.min(active, ws.files.length - 1)];

  const marks = useMemo<EditorMark[]>(
    () =>
      messages
        .filter((m) => m.file === file?.name && m.line && m.severity !== "note")
        .map((m) => ({ line: m.line!, severity: m.severity === "warning" ? "warning" : "error" })),
    [messages, file?.name],
  );

  const updateFile = (text: string) =>
    setWs((w) => ({ ...w, files: w.files.map((f, i) => (i === active ? { ...f, text } : f)) }));

  const addFile = () => {
    const name = prompt("Dosya adı (ör. sayac.vhd):")?.trim();
    if (!name) return;
    const fixed = name.endsWith(".vhd") || name.endsWith(".vhdl") ? name : `${name}.vhd`;
    if (ws.files.some((f) => f.name === fixed)) return;
    setWs((w) => ({ ...w, files: [...w.files, { name: fixed, text: "library ieee;\nuse ieee.std_logic_1164.all;\n\n" }] }));
    setActive(ws.files.length);
  };

  const removeFile = (i: number) => {
    if (ws.files.length === 1 || !confirm(`${ws.files[i].name} silinsin mi?`)) return;
    setWs((w) => ({ ...w, files: w.files.filter((_, j) => j !== i) }));
    setActive(0);
  };

  const resetExample = () => {
    if (!confirm("Pratik alanı örnek projeye dönsün mü? Yaptığın değişiklikler silinir.")) return;
    setWs({ ...triangleExample, std: "1993" });
    setActive(0);
  };

  const runCheck = async () => {
    setBusy("check");
    onStatus("Sözdizimi kontrol ediliyor…");
    const r = await checkSyntax(ws.files, ws.std);
    setMessages(r.messages);
    setLog(r.log);
    setTab("messages");
    setBusy(null);
    onStatus(r.ok ? `Sözdizimi temiz (${Math.round(r.ms)} ms)` : `${r.messages.filter((m) => m.severity === "error").length} hata bulundu`);
  };

  const runSim = async () => {
    setBusy("sim");
    onStatus("Simülasyon çalışıyor…");
    const r = await simulate(ws.files, { top: ws.top, stopTime: ws.stopTime, std: ws.std });
    setMessages(r.messages);
    setLog(r.log);
    if (r.vcd) setVcd(r.vcd);
    setTab("messages");
    setBusy(null);
    onStatus(r.vcd ? `Simülasyon tamamlandı (${Math.round(r.ms)} ms)` : "Simülasyon başarısız");
  };

  const selectMessage = (m: SimMessage) => {
    const i = ws.files.findIndex((f) => f.name === m.file);
    if (i < 0 || !m.line) return;
    setActive(i);
    setGotoLine({ line: m.line, nonce: Date.now() });
  };

  return (
    <div className="sandbox">
      <div className="toolbar">
        <button className="primary" onClick={runCheck} disabled={busy !== null}>
          {busy === "check" ? "Kontrol ediliyor…" : "✓ Sözdizimi kontrolü"}
        </button>
        <button className="primary" onClick={runSim} disabled={busy !== null}>
          {busy === "sim" ? "Çalışıyor…" : "▶ Simülasyonu çalıştır"}
        </button>
        <label>
          Top
          <input value={ws.top} onChange={(e) => setWs({ ...ws, top: e.target.value.trim() })} size={16} />
        </label>
        <label>
          Süre
          <input value={ws.stopTime} onChange={(e) => setWs({ ...ws, stopTime: e.target.value.replace(/\s/g, "") })} size={6} />
        </label>
        <label>
          VHDL
          <select value={ws.std} onChange={(e) => setWs({ ...ws, std: e.target.value as VhdlStd })}>
            <option value="1993">93</option>
            <option value="2008">2008</option>
          </select>
        </label>
        <button onClick={resetExample}>Örneğe dön</button>
      </div>

      <section className="panel sources">
        <div className="panel-title">
          Sources <button className="icon" onClick={addFile} title="Dosya ekle">＋</button>
        </div>
        <ul>
          {ws.files.map((f, i) => (
            <li key={f.name} className={i === active ? "active" : ""}>
              <button onClick={() => setActive(i)}>
                <span className="file-badge">V</span>
                {f.name}
              </button>
              {ws.files.length > 1 && (
                <button className="icon" onClick={() => removeFile(i)} title="Sil">×</button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel editor">
        <div className="panel-title">{file?.name}</div>
        {file && <VhdlEditor key={file.name} value={file.text} onChange={updateFile} marks={marks} gotoLine={gotoLine} />}
      </section>

      <section className="panel waves">
        <div className="panel-title">Dalga ekranı</div>
        {vcd ? <WaveformView vcd={vcd} /> : <p className="empty dark">Simülasyonu çalıştırınca sinyaller burada çizilir.</p>}
      </section>

      <section className="panel bottom">
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === "messages"} onClick={() => setTab("messages")}>
            Messages{messages.length > 0 && ` (${messages.length})`}
          </button>
          <button role="tab" aria-selected={tab === "log"} onClick={() => setTab("log")}>Log</button>
        </div>
        <div className="tab-body">
          {tab === "messages" ? (
            <MessagesPanel messages={messages} onSelect={selectMessage} />
          ) : (
            <pre className="log">{log.join("\n").replace(/\x1b\[[0-9;]*m|\x1b\]8;;[^\x07]*\x07/g, "") || "Henüz çalıştırılmadı."}</pre>
          )}
        </div>
      </section>
    </div>
  );
}
