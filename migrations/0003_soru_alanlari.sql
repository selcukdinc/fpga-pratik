-- Soru havuzu için yeni alanlar ve ayarlar
ALTER TABLE questions ADD COLUMN difficulty INTEGER NOT NULL DEFAULT 1;
ALTER TABLE questions ADD COLUMN source_ref TEXT;

-- Orijinal (sunumdan gelen) soruları tek seferde gizlemek için: '0' gizler
INSERT INTO settings (key, value) VALUES ('show_original', '1')
  ON CONFLICT(key) DO NOTHING;

-- Sunumlar Hafta 5'e kadar geldi
UPDATE settings SET value = '5' WHERE key = 'current_week';
