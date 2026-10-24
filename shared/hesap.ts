// Hesap alanlarının kuralları. İstemci anlık geri bildirim için, Worker son
// karar için aynı fonksiyonları kullanır.

export const KULLANICI_ADI = /^[a-z0-9_]{3,20}$/;

// Sitenin kendi sayfa ya da rol adlarıyla karışabilecek adlar
const AYRILMIS = new Set([
  "admin", "administrator", "yonetici", "yonetim", "root", "sistem", "system", "api", "destek", "support",
  "moderator", "mod", "fpga", "fpgapratik", "pratik", "sorular", "profil", "ayarlar", "giris", "kayit",
  "misafir", "guest", "anonim", "null", "undefined", "claude", "noreply",
]);

export function kullaniciAdiHatasi(ad: string): string | null {
  if (ad.length < 3) return "En az 3 karakter olmalı.";
  if (ad.length > 20) return "En fazla 20 karakter olabilir.";
  if (!KULLANICI_ADI.test(ad)) return "Sadece küçük harf (a-z), rakam ve _ kullanılabilir.";
  if (AYRILMIS.has(ad)) return "Bu ad ayrılmış, başka bir ad seç.";
  return null;
}

export function epostaHatasi(eposta: string): string | null {
  if (eposta.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)) return "Geçerli bir e-posta adresi yaz.";
  return null;
}

export const PAROLA_EN_AZ = 10;
export const PAROLA_EN_FAZLA = 200;

// En sık kullanılan parolalardan ve klavye dizilerinden birkaçı. Tam bir liste
// değil, sadece en bariz seçimleri yakalar.
const YAYGIN = [
  "1234567890", "0123456789", "qwertyuiop", "asdfghjkl", "password", "parola", "sifre", "şifre",
  "123456789", "abcdefgh", "iloveyou", "galatasaray", "fenerbahce", "besiktas", "trabzonspor", "fpga", "vhdl",
  "qwerty", "111111", "000000",
];

export interface ParolaGucu {
  seviye: 0 | 1 | 2 | 3; // 0: kabul edilmez, 1: zayıf, 2: orta, 3: güçlü
  ipucu: string | null;
}

export function parolaGucu(parola: string, ilgili: string[] = []): ParolaGucu {
  if (parola.length < PAROLA_EN_AZ) return { seviye: 0, ipucu: `En az ${PAROLA_EN_AZ} karakter olmalı.` };
  if (parola.length > PAROLA_EN_FAZLA) return { seviye: 0, ipucu: `En fazla ${PAROLA_EN_FAZLA} karakter olabilir.` };

  const kucuk = parola.toLocaleLowerCase("tr");
  if (new Set(parola).size <= 2) return { seviye: 0, ipucu: "Aynı karakterlerin tekrarından oluşuyor." };
  for (const s of ilgili) {
    if (s.length >= 3 && kucuk.includes(s.toLocaleLowerCase("tr"))) {
      return { seviye: 0, ipucu: "Kullanıcı adını ya da e-postanı içermemeli." };
    }
  }

  let puan = 0;
  const siniflar = [/[a-zçğıöşü]/, /[A-ZÇĞİÖŞÜ]/, /[0-9]/, /[^A-Za-z0-9çğıöşüÇĞİÖŞÜ]/].filter((r) => r.test(parola)).length;
  puan += siniflar - 1;
  if (parola.length >= 14) puan++;
  if (parola.length >= 18) puan++;

  let ipucu: string | null = null;
  if (YAYGIN.some((y) => kucuk.includes(y))) {
    puan -= 2;
    ipucu = "Çok bilinen bir parola ya da klavye dizisi içeriyor.";
  } else if (/^\d+$/.test(parola)) {
    puan -= 1;
    ipucu = "Sadece rakamlardan oluşuyor.";
  } else if (/(.)\1\1/.test(parola)) {
    puan -= 1;
    ipucu = "Aynı karakter art arda tekrar ediyor.";
  } else if (siniflar < 3 && parola.length < 14) {
    ipucu = "Daha uzun yaz ya da büyük harf, rakam veya simge ekle.";
  }

  const seviye = puan <= 0 ? 1 : puan <= 2 ? 2 : 3;
  if (seviye === 3) ipucu = null;
  return { seviye, ipucu };
}

// Sunucu yalnızca kabul edilmeyen (seviye 0) parolaları reddeder
export function parolaHatasi(parola: string, ilgili: string[] = []): string | null {
  const g = parolaGucu(parola, ilgili);
  return g.seviye === 0 ? g.ipucu : null;
}

export const KOD_GECERLILIK_DK = 15;
export const KOD_DENEME = 5;
export const KOD_TEKRAR_SN = 60;
export const KULLANICI_ADI_DEGISIM_GUN = 30;
