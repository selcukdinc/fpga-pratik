import { gorselBul } from "../gorseller";

// Ders metnindeki [[G-H1-01]] satırlarının yerine konan şekil
export function Sekil({ kod }: { kod: string }) {
  const g = gorselBul(kod);
  if (!g) return null;
  return (
    <figure className="sekil" id={`sekil-${kod}`}>
      <div className="sekil-kutu">
        <svg viewBox={`0 0 ${g.en} ${g.boy}`} role="img" aria-label={`${g.baslik}. ${g.aciklama}`} dangerouslySetInnerHTML={{ __html: g.icerik }} />
      </div>
      <figcaption>
        <span className="sekil-kod">{g.kod}</span> {g.baslik}
      </figcaption>
    </figure>
  );
}
