-- Derslerde bitirilen bölümler ve en son okunan bölüm (JSON, shared/dersIlerleme.ts).
-- NULL: henüz kayıt yok. Misafirlerde ilerleme tarayıcıda tutulur.
ALTER TABLE users ADD COLUMN ders_ilerleme TEXT;
