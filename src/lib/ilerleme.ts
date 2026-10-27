// Deneme sayısını 0-4 basamağına çevirir; basamaklar o dönemin en yüksek gününe göre
export function basamak(n: number, enCok: number) {
  if (!n) return 0;
  return Math.min(4, Math.max(1, Math.ceil((n / enCok) * 4)));
}

