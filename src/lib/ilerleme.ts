import type { IlerlemeAyrintisi } from "../../shared/api";

type Gun = IlerlemeAyrintisi["takvim"][number];

// Deneme sayısını 0-4 basamağına çevirir; basamaklar o dönemin en yüksek gününe göre
export function basamak(n: number, enCok: number) {
  if (!n) return 0;
  return Math.min(4, Math.max(1, Math.ceil((n / enCok) * 4)));
}

// Bugünden geriye, en az bir deneme yapılan ardışık günler (bugün boşsa dünden başlar)
export function seri(takvim: Gun[]) {
  let i = takvim.length - 1;
  if (i >= 0 && !takvim[i]!.deneme) i--;
  let n = 0;
  for (; i >= 0 && takvim[i]!.deneme; i--) n++;
  return n;
}
