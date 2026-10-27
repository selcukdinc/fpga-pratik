// Kod yazma sorusu: editör, tarayıcıda gizli testbench'le sınama ve
// sunucunun "nerede takıldı" raporu.

import { useEffect, useMemo, useState } from "react";
import { BoyutluEditor } from "./BoyutluEditor";
import { VhdlEditor, type EditorMark } from "./VhdlEditor";
import { MessagesPanel } from "./MessagesPanel";
import { WaveformView } from "./WaveformView";
import { Markdown } from "./Markdown";
import { Paylasimlar } from "./Paylasimlar";
import { api } from "../lib/api";
import { checkSyntax, simulate } from "../sim/simulator";
import type { SimMessage } from "../sim/messages";
import type { Vcd } from "../sim/vcd";
import { cikislar, girisler, izOku, type KodBilgisi, type KodSonucu, type RaporSatiri } from "../../shared/kod";

const DOSYA = "tasarim.vhd";
const TB_DOSYA = "tb_sinama.vhd";
const anahtar = (id: string) => `fpga-pratik:kod:${id}`;

function kayitliKod(id: string, sablon: string): string {
  try {
    return localStorage.getItem(anahtar(id)) ?? sablon;
  } catch {
    return sablon;
  }
}

type Durum = null | "kontrol" | "sinama" | "benzetim" | "gonderim";
const DURUM_METNI: Record<Exclude<Durum, null>, string> = {
  kontrol: "Kontrol ediliyor…",
  sinama: "Testbench hazırlanıyor…",
  benzetim: "Benzetim çalışıyor…",
  gonderim: "Sonuç kontrol ediliyor…",
};

// Çok bitli değerlerin yanında onluk karşılığı da gösterilir
function deger(bits: string): string {
  if (bits.length <= 1 || !/^[01]+$/.test(bits)) return bits;
  return `${bits} (${parseInt(bits, 2)})`;
}

function Rapor({ bilgi, rapor }: { bilgi: KodBilgisi; rapor: RaporSatiri[] }) {
  const g = girisler(bilgi);
  const c = cikislar(bilgi);
  return (
    <div className="kod-rapor-tablo">
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>#</th>
            <th rowSpan={2}>Zaman</th>
            <th colSpan={g.length}>Girişler</th>
            <th colSpan={c.length}>Beklenen</th>
            <th colSpan={c.length}>Senin çıkışın</th>
          </tr>
          <tr>
            {g.map((p) => <th key={p.ad} className="mono">{p.ad}</th>)}
            {c.map((p) => <th key={p.ad} className="mono">{p.ad}</th>)}
            {c.map((p) => <th key={p.ad} className="mono">{p.ad}</th>)}
          </tr>
        </thead>
        <tbody>
          {rapor.map((s) => (
            <tr key={s.i} className={s.dogru ? undefined : "hatali"}>
              <td>{s.i}</td>
              <td className="mono">{s.zamanNs} ns</td>
              {g.map((p) => <td key={p.ad} className="mono">{deger(s.girisler[p.ad])}</td>)}
              {c.map((p) => <td key={p.ad} className="mono">{deger(s.beklenen[p.ad])}</td>)}
              {c.map((p) => {
                const v = s.gelen?.[p.ad];
                const yanlis = v === undefined || v.replace(/H/g, "1").replace(/L/g, "0") !== s.beklenen[p.ad];
                return (
                  <td key={p.ad} className={`mono${yanlis ? " yanlis-hucre" : ""}`}>
                    {v === undefined ? "—" : deger(v)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function KodSorusu({ id, bilgi, onSonuc }: { id: string; bilgi: KodBilgisi; onSonuc: (dogru: boolean | null) => void }) {
  const [kod, setKod] = useState(() => kayitliKod(id, bilgi.sablon));
  const [durum, setDurum] = useState<Durum>(null);
  const [mesajlar, setMesajlar] = useState<SimMessage[]>([]);
  const [sonuc, setSonuc] = useState<KodSonucu | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [vcd, setVcd] = useState<Vcd | null>(null);
  const [testbench, setTestbench] = useState<string | null>(null);
  const [gotoLine, setGotoLine] = useState<{ line: number; nonce: number }>();

  useEffect(() => {
    try {
      if (kod === bilgi.sablon) localStorage.removeItem(anahtar(id));
      else localStorage.setItem(anahtar(id), kod);
    } catch {
      // kaydedilemezse sayfa açık kaldıkça bellekte durur
    }
  }, [id, kod, bilgi.sablon]);

  const isaretler = useMemo<EditorMark[]>(
    () =>
      mesajlar
        .filter((m) => m.file === DOSYA && m.line && m.severity !== "note")
        .map((m) => ({ line: m.line!, severity: m.severity === "warning" ? "warning" : "error" })),
    [mesajlar],
  );

  const temizle = () => {
    setHata(null);
    setSonuc(null);
    setMesajlar([]);
    onSonuc(null);
  };

  const kontrol = async () => {
    temizle();
    setDurum("kontrol");
    const r = await checkSyntax([{ name: DOSYA, text: kod }]);
    setMesajlar(r.messages);
    setDurum(null);
    if (r.ok) setHata(null);
    else if (!r.messages.length) setHata("Analiz başarısız oldu.");
  };

  const sina = async () => {
    temizle();
    setDurum("sinama");
    const s = await api.sinama(id);
    if (!s.ok) {
      setDurum(null);
      return setHata(s.hata.error);
    }
    setTestbench(s.data.testbench);
    setDurum("benzetim");
    const r = await simulate(
      [{ name: DOSYA, text: kod }, { name: TB_DOSYA, text: s.data.testbench }],
      { top: s.data.top, stopTime: s.data.stopTime },
    );
    setMesajlar(r.messages.filter((m) => !(m.severity === "note" && /^\S+: IZ /.test(m.text))));
    setVcd(r.vcd);
    if (!r.ok) {
      setDurum(null);
      return setHata(
        r.timedOut
          ? "Benzetim zaman sınırını aştı. Tasarımda sonsuz bir döngü ya da kendini tetikleyen bir atama olabilir."
          : "Tasarım derlenemedi ya da benzetim hatayla durdu. Ayrıntılar aşağıdaki mesajlarda.",
      );
    }
    setDurum("gonderim");
    const g = await api.sinamaGonder(s.data.id, izOku(r.log));
    setDurum(null);
    if (!g.ok) return setHata(g.hata.error);
    setSonuc(g.data);
    onSonuc(g.data.correct);
  };

  const sablonaDon = () => {
    if (kod !== bilgi.sablon && !confirm("Yazdığın kod silinip şablon geri yüklensin mi?")) return;
    setKod(bilgi.sablon);
    temizle();
  };

  const mesajSec = (m: SimMessage) => {
    if (m.file === DOSYA && m.line) setGotoLine({ line: m.line, nonce: Date.now() });
  };

  return (
    <div className="kod-sorusu">
      <BoyutluEditor>
        <VhdlEditor value={kod} onChange={setKod} marks={isaretler} gotoLine={gotoLine} />
      </BoyutluEditor>
      <div className="kod-dugmeler">
        <button className="primary" onClick={sina} disabled={durum !== null}>
          {durum && durum !== "kontrol" ? DURUM_METNI[durum] : "▶ Sına"}
        </button>
        <button onClick={kontrol} disabled={durum !== null}>
          {durum === "kontrol" ? DURUM_METNI.kontrol : "✓ Sözdizimi kontrolü"}
        </button>
        <button onClick={sablonaDon} disabled={durum !== null}>Şablona dön</button>
      </div>

      {hata && <p className="bad" role="alert">{hata}</p>}
      {mesajlar.length > 0 && (
        <div className="kod-mesajlar">
          <MessagesPanel messages={mesajlar} onSelect={mesajSec} />
        </div>
      )}
      {!hata && !sonuc && durum === null && mesajlar.length === 0 && testbench === null && (
        <p className="hint">Kodun yalnızca bu tarayıcıda saklanır; sen paylaşmayı seçmedikçe sunucuya gönderilmez. Sınamada sunucuya sadece testbench'in okuduğu çıkış değerleri gider.</p>
      )}

      {sonuc && (
        <div className="kod-sonuc" role="status">
          <div className="kod-ilerleme" aria-hidden>
            <span style={{ width: `${(sonuc.gecen / sonuc.toplam) * 100}%` }} />
          </div>
          <p>
            <strong className={sonuc.correct ? "ok" : "bad"}>
              {sonuc.correct ? "Doğru: tüm kontrol noktaları geçti." : "Henüz değil."}
            </strong>{" "}
            {sonuc.toplam} kontrol noktasından {sonuc.gecen} tanesi geçti.
          </p>
          {sonuc.rapor && (
            <>
              <h4>Nerede takıldı?</h4>
              <p className="hint">
                İlk hatalı kontrol noktası {sonuc.rapor.at(-1)!.i}
                {bilgi.saat ? "; öncesindeki birkaç saat çevrimi de gösteriliyor." : "."} Zaman, testbench'in çıkışı okuduğu
                andır; dalga ekranında aynı zamana bakabilirsin.
              </p>
              <Rapor bilgi={bilgi} rapor={sonuc.rapor} />
              {sonuc.ipucu && <p className="kod-ipucu">İpucu: {sonuc.ipucu}</p>}
            </>
          )}
          {sonuc.explanation && <Markdown text={sonuc.explanation} terim />}
        </div>
      )}

      <Paylasimlar soruId={id} kod={kod} sinandi={!!sonuc} />

      {(vcd || testbench) && (
        <div className="kod-ayrinti">
          {vcd && (
            <details>
              <summary>Dalga ekranı (son benzetim)</summary>
              <div className="kod-dalga">
                <WaveformView vcd={vcd} />
              </div>
            </details>
          )}
          {testbench && (
            <details>
              <summary>Kullanılan testbench</summary>
              <pre className="log">{testbench}</pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
