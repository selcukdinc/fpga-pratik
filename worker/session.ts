// Oturum: tek bir zorunlu, HttpOnly çerez. Takip ya da analitik çerezi yok.

import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { Me } from "../shared/api";
import type { EpostaEnv } from "./eposta";
import type { AccessEnv } from "./access";

export const COOKIE = "fp_oturum";
const MAX_AGE_S = 60 * 60 * 24 * 180;

export type Env = {
  Bindings: EpostaEnv & AccessEnv & { DB: D1Database; PBKDF2_ITER?: string };
  Variables: { me: Me | null };
};

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" })[c]!);
}

const ME_SQL = `SELECT u.id, u.kind, u.display_name, u.username, u.email, u.avatar, u.avatar_bg, u.role,
                       u.public_profile, u.username_changed_at
                FROM users u`;

type MeRow = {
  id: string; kind: "guest" | "member"; display_name: string | null; username: string | null;
  email: string | null; avatar: string | null; avatar_bg: string | null; role: string;
  public_profile: number; username_changed_at: number | null;
};

const meFromRow = (r: MeRow): Me => ({
  id: r.id,
  kind: r.kind,
  displayName: r.display_name ?? r.username,
  username: r.username,
  email: r.email,
  avatar: r.avatar,
  avatarBg: r.avatar_bg,
  role: r.role,
  publicProfile: r.public_profile === 1,
  usernameChangedAt: r.username_changed_at,
});

export async function loadUser(db: D1Database, id: string): Promise<Me | null> {
  const row = await db.prepare(`${ME_SQL} WHERE u.id = ?`).bind(id).first<MeRow>();
  return row ? meFromRow(row) : null;
}

export async function loadMe(c: Context<Env>): Promise<Me | null> {
  const token = getCookie(c, COOKIE);
  if (!token) return null;
  const row = await c.env.DB.prepare(
    `${ME_SQL} JOIN sessions s ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?`,
  )
    .bind(await sha256(token), Date.now())
    .first<MeRow>();
  return row ? meFromRow(row) : null;
}

// Yeni oturum açar; varsa eski oturum belirteci silinir (girişte oturum sabitleme olmasın)
export async function startSession(c: Context<Env>, userId: string, extra: D1PreparedStatement[] = []): Promise<void> {
  const token = randomToken();
  const now = Date.now();
  const old = getCookie(c, COOKIE);
  await c.env.DB.batch([
    ...extra,
    ...(old ? [c.env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(old))] : []),
    c.env.DB.prepare(
      "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
    ).bind(await sha256(token), userId, now, now + MAX_AGE_S * 1000),
  ]);
  setCookie(c, COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
}

export async function endSession(c: Context<Env>): Promise<void> {
  const token = getCookie(c, COOKIE);
  if (token) await c.env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256(token)).run();
  deleteCookie(c, COOKIE, { path: "/", secure: true });
}

// Geçerli oturum dışındaki tüm oturumları kapatır
export async function otherSessionsQuery(c: Context<Env>, userId: string): Promise<D1PreparedStatement> {
  const token = getCookie(c, COOKIE) ?? "";
  return c.env.DB.prepare("DELETE FROM sessions WHERE user_id = ? AND token_hash != ?").bind(userId, await sha256(token));
}

// İlk cevapta misafir kullanıcı açılır; o ana kadar hiçbir çerez yazılmaz
export async function ensureGuest(c: Context<Env>): Promise<Me> {
  const existing = c.get("me");
  if (existing) return existing;

  const id = crypto.randomUUID();
  await startSession(c, id, [
    c.env.DB.prepare("INSERT INTO users (id, kind, created_at) VALUES (?, 'guest', ?)").bind(id, Date.now()),
  ]);
  const me: Me = {
    id, kind: "guest", displayName: null, username: null, email: null, avatar: null, avatarBg: null,
    role: "user", publicProfile: false, usernameChangedAt: null,
  };
  c.set("me", me);
  return me;
}
