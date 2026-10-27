export interface Gorsel {
  kod: string;
  baslik: string;
  // Ekran okuyucular için şeklin anlattığı
  aciklama: string;
  en: number;
  boy: number;
  // Şeklin SVG içeriği. Etkileşimli şekillerde varsayılan değerlerle çizilmiş hali;
  // yönetim listesinde ve ekran okuyucu açıklamasıyla birlikte bu gösterilir.
  icerik: string;
  // Etkileşimli şekiller: src/components/etkilesim içindeki bileşenin adı
  etkilesim?: string;
}
