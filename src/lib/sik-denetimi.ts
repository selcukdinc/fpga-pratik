// Çoktan seçmeli soruların şıkları adil mi: İngilizce ya da açıklayıcı parantez
// yalnız bazı şıklarda olmasın, doğru şık açıklamayı içinde taşıyıp
// çeldiricilerden belirgin uzun olmasın. Kod içeren şıklar (`...` ya da ~...~)
// parantez denetiminin dışında. Soru havuzu testi ve soru formları kullanır.

const kodlu = (s: string) => /[`~]/.test(s);
// Formüllerdeki parantezler sayılmaz: içinde en az 3 harflik bir kelime olan, işlem işareti olmayan parantez
const parantezli = (s: string) => /\((?=[^)]*[a-zçğıöşü]{3})[^)·+'=<]*\)/i.test(s);

export function sikUyarilari(secenekler: string[], dogru: number): string[] {
  const uyarilar: string[] = [];
  const dolu = secenekler.filter((x) => x.trim());
  if (dolu.length < 2) return uyarilar;
  if (!dolu.some(kodlu)) {
    const p = dolu.map(parantezli);
    if (p.some(Boolean) && !p.every(Boolean)) uyarilar.push("Parantez içindeki açıklama ya da İngilizce karşılık yalnız bazı şıklarda var; ya hepsine ekle ya da hiçbirine.");
  }
  const d = secenekler[dogru] ?? "";
  const enUzun = Math.max(...secenekler.filter((x, i) => i !== dogru && x.trim()).map((x) => x.length));
  if (!kodlu(d) && d.length > 40 && d.length > enUzun * 1.35) {
    uyarilar.push("Doğru şık çeldiricilerden belirgin uzun; uzunluğu ipucu vermesin, ayrıntıyı açıklamaya taşı.");
  }
  return uyarilar;
}
