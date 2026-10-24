# FPGA Pratik

FPGA dersi için açık kaynaklı, ücretsiz bir VHDL pratik sitesi.

**Site:** [fpga.selcukdinc.dev](https://fpga.selcukdinc.dev) (yayında)

Kurulum yok, üyelik yok. Siteyi aç, VHDL yaz, simüle et, soruları çöz.

## Neler var?

- **Tarayıcıda VHDL:** Sözdizimi kontrolü ve simülasyon, WebAssembly'ye derlenmiş
  [NVC](https://github.com/nickg/nvc) ile doğrudan tarayıcında çalışır.
- **Dalga görüntüleyici:** Sinyalleri zaman ekseninde incele; sayısal sinyalleri
  analog gösterimle (örneğin üçgen dalga) de görebilirsin.
- **Haftalara göre soru havuzu:** Doğru/yanlış, şıklı ve boşluk doldurma soruları.
  Geçmiş sınav soruları `Orijinal`, aynı mantıkla hazırlananlar `Türetilmiş` etiketlidir.
- **Konu bazlı ilerleme:** Hangi konuda ne kadar doğru yaptığını görürsün, eksik
  konular en üstte çıkar.
- **Misafir kullanım:** Kayıt olmadan hemen başlayabilirsin.

## Gizlilik

- Reklam yok.
- Analitik ya da takip çerezi yok.
- Yalnızca ilk cevabını gönderdiğinde ilerlemeni tutmak için tek bir oturum çerezi yazılır.
- Yazdığın VHDL kodu tarayıcından hiç çıkmaz; simülasyon tamamen senin cihazında çalışır.

## Katkıda bulun

- **Yanlış soru ya da hata mı gördün?** [Yeni bir issue aç](https://github.com/selcukdinc/fpga-pratik/issues/new).
  Hangi soru olduğunu (hafta ve sorunun metni) ve neyin yanlış olduğunu yazman yeterli.
- **Soru önermek ister misin?** Yine bir [issue](https://github.com/selcukdinc/fpga-pratik/issues/new)
  açıp soruyu, doğru cevabı ve hangi haftanın konusu olduğunu yaz. Geçmiş sınavdan
  geliyorsa bunu da belirt.
- **Beğendiysen** depoya yıldız vermeyi unutma, başkalarının bulmasına yardımcı olur.

## Geliştiriciler için

Gereksinim: Node.js 22.12 veya üstü (22 ya da 24 LTS önerilir).

```sh
npm install
npm run db:migrate:local   # yerel veritabanına şema ve örnek sorular
npm run dev                # http://localhost:5173
npm test
```

Yerelde kayıt ve parola sıfırlamayı denemek için proje kökünde `.dev.vars`
dosyası oluşturup `EPOSTA_KONSOL=1` yaz. Doğrulama kodları e-posta yerine
`npm run dev` çıktısına düşer.

Yayındaki Worker için ayarlar:

| Ad              | Nasıl eklenir | Açıklama |
|-----------------|---------------|----------|
| `RESEND_API_KEY` | `npx wrangler secret put RESEND_API_KEY` | Doğrulama e-postaları için. Yoksa kayıt ve parola sıfırlama kapalı kalır. |
| `MAIL_FROM`      | `wrangler.jsonc` içinde `vars` | Gönderen adresi. Varsayılan `FPGA Pratik <noreply@fpga.selcukdinc.dev>`. |
| `PBKDF2_ITER`    | `wrangler.jsonc` içinde `vars` | Parola özeti yineleme sayısı (10.000 ile 100.000 arası). Varsayılan 50.000, ücretsiz plandaki 10 ms CPU sınırına göre seçildi. Artırılırsa eski özetler kullanıcı giriş yaptığında yenilenir. |

| Klasör          | İçerik |
|-----------------|--------|
| `src/`          | Arayüz: Vite + React + CodeMirror 6 |
| `src/sim/`      | Simülatörü Web Worker içinde çalıştıran kod, VCD okuyucu |
| `sim/nvc-wasm/` | NVC'yi WebAssembly'ye derleme betiği ve yamaları |
| `worker/`       | API: Cloudflare Worker + Hono |
| `migrations/`   | Cloudflare D1 şeması ve örnek sorular |
| `shared/`       | Arayüz ve API'nin ortak kodu; puanlama sunucuda yapılır, doğru cevaplar istemciye gönderilmez |

## Lisans

[GPL-3.0-or-later](LICENSE).

Simülatör olarak [NVC](https://github.com/nickg/nvc) (Nick Gasson ve katkıcıları,
GPL-3.0) kullanılır. WebAssembly derlemesinin kaynağı ve yamaları `sim/nvc-wasm/` altındadır.
