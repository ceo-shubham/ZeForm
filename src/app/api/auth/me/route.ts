import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth-edge";
import { ADMIN_EMAIL } from "@/lib/utils";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    const isMasterAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: isMasterAdmin ? "ADMIN" : user.role || "USER",
        isAdmin: isMasterAdmin,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ user: null, error: error.message }, { status: 500 });
  }
}
