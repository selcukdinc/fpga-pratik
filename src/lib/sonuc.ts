// Sonuç cümlesi "Doğru" tek başına kalmasın: doğru/yanlış sorularında hem
// "cevabın doğru" hem "ifade doğru" diye okunabiliyordu
export function sonucCumlesi(tip: string, dogru: boolean, tf: boolean | null, bosluklar: boolean[] | undefined, dogruBosluk: number): string {
  if (tip === "tf" && tf !== null) {
    const ifade = dogru === tf ? "doğru" : "yanlış";
    return `${dogru ? "Cevabın doğru" : "Cevabın yanlış"}: bu ifade ${ifade}.`;
  }
  if (dogru) return "Cevabın doğru";
  if (bosluklar && bosluklar.length > 1 && dogruBosluk > 0) return `Kısmen doğru: ${bosluklar.length} boşluktan ${dogruBosluk} tanesi doğru`;
  return "Cevabın yanlış";
}
