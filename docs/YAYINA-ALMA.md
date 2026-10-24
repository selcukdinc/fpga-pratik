# Yayına alma (fpga.selcukdinc.dev)

Bu adımlar sitenin sahibinin Cloudflare hesabı içindir. Kendi hesabında denemek
istersen alan adını ve veritabanı adını kendine göre değiştir.

1. Cloudflare'e giriş yap:

   ```sh
   npx wrangler login
   ```

2. Veritabanını oluştur (bir kez):

   ```sh
   npx wrangler d1 create fpga-pratik
   ```

   Çıktıdaki `database_id` değerini `wrangler.jsonc` içindeki `d1_databases` kaydına yaz.
   Var olan id'yi görmek için: `npx wrangler d1 list`.

3. Şemayı ve örnek soruları uzaktaki veritabanına uygula:

   ```sh
   npm run db:migrate:remote
   ```

   Bekleyen migration'ları önce görmek için:
   `npx wrangler d1 migrations list fpga-pratik --remote`.

4. Alan adını aç: `wrangler.jsonc` içindeki `routes` satırı şöyle olmalı:

   ```jsonc
   "routes": [{ "pattern": "fpga.selcukdinc.dev", "custom_domain": true }]
   ```

   `selcukdinc.dev` zaten Cloudflare'de olduğu için `custom_domain: true` ile DNS kaydı
   ve sertifika otomatik oluşturulur; ana site etkilenmez. Aynı işlem panelden de
   yapılabilir: Workers & Pages → fpga-pratik → Settings → Domains & Routes → Add →
   Custom Domain.

5. Derle ve yayınla:

   ```sh
   npm run deploy
   ```
