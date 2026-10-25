// Parola özeti: PBKDF2-SHA256, kullanıcıya özel tuz. Yineleme sayısı her
// kullanıcıda saklanır; PBKDF2_ITER artırılırsa eski özetler girişte yenilenir.
// Ücretsiz planda istek başına 10 ms CPU sınırı var: 100.000 yineleme yaklaşık
// 13 ms sürdüğü için varsayılan 50.000 (yaklaşık 7 ms). Workers en fazla
// 100.000'e izin verir.

export const VARSAYILAN_YINELEME = 50_000;
const EN_FAZLA_YINELEME = 100_000;

const b64 = (b: Uint8Array) => btoa(String.fromCharCode(...b));
const b64coz = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function turet(parola: string, tuz: Uint8Array, yineleme: number): Promise<Uint8Array> {
  const anahtar = await crypto.subtle.importKey("raw", new TextEncoder().encode(parola), "PBKDF2", false, ["deriveBits"]);
  const bitler = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: tuz, iterations: yineleme },
    anahtar,
    256,
  );
  return new Uint8Array(bitler);
}

export interface ParolaOzeti {
  hash: string;
  salt: string;
  iter: number;
}

export async function parolaOzeti(parola: string, yineleme = VARSAYILAN_YINELEME): Promise<ParolaOzeti> {
  const tuz = crypto.getRandomValues(new Uint8Array(16));
  return { hash: b64(await turet(parola, tuz, yineleme)), salt: b64(tuz), iter: yineleme };
}

export async function parolaDogru(parola: string, o: ParolaOzeti): Promise<boolean> {
  const beklenen = b64coz(o.hash);
  const gelen = await turet(parola, b64coz(o.salt), o.iter);
  // Sabit süreli karşılaştırma
  let fark = beklenen.length ^ gelen.length;
  for (let i = 0; i < beklenen.length; i++) fark |= beklenen[i]! ^ (gelen[i] ?? 0);
  return fark === 0;
}

export function yinelemeSayisi(env: { PBKDF2_ITER?: string }): number {
  const n = Number(env.PBKDF2_ITER);
  return Number.isInteger(n) && n >= 10_000 && n <= EN_FAZLA_YINELEME ? n : VARSAYILAN_YINELEME;
}
