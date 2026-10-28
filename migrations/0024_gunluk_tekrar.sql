-- Hesaba kaydedilen günlük tekrar sayısı (0 sınırsız); NULL ise varsayılan (20)
ALTER TABLE users ADD COLUMN gunluk_tekrar INTEGER;
