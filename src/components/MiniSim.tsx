// Ders sayfalarındaki küçük benzetim: tek dosyalık tasarım + testbench,
// düzenlenebilir editör, mesajlar ve dalga ekranı. Her şey tarayıcıda çalışır.

import { useMemo, useState } from "react";
import { VhdlEditor, type EditorMark } from "./VhdlEditor";
import { MessagesPanel } from "./MessagesPanel";
import { WaveformView } from "./WaveformView";
import { simulate } from "../sim/simulator";
import type { SimMessage } from "../sim/messages";
import type { Vcd } from "../sim/vcd";
import type { MiniSim as Veri } from "../dersler/tipler";

const DOSYA = "ders.vhd";

export function MiniSim({ sim }: { sim: Veri }) {
  const [kod, setKod] = useState(sim.kod);
  const [calisiyor, setCalisiyor] = useState(false);
  const [mesajlar, setMesajlar] = useState<SimMessage[] | null>(null);
  const [vcd, setVcd] = useState<Vcd | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [gotoLine, setGotoLine] = useState<{ line: number; nonce: number }>();

  const isaretler = useMemo<EditorMark[]>(
    () =>
      (mesajlar ?? [])
        .filter((m) => m.file === DOSYA && m.line && m.severity !== "note")
        .map((m) => ({ line: m.line!, severity: m.severity === "warning" ? "warning" : "error" })),
    [mesajlar],
  );

  const calistir = async () => {
    setCalisiyor(true);
    setHata(null);
    const r = await simulate([{ name: DOSYA, text: kod }], { top: sim.top, stopTime: sim.sure });
    setCalisiyor(false);
    setMesajlar(r.messages);
    setVcd(r.vcd);
    if (!r.ok) setHata(r.timedOut ? "Benzetim zaman sınırını aştı." : "Derleme ya da benzetim hatası; ayrıntılar mesajlarda.");
  };

  const sifirla = () => {
    setKod(sim.kod);
    setMesajlar(null);
    setVcd(null);
    setHata(null);
  };

  return (
    <div className="mini-sim">
      <div className="kod-editor mini-editor">
        <VhdlEditor value={kod} onChange={setKod} marks={isaretler} gotoLine={gotoLine} />
      </div>
      <div className="kod-dugmeler">
        <button className="primary" onClick={calistir} disabled={calisiyor}>{calisiyor ? "Çalışıyor…" : "▶ Çalıştır"}</button>
        <button onClick={sifirla} disabled={calisiyor || kod === sim.kod}>Örneğe dön</button>
        <span className="hint">{sim.sure} benzetim · tarayıcında çalışır</span>
      </div>
      {sim.gorev && <p className="mini-gorev"><strong>Dene:</strong> {sim.gorev}</p>}
      {hata && <p className="bad" role="alert">{hata}</p>}
      {mesajlar && mesajlar.length > 0 && (
        <div className="kod-mesajlar">
          <MessagesPanel messages={mesajlar} onSelect={(m) => m.line && setGotoLine({ line: m.line, nonce: Date.now() })} />
        </div>
      )}
      {vcd && vcd.signals.length > 0 && (
        <div className="kod-dalga">
          <WaveformView vcd={vcd} />
        </div>
      )}
    </div>
  );
}
