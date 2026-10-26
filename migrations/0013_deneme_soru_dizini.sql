-- Soru başına toplu istatistik (deneyenlerin doğru oranı, şık dağılımı) için
CREATE INDEX IF NOT EXISTS attempts_soru ON attempts(question_id, user_id, id);
