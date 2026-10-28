// Ders ve kod sorularındaki editör kutusu: alt kenarından sürüklenerek
// boyutlandırılır, en fazla kodun tamamı görünecek kadar uzar. "Tümünü göster"
// tek tıkla o yüksekliğe getirir.

import { useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode } from "react";

const EN_AZ = 120;

// İçeriğin tamamının kaydırmadan sığdığı yükseklik: editörün (ya da kutunun
// kendi) içeriği + kutunun kenarlığı
function tamYukseklik(kutu: HTMLElement): number {
  const kenar = kutu.offsetHeight - kutu.clientHeight;
  const kaydirici = kutu.querySelector<HTMLElement>(".cm-scroller");
  if (!kaydirici) return Math.max(EN_AZ, kutu.scrollHeight + kenar);
  return Math.max(EN_AZ, kaydirici.scrollHeight + (kaydirici.offsetHeight - kaydirici.clientHeight) + kenar);
}

// etiket: tutamağın ekran okuyucudaki adı. Mesaj paneli gibi editör olmayan
// kutular da aynı tutamakla boyutlandırılır.
export function BoyutluEditor({ sinif, etiket = "Editör yüksekliği", children }: { sinif?: string; etiket?: string; children: ReactNode }) {
  const kutu = useRef<HTMLDivElement>(null);
  // null: CSS'teki varsayılan yükseklik
  const [yukseklik, setYukseklik] = useState<number | null>(null);
  const [tam, setTam] = useState(false);

  const surukle = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !kutu.current) return;
    e.preventDefault();
    const tutamak = e.currentTarget;
    tutamak.setPointerCapture(e.pointerId);
    const y0 = e.clientY;
    const h0 = kutu.current.getBoundingClientRect().height;
    const enCok = tamYukseklik(kutu.current);
    setTam(false);
    const hareket = (m: PointerEvent) => setYukseklik(Math.min(enCok, Math.max(EN_AZ, h0 + m.clientY - y0)));
    const bitir = () => {
      tutamak.removeEventListener("pointermove", hareket);
      tutamak.removeEventListener("pointerup", bitir);
      tutamak.removeEventListener("pointercancel", bitir);
      document.body.classList.remove("boyutlaniyor-dikey");
    };
    document.body.classList.add("boyutlaniyor-dikey");
    tutamak.addEventListener("pointermove", hareket);
    tutamak.addEventListener("pointerup", bitir);
    tutamak.addEventListener("pointercancel", bitir);
  };

  const klavye = (e: KeyboardEvent) => {
    if ((e.key !== "ArrowDown" && e.key !== "ArrowUp") || !kutu.current) return;
    e.preventDefault();
    const h = kutu.current.getBoundingClientRect().height + (e.key === "ArrowDown" ? 40 : -40);
    setTam(false);
    setYukseklik(Math.min(tamYukseklik(kutu.current), Math.max(EN_AZ, h)));
  };

  return (
    <div className="boyutlu-editor">
      <div
        ref={kutu}
        className={`kod-editor${sinif ? ` ${sinif}` : ""}${tam ? " tam" : ""}`}
        style={!tam && yukseklik ? { height: yukseklik } : undefined}
      >
        {children}
      </div>
      <div className="editor-alt">
        <div
          className="editor-tutamak"
          role="separator"
          aria-orientation="horizontal"
          aria-label={etiket}
          tabIndex={0}
          title="Sürükleyerek boyutlandır"
          onPointerDown={surukle}
          onKeyDown={klavye}
          onDoubleClick={() => (setTam(false), setYukseklik(null))}
        />
        <button className="baglanti-dugme" onClick={() => setTam(!tam)} aria-pressed={tam}>
          {tam ? "Küçült" : "Tümünü göster"}
        </button>
      </div>
    </div>
  );
}
