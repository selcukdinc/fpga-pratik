// Cloudflare Access ikinci kapı olarak kullanılırsa, Access'in her isteğe
// eklediği imzalı JWT burada doğrulanır. ACCESS_TEAM_DOMAIN ve ACCESS_AUD
// tanımlı değilse bu kontrol atlanır; yönetici rolü kontrolü her durumda yapılır.

export interface AccessEnv {
  ACCESS_TEAM_DOMAIN?: string; // ör. selcukdinc.cloudflareaccess.com
  ACCESS_AUD?: string; // Access uygulamasının "Application Audience (AUD) Tag" değeri
}

type Jwk = JsonWebKey & { kid: string };
let anahtarOnbellegi: { alan: string; zaman: number; anahtarlar: Jwk[] } | null = null;

const b64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function anahtarlar(alan: string): Promise<Jwk[]> {
  if (anahtarOnbellegi?.alan === alan && Date.now() - anahtarOnbellegi.zaman < 3_600_000) return anahtarOnbellegi.anahtarlar;
  const res = await fetch(`https://${alan}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`Access anahtarları alınamadı: ${res.status}`);
  const { keys } = (await res.json()) as { keys: Jwk[] };
  anahtarOnbellegi = { alan, zaman: Date.now(), anahtarlar: keys };
  return keys;
}

export const accessAcik = (env: AccessEnv) => !!env.ACCESS_TEAM_DOMAIN && !!env.ACCESS_AUD;

// Geçerli bir Access belirteci varsa içindeki e-postayı döner
export async function accessEposta(env: AccessEnv, jwt: string | undefined): Promise<string | null> {
  if (!jwt || !accessAcik(env)) return null;
  const [baslikB64, govdeB64, imzaB64] = jwt.split(".");
  if (!baslikB64 || !govdeB64 || !imzaB64) return null;
  try {
    const baslik = JSON.parse(new TextDecoder().decode(b64url(baslikB64))) as { kid?: string; alg?: string };
    if (baslik.alg !== "RS256") return null;
    const jwk = (await anahtarlar(env.ACCESS_TEAM_DOMAIN!)).find((k) => k.kid === baslik.kid);
    if (!jwk) return null;
    const anahtar = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const gecerli = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      anahtar,
      b64url(imzaB64),
      new TextEncoder().encode(`${baslikB64}.${govdeB64}`),
    );
    if (!gecerli) return null;
    const g = JSON.parse(new TextDecoder().decode(b64url(govdeB64))) as {
      aud?: string | string[]; exp?: number; iss?: string; email?: string;
    };
    const aud = Array.isArray(g.aud) ? g.aud : [g.aud];
    if (!aud.includes(env.ACCESS_AUD)) return null;
    if (!g.exp || g.exp * 1000 < Date.now()) return null;
    if (g.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null;
    return g.email?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}
