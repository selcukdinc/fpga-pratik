// Oturum: tek bir zorunlu, HttpOnly çerez. Takip ya da analitik çerezi yok.

import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { Me } from "../shared/api";

export const COOKIE = "fp_oturum";
const MAX_AGE_S = 60 * 60 * 24 * 180;

export type Env = { Bindings: { DB: D1Database }; Variables: { me: Me | null } };

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" })[c]!);
}

export async function loadMe(c: Context<Env>): Promise<Me | null> {
  const token = getCookie(c, COOKIE);
  if (!token) return null;
  const row = await c.env.DB.prepare(
    `SELECT u.id, u.kind, u.display_name FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ?`,
  )
    .bind(await sha256(token), Date.now())
    .first<{ id: string; kind: "guest" | "member"; display_name: string | null }>();
  return row ? { id: row.id, kind: row.kind, displayName: row.display_name } : null;
}

// İlk cevapta misafir kullanıcı açılır; o ana kadar hiçbir çerez yazılmaz
export async function ensureGuest(c: Context<Env>): Promise<Me> {
  const existing = c.get("me");
  if (existing) return existing;

  const id = crypto.randomUUID();
  const token = randomToken();
  const now = Date.now();
  await c.env.DB.batch([
    c.env.DB.prepare("INSERT INTO users (id, kind, created_at) VALUES (?, 'guest', ?)").bind(id, now),
    c.env.DB.prepare(
      "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
    ).bind(await sha256(token), id, now, now + MAX_AGE_S * 1000),
  ]);
  setCookie(c, COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: MAX_AGE_S,
  });
  const me: Me = { id, kind: "guest", displayName: null };
  c.set("me", me);
  return me;
}
