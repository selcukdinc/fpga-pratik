// VHDL için Enter'dan sonraki girinti. Yeni satır bir önceki dolu satırın
// girintisinden başlar; yalnızca blok açan satırlardan sonra bir kademe artar,
// end / else / elsif / when / begin / ")" ile başlayan satırlar bir kademe geri
// gelir. Hazır VHDL kipi "wait for" içindeki "for"u döngü sanıp fazladan
// girinti veriyordu.

// Satır sonu bu sözcüklerden biriyse arkasından gelen satır içeride başlar
const ACAN_SON = /(\bbegin|\bthen|\belse|\bloop|\bis|=>|\bgenerate|\brecord|\bselect|\bunits|\bprotected|\()$/;
// Satır başı: noktalı virgülsüz "process", "p1 : process (clk)", "component x", "block"
const ACAN_BAS = /^(\w+\s*:\s*)?(process|block|component)\b/;
// Bu sözcüklerle başlayan satır içinde bulunduğu bloğu kapatır ya da böler
const KAPATAN = /^(end\b|else\b|elsif\b|when\b|begin\b|\))/;

// Yorum ve dizgiler atılmış, küçük harfli, kırpılmış satır
export function yalinSatir(satir: string): string {
  return satir
    .replace(/"[^"]*"/g, '""')
    .replace(/--.*$/, "")
    .trim()
    .toLowerCase();
}

export function girintiSutunu(satir: string, sekme = 4): number {
  let n = 0;
  for (const c of satir) {
    if (c === " ") n++;
    else if (c === "\t") n += sekme - (n % sekme);
    else break;
  }
  return n;
}

export function blokAcar(satir: string): boolean {
  const y = yalinSatir(satir);
  if (!y || y.endsWith(";")) return false;
  return ACAN_SON.test(y) || ACAN_BAS.test(y);
}

// "end case", "end if" gibi satırlar açtıkları satırın hizasına döner
const ACANLAR: Record<string, RegExp> = {
  case: /^(\w+\s*:\s*)?case\b/,
  if: /^(\w+\s*:\s*)?if\b/,
  loop: /\bloop$/,
  process: /^(\w+\s*:\s*)?(postponed\s+)?process\b/,
  generate: /\bgenerate$/,
  block: /^\w+\s*:\s*block\b/,
  record: /\brecord$/,
  component: /^component\b/,
};

function acanSatirHizasi(onceki: string[], tur: string, sekme: number): number | null {
  const acan = ACANLAR[tur]!;
  let derinlik = 0;
  for (let i = onceki.length - 1; i >= 0; i--) {
    const y = yalinSatir(onceki[i]!);
    if (new RegExp(`^end\\s+${tur}\\b`).test(y)) derinlik++;
    else if (acan.test(y)) {
      if (derinlik === 0) return girintiSutunu(onceki[i]!, sekme);
      derinlik--;
    }
  }
  return null;
}

// onceki: yeni satırdan önceki satırlar; suanki: yeni satırın (varsa) metni
export function vhdlGirinti(onceki: string[], suanki: string, birim = 2, sekme = 4): number {
  let i = onceki.length - 1;
  while (i >= 0 && !yalinSatir(onceki[i]!)) i--;
  if (i < 0) return 0;
  const ust = onceki[i]!;
  const taban = girintiSutunu(ust, sekme);
  const acar = blokAcar(ust);
  const y = yalinSatir(suanki);
  const son = /^end\s+(\w+)/.exec(y);
  if (son && son[1]! in ACANLAR) {
    const hiza = acanSatirHizasi(onceki, son[1]!, sekme);
    if (hiza !== null) return hiza;
  }
  if (KAPATAN.test(y)) {
    // "case s is" sonrasındaki ilk "when" case'in içinde başlar
    if (/^when\b/.test(y) && /^case\b/.test(yalinSatir(ust))) return taban + birim;
    // Bir önceki satır bloğu açtıysa (process -> begin, if -> else) aynı hizada kalır
    return acar ? taban : Math.max(0, taban - birim);
  }
  return acar ? taban + birim : taban;
}
