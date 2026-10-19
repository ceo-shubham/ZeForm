import { NextRequest, NextResponse } from "next/server";
import { exchangeGoogleCodeForUser, createSessionToken, COOKIE_NAME } from "@/lib/auth-edge";
import { upsertUser } from "@/lib/d1-store";
import { ADMIN_EMAIL } from "@/lib/utils";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");
  const stateRaw = req.nextUrl.searchParams.get("state");
  const origin = req.nextUrl.origin;

  if (error || !code) {
    return NextResponse.redirect(`${origin}/auth/signin?error=${encodeURIComponent(error || "Sign in cancelled")}`);
  }

  let isClientRespondent = false;
  let returnTo = "/dashboard";

  if (stateRaw) {
    try {
      const parsed = JSON.parse(Buffer.from(stateRaw, "base64").toString("utf-8"));
      isClientRespondent = Boolean(parsed.isClientRespondent);
      if (parsed.returnTo) returnTo = parsed.returnTo;
    } catch {
      // fallback
    }
  }

  try {
    const googleProfile = await exchangeGoogleCodeForUser(code, origin, isClientRespondent);
    if (!googleProfile) {
      return NextResponse.redirect(`${origin}/auth/signin?error=Failed to retrieve Google profile`);
    }

    const user = await upsertUser(
      googleProfile.email,
      googleProfile.name,
      googleProfile.avatar
    );

    const token = await createSessionToken(user);

    // If master admin, redirect to /admin by default if going to dashboard
    let finalRedirect = returnTo;
    if (returnTo === "/dashboard" && user.role === "ADMIN") {
      finalRedirect = "/admin";
    }

    const response = NextResponse.redirect(finalRedirect.startsWith("http") ? finalRedirect : `${origin}${finalRedirect}`);

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err: any) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(`${origin}/auth/signin?error=Authentication failed: ${encodeURIComponent(err.message)}`);
  }
}
