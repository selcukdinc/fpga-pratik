// Avatar kimlikleri. Çizimler src/components/Avatar.tsx'te; sunucu sadece
// kimliğin bu listede olup olmadığına bakar.

export interface AvatarBilgi {
  id: string;
  ad: string;
  grup: string;
}

const g = (grup: string, liste: [string, string][]): AvatarBilgi[] => liste.map(([id, ad]) => ({ id, ad, grup }));

export const AVATARLAR: AvatarBilgi[] = [
  ...g("Kapılar", [
    ["and", "AND kapısı"], ["or", "OR kapısı"], ["not", "NOT kapısı"], ["nand", "NAND kapısı"], ["nor", "NOR kapısı"],
    ["xor", "XOR kapısı"], ["xnor", "XNOR kapısı"], ["buffer", "Tampon"], ["tristate", "Üç durumlu tampon"],
  ]),
  ...g("Kombinasyonel", [
    ["yarim-toplayici", "Yarım toplayıcı"], ["tam-toplayici", "Tam toplayıcı"], ["mux2", "2:1 mux"], ["mux4", "4:1 mux"],
    ["demux", "Demux"], ["decoder", "Kod çözücü"], ["encoder", "Kodlayıcı"], ["karsilastirici", "Karşılaştırıcı"],
    ["alu", "ALU"],
  ]),
  ...g("Ardışıl", [
    ["dff", "D flip-flop"], ["jkff", "JK flip-flop"], ["tff", "T flip-flop"], ["sr-latch", "SR latch"],
    ["d-latch", "D latch"], ["register", "Register"], ["shift-register", "Kaydırmalı register"], ["sayici", "Sayıcı"],
    ["fsm", "Durum makinesi"],
  ]),
  ...g("FPGA içi", [
    ["lut", "LUT"], ["clb", "CLB"], ["dsp", "DSP dilimi"], ["bram", "Blok RAM"], ["iob", "IOB"], ["pll", "PLL"],
    ["fpga", "FPGA yongası"], ["bitstream", "Bitstream"],
  ]),
  ...g("Sinyaller", [
    ["saat", "Saat"], ["yukselen-kenar", "Yükselen kenar"], ["dusen-kenar", "Düşen kenar"], ["ucgen", "Üçgen dalga"],
    ["kare", "Kare dalga"],
  ]),
  ...g("VHDL", [
    ["entity", "entity"], ["architecture", "architecture"], ["process", "process"], ["signal", "signal"],
    ["std-logic", "std_logic"], ["rising-edge", "rising_edge"], ["port-map", "port map"], ["generic", "generic"],
    ["when-else", "when else"], ["case", "case"],
  ]),
  ...g("Araçlar", [
    ["osiloskop", "Osiloskop"], ["lojik-analizor", "Lojik analizör"], ["breadboard", "Breadboard"], ["led", "LED"],
    ["yedi-segment", "7 segment"], ["anahtar", "Anahtar"],
  ]),
];

export const AVATAR_IDLERI = new Set(AVATARLAR.map((a) => a.id));

// Arka plan renkleri: hepsi açık tonlar, üzerindeki çizim koyu kalır.
// "yok" seçilirse çizim temanın yazı rengini alır.
export const AVATAR_ZEMINLERI = [
  "#d9e6f7", "#dcefd9", "#fbe3c8", "#f6d6d6", "#e6dcf5", "#d4eeee", "#f3ecc2", "#e3e3e3",
] as const;

export function rastgeleAvatar(): string {
  const i = crypto.getRandomValues(new Uint32Array(1))[0]! % AVATARLAR.length;
  return AVATARLAR[i]!.id;
}
