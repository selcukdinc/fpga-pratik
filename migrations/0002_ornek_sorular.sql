-- Müfredat gelene kadar örnek içerik. Hepsi 'derived' (türetilmiş).
INSERT INTO settings (key, value) VALUES ('current_week', '1');

INSERT INTO topics (id, title, week, sort) VALUES
  ('vhdl-temel', 'VHDL temelleri: entity ve architecture', 1, 1),
  ('veri-tipleri', 'Veri tipleri ve numeric_std', 1, 2);

INSERT INTO questions (id, topic_id, week, type, source, prompt, payload, answer, explanation) VALUES
(
  'tf-entity-port', 'vhdl-temel', 1, 'tf', 'derived',
  'Bir `entity` bildirimi devrenin iç yapısını (nasıl çalıştığını) tanımlar.',
  '{}',
  '{"value": false}',
  '`entity` yalnızca dış arayüzü (portları) tanımlar. Devrenin davranışı ya da yapısı `architecture` içinde yazılır.'
),
(
  'mcq-numeric-std', 'veri-tipleri', 1, 'mcq', 'derived',
  'İşaretsiz aritmetik için ders notlarında önerilen standart paket hangisidir?',
  '{"choices": ["ieee.std_logic_arith", "ieee.std_logic_unsigned", "ieee.numeric_std", "std.textio"]}',
  '{"index": 2}',
  '`std_logic_arith` ve `std_logic_unsigned` Synopsys paketleridir, IEEE standardı değildir. Standart olan `ieee.numeric_std` paketidir.'
),
(
  'mcq-rising-edge', 'vhdl-temel', 1, 'mcq', 'derived',
  'Aşağıdakilerden hangisi saatin yükselen kenarını doğru şekilde algılar?',
  '{"choices": ["if clk = ''1'' then", "if rising_edge(clk) then", "if clk''event then", "wait for clk;"]}',
  '{"index": 1}',
  '`rising_edge(clk)` hem olay olduğunu hem de yeni değerin ''1'' olduğunu kontrol eder. `clk = ''1''` seviye algılar, `clk''event` iki kenarı da yakalar.'
),
(
  'fill-unsigned-add', 'veri-tipleri', 1, 'fill', 'derived',
  '`a` ve `b` `std_logic_vector(7 downto 0)` tipindedir. Toplamı `y` sinyaline atamak için boşluğu doldurun:\n\n```vhdl\ny <= std_logic_vector(____(a) + unsigned(b));\n```',
  '{"blanks": 1}',
  '{"blanks": [["unsigned"]]}',
  '`std_logic_vector` üzerinde doğrudan toplama yoktur. Önce `unsigned(...)` ile dönüştürülür, sonuç yeniden `std_logic_vector`e çevrilir.'
);
