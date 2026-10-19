import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { getUserByEmail, upsertUser, DBUser } from "./d1-store";
import { ADMIN_EMAIL } from "./utils";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "zeform-secret-key-zenstro-2026-super-secure"
);

export const COOKIE_NAME = "zeform_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export async function createSessionToken(user: { id: string; email: string; name?: string | null; role: string }): Promise<string> {
  const normEmail = user.email.toLowerCase();
  const role = normEmail === ADMIN_EMAIL.toLowerCase() ? "ADMIN" : user.role || "USER";

  return await new SignJWT({
    userId: user.id,
    email: normEmail,
    name: user.name || normEmail.split("@")[0],
    role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionUserFromRequest(req: NextRequest): Promise<DBUser | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload?.email) return null;

  return await getUserByEmail(payload.email);
}

// Google OAuth Helpers
export function getGoogleOAuthUrl(origin: string, isClientRespondent: boolean = false, state?: string): string {
  const clientId = isClientRespondent
    ? process.env.GOOGLE_CLIENTS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
    : process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error("Missing Google Client ID");
    return "";
  }

  const redirectUri = `${origin}/api/auth/callback/google`;
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const options: Record<string, string> = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  if (state) {
    options.state = state;
  }

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export async function exchangeGoogleCodeForUser(
  code: string,
  origin: string,
  isClientRespondent: boolean = false
): Promise<{ email: string; name: string; avatar: string } | null> {
  const clientId = isClientRespondent
    ? process.env.GOOGLE_CLIENTS_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
    : process.env.GOOGLE_CLIENT_ID;

  const clientSecret = isClientRespondent
    ? process.env.GOOGLE_CLIENTS_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET
    : process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Missing Google Client ID or Secret");
    return null;
  }

  const redirectUri = `${origin}/api/auth/callback/google`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    console.error("Google token exchange error:", tokenData);
    return null;
  }

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userData = await userRes.json();
  if (!userRes.ok || !userData.email) {
    console.error("Google userinfo fetch error:", userData);
    return null;
  }

  return {
    email: userData.email,
    name: userData.name || userData.email.split("@")[0],
    avatar: userData.picture || "",
  };
}
