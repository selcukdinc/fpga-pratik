// Kişisel motivasyon: günlük hedef, takvimdeki alev basamakları, seriler ve rozetler.
// Herkes yalnızca kendi durumunu görür; sıralama ya da karşılaştırma yoktur.

export const VARSAYILAN_HEDEF = 10;
export const HEDEF_SECENEKLERI = [0, 5, 10, 20, 30, 50];

// Bir günde doğru cevap sayısına göre takvim süsü
export const KIVILCIM = 10;
export const PARILTI = 25;
export const ALEV = 50;

export type GunSusu = "kivilcim" | "parilti" | "alev" | null;

export function gunSusu(dogru: number): GunSusu {
  if (dogru >= ALEV) return "alev";
  if (dogru >= PARILTI) return "parilti";
  if (dogru >= KIVILCIM) return "kivilcim";
  return null;
}

// Doğru bir cevaptan sonra bugünün durumu; hedefe ya da alev eşiğine tam o cevapla ulaşıldıysa kutlanır
export interface GunlukDurum {
  dogru: number;
  hedef: number;
}

export type Kutlama = "hedef" | "alev";

export function kutlama(d: GunlukDurum): Kutlama | null {
  if (d.dogru === ALEV) return "alev";
  if (d.hedef > 0 && d.dogru === d.hedef) return "hedef";
  return null;
}

export interface Seriler {
  // Bugün ya da dün biten ardışık çalışma günleri
  simdi: number;
  enUzun: number;
}

const gunNo = (gun: string) => Math.round(Date.parse(`${gun}T00:00:00Z`) / 86_400_000);

// gunler: çalışılan günler (YYYY-AA-GG, sırasız olabilir); bugun aynı biçimde
export function seriler(gunler: string[], bugun: string): Seriler {
  const nolar = [...new Set(gunler.map(gunNo))].sort((a, b) => a - b);
  let enUzun = 0;
  let uzunluk = 0;
  for (let i = 0; i < nolar.length; i++) {
    uzunluk = i > 0 && nolar[i] === nolar[i - 1]! + 1 ? uzunluk + 1 : 1;
    enUzun = Math.max(enUzun, uzunluk);
  }
  const son = nolar[nolar.length - 1];
  const b = gunNo(bugun);
  const simdi = son !== undefined && b - son <= 1 ? uzunluk : 0;
  return { simdi, enUzun };
}

export interface RozetGirdisi {
  enUzunSeri: number;
  alevGunleri: number;
  hedefGunleri: number;
  cozulen: number;
  toplam: number;
}

export interface Rozet {
  id: string;
  ad: string;
  aciklama: string;
  ikon: string;
  ilerleme: number;
  esik: number;
}

export function rozetler(g: RozetGirdisi): Rozet[] {
  return [
    { id: "seri-7", ad: "Bir hafta", aciklama: "7 gün üst üste çalış", ikon: "📅", ilerleme: g.enUzunSeri, esik: 7 },
    { id: "seri-30", ad: "Bir ay", aciklama: "30 gün üst üste çalış", ikon: "🗓️", ilerleme: g.enUzunSeri, esik: 30 },
    { id: "seri-100", ad: "Yüz gün", aciklama: "100 gün üst üste çalış", ikon: "🏆", ilerleme: g.enUzunSeri, esik: 100 },
    { id: "hedef-10", ad: "Hedef avcısı", aciklama: "Günlük hedefine 10 farklı günde ulaş", ikon: "🎯", ilerleme: g.hedefGunleri, esik: 10 },
    { id: "alev", ad: "Alev aldı", aciklama: `Bir günde ${ALEV} doğru cevap ver`, ikon: "🔥", ilerleme: g.alevGunleri, esik: 1 },
    { id: "hepsi", ad: "Tam liste", aciklama: "Havuzdaki her soruyu en az bir kez doğru çöz", ikon: "🎓", ilerleme: g.cozulen, esik: Math.max(1, g.toplam) },
  ];
}
