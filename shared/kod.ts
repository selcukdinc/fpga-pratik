// Kod yazma soruları: port tanımları, gizli testbench üretimi ve iz okuma.
//
// Akış: sunucu her denemede rastgele giriş vektörleri seçip bir "sınama"
// açar ve bu vektörleri içeren testbench'i istemciye gönderir. Tarayıcı
// öğrencinin tasarımıyla birlikte testbench'i NVC'de çalıştırır; testbench
// her kontrol noktasında çıkışları "IZ <sıra> <bitler>" satırı olarak basar.
// İstemci bu izi geri yollar, sunucu beklenen çıkışları kendi referans
// modelinden hesaplayıp karşılaştırır. Beklenen çıkışlar istemciye hiç gitmez.

export interface Port {
  ad: string;
  yon: "in" | "out";
  // 0: std_logic, n: std_logic_vector(n-1 downto 0)
  genislik: number;
}

// Sorunun istemciye giden kısmı (questions.payload içinde "kod" alanı)
export interface KodBilgisi {
  varlik: string;
  portlar: Port[];
  // Sıralı devrelerde saat girişinin adı; testbench bu girişi kendisi sürer
  saat?: string;
  sablon: string;
}

// Bir kontrol noktasındaki giriş değerleri, port adına göre
export type Vektor = Record<string, number>;

export interface Sinama {
  id: string;
  testbench: string;
  top: string;
  stopTime: string;
  adet: number;
  bitis: number;
}

export interface RaporSatiri {
  i: number;
  zamanNs: number;
  girisler: Record<string, string>;
  beklenen: Record<string, string>;
  // İz bu noktaya ulaşmadıysa null
  gelen: Record<string, string> | null;
  dogru: boolean;
}

export interface KodSonucu {
  correct: boolean;
  gecen: number;
  toplam: number;
  // İlk hatalı kontrol noktası ve öncesindeki birkaç satır
  rapor: RaporSatiri[] | null;
  ipucu: string | null;
  explanation: string | null;
}

export const TB_ADI = "tb_sinama";
export const PERIYOT_NS = 10;
export const IZ_SINIRI = 200;

export const girisler = (b: KodBilgisi) => b.portlar.filter((p) => p.yon === "in" && p.ad !== b.saat);
export const cikislar = (b: KodBilgisi) => b.portlar.filter((p) => p.yon === "out");

export function bitler(deger: number, genislik: number): string {
  const n = Math.max(genislik, 1);
  let s = "";
  for (let i = n - 1; i >= 0; i--) s += Math.floor(deger / 2 ** i) % 2 ? "1" : "0";
  return s;
}

const vhdlDeger = (p: Port, v: number) => (p.genislik === 0 ? `'${bitler(v, 1)}'` : `"${bitler(v, p.genislik)}"`);

// Kontrol noktasının benzetim zamanı (ns): kombinasyonelde girişten 10 ns sonra,
// sıralıda yükselen kenardan 2 ns sonra
export function kontrolZamani(b: KodBilgisi, i: number): number {
  return b.saat ? i * PERIYOT_NS + PERIYOT_NS / 2 + 2 : (i + 1) * PERIYOT_NS;
}

export function testbenchUret(b: KodBilgisi, vektorler: Vektor[]): { metin: string; stopTime: string } {
  const g = girisler(b);
  const c = cikislar(b);
  const tip = (p: Port) => (p.genislik === 0 ? "std_logic" : `std_logic_vector(${p.genislik - 1} downto 0)`);
  const baslangic = (p: Port) => (p.genislik === 0 ? "'0'" : "(others => '0')");
  const bas = (p: Port) => (p.genislik === 0 ? `b1(${p.ad})` : `bv(${p.ad})`);

  const sinyaller = [
    ...g.map((p) => `  signal ${p.ad} : ${tip(p)} := ${baslangic(p)};`),
    ...c.map((p) => `  signal ${p.ad} : ${tip(p)};`),
    ...(b.saat ? [`  signal ${b.saat} : std_logic := '0';`, "  signal bitti : boolean := false;"] : []),
  ];
  const baglanti = b.portlar.map((p) => `${p.ad} => ${p.ad}`).join(", ");
  const iz = (i: number) => `    report "IZ ${i} " & ${c.map(bas).join(' & " " & ')};`;

  const adimlar: string[] = [];
  vektorler.forEach((v, i) => {
    const atama = g.map((p) => `${p.ad} <= ${vhdlDeger(p, v[p.ad] ?? 0)};`).join(" ");
    if (b.saat) {
      adimlar.push(`    ${atama}`, `    wait until rising_edge(${b.saat});`, "    wait for 2 ns;", iz(i));
      if (i < vektorler.length - 1) adimlar.push(`    wait until falling_edge(${b.saat});`);
    } else {
      adimlar.push(`    ${atama}`, `    wait for ${PERIYOT_NS} ns;`, iz(i));
    }
  });

  const metin = `-- Bu testbench her denemede sunucuda yeniden üretilir.
-- Girişler rastgele seçilir; beklenen çıkışlar burada yer almaz.
library ieee;
use ieee.std_logic_1164.all;

entity ${TB_ADI} is
end ${TB_ADI};

architecture sinama of ${TB_ADI} is
${sinyaller.join("\n")}

  function b1(x : std_logic) return string is
  begin
    return std_logic'image(x)(2 to 2);
  end function;

  function bv(x : std_logic_vector) return string is
    variable s : string(1 to x'length);
    variable k : integer := 1;
  begin
    for i in x'range loop
      s(k) := std_logic'image(x(i))(2);
      k := k + 1;
    end loop;
    return s;
  end function;
begin
  dut : entity work.${b.varlik} port map (${baglanti});
${b.saat ? `\n  ${b.saat} <= not ${b.saat} after ${PERIYOT_NS / 2} ns when not bitti else '0';\n` : ""}
  uyaran : process
  begin
${adimlar.join("\n")}
    report "IZ SON";
${b.saat ? "    bitti <= true;\n" : ""}    wait;
  end process;
end sinama;
`;
  return { metin, stopTime: `${vektorler.length * PERIYOT_NS + 100}ns` };
}

// Benzetim çıktısındaki IZ satırlarını sıraya göre toplar
export function izOku(satirlar: string[]): string[] {
  const iz: string[] = [];
  for (const satir of satirlar) {
    for (const m of satir.replace(/\x1b\[[0-9;]*m|\x1b\]8;;[^\x07]*\x07/g, "").matchAll(/\bIZ (\d+) ([UX01ZWLH\- ]+)/g)) {
      const i = Number(m[1]);
      if (i < IZ_SINIRI && iz[i] === undefined) iz[i] = m[2].trim();
    }
  }
  return Array.from({ length: iz.length }, (_, i) => iz[i] ?? "");
}
