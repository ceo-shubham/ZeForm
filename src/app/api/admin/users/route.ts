import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth-edge";
import { getAllUsers } from "@/lib/d1-store";
import { isAdmin } from "@/lib/utils";

export const runtime = "edge";

// GET /api/admin/users - Admin only route to list all platform users
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

    const users = await getAllUsers();

    const formattedUsers = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      image: u.image,
      role: u.role,
      createdAt: u.createdAt,
      formsCount: Number(u.formCount || 0),
      forms: [],
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
