import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth-edge";
import { getAllForms } from "@/lib/d1-store";
import { isAdmin } from "@/lib/utils";

export const runtime = "edge";

// GET /api/admin/forms - Admin only route to list all platform forms
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    const userEmail = user?.email?.toLowerCase();

    if (!user || !isAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Access denied. Only the platform administrator (ceo.shubhampathak@gmail.com) can access this resource." },
        { status: 403 }
      );
    }

    const forms = await getAllForms();

    return NextResponse.json({ forms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
