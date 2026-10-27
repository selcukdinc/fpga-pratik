// Metin boyutu (yüzde). Tarayıcıda saklanır; hesaplarda ayrıca kaydedilir,
// böylece başka cihazda giriş yapınca aynı boyut gelir.

export const OLCEK_SECENEKLERI = [85, 90, 100, 110, 120, 135, 150];
export const VARSAYILAN_OLCEK = 100;

export const olcekGecerli = (o: unknown): o is number => typeof o === "number" && OLCEK_SECENEKLERI.includes(o);
