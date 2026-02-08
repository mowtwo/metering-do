import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  USER_COOKIE_NAME,
  CSRF_COOKIE_NAME,
  encryptSession,
} from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (!state || !storedState || state !== storedState) {
    return NextResponse.redirect(
      new URL("/settings?error=csrf", request.url)
    );
  }

  cookieStore.delete(CSRF_COOKIE_NAME);

  if (!code) {
    return NextResponse.redirect(
      new URL("/settings?error=no_code", request.url)
    );
  }

  // Exchange code for access token
  const tokenRes = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    }
  );

  const tokenData = await tokenRes.json();
  if (tokenData.error || !tokenData.access_token) {
    return NextResponse.redirect(
      new URL("/settings?error=token_exchange", request.url)
    );
  }

  // Fetch user profile
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const userData = await userRes.json();

  const session = {
    accessToken: tokenData.access_token,
    user: {
      login: userData.login,
      name: userData.name,
      avatar_url: userData.avatar_url,
    },
  };

  const encrypted = await encryptSession(session);

  const isProduction = process.env.NODE_ENV === "production";
  const maxAge = 60 * 60 * 24 * 30; // 30 days

  cookieStore.set(AUTH_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  cookieStore.set(USER_COOKIE_NAME, JSON.stringify(session.user), {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    maxAge,
    path: "/",
  });

  return NextResponse.redirect(new URL("/settings", request.url));
}
