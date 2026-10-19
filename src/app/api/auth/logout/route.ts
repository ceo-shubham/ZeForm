import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth-edge";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const response = NextResponse.redirect(`${origin}/`);

  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function POST(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
