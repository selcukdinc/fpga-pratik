import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { VhdlEditor, type EditorMark } from "../components/VhdlEditor";
import { MessagesPanel } from "../components/MessagesPanel";
import { WaveformView } from "../components/WaveformView";
import { checkSyntax, simulate, type SimFile, type VhdlStd } from "../sim/simulator";
import { ORNEKLER, type Ornek } from "../sim/ornekler";
import {
  adDuzelt, adHatasi, bosAd, kaynakSablonu, sureHatasi, topBul, varliklar, vhdlDosyasi, zipOlustur, type KaynakTuru,
} from "../sim/proje";
import type { SimMessage } from "../sim/messages";
import type { Vcd } from "../sim/vcd";

const ANAHTAR = "fpga-pratik:proje";
const ESKI_ANAHTAR = "fpga-pratik:pratik-alani";

interface Workspace {
  files: SimFile[];
  // Kullanıcının seçtiği top; boşsa ya da artık yoksa otomatik seçilir
  top: string;
  stopTime: string;
  std: VhdlStd;
  ad: string;
}

const BOS: Workspace = { files: [], top: "", stopTime: "1us", std: "1993", ad: "proje" };

function yukle(): Workspace {
  try {
    const kayitli = localStorage.getItem(ANAHTAR);
    if (kayitli) return { ...BOS, ...(JSON.parse(kayitli) as Partial<Workspace>) };
    // Önceki sürümde açılış projesi üçgen dalgaydı: değiştirilmediyse boş başlanır
    const eski = localStorage.getItem(ESKI_ANAHTAR);
    if (eski) {
      const w = JSON.parse(eski) as Workspace;
      const ornek = ORNEKLER[0].uret(ORNEKLER[0].varsayilanAd).files;
      const degismemis = w.files.length === ornek.length && w.files.every((f, i) => f.text === ornek[i].text);
      localStorage.removeItem(ESKI_ANAHTAR);
      if (!degismemis) return { ...BOS, ...w };
    }
  } catch {
    // gizli pencere vb.: boş projeyle başla
  }
  return BOS;
}

// ---- File System Access API (Chrome, Edge). Diğer tarayıcılarda klasör yalnızca okunur. ----

interface DosyaTutamagi {
  kind: "file";
  name: string;
  getFile(): Promise<File>;
  createWritable(): Promise<{ write(d: string): Promise<void>; close(): Promise<void> }>;
}
interface KlasorTutamagi {
  kind: "directory";
  name: string;
  values(): AsyncIterable<DosyaTutamagi | KlasorTutamagi>;
  getFileHandle(ad: string, o?: { create?: boolean }): Promise<DosyaTutamagi>;
  requestPermission?(o: { mode: "readwrite" }): Promise<"granted" | "denied" | "prompt">;
}
type KlasorSecici = (o?: { mode?: "read" | "readwrite"; id?: string }) => Promise<KlasorTutamagi>;
const klasorSecici = (): KlasorSecici | undefined =>
  (window as unknown as { showDirectoryPicker?: KlasorSecici }).showDirectoryPicker;

interface AcikKlasor {
  kok: KlasorTutamagi;
  // Dosya adı → klasördeki tutamağı (alt klasördekiler de yerinde kaydedilir)
  dosyalar: Map<string, DosyaTutamagi>;
}

async function klasorOku(kok: KlasorTutamagi, derinlik = 0, out: DosyaTutamagi[] = []): Promise<DosyaTutamagi[]> {
  for await (const g of kok.values()) {
    if (g.kind === "file" && vhdlDosyasi(g.name)) out.push(g);
    else if (g.kind === "directory" && derinlik < 3 && !g.name.startsWith(".")) await klasorOku(g, derinlik + 1, out);
  }
  return out;
}

function indir(ad: string, veri: BlobPart, tur: string) {
  const url = URL.createObjectURL(new Blob([veri], { type: tur }));
  const a = document.createElement("a");
  a.href = url;
  a.download = ad;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Aynı adlı dosyalar (ör. farklı alt klasörlerden) _2 ekiyle ayrılır
function adlariAyir(gelen: SimFile[], mevcut: string[]): SimFile[] {
  const dolu = [...mevcut];
  return gelen.map((f) => {
    const [kok, uzanti] = [f.name.replace(/\.(vhd|vhdl)$/i, ""), f.name.match(/\.(vhd|vhdl)$/i)?.[0] ?? ".vhd"];
    const ad = dolu.some((d) => d.toLowerCase() === f.name.toLowerCase()) ? `${bosAd(kok, dolu.map((d) => d.replace(/\.(vhd|vhdl)$/i, "")))}${uzanti}` : f.name;
    dolu.push(ad);
    return { ...f, name: ad };
  });
}

// ---- Küçük pencere ve menü bileşenleri ----

function Pencere({ baslik, kapat, children }: { baslik: string; kapat: () => void; children: ReactNode }) {
  useEffect(() => {
    const tus = (e: KeyboardEvent) => e.key === "Escape" && kapat();
    window.addEventListener("keydown", tus);
    return () => window.removeEventListener("keydown", tus);
  }, [kapat]);
  return (
    <div className="pencere-arka" onMouseDown={(e) => e.target === e.currentTarget && kapat()}>
      <div className="pencere" role="dialog" aria-modal="true" aria-label={baslik}>
        <div className="panel-title">{baslik}</div>
        <div className="pencere-govde">{children}</div>
      </div>
    </div>
  );
}

interface MenuOgesi {
  etiket: string;
  yap?: () => void;
  pasif?: boolean;
  ayrac?: boolean;
}

function BaglamMenusu({ x, y, ogeler, kapat }: { x: number; y: number; ogeler: MenuOgesi[]; kapat: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [konum, setKonum] = useState({ x, y });
  useEffect(() => {
    // Ekrandan taşmasın
    const r = ref.current!.getBoundingClientRect();
    setKonum({ x: Math.min(x, window.innerWidth - r.width - 8), y: Math.min(y, window.innerHeight - r.height - 8) });
    ref.current!.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
    const disari = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && kapat();
    const tus = (e: KeyboardEvent) => e.key === "Escape" && kapat();
    window.addEventListener("mousedown", disari);
    window.addEventListener("keydown", tus);
    window.addEventListener("blur", kapat);
    return () => {
      window.removeEventListener("mousedown", disari);
      window.removeEventListener("keydown", tus);
      window.removeEventListener("blur", kapat);
    };
  }, [x, y, kapat]);
  return (
    <div ref={ref} className="baglam-menusu" role="menu" style={{ left: konum.x, top: konum.y }}>
      {ogeler.map((o, i) =>
        o.ayrac ? (
          <hr key={i} />
        ) : (
          <button key={i} role="menuitem" disabled={o.pasif} onClick={() => (kapat(), o.yap?.())}>
            {o.etiket}
          </button>
        ),
      )}
    </div>
  );
}

type Tab = "messages" | "log";
type Diyalog =
  | { tur: "kaynak" }
  | { tur: "ornek" }
  | { tur: "adlandir"; dosya: string };

interface Props {
  onStatus: (s: string) => void;
}

export function Sandbox({ onStatus }: Props) {
  const [ws, setWs] = useState<Workspace>(yukle);
  const [aktifAd, setAktifAd] = useState<string | null>(() => ws.files[0]?.name ?? null);
  const [busy, setBusy] = useState<null | "check" | "sim">(null);
  const [messages, setMessages] = useState<SimMessage[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [vcd, setVcd] = useState<Vcd | null>(null);
  const [tab, setTab] = useState<Tab>("messages");
  const [gotoLine, setGotoLine] = useState<{ line: number; nonce: number }>();
  const [menu, setMenu] = useState<{ x: number; y: number; dosya: string } | null>(null);
  const [diyalog, setDiyalog] = useState<Diyalog | null>(null);
  const [klasor, setKlasor] = useState<AcikKlasor | null>(null);
  const dosyaGirdisi = useRef<HTMLInputElement>(null);
  const klasorGirdisi = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(ANAHTAR, JSON.stringify(ws));
    } catch {
      // kaydedilemezse oturum boyunca bellekte kalır
    }
  }, [ws]);

  const file = ws.files.find((f) => f.name === aktifAd) ?? ws.files[0];
  const birimler = useMemo(() => varliklar(ws.files), [ws.files]);
  const top = useMemo(() => topBul(ws.files, ws.top), [ws.files, ws.top]);
  const topBirim = birimler.find((v) => v.ad === top);

  // Top'un altındaki birimler: "entity work.X" ve bileşen örneklemelerinden izlenir
  const kullanilan = useMemo(() => {
    const kume = new Set<string>();
    const sira = top ? [top] : [];
    while (sira.length) {
      const ad = sira.pop()!;
      if (kume.has(ad)) continue;
      kume.add(ad);
      const dosya = ws.files.find((f) => f.name === birimler.find((v) => v.ad === ad)?.dosya);
      if (!dosya) continue;
      const metin = dosya.text.replace(/--[^\n]*/g, "");
      for (const m of metin.matchAll(/\bentity\s+work\.([a-z][a-z0-9_]*)/gi)) sira.push(m[1].toLowerCase());
      for (const m of metin.matchAll(/:\s*(?:component\s+)?([a-z][a-z0-9_]*)\s+(?:generic|port)\s+map\b/gi)) sira.push(m[1].toLowerCase());
    }
    return kume;
  }, [top, ws.files, birimler]);

  const dosyaBirimleri = (ad: string) => birimler.filter((v) => v.dosya === ad);
  const simulasyonda = (ad: string) => dosyaBirimleri(ad).some((v) => kullanilan.has(v.ad));

  const marks = useMemo<EditorMark[]>(
    () =>
      messages
        .filter((m) => m.file === file?.name && m.line && m.severity !== "note")
        .map((m) => ({ line: m.line!, severity: m.severity === "warning" ? "warning" : "error" })),
    [messages, file?.name],
  );

  const updateFile = (text: string) =>
    setWs((w) => ({ ...w, files: w.files.map((f) => (f.name === file?.name ? { ...f, text } : f)) }));

  const dosyalariEkle = (yeni: SimFile[], yeniTop?: string, stopTime?: string) => {
    if (!yeni.length) return;
    setWs((w) => ({
      ...w,
      files: [...w.files, ...yeni],
      top: yeniTop ?? w.top,
      stopTime: stopTime ?? w.stopTime,
    }));
    setAktifAd(yeni[0].name);
  };

  const topYap = (ad: string) => {
    setWs((w) => ({ ...w, top: ad }));
    onStatus(`Top birimi: ${ad}`);
  };

  const sil = (ad: string) => {
    if (!confirm(`${ad} projeden çıkarılsın mı?${klasor ? " Klasördeki dosya silinmez." : ""}`)) return;
    setWs((w) => ({ ...w, files: w.files.filter((f) => f.name !== ad) }));
    if (aktifAd === ad) setAktifAd(ws.files.find((f) => f.name !== ad)?.name ?? null);
  };

  const dosyaIndir = (ad: string) => {
    const f = ws.files.find((x) => x.name === ad);
    if (f) indir(f.name, f.text, "text/x-vhdl;charset=utf-8");
  };

  const zipIndir = () => {
    if (!ws.files.length) return;
    indir(`${ws.ad || "proje"}.zip`, zipOlustur(ws.files) as BlobPart, "application/zip");
    onStatus(`${ws.files.length} dosya ${ws.ad || "proje"}.zip olarak indirildi`);
  };

  // ---- Dosya ve klasör içe alma ----

  const metinleriOku = async (dosyalar: File[]): Promise<SimFile[]> =>
    Promise.all(dosyalar.filter((d) => vhdlDosyasi(d.name)).map(async (d) => ({ name: d.name, text: await d.text() })));

  const yuklenenleriEkle = async (liste: FileList | null) => {
    const gelen = await metinleriOku([...(liste ?? [])]);
    if (!gelen.length) return onStatus("Seçilen dosyalar arasında .vhd ya da .vhdl dosyası yok");
    const ayni = gelen.filter((g) => ws.files.some((f) => f.name.toLowerCase() === g.name.toLowerCase()));
    let eklenecek = gelen;
    if (ayni.length && confirm(`${ayni.map((x) => x.name).join(", ")} zaten açık. Yeni içerikle değiştirilsin mi? (İptal: yeni adla eklenir)`)) {
      setWs((w) => ({
        ...w,
        files: w.files.map((f) => ayni.find((a) => a.name.toLowerCase() === f.name.toLowerCase()) ?? f),
      }));
      eklenecek = gelen.filter((g) => !ayni.includes(g));
    }
    dosyalariEkle(adlariAyir(eklenecek, ws.files.map((f) => f.name)));
    onStatus(`${gelen.length} dosya yüklendi`);
  };

  const klasordenAc = (ad: string, gelen: SimFile[], acik: AcikKlasor | null) => {
    if (!gelen.length) {
      onStatus(`${ad} klasöründe .vhd ya da .vhdl dosyası bulunamadı`);
      return;
    }
    const degistir =
      ws.files.length === 0 ||
      confirm(`Açık dosyalar kapatılıp yalnızca ${ad} klasöründeki ${gelen.length} dosya açılsın mı?\n(İptal: klasördeki dosyalar mevcut projeye eklenir)`);
    const dosyalar = adlariAyir(gelen, degistir ? [] : ws.files.map((f) => f.name));
    setWs((w) => ({ ...w, ad, files: degistir ? dosyalar : [...w.files, ...dosyalar], top: degistir ? "" : w.top }));
    setAktifAd(dosyalar[0].name);
    setKlasor(acik);
    setMessages([]);
    onStatus(`${ad} klasöründen ${gelen.length} VHDL dosyası açıldı${acik ? "" : " (bu tarayıcıda klasöre geri kaydedilemez, Zip indir'i kullan)"}`);
  };

  const klasorAc = async () => {
    const secici = klasorSecici();
    if (!secici) return klasorGirdisi.current?.click();
    try {
      const kok = await secici({ id: "fpga-pratik", mode: "readwrite" });
      const tutamaklar = await klasorOku(kok);
      const gelen = await Promise.all(tutamaklar.map(async (t) => ({ name: t.name, text: await (await t.getFile()).text() })));
      const ayrik = adlariAyir(gelen, []);
      klasordenAc(kok.name, ayrik, { kok, dosyalar: new Map(ayrik.map((f, i) => [f.name, tutamaklar[i]])) });
    } catch (e) {
      if ((e as Error).name !== "AbortError") onStatus(`Klasör açılamadı: ${(e as Error).message}`);
    }
  };

  const klasorGirdisindenAc = async (liste: FileList | null) => {
    const dosyalar = [...(liste ?? [])];
    const ad = (dosyalar[0] as File & { webkitRelativePath?: string })?.webkitRelativePath?.split("/")[0] || "proje";
    klasordenAc(ad, await metinleriOku(dosyalar), null);
  };

  const klasoreKaydet = useCallback(async () => {
    if (!klasor) return;
    try {
      if ((await klasor.kok.requestPermission?.({ mode: "readwrite" })) === "denied") throw new Error("yazma izni verilmedi");
      for (const f of ws.files) {
        const t = klasor.dosyalar.get(f.name) ?? (await klasor.kok.getFileHandle(f.name, { create: true }));
        klasor.dosyalar.set(f.name, t);
        const w = await t.createWritable();
        await w.write(f.text);
        await w.close();
      }
      onStatus(`${ws.files.length} dosya ${klasor.kok.name} klasörüne kaydedildi`);
    } catch (e) {
      onStatus(`Kaydedilemedi: ${(e as Error).message}`);
    }
  }, [klasor, ws.files, onStatus]);

  // Ctrl/Cmd+S: klasör açıksa klasöre kaydeder
  useEffect(() => {
    const tus = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && klasor) {
        e.preventDefault();
        klasoreKaydet();
      }
    };
    window.addEventListener("keydown", tus);
    return () => window.removeEventListener("keydown", tus);
  }, [klasor, klasoreKaydet]);

  // ---- Çalıştırma ----

  const yaz = (r: { messages: SimMessage[]; log: string[] }, on: SimMessage[] = []) => {
    setMessages([...on, ...r.messages]);
    setLog(r.log);
    setTab("messages");
  };

  const ozet = (m: SimMessage[]) => {
    const hata = m.filter((x) => x.severity === "error" || x.severity === "fatal" || x.severity === "failure");
    const uyari = m.filter((x) => x.severity === "warning").length;
    const ilk = hata[0];
    return `${hata.length} hata${uyari ? `, ${uyari} uyarı` : ""}${ilk ? `. İlki: ${ilk.file ? `${ilk.file}:${ilk.line} ` : ""}${ilk.text}` : ""}`;
  };

  const runCheck = async () => {
    if (!ws.files.length) return onStatus("Önce bir kaynak ekle");
    setBusy("check");
    onStatus("Sözdizimi kontrol ediliyor…");
    const r = await checkSyntax(ws.files, ws.std);
    yaz(r);
    setBusy(null);
    onStatus(r.ok ? `Sözdizimi temiz: ${ws.files.length} dosya analiz edildi (${Math.round(r.ms)} ms)` : ozet(r.messages));
  };

  const runSim = async () => {
    if (!ws.files.length) return onStatus("Önce bir kaynak ekle");
    const sureH = sureHatasi(ws.stopTime);
    if (sureH) return onStatus(sureH);
    if (!top) {
      setMessages([{
        severity: "error",
        text: birimler.length
          ? "Simülasyon için bir top birimi seçilmedi. Testbench dosyasına sağ tıklayıp \"Top yap\"ı seç ya da araç çubuğundaki Top listesinden seç."
          : "Projede hiç entity yok. Simülasyon için bir tasarım ve onu çalıştıran bir testbench gerekir.",
        detail: [],
      }]);
      setTab("messages");
      return onStatus("Top birimi seçili değil");
    }
    const on: SimMessage[] = topBirim?.portlu
      ? [{
          severity: "warning",
          text: `Top birimi ${top} portlu bir tasarım. Portlarına dışarıdan değer verilemez, girişler 'U' kalır. Genellikle tasarımı örnekleyen portsuz bir testbench top yapılır.`,
          file: topBirim.dosya,
          detail: [],
        }]
      : [];
    setBusy("sim");
    onStatus(`Simülasyon çalışıyor: ${top}, ${ws.stopTime}…`);
    const r = await simulate(ws.files, { top, stopTime: ws.stopTime, std: ws.std });
    yaz(r, on);
    if (r.vcd) setVcd(r.vcd);
    setBusy(null);
    if (r.vcd && r.ok) onStatus(`Simülasyon tamamlandı: ${top}, ${ws.stopTime} (${Math.round(r.ms)} ms)`);
    else if (r.timedOut) onStatus("Simülasyon zaman sınırını aştı; sonsuz bir döngü olabilir");
    else if (r.vcd) onStatus(`Simülasyon bir hatayla durdu: ${ozet(r.messages)}`);
    else onStatus(`Simülasyon başlamadı: ${ozet(r.messages)}`);
  };

  const selectMessage = (m: SimMessage) => {
    if (!m.file || !m.line || !ws.files.some((f) => f.name === m.file)) return;
    setAktifAd(m.file);
    setGotoLine({ line: m.line, nonce: Date.now() });
  };

  const menuOgeleri = (ad: string): MenuOgesi[] => {
    const b = dosyaBirimleri(ad);
    return [
      ...(b.length
        ? b.map((v) => ({ etiket: v.ad === top ? `✓ Top: ${v.ad}` : `Top yap: ${v.ad}`, yap: () => topYap(v.ad), pasif: v.ad === top }))
        : [{ etiket: "Top yap (bu dosyada entity yok)", pasif: true }]),
      { etiket: "", ayrac: true },
      { etiket: "Yeniden adlandır…", yap: () => setDiyalog({ tur: "adlandir", dosya: ad }) },
      { etiket: "İndir", yap: () => dosyaIndir(ad) },
      { etiket: "Projeden çıkar", yap: () => sil(ad) },
    ];
  };

  const bilgi = file && top && !simulasyonda(file.name)
    ? dosyaBirimleri(file.name).length
      ? `Bu dosya simülasyona girmiyor: top ${top}${topBirim ? ` (${topBirim.dosya})` : ""} bu dosyadaki birimi kullanmıyor.`
      : "Bu dosyada entity yok."
    : null;

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
          <select value={top} onChange={(e) => topYap(e.target.value)} disabled={!birimler.length}>
            {!top && <option value="">{birimler.length ? "seç…" : "entity yok"}</option>}
            {birimler.map((v) => (
              <option key={`${v.dosya}:${v.ad}`} value={v.ad}>
                {v.ad}{v.portlu ? "" : " (testbench)"}
              </option>
            ))}
          </select>
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
        <span className="toolbar-ayrac" />
        <button onClick={() => setDiyalog({ tur: "kaynak" })}>＋ Yeni kaynak</button>
        <button onClick={() => setDiyalog({ tur: "ornek" })}>Örnek ekle</button>
        <button onClick={() => dosyaGirdisi.current?.click()}>Dosya yükle</button>
        <button onClick={klasorAc}>Klasör aç</button>
        {klasor && <button onClick={klasoreKaydet} title="Ctrl+S">Klasöre kaydet</button>}
        <button onClick={zipIndir} disabled={!ws.files.length}>Zip indir</button>
        <input ref={dosyaGirdisi} type="file" accept=".vhd,.vhdl" multiple hidden onChange={(e) => (yuklenenleriEkle(e.target.files), (e.target.value = ""))} />
        <input
          ref={klasorGirdisi}
          type="file"
          multiple
          hidden
          {...{ webkitdirectory: "" }}
          onChange={(e) => (klasorGirdisindenAc(e.target.files), (e.target.value = ""))}
        />
      </div>

      <section className="panel sources">
        <div className="panel-title">
          Sources <button className="icon" onClick={() => setDiyalog({ tur: "kaynak" })} title="Yeni kaynak">＋</button>
        </div>
        {ws.files.length === 0 ? (
          <p className="empty">Henüz dosya yok.</p>
        ) : (
          <ul>
            {ws.files.map((f) => {
              const topDosyasi = topBirim?.dosya === f.name;
              return (
                <li
                  key={f.name}
                  className={`${f.name === file?.name ? "active" : ""}${simulasyonda(f.name) ? "" : " pasif-dosya"}`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setAktifAd(f.name);
                    setMenu({ x: e.clientX, y: e.clientY, dosya: f.name });
                  }}
                >
                  <button onClick={() => setAktifAd(f.name)} title={topDosyasi ? `Top: ${top}` : f.name}>
                    <span className="file-badge">V</span>
                    <span className="dosya-adi">{f.name}</span>
                    {topDosyasi && <span className="top-rozeti">TOP</span>}
                  </button>
                  <button
                    className="icon"
                    aria-label={`${f.name} için işlemler`}
                    onClick={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      setMenu({ x: r.left, y: r.bottom, dosya: f.name });
                    }}
                  >
                    ⋮
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {ws.files.length > 0 && <p className="hint sources-ipucu">Top yapmak için dosyaya sağ tıkla.</p>}
      </section>

      <section className="panel editor">
        <div className="panel-title">
          {file?.name ?? "Başlangıç"}
          {file && topBirim?.dosya === file.name && <span className="top-rozeti">TOP</span>}
        </div>
        {bilgi && (
          <div className="editor-bilgi">
            {bilgi}
            {dosyaBirimleri(file!.name).length > 0 && (
              <button onClick={() => topYap(dosyaBirimleri(file!.name).at(-1)!.ad)}>Bu dosyayı top yap</button>
            )}
          </div>
        )}
        {file ? (
          <VhdlEditor key={file.name} value={file.text} onChange={updateFile} marks={marks} gotoLine={gotoLine} />
        ) : (
          <div className="bos-proje">
            <p>Simülasyon alanı boş. Başlamak için:</p>
            <div className="bos-proje-dugmeler">
              <button className="primary" onClick={() => setDiyalog({ tur: "kaynak" })}>＋ Yeni kaynak</button>
              <button onClick={() => setDiyalog({ tur: "ornek" })}>Örnek ekle</button>
              <button onClick={() => dosyaGirdisi.current?.click()}>Dosya yükle</button>
              <button onClick={klasorAc}>Klasör aç</button>
            </div>
            <p className="hint">
              Klasör açtığında içindeki .vhd ve .vhdl dosyaları gelir; haftalık çalışmalarını ayrı klasörlerde tutabilirsin.
              Dosyaların bu tarayıcıda saklanır, sunucuya gönderilmez.
            </p>
          </div>
        )}
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

      {menu && <BaglamMenusu x={menu.x} y={menu.y} ogeler={menuOgeleri(menu.dosya)} kapat={() => setMenu(null)} />}

      {diyalog?.tur === "kaynak" && (
        <YeniKaynak
          dolu={ws.files.map((f) => f.name)}
          birimler={birimler.map((b) => b.ad)}
          kapat={() => setDiyalog(null)}
          ekle={(ad, tur) => {
            dosyalariEkle([{ name: `${ad}.vhd`, text: kaynakSablonu(ad, tur) }]);
            if (tur === "testbench") topYap(ad.toLowerCase());
            setDiyalog(null);
          }}
        />
      )}
      {diyalog?.tur === "ornek" && (
        <OrnekEkle
          birimler={birimler.map((b) => b.ad)}
          dolu={ws.files.map((f) => f.name)}
          kapat={() => setDiyalog(null)}
          ekle={(o, ad) => {
            const u = o.uret(ad);
            dosyalariEkle(u.files, u.top.toLowerCase(), o.stopTime);
            setDiyalog(null);
            onStatus(`${o.baslik} eklendi; top ${u.top}, süre ${o.stopTime}`);
          }}
        />
      )}
      {diyalog?.tur === "adlandir" && (
        <Adlandir
          eski={diyalog.dosya}
          dolu={ws.files.map((f) => f.name).filter((n) => n !== diyalog.dosya)}
          kapat={() => setDiyalog(null)}
          kaydet={(yeni) => {
            setWs((w) => ({ ...w, files: w.files.map((f) => (f.name === diyalog.dosya ? { ...f, name: yeni } : f)) }));
            if (klasor?.dosyalar.has(diyalog.dosya)) klasor.dosyalar.delete(diyalog.dosya);
            setAktifAd(yeni);
            setDiyalog(null);
          }}
        />
      )}
    </div>
  );
}

// ---- Diyaloglar ----

function YeniKaynak({ dolu, birimler, kapat, ekle }: {
  dolu: string[]; birimler: string[]; kapat: () => void; ekle: (ad: string, tur: KaynakTuru) => void;
}) {
  const [girdi, setGirdi] = useState("");
  const [tur, setTur] = useState<KaynakTuru>("tasarim");
  const ad = adDuzelt(girdi);
  const hata = girdi
    ? adHatasi(ad) ??
      (dolu.some((d) => d.toLowerCase() === `${ad}.vhd`.toLowerCase()) ? `${ad}.vhd adında bir dosya zaten var.` : null) ??
      (birimler.includes(ad.toLowerCase()) ? `${ad} adında bir entity zaten var.` : null)
    : null;
  const gonder = (e: FormEvent) => {
    e.preventDefault();
    if (ad && !hata) ekle(ad, tur);
  };
  return (
    <Pencere baslik="Yeni kaynak" kapat={kapat}>
      <form onSubmit={gonder} className="pencere-form">
        <fieldset className="tur-secimi">
          <legend>Tür</legend>
          <label className="onay">
            <input type="radio" checked={tur === "tasarim"} onChange={() => setTur("tasarim")} /> Tasarım kaynağı
          </label>
          <label className="onay">
            <input type="radio" checked={tur === "testbench"} onChange={() => setTur("testbench")} /> Simülasyon kaynağı (testbench)
          </label>
        </fieldset>
        <label>
          Dosya adı
          <input autoFocus className="mono" value={girdi} placeholder={tur === "testbench" ? "tb_sayac" : "sayac"} onChange={(e) => setGirdi(e.target.value)} />
        </label>
        <p className="hint">
          {ad && !hata
            ? `${ad}.vhd oluşturulur; içinde ${ad} entity'si hazır gelir.${tur === "testbench" ? " Testbench top birimi yapılır." : ""}`
            : "Entity adı dosya adından alınır."}
        </p>
        {hata && <p className="bad" role="alert">{hata}</p>}
        <div className="form-dugmeler">
          <button type="button" onClick={kapat}>Vazgeç</button>
          <button className="primary" type="submit" disabled={!ad || !!hata}>Oluştur</button>
        </div>
      </form>
    </Pencere>
  );
}

function OrnekEkle({ birimler, dolu, kapat, ekle }: {
  birimler: string[]; dolu: string[]; kapat: () => void; ekle: (o: Ornek, ad: string) => void;
}) {
  const varsayilan = (o: Ornek) => bosAd(o.varsayilanAd, [...birimler, ...dolu.map((d) => d.replace(/\.(vhd|vhdl)$/i, ""))]);
  const [secili, setSecili] = useState<Ornek>(ORNEKLER[0]);
  const [girdi, setGirdi] = useState(() => varsayilan(ORNEKLER[0]));
  const ad = adDuzelt(girdi);
  const uretilen = ad && !adHatasi(ad) ? secili.uret(ad) : null;
  const cakisan = uretilen
    ? [
        ...uretilen.files.filter((f) => dolu.some((d) => d.toLowerCase() === f.name.toLowerCase())).map((f) => f.name),
        ...varliklar(uretilen.files).filter((v) => birimler.includes(v.ad)).map((v) => v.ad),
      ]
    : [];
  const hata = adHatasi(ad) ?? (cakisan.length ? `${[...new Set(cakisan)].join(", ")} zaten projede var; başka bir ad seç.` : null);
  const gonder = (e: FormEvent) => {
    e.preventDefault();
    if (!hata) ekle(secili, ad);
  };
  return (
    <Pencere baslik="Örnek ekle" kapat={kapat}>
      <form onSubmit={gonder} className="pencere-form">
        <div className="ornek-listesi" role="radiogroup" aria-label="Örnekler">
          {ORNEKLER.map((o) => (
            <label key={o.id} className={`ornek${o === secili ? " secili" : ""}`}>
              <input
                type="radio"
                name="ornek"
                checked={o === secili}
                onChange={() => {
                  setSecili(o);
                  setGirdi(varsayilan(o));
                }}
              />
              <span>
                <strong>{o.baslik}</strong>
                <span className="hint">{o.aciklama}</span>
              </span>
            </label>
          ))}
        </div>
        <label>
          Ad
          <input className="mono" value={girdi} onChange={(e) => setGirdi(e.target.value)} />
        </label>
        <p className="hint">
          {uretilen ? `Eklenecek dosyalar: ${uretilen.files.map((f) => f.name).join(", ")}. Top: ${uretilen.top}.` : ""}
        </p>
        {hata && <p className="bad" role="alert">{hata}</p>}
        <div className="form-dugmeler">
          <button type="button" onClick={kapat}>Vazgeç</button>
          <button className="primary" type="submit" disabled={!!hata}>Ekle</button>
        </div>
      </form>
    </Pencere>
  );
}

function Adlandir({ eski, dolu, kapat, kaydet }: { eski: string; dolu: string[]; kapat: () => void; kaydet: (yeni: string) => void }) {
  const [girdi, setGirdi] = useState(eski);
  const uzanti = girdi.match(/\.(vhd|vhdl)$/i)?.[0] ?? ".vhd";
  const ad = adDuzelt(girdi);
  const yeni = `${ad}${uzanti}`;
  const hata = adHatasi(ad) ?? (dolu.some((d) => d.toLowerCase() === yeni.toLowerCase()) ? `${yeni} adında bir dosya zaten var.` : null);
  return (
    <Pencere baslik="Dosyayı yeniden adlandır" kapat={kapat}>
      <form
        className="pencere-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!hata) kaydet(yeni);
        }}
      >
        <label>
          Yeni ad
          <input autoFocus className="mono" value={girdi} onChange={(e) => setGirdi(e.target.value)} />
        </label>
        <p className="hint">Yalnızca dosya adı değişir; içindeki entity adı aynı kalır.</p>
        {hata && <p className="bad" role="alert">{hata}</p>}
        <div className="form-dugmeler">
          <button type="button" onClick={kapat}>Vazgeç</button>
          <button className="primary" type="submit" disabled={!!hata || yeni === eski}>Kaydet</button>
        </div>
      </form>
    </Pencere>
  );
}
