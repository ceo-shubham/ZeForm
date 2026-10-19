import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthUrl } from "@/lib/auth-edge";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const clientType = req.nextUrl.searchParams.get("client");
  const returnTo = req.nextUrl.searchParams.get("returnTo") || "/dashboard";

  const isClientRespondent = clientType === "clients";
  const state = JSON.stringify({ isClientRespondent, returnTo });

  const url = getGoogleOAuthUrl(origin, isClientRespondent, Buffer.from(state).toString("base64"));

  if (!url) {
    return NextResponse.json({ error: "Google OAuth credentials not configured" }, { status: 500 });
  }

  return NextResponse.redirect(url);
}
