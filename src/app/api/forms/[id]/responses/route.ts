import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/utils";

interface Params {
  params: { id: string };
}

// GET /api/forms/[id]/responses
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userEmail = session.user.email.toLowerCase();
    const userIsAdmin = isAdmin(userEmail);

    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        user: true,
        questions: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.user.email !== userEmail && !userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const responses = await prisma.formResponse.findMany({
      where: { formId: id },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({
      form: {
        id: form.id,
        title: form.title,
        slug: form.slug,
        isQuiz: form.isQuiz,
        questions: form.questions,
      },
      responses,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
