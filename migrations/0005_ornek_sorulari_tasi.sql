-- 0002'deki örnek sorular 0004'te gelen konu düzenine taşınıyor
UPDATE questions SET week = 3, difficulty = 1, source_ref = 'Hafta 3, Entity ve architecture' WHERE id = 'tf-entity-port';
UPDATE questions SET topic_id = 'nitelikler', week = 3, difficulty = 2, source_ref = 'Hafta 3, Sinyal öznitelikleri',
  payload = '{"choices": ["`if clk = ''1'' then`", "`if rising_edge(clk) then`", "`if clk''event then`", "`wait for clk;`"]}'
  WHERE id = 'mcq-rising-edge';
UPDATE questions SET week = 4, difficulty = 1, source_ref = 'Hafta 4, Signed ve unsigned',
  payload = '{"choices": ["`ieee.std_logic_arith`", "`ieee.std_logic_unsigned`", "`ieee.numeric_std`", "`std.textio`"]}'
  WHERE id = 'mcq-numeric-std';
UPDATE questions SET week = 4, difficulty = 1, source_ref = 'Hafta 4, Tip dönüşümleri' WHERE id = 'fill-unsigned-add';
