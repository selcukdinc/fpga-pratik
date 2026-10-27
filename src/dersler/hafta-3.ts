import { UST, md, type Ders } from "./tipler";

export const HAFTA_3: Ders = {
  hafta: 3,
  baslik: "VHDL'in yapısı, operatörler ve öznitelikler",
  ozet: "Bir VHDL dosyasının üç bölümünü, operatörleri, öznitelikleri ve GENERIC ile parametreli tasarımı öğren.",
  bolumler: [
    {
      baslik: "Üç bölüm: library, entity, architecture",
      metin: md(`
Her VHDL tasarımı üç parçadan oluşur:

- **Kütüphane bildirimleri:** Kullanacağın tip ve fonksiyonların nereden geleceğini söyler. ~library ieee;~ ve ~use ieee.std_logic_1164.all;~ neredeyse her dosyada bulunur. ~std~ ve ~work~ kütüphaneleri her zaman görünür olduğu için bildirilmeleri gerekmez.
- **entity:** Devrenin dışarıdan görünüşü, yani portlarıdır. Bir kutunun bacaklarını tanımlar.
- **architecture:** Kutunun içinde ne olduğunu anlatır. ~architecture rtl of yarim_toplayici is~ satırı bu mimarinin hangi entity'ye ait olduğunu söyler.

[[G-H3-01]]

Port modları:

- ~in~: yalnızca okunur.
- ~out~: yalnızca yazılır; VHDL-93'te devrenin içinden okunamaz.
- ~inout~: iki yönlüdür; hem dışarıdan hem içeriden sürülebilir.
- ~buffer~: yazılır ve içeriden geri okunabilir, ama yalnızca tek bir kaynaktan sürülür.

[[G-H3-02]]

Aşağıda bir yarım toplayıcı ve onu deneyen testbench var. Benzetimi çalıştır, sonra dalga ekranında ~s~ ve ~c~'ye bak.
`),
      sim: {
        top: "tb",
        sure: "50ns",
        gorev: "Mimariyi tam toplayıcıya genişlet: bir cin girişi ekle, s <= a xor b xor cin; c <= (a and b) or (cin and (a xor b)); yaz.",
        kod: `${UST}
entity yarim_toplayici is
  port (
    a, b : in  std_logic;
    s, c : out std_logic
  );
end entity;

architecture rtl of yarim_toplayici is
begin
  s <= a xor b;  -- toplam
  c <= a and b;  -- elde
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal a, b, s, c : std_logic := '0';
begin
  uut : entity work.yarim_toplayici port map (a => a, b => b, s => s, c => c);

  process
  begin
    a <= '0'; b <= '0'; wait for 10 ns;
    a <= '0'; b <= '1'; wait for 10 ns;
    a <= '1'; b <= '0'; wait for 10 ns;
    a <= '1'; b <= '1'; wait for 10 ns;
    assert s = '0' and c = '1' report "1 + 1 yanlis" severity error;
    report "Dort giris birlesimi denendi";
    wait;
  end process;
end architecture;
`,
      },
    },
    {
      baslik: "Operatörler",
      metin: md(`
VHDL operatörleri gruplara ayrılır:

- **Mantıksal:** ~and or nand nor xor xnor not~. ~not~ en yüksek önceliğe sahiptir; diğerlerinin hepsi aynı önceliktedir. Bu yüzden ~a and b or c~ geçersizdir, parantez şarttır. ~nand~ ve ~nor~ zincirlenemez: ~a nand b nand c~ derlenmez.
- **İlişkisel:** ~= /= < <= > >=~. Sonuç ~boolean~'dır. ~<=~ hem "küçük eşit" hem sinyal atamasıdır; bağlam belirler.
- **Toplama ve birleştirme:** ~+ -~ ve ~&~. ~&~ iki vektörü ya da biti uç uca ekler: ~"10" & '1'~ sonucu ~"101"~.
- **Çarpma:** ~* / mod rem~. Bölme sentezde pahalıdır; çoğu araç yalnızca 2'nin kuvvetine bölmeyi kolayca sentezler.
- **Kaydırma:** ~sll srl sla sra rol ror~ (~bit_vector~ ve numeric_std tipleriyle).
- **Atama:** sinyale ~<=~, değişkene ~:=~.

**mod ve rem farkı:** ikisi de bölümden kalanı verir ama işaretleri farklıdır. ~rem~ sonucunun işareti **bölünenle**, ~mod~ sonucunun işareti **bölenle** aynıdır. Pozitif sayılarda ikisi eşittir.

Aşağıdaki kod birkaç işlemi ~report~ ile mesaj paneline yazar. Sayıları değiştirip sonuçları tahmin etmeye çalış.
`),
      sim: {
        top: "tb",
        sure: "1ns",
        gorev: "Önce sonuçları kafandan hesapla, sonra çalıştır. -7 ve 3 için de dene.",
        kod: `entity tb is
end entity;

architecture sim of tb is
begin
  process
    constant A : integer := 7;
    constant B : integer := -3;
  begin
    report "A rem B = " & integer'image(A rem B);   -- işaret A'dan gelir
    report "A mod B = " & integer'image(A mod B);   -- işaret B'den gelir
    report "A / B   = " & integer'image(A / B);     -- sıfıra doğru yuvarlanır
    report "2 ** 5  = " & integer'image(2 ** 5);
    report "abs B   = " & integer'image(abs B);
    wait;
  end process;
end architecture;
`,
      },
    },
    {
      baslik: "Öznitelikler",
      metin: md(`
Öznitelikler (attribute) bir sinyal, tip ya da dizi hakkında bilgi verir ve ~'~ ile yazılır.

Dizi öznitelikleri, ~signal d : std_logic_vector(7 downto 0)~ için:

- ~d'left~ = 7, ~d'right~ = 0
- ~d'high~ = 7, ~d'low~ = 0
- ~d'length~ = 8
- ~d'range~ = ~7 downto 0~, ~d'reverse_range~ = ~0 to 7~

~to~ ile tanımlı bir dizide ~'left~ küçük indistir. ~'high~ ve ~'low~ ise yönden bağımsız olarak en büyük ve en küçük indisi verir.

Sinyal öznitelikleri:

- ~clk'event~: sinyal bu anda değişti mi? ~clk'event and clk = '1'~ yükselen kenardır.
- ~s'last_value~: değişmeden önceki değer.

Döngülerde ~for i in d'range loop~ yazmak, dizinin genişliği değişse bile kodu doğru tutar. Sentez araçları genellikle ~'event~ ve dizi özniteliklerini destekler; zamanla ilgili olanları (~'last_event~ gibi) desteklemez.
`),
    },
    {
      baslik: "GENERIC ile parametreli tasarım",
      metin: md(`
~generic~, bir entity'ye derleme anında verilen sabit parametredir. Aynı kodu farklı genişliklerde kullanmanı sağlar. Entity içinde ~port~'tan önce yazılır:

~~~
entity parite is
  generic (N : positive := 8);
  port (d : in std_logic_vector(N-1 downto 0); p : out std_logic);
end entity;
~~~

Bileşeni kullanırken ~generic map (N => 4)~ ile değer verilir; verilmezse varsayılan değer geçerlidir.

Aşağıdaki örnekte parite üretecinde ~N~ ve ~'range~ birlikte kullanılıyor. Testbench'teki ~N => 4~ değerini değiştir ve ~d~'nin genişliğini buna uydur.
`),
      sim: {
        top: "tb",
        sure: "40ns",
        gorev: "Testbench'te N'yi 6 yap ve d sinyalini 6 bitlik olacak şekilde güncelle.",
        kod: `${UST}
entity parite is
  generic (N : positive := 8);
  port (
    d : in  std_logic_vector(N - 1 downto 0);
    p : out std_logic
  );
end entity;

architecture rtl of parite is
begin
  process (d)
    variable x : std_logic;
  begin
    x := '0';
    for i in d'range loop
      x := x xor d(i);
    end loop;
    p <= x;  -- 1 sayısı tekse '1'
  end process;
end architecture;

library ieee;
use ieee.std_logic_1164.all;

entity tb is
end entity;

architecture sim of tb is
  signal d : std_logic_vector(3 downto 0) := "0000";
  signal p : std_logic;
begin
  uut : entity work.parite
    generic map (N => 4)
    port map (d => d, p => p);

  process
  begin
    d <= "0001"; wait for 10 ns;
    d <= "0011"; wait for 10 ns;
    d <= "0111"; wait for 10 ns;
    report "d'length = " & integer'image(d'length);
    wait;
  end process;
end architecture;
`,
      },
    },
  ],
  test: ["h3-uc-bolum", "h3-port-inout", "h3-not-oncelik", "h3-mod-rem-pozitif", "h3-birlestirme", "h3-attr-downto", "h3-generic-yer"],
};
