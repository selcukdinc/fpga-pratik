# FPGA Pratik

FPGA dersi için açık kaynaklı VHDL pratik sitesi: **fpga.selcukdinc.dev**

- **Simülasyon alanı:** Vivado'ya benzeyen arayüzde VHDL yaz, sözdizimini kontrol
  et, simülasyonu çalıştır, dalgaları (üçgen dalga dahil analog gösterimle) incele.
  Her şey tarayıcında, WebAssembly'ye derlenmiş [NVC](https://github.com/nickg/nvc)
  ile çalışır; kodun sunucuya gitmez.
- **Soru havuzu:** Doğru/yanlış, şıklı, boşluk doldurma (yakında: kod yazma ve
  dalga okuma). Sorular haftalara bağlıdır; işlenen son haftaya kadar olanlar açılır.
  Geçmiş sınav soruları `Orijinal`, aynı mantıkla üretilenler `Türetilmiş` etiketlidir.
- **İlerleme:** Konu bazlı doğru oranı, eksik konular üstte.
- **Gizlilik:** Reklam yok, analitik ya da takip çerezi yok. Yalnızca ilk cevapta
  ilerlemeyi tutmak için tek bir oturum çerezi yazılır.

Bir hata ya da yanlış soru gördüysen [sorun bildir](https://github.com/selcukdinc/fpga-pratik/issues/new).
Beğendiysen depoyu yıldızlayabilirsin.

## Mimari

| Katman        | Teknoloji |
|---------------|-----------|
| Arayüz        | Vite + React + CodeMirror 6, `src/` |
| Simülatör     | NVC → WebAssembly, Web Worker içinde (`src/sim/`, `sim/nvc-wasm/`) |
| API           | Cloudflare Worker + Hono (`worker/`) |
| Veritabanı    | Cloudflare D1 (`migrations/`) |
| Puanlama      | Sunucuda (`shared/grade.ts`); doğru cevaplar istemciye gönderilmez |

## Geliştirme

```sh
npm install
npm run db:migrate:local   # yerel D1'e şema ve örnek sorular
npm run dev                # http://localhost:5173
npm test
```

## Yayına alma (fpga.selcukdinc.dev)

1. `npx wrangler login`
2. `npx wrangler d1 create fpga-pratik` ve çıktıdaki `database_id`'yi `wrangler.jsonc` içine yaz.
3. `npm run db:migrate:remote`
4. `wrangler.jsonc` içindeki `routes` satırının yorumunu kaldır.
5. `npm run deploy`

`selcukdinc.dev` zaten Cloudflare'de olduğu için `custom_domain: true` ile DNS kaydı ve
sertifika otomatik oluşturulur; ana site etkilenmez. Aynı işlem panelden de yapılabilir:
Workers & Pages → fpga-pratik → Settings → Domains & Routes → Add → Custom Domain.

## Lisans

[GPL-3.0-or-later](LICENSE). Simülatör olarak kullanılan NVC de GPL-3.0 lisanslıdır;
WebAssembly derlemesinin kaynağı ve yamaları `sim/nvc-wasm/` altındadır.
