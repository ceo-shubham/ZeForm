import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";

// GET /api/admin/users - Admin only route to list all platform users
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

    const users = await prisma.user.findMany({
      include: {
        forms: {
          select: {
            id: true,
            title: true,
            slug: true,
            isAcceptingResponses: true,
            createdAt: true,
            _count: {
              select: {
                responses: true,
              },
            },
          },
        },
        _count: {
          select: {
            forms: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedUsers = users.map((u) => {
      const totalResponsesReceived = u.forms.reduce(
        (acc, form) => acc + (form._count?.responses || 0),
        0
      );

      return {
        id: u.id,
        email: u.email,
        name: u.name,
        image: u.image,
        role: u.role,
        createdAt: u.createdAt,
        formsCount: u._count.forms,
        totalResponsesReceived,
        forms: u.forms,
      };
    });

    return NextResponse.json({ users: formattedUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
