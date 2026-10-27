// Simülasyon alanının yeniden boyutlandırılıp yeri değiştirilebilen panelleri.
// Paneller başlıklarından sürüklenip başka bir panelin soluna ya da sağına
// bırakılır; aradaki çizgiler sürüklenerek boyutlandırılır. Klavyeyle de aynı
// işler panelin ⋯ menüsünden yapılır.

import { useRef, useState, type DragEvent, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { komsuBoyutla, komsuEsitle, paneliBul, satirBoyutla, tasi, type SatirAdi } from "../lib/duzen";
import type { Duzen, PanelId } from "../../shared/duzen";

export interface PanelTanimi {
  ad: string;
  sinif: string;
  // Başlık çubuğunun içeriği (ör. dosya adı ya da sekmeler)
  baslik: ReactNode;
  govde: ReactNode;
}

interface Props {
  duzen: Duzen;
  degistir: (d: Duzen) => void;
  paneller: Record<PanelId, PanelTanimi>;
  menuAc: (x: number, y: number, ogeler: { etiket: string; yap?: () => void; pasif?: boolean; ayrac?: boolean }[]) => void;
}

type Birakma = { satir: SatirAdi; indeks: number };

const VERI = "application/x-fpga-panel";

export function DuzenAlani({ duzen, degistir, paneller, menuAc }: Props) {
  const alan = useRef<HTMLDivElement>(null);
  const [surukle, setSurukle] = useState<PanelId | null>(null);
  const [birakma, setBirakma] = useState<Birakma | null>(null);

  // Ayırıcı sürükleme: başlangıçtaki düzen ve fare konumuna göre hesaplanır
  const ayiriciBasla = (e: RPointerEvent, hesapla: (dx: number, dy: number, w: number, h: number) => Duzen) => {
    e.preventDefault();
    const hedef = e.currentTarget as HTMLElement;
    hedef.setPointerCapture(e.pointerId);
    const { clientX: x0, clientY: y0 } = e;
    const kutu = alan.current!.getBoundingClientRect();
    const satirKutu = (hedef.parentElement as HTMLElement).getBoundingClientRect();
    const hareket = (m: PointerEvent) => degistir(hesapla(m.clientX - x0, m.clientY - y0, satirKutu.width, kutu.height));
    const bitir = () => {
      hedef.removeEventListener("pointermove", hareket);
      hedef.removeEventListener("pointerup", bitir);
      hedef.removeEventListener("pointercancel", bitir);
      document.body.classList.remove("boyutlaniyor");
    };
    document.body.classList.add("boyutlaniyor");
    hedef.addEventListener("pointermove", hareket);
    hedef.addEventListener("pointerup", bitir);
    hedef.addEventListener("pointercancel", bitir);
  };

  const panelMenusu = (id: PanelId, x: number, y: number) => {
    const { satir, indeks } = paneliBul(duzen, id);
    const s = duzen[satir];
    const diger: SatirAdi = satir === "ust" ? "alt" : "ust";
    menuAc(x, y, [
      { etiket: "Sola taşı", pasif: indeks === 0, yap: () => degistir(tasi(duzen, id, satir, indeks - 1)) },
      { etiket: "Sağa taşı", pasif: indeks === s.length - 1, yap: () => degistir(tasi(duzen, id, satir, indeks + 2)) },
      {
        etiket: satir === "ust" ? "Alt satıra taşı" : "Üst satıra taşı",
        pasif: s.length === 1 && duzen[diger].length === 0,
        yap: () => degistir(tasi(duzen, id, diger, duzen[diger].length)),
      },
    ]);
  };

  const uzerinde = (e: DragEvent, satir: SatirAdi, indeks: number) => {
    if (!surukle) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const yer = { satir, indeks: e.clientX < r.left + r.width / 2 ? indeks : indeks + 1 };
    if (yer.satir !== birakma?.satir || yer.indeks !== birakma.indeks) setBirakma(yer);
  };

  const birak = (e: DragEvent) => {
    e.preventDefault();
    if (surukle && birakma) degistir(tasi(duzen, surukle, birakma.satir, birakma.indeks));
    setSurukle(null);
    setBirakma(null);
  };

  // Boş satır sürükleme sırasında bir bırakma şeridi olarak görünür
  const bosSatir = (satir: SatirAdi) =>
    surukle && (
      <div
        className={`duzen-bos-satir${birakma?.satir === satir ? " hedef" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (birakma?.satir !== satir) setBirakma({ satir, indeks: 0 });
        }}
        onDrop={birak}
      >
        Paneli yeni satır için buraya bırak
      </div>
    );

  const satirCiz = (satir: SatirAdi) => {
    const s = duzen[satir];
    if (!s.length) return bosSatir(satir);
    const tekSatir = !duzen[satir === "ust" ? "alt" : "ust"].length;
    const yukseklik = tekSatir ? 1 : satir === "ust" ? duzen.ustOran : 1 - duzen.ustOran;
    // flex-grow toplamı 1'in altına düşerse satır dolmaz; paylar toplama bölünür
    const toplam = s.reduce((t, p) => t + p.oran, 0) || 1;
    return (
      <div className="duzen-satir" style={{ flexGrow: yukseklik }} data-satir={satir}>
        {s.map((p, i) => {
          const t = paneller[p.id];
          const cizgi = birakma?.satir === satir ? (birakma.indeks === i ? " birak-sol" : birakma.indeks === i + 1 ? " birak-sag" : "") : "";
          return [
            i > 0 && (
              <div
                key={`a${i}`}
                className="duzen-ayirici dikey"
                role="separator"
                aria-orientation="vertical"
                title="Sürükleyerek boyutlandır, çift tıkla eşitle"
                onPointerDown={(e) => {
                  const bas = duzen;
                  ayiriciBasla(e, (dx, _dy, w) => komsuBoyutla(bas, satir, i - 1, dx / w));
                }}
                onDoubleClick={() => degistir(komsuEsitle(duzen, satir, i - 1))}
              />
            ),
            <section
              key={p.id}
              className={`panel ${t.sinif}${surukle === p.id ? " surukleniyor" : ""}${cizgi}`}
              style={{ flexGrow: p.oran / toplam }}
              data-panel={p.id}
              onDragOver={(e) => uzerinde(e, satir, i)}
              onDrop={birak}
            >
              <div
                className="panel-title panel-tutamak"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(VERI, p.id);
                  e.dataTransfer.effectAllowed = "move";
                  setSurukle(p.id);
                }}
                onDragEnd={() => {
                  setSurukle(null);
                  setBirakma(null);
                }}
              >
                <span className="tutamak-izi" aria-hidden="true">⠿</span>
                {t.baslik}
                <button
                  className="icon panel-menu"
                  aria-label={`${t.ad} panelini taşı`}
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    panelMenusu(p.id, r.left, r.bottom);
                  }}
                >
                  ⋯
                </button>
              </div>
              {t.govde}
            </section>,
          ];
        })}
      </div>
    );
  };

  const ikiSatir = duzen.ust.length > 0 && duzen.alt.length > 0;
  return (
    <div className="duzen-alani" ref={alan}>
      {satirCiz("ust")}
      {ikiSatir && (
        <div
          className="duzen-ayirici yatay"
          role="separator"
          aria-orientation="horizontal"
          title="Sürükleyerek boyutlandır"
          onPointerDown={(e) => {
            const bas = duzen;
            ayiriciBasla(e, (_dx, dy, _w, h) => satirBoyutla(bas, bas.ustOran + dy / h));
          }}
        />
      )}
      {satirCiz("alt")}
    </div>
  );
}
