-- Üyenin günlük doğru cevap hedefi; 0 hedefi kapatır
ALTER TABLE users ADD COLUMN gunluk_hedef INTEGER NOT NULL DEFAULT 10;
