// Kod yazma soruları. Her sorunun aynı kimlikli bir referans modeli
// worker/modeller.ts'de durur; `npm run sorular:dogrula` örnek çözümü NVC ile
// birkaç farklı rastgele testbench'e karşı çalıştırıp modelle karşılaştırır.

import { IEEE, type Soru } from "./tipler.ts";
import type { KodBilgisi, Port } from "../../shared/kod.ts";

const giris = (ad: string, genislik = 0): Port => ({ ad, yon: "in", genislik });
const cikis = (ad: string, genislik = 0): Port => ({ ad, yon: "out", genislik });

function varlikMetni(varlik: string, portlar: Port[]): string {
  const tip = (p: Port) => (p.genislik === 0 ? "std_logic" : `std_logic_vector(${p.genislik - 1} downto 0)`);
  const uzun = Math.max(...portlar.map((p) => p.ad.length));
  const satirlar = portlar.map((p, i) => `    ${p.ad.padEnd(uzun)} : ${p.yon.padEnd(3)} ${tip(p)}${i < portlar.length - 1 ? ";" : ""}`);
  return `entity ${varlik} is\n  port (\n${satirlar.join("\n")}\n  );\nend ${varlik};\n`;
}

// Şablon: entity hazır, mimari boş. Çözüm aynı entity'yi kullanır.
function kod(varlik: string, portlar: Port[], saat?: string): KodBilgisi {
  return {
    varlik,
    portlar,
    ...(saat ? { saat } : {}),
    sablon: `${IEEE}\n${varlikMetni(varlik, portlar)}\narchitecture rtl of ${varlik} is\nbegin\n  -- Çözümünü buraya yaz\nend rtl;\n`,
  };
}

const cozum = (b: KodBilgisi, mimari: string) => `${IEEE}\n${varlikMetni(b.varlik, b.portlar)}\n${mimari.trim()}\n`;

const yarim = kod("half_adder", [giris("a"), giris("b"), cikis("s"), cikis("c")]);
const tam = kod("full_adder", [giris("a"), giris("b"), giris("cin"), cikis("s"), cikis("cout")]);
const karsilastirici = kod("cmp4", [giris("a", 4), giris("b", 4), cikis("eq"), cikis("gt"), cikis("lt")]);
const mux = kod("mux4", [giris("d", 4), giris("sel", 2), cikis("y")]);
const oncelik = kod("prio4", [giris("r", 4), cikis("y", 2), cikis("v")]);
const birler = kod("ones8", [giris("x", 8), cikis("n", 4)]);
const sayac = kod("cnt4", [giris("clk"), giris("rst"), giris("en"), cikis("q", 4)], "clk");
const kenar = kod("rise_detect", [giris("clk"), giris("rst"), giris("d"), cikis("p")], "clk");
const dizi = kod("det101", [giris("clk"), giris("rst"), giris("x"), cikis("z")], "clk");

const KOD_NOTU =
  "\n\nŞablondaki entity'yi değiştirme; yalnızca mimariyi yaz. **Sına** dediğinde tasarımın tarayıcında, her seferinde rastgele seçilen girişlerle gizli bir testbench'e karşı çalıştırılır.";

export const kodSorulari: Soru[] = [
  {
    id: "k-yarim-toplayici", konu: "vhdl-temel", hafta: 3, kaynak: "derived", zorluk: 1,
    ref: "Hafta 3, entity ve architecture", tip: "code", kod: yarim,
    soru: "İki bitlik bir **yarım toplayıcı** yaz: ~s~ toplam (a XOR b), ~c~ elde (a AND b) çıkışıdır." + KOD_NOTU,
    aciklama: "Yarım toplayıcı iki eşzamanlı atamadır: ~s <= a xor b;~ ve ~c <= a and b;~. Eşzamanlı atamaların sırası önemli değildir.",
    cozum: cozum(yarim, `
architecture rtl of half_adder is
begin
  s <= a xor b;
  c <= a and b;
end rtl;`),
  },
  {
    id: "k-tam-toplayici", konu: "vhdl-temel", hafta: 3, kaynak: "derived", zorluk: 1,
    ref: "Hafta 3, entity ve architecture", tip: "code", kod: tam,
    soru: "Bir **tam toplayıcı** yaz: ~a + b + cin~ toplamının düşük biti ~s~, yüksek biti ~cout~ olsun." + KOD_NOTU,
    aciklama: "~s <= a xor b xor cin;~ ve ~cout <= (a and b) or (cin and (a xor b));~. Elde, girişlerden en az ikisi 1 olduğunda 1 olur; ~(a and b) or (a and cin) or (b and cin)~ de aynı sonucu verir.",
    cozum: cozum(tam, `
architecture rtl of full_adder is
begin
  s    <= a xor b xor cin;
  cout <= (a and b) or (a and cin) or (b and cin);
end rtl;`),
  },
  {
    id: "k-karsilastirici", konu: "operatorler", hafta: 3, kaynak: "derived", zorluk: 2,
    ref: "Hafta 3, ilişkisel operatörler", tip: "code", kod: karsilastirici,
    soru: "4 bitlik **işaretsiz karşılaştırıcı** yaz. ~a = b~ ise ~eq~, ~a > b~ ise ~gt~, ~a < b~ ise ~lt~ '1' olsun; diğerleri '0'.\n\nİpucu: ~numeric_std~ ile ~unsigned(a)~ biçiminde dönüştürüp karşılaştırabilirsin." + KOD_NOTU,
    aciklama: "~std_logic_vector~ için ~<~ ve ~>~ işaretsiz sayı karşılaştırması yapmaz; ~unsigned(a) < unsigned(b)~ yazmak gerekir. Çıkışlar ~'1' when ... else '0'~ biçimiyle atanabilir.",
    cozum: cozum(karsilastirici, `
architecture rtl of cmp4 is
begin
  eq <= '1' when unsigned(a) = unsigned(b) else '0';
  gt <= '1' when unsigned(a) > unsigned(b) else '0';
  lt <= '1' when unsigned(a) < unsigned(b) else '0';
end rtl;`),
  },
  {
    id: "k-mux4", konu: "esz-atamalar", hafta: 5, kaynak: "derived", zorluk: 1,
    ref: "Hafta 5, with/select", tip: "code", kod: mux,
    soru: "~with ... select~ kullanarak 4'e 1 **multiplexer** yaz: ~sel = \"00\"~ iken ~y = d(0)~, ~\"01\"~ iken ~d(1)~, ~\"10\"~ iken ~d(2)~, ~\"11\"~ iken ~d(3)~." + KOD_NOTU,
    aciklama: "~with sel select y <= d(0) when \"00\", d(1) when \"01\", d(2) when \"10\", d(3) when others;~ Son seçeneği ~others~ yapmak, std_logic'in '0' ve '1' dışındaki değerlerini de kapsar.",
    cozum: cozum(mux, `
architecture rtl of mux4 is
begin
  with sel select
    y <= d(0) when "00",
         d(1) when "01",
         d(2) when "10",
         d(3) when others;
end rtl;`),
  },
  {
    id: "k-oncelik", konu: "esz-atamalar", hafta: 5, kaynak: "derived", zorluk: 2,
    ref: "Hafta 5, when/else", tip: "code", kod: oncelik,
    soru: "4 girişli bir **öncelik kodlayıcı** yaz. ~r(3)~ en yüksek önceliklidir: '1' olan en yüksek bitin numarası ~y~'ye yazılsın (ör. ~r = \"0110\"~ ise ~y = \"10\"~) ve ~v = '1'~ olsun. Hiçbir bit '1' değilse ~y = \"00\"~, ~v = '0'~." + KOD_NOTU,
    aciklama: "~when/else~ koşulları sırayla denendiği için öncelik doğal olarak ifade edilir: ~y <= \"11\" when r(3) = '1' else \"10\" when r(2) = '1' else ...~ ve ~v <= '0' when r = \"0000\" else '1';~",
    cozum: cozum(oncelik, `
architecture rtl of prio4 is
begin
  y <= "11" when r(3) = '1' else
       "10" when r(2) = '1' else
       "01" when r(1) = '1' else
       "00";
  v <= '0' when r = "0000" else '1';
end rtl;`),
  },
  {
    id: "k-birler", konu: "sirali-kod", hafta: 5, kaynak: "derived", zorluk: 2,
    ref: "Hafta 5, process ve for loop", tip: "code", kod: birler,
    soru: "8 bitlik ~x~ girişindeki **'1' bitlerinin sayısını** ~n~ çıkışına yaz (ör. ~x = \"10110001\"~ ise ~n = \"0100\"~). Bir process içinde ~for~ döngüsü ve değişken (variable) kullan." + KOD_NOTU,
    aciklama: "Sayaç bir ~variable~ olmalı: sinyal kullanılsaydı process içindeki ara atamalar hemen görünmezdi. Process'in duyarlılık listesinde ~x~ bulunmalı; sonuç döngüden sonra ~n <= std_logic_vector(to_unsigned(say, 4));~ ile atanır.",
    cozum: cozum(birler, `
architecture rtl of ones8 is
begin
  process (x)
    variable say : integer range 0 to 8;
  begin
    say := 0;
    for i in x'range loop
      if x(i) = '1' then
        say := say + 1;
      end if;
    end loop;
    n <= std_logic_vector(to_unsigned(say, 4));
  end process;
end rtl;`),
  },
  {
    id: "k-sayac", konu: "sirali-kod", hafta: 5, kaynak: "derived", zorluk: 2,
    ref: "Hafta 5, process ve rising_edge", tip: "code", kod: sayac,
    soru: "4 bitlik bir **yukarı sayıcı** yaz. Her yükselen saat kenarında:\n\n- ~rst = '1'~ ise ~q~ sıfırlanır (eşzamanlı reset),\n- değilse ~en = '1'~ iken ~q~ bir artar (15'ten sonra 0'a döner),\n- ~en = '0'~ iken ~q~ değişmez." + KOD_NOTU,
    aciklama: "Çıkış portu okunamadığı için (VHDL-93'te ~out~ port okunmaz) sayım iç bir ~unsigned(3 downto 0)~ sinyalinde tutulur ve ~q <= std_logic_vector(sayi);~ ile dışarı verilir. ~unsigned~ toplama 4 bitte taşar, böylece 15 + 1 = 0 olur.",
    cozum: cozum(sayac, `
architecture rtl of cnt4 is
  signal sayi : unsigned(3 downto 0) := (others => '0');
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        sayi <= (others => '0');
      elsif en = '1' then
        sayi <= sayi + 1;
      end if;
    end if;
  end process;
  q <= std_logic_vector(sayi);
end rtl;`),
  },
  {
    id: "k-kenar", konu: "sirali-kod", hafta: 5, kaynak: "derived", zorluk: 2,
    ref: "Hafta 5, process ve rising_edge", tip: "code", kod: kenar,
    soru: "Bir **yükselen kenar dedektörü** yaz. Her yükselen saat kenarında ~d~ örneklenir; ~d~ bu kenarda '1' ve bir önceki kenarda '0' ise ~p~ bir saat çevrimi boyunca '1' olur, aksi halde '0'. ~p~ bir yazmaç çıkışı olmalı (değeri yalnızca saat kenarında değişir).\n\n~rst = '1'~ iken (eşzamanlı) ~p = '0'~ olur ve önceki değer '0' kabul edilir." + KOD_NOTU,
    aciklama: "~d~'nin önceki değeri bir sinyalde saklanır. Aynı kenarda ~p <= d and not onceki;~ ve ~onceki <= d;~ atanır; sinyal atamaları process sonunda gerçekleştiği için ~p~ hesaplanırken ~onceki~ hâlâ eski değerdir.",
    cozum: cozum(kenar, `
architecture rtl of rise_detect is
  signal onceki : std_logic := '0';
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        onceki <= '0';
        p <= '0';
      else
        p <= d and not onceki;
        onceki <= d;
      end if;
    end if;
  end process;
end rtl;`),
  },
  {
    id: "k-dizi101", konu: "sirali-kod", hafta: 5, kaynak: "derived", zorluk: 3,
    ref: "Hafta 5, process ve case", tip: "code", kod: dizi,
    soru: "Her yükselen saat kenarında ~x~ girişinden bir bit okuyan bir **\"101\" dizi dedektörü** yaz. Son okunan üç bit sırasıyla 1, 0, 1 olduğunda ~z~ '1' olur; diziler örtüşebilir (~1 0 1 0 1~ iki kez yakalanır). ~z~ son biti okuyan kenardan hemen sonra '1' olmalı ve bir sonraki kenara kadar öyle kalmalı.\n\n~rst = '1'~ iken (eşzamanlı) geçmiş unutulur: yeni bir \"101\" için reset sonrasında üç bit daha okunmalı." + KOD_NOTU,
    aciklama: "Moore tipi bir durum makinesi kurulabilir: ~S0~ (başlangıç), ~S1~ (\"1\" görüldü), ~S10~ (\"10\" görüldü), ~S101~ (dizi tamam, ~z = '1'~). ~S101~ durumunda ~x = '0'~ gelirse ~S10~'a, ~x = '1'~ gelirse ~S1~'e geçilir; örtüşme bu geçişlerden gelir. Durum tipini ~type durum is (S0, S1, S10, S101);~ ile tanımlayıp ~case~ ile geçişleri yazmak okunaklı olur.",
    cozum: cozum(dizi, `
architecture rtl of det101 is
  type durum is (S0, S1, S10, S101);
  signal d : durum := S0;
begin
  process (clk)
  begin
    if rising_edge(clk) then
      if rst = '1' then
        d <= S0;
      else
        case d is
          when S0   => if x = '1' then d <= S1;   else d <= S0;  end if;
          when S1   => if x = '1' then d <= S1;   else d <= S10; end if;
          when S10  => if x = '1' then d <= S101; else d <= S0;  end if;
          when S101 => if x = '1' then d <= S1;   else d <= S10; end if;
        end case;
      end if;
    end if;
  end process;
  z <= '1' when d = S101 else '0';
end rtl;`),
  },
];
