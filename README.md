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
| `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` | `wrangler.jsonc` içinde `vars` | İsteğe bağlı. Tanımlıysa `/api/yonetim` istekleri Cloudflare Access belirteci de ister (aşağıya bakın). |
| `PBKDF2_ITER`    | `wrangler.jsonc` içinde `vars` | Parola özeti yineleme sayısı (10.000 ile 100.000 arası). Varsayılan 50.000, ücretsiz plandaki 10 ms CPU sınırına göre seçildi. Artırılırsa eski özetler kullanıcı giriş yaptığında yenilenir. |

| Klasör          | İçerik |
|-----------------|--------|
| `src/`          | Arayüz: Vite + React + CodeMirror 6 |
| `src/sim/`      | Simülatörü Web Worker içinde çalıştıran kod, VCD okuyucu |
| `sim/nvc-wasm/` | NVC'yi WebAssembly'ye derleme betiği ve yamaları |
| `worker/`       | API: Cloudflare Worker + Hono |
| `migrations/`   | Cloudflare D1 şeması ve örnek sorular |
| `shared/`       | Arayüz ve API'nin ortak kodu; puanlama sunucuda yapılır, doğru cevaplar istemciye gönderilmez |

### Yönetim paneli

`/yonetim` sadece `role = 'admin'` olan hesaplara açıktır. İlk yöneticiyi bir kez elle ata:

```sh
npx wrangler d1 execute fpga-pratik --remote --command "UPDATE users SET role = 'admin' WHERE username = '<ad>'"
```

İkinci bir kapı olarak Cloudflare Access (ücretsiz plan, 50 kullanıcıya kadar) önerilir:

1. Cloudflare panelinde **Zero Trust → Access → Applications → Add an application → Self-hosted**.
2. Uygulama alan adı olarak `fpga.selcukdinc.dev` gir, yol olarak `yonetim*` ekle; aynı uygulamaya ikinci bir hedef olarak `api/yonetim*` yolunu da ekle.
3. Politika: **Allow**, **Include → Emails** ve yönetici e-postası. Giriş yöntemi olarak "One-time PIN" yeterli.
4. Uygulamanın **Application Audience (AUD) Tag** değerini kopyala. `wrangler.jsonc` içindeki `vars` bölümüne
   `ACCESS_TEAM_DOMAIN` (ör. `takimin.cloudflareaccess.com`) ve `ACCESS_AUD` olarak ekleyip yeniden yayınla.

Bu iki değer tanımlıyken Worker, Access belirtecindeki e-postanın yönetici hesabının e-postasıyla aynı olduğunu da kontrol eder.

## Lisans

[GPL-3.0-or-later](LICENSE).

Simülatör olarak [NVC](https://github.com/nickg/nvc) (Nick Gasson ve katkıcıları,
GPL-3.0) kullanılır. WebAssembly derlemesinin kaynağı ve yamaları `sim/nvc-wasm/` altındadır.
