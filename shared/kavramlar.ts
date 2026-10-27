// Her soru tek bir kavrama bağlanır. Aralıklı tekrarda bir soruyu yanlış yapan
// kişiye aynı kavramdan henüz çözmediği sorular da eklenir. Kavramlar konulardan
// daha dardır ve haftaları aşabilir (ör. port modları 3. ve 4. haftada).

export interface Kavram {
  ad: string;
  sorular: string[];
}

export const KAVRAMLAR: Record<string, Kavram> = {
  "fpga-yapi": { ad: "FPGA'nın yapısı ve tarihçesi", sorular: ["h1-fpga-acilim", "h2-fpga-yapi", "h2-cpld", "h2-tarihce-sira"] },
  "fpga-asic": {
    ad: "FPGA ve ASIC karşılaştırması",
    sorular: ["h1-fpga-asic-nre", "h1-asic-seri-uretim", "h1-fpga-guncelleme", "h1-asic-analog", "h1-prototip", "h1-esneklik-verim"],
  },
  "fpga-cpu": { ad: "FPGA ve işlemci", sorular: ["h1-fpga-cpu-paralel", "h1-fpga-cpu-avantaj"] },
  "entegre-olcek": { ad: "Entegre devre ölçekleri", sorular: ["h1-entegre-olcek", "h1-7400-ssi"] },
  "pld-diziler": {
    ad: "PROM, PAL, PLA dizileri",
    sorular: ["h2-prom-dizi", "h2-pal-dizi", "h2-pla-dizi", "h2-pal-pla-paylasim", "h2-prom-terim"],
  },
  "pla-tasarim": { ad: "PLA ile fonksiyon gerçekleme", sorular: ["h2-pla-fonksiyon", "h2-pla-terim-sayisi"] },
  "lut-clb": { ad: "CLB ve LUT", sorular: ["h2-clb-lut", "h2-lut-bit"] },
  "tasarim-akisi": { ad: "Tasarım akışı", sorular: ["h2-akis-sira", "h2-sentez", "h2-yonlendirme", "h2-simulasyon-amac"] },
  modelleme: { ad: "Yapısal ve davranışsal modelleme", sorular: ["h2-modelleme-yapisal", "h2-modelleme-kod"] },
  vivado: { ad: "Vivado kullanımı", sorular: ["h2-vivado-rtl", "h2-vivado-parca"] },
  "vhdl-yapi": { ad: "library, entity, architecture", sorular: ["h3-uc-bolum", "h3-std-work", "h3-architecture-of", "h3-entity-hata"] },
  "port-modlari": { ad: "Port modları", sorular: ["h3-port-inout", "h3-out-okuma", "h4-out-okuma-cozum"] },
  toplayici: {
    ad: "Yarım ve tam toplayıcı",
    sorular: ["h3-yarim-toplayici", "h3-yarim-toplayici-kod", "h3-tam-toplayici", "h3-tam-toplayici-cout", "k-yarim-toplayici", "k-tam-toplayici"],
  },
  "mantik-operatorleri": { ad: "Mantık operatörleri ve öncelik", sorular: ["h3-not-oncelik", "h3-karisik-op", "h3-nand-zincir"] },
  "mod-rem": {
    ad: "mod, rem ve bölme",
    sorular: ["h3-mod-rem-pozitif", "h3-mod-rem-negatif-bolen", "h3-mod-rem-negatif-bolunen", "h3-mod-rem-isaret", "h3-bolme-sentez"],
  },
  "aritmetik-tasma": { ad: "Toplama, çıkarma ve taşma", sorular: ["h3-ornek3", "h3-ornek3-tasma"] },
  "numeric-std-islem": {
    ad: "Hangi tipte hangi işlem yapılır",
    sorular: ["h3-slv-toplama", "h4-slv-toplama", "h4-bit-toplama", "h4-unsigned-and"],
  },
  karsilastirma: { ad: "Karşılaştırma operatörleri", sorular: ["h3-esit-degil", "h3-kucuk-esit", "k-karsilastirici"] },
  "kaydirma-birlestirme": { ad: "Kaydırma ve birleştirme", sorular: ["h3-kaydirma", "h3-birlestirme"] },
  "others-atama": { ad: "others ile toplu atama", sorular: ["h3-others-to", "h5-others-hepsi", "h5-others-karisik"] },
  "dizi-nitelikleri": { ad: "Dizi nitelikleri ('LEFT, 'RANGE...)", sorular: ["h3-attr-downto", "h3-attr-to", "h3-attr-reverse", "h3-attr-dongu"] },
  "sinyal-nitelikleri": {
    ad: "Sinyal nitelikleri ve kenar algılama",
    sorular: ["h3-kenar-algilama", "h3-sentezlenebilir-nitelik", "h3-last-value"],
  },
  "enum-nitelikleri": { ad: "Sayım tipleri ve 'POS / 'VAL", sorular: ["h3-enum-encoding", "h3-pos-val"] },
  generic: { ad: "GENERIC", sorular: ["h3-generic-atama", "h3-generic-yer", "h3-generic-genislik"] },
  "kullanici-nitelik": { ad: "Kullanıcı nitelikleri ve aşırı yükleme", sorular: ["h3-overload", "h3-kullanici-nitelik"] },
  "atama-zamani": {
    ad: "Sinyal ve değişkenin ne zaman güncellendiği",
    sorular: ["h3-atama-variable", "h4-signal-guncelleme", "h4-variable-guncelleme", "h4-uc-atama", "h4-birler-signal", "h4-nand-signal-sabit"],
  },
  "variable-kullanim": {
    ad: "Değişkenin yeri ve kullanımı",
    sorular: ["h4-variable-yer", "h4-variable-disarida", "h5-variable-yeri", "h4-nand-variable", "h4-nand-variable-2", "h4-birler-variable", "k-birler"],
  },
  tanimlayicilar: { ad: "İsimlendirme kuralları", sorular: ["h4-isim-gecerli", "h4-isim-gecersiz", "h4-anahtar-sozcuk"] },
  "std-logic-degerleri": { ad: "std_logic değerleri", sorular: ["h4-std-ulogic-deger", "h4-u-degeri"] },
  cozumleme: { ad: "Çok sürücü ve çözümleme", sorular: ["h4-cozumleme", "h4-ulogic-coklu", "h4-multiple-driven"] },
  "vektor-indeks": { ad: "Vektör indeksleri ve dilimler", sorular: ["h4-to-indeks", "h4-hafta4-3-d", "h4-hafta4-3-e"] },
  "sayi-tabani": { ad: "Sayı tabanları ve bit dizgileri", sorular: ["h4-hex-oktal", "h4-sayi-tabani", "h4-alt-cizgi"] },
  "signed-unsigned": { ad: "signed ve unsigned", sorular: ["h4-signed-deger", "h4-signed-karsilastirma"] },
  "tip-donusumu": {
    ad: "Tip dönüşümleri",
    sorular: ["h4-to-integer", "h4-tek-bit-to-integer", "h4-bit-vektor-hilesi", "h4-shift-and-add"],
  },
  "tip-uyumu": { ad: "Tip uyumu ve alt tipler", sorular: ["h4-tip-uyumu", "h4-subtype-atama", "h4-subtype-aralik"] },
  "integer-aralik": { ad: "integer aralıkları ve bit sayısı", sorular: ["h4-integer-bit", "h4-aralik-disi", "h4-carpim-aralik"] },
  diziler: { ad: "Dizi tipleri", sorular: ["h4-dizi-atama", "h4-2d-erisim", "h4-bellek-tipi", "h4-port-dizisi"] },
  "with-select": {
    ad: "with/select",
    sorular: ["h5-with-select-mux", "h5-with-others-zorunlu", "h5-select-tekrar", "h5-secilmis-x", "k-mux4"],
  },
  "when-else": {
    ad: "when/else ve öncelik",
    sorular: ["h5-when-else-latch", "h5-oncelikli-mux-or", "h5-oncelikli-secim", "h5-select-oncelik", "h5-kosullu-z", "k-oncelik"],
  },
  "process-hassasiyet": { ad: "process ve hassasiyet listesi", sorular: ["h5-process-tetik", "h5-eksik-hassasiyet", "h5-wait-liste"] },
  "if-case": { ad: "if ve case", sorular: ["h5-if-oncelik", "h5-case-others", "h5-case-sinyal"] },
  donguler: { ad: "Döngüler", sorular: ["h5-for-sayi", "h5-arama-modulu", "h5-for-statik"] },
  "saatli-devre": { ad: "Saatli devreler", sorular: ["k-sayac", "k-kenar", "k-dizi101"] },
};

// Soru kimliğinden kavrama
export const kavramOf = (id: string) => Object.entries(KAVRAMLAR).find(([, k]) => k.sorular.includes(id))?.[0];
