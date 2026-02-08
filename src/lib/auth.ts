import { cookies } from "next/headers";
import type { AuthUser } from "@/types/auth";

export const AUTH_COOKIE_NAME = "metering-do-auth";
export const USER_COOKIE_NAME = "metering-do-user";
export const CSRF_COOKIE_NAME = "metering-do-csrf";

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

async function getKey(): Promise<CryptoKey> {
  const secret = process.env.AUTH_COOKIE_SECRET!;
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret.padEnd(32, "0").slice(0, 32)),
    "AES-GCM",
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptSession(session: AuthSession): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(session));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptSession(
  encrypted: string
): Promise<AuthSession | null> {
  try {
    const key = await getKey();
    const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!cookie) return null;
  return decryptSession(cookie.value);
}
