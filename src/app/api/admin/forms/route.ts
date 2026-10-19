import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";

// GET /api/admin/forms - Admin only route to list all platform forms
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session || !isAdmin(userEmail)) {
      return NextResponse.json(
        { error: "Access denied. Only the platform administrator (ceo.shubhampathak@gmail.com) can access this resource." },
        { status: 403 }
      );
    }

    const forms = await prisma.form.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            responses: true,
            questions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ forms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
