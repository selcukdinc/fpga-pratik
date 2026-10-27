// Soru metnini kod bloklarının önü, kendisi ve arkası olarak ayırır; geniş
// ekranda kod sağ sütuna geçer. Kod blokları arasında yazı varsa ayrılmaz,
// yoksa okuma sırası bozulurdu.
const KOD_BLOGU = /```(?:vhdl)?\n?([\s\S]*?)```/g;
export function koduAyir(metin: string): { once: string; kod: string; sonra: string } | null {
  const parcalar = metin.replace(/\\n/g, "\n").split(KOD_BLOGU);
  if (parcalar.length < 3) return null;
  for (let i = 2; i < parcalar.length - 1; i += 2) if (parcalar[i]!.trim()) return null;
  const kodlar = parcalar.filter((_, i) => i % 2 === 1).map((k) => "```\n" + k + "```");
  return { once: parcalar[0]!, kod: kodlar.join("\n\n"), sonra: parcalar[parcalar.length - 1]! };
}
