import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isAdmin, isValidSubdomain, slugify } from "@/lib/utils";
import { createSubdomainDnsRecord } from "@/lib/cloudflare";

interface Params {
  params: { id: string };
}

// GET /api/forms/[id]
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
        questions: {
          orderBy: { orderIndex: "asc" },
        },
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
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.user.email !== userEmail && !userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ form });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/forms/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userEmail = session.user.email.toLowerCase();
    const userIsAdmin = isAdmin(userEmail);

    const existingForm = await prisma.form.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (existingForm.user.email !== userEmail && !userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Check slug uniqueness if changed
    let updatedSlug = existingForm.slug;
    if (body.slug && body.slug !== existingForm.slug) {
      const formattedSlug = slugify(body.slug);
      const validation = isValidSubdomain(formattedSlug);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      const duplicate = await prisma.form.findFirst({
        where: {
          slug: formattedSlug,
          NOT: { id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: `Subdomain "${formattedSlug}" is already taken.` },
          { status: 400 }
        );
      }
      updatedSlug = formattedSlug;

      // Register with Cloudflare if configured
      createSubdomainDnsRecord(updatedSlug).catch(() => {});
    }

    // Process questions update if provided
    if (Array.isArray(body.questions)) {
      // Delete existing questions not in new list or replace
      await prisma.question.deleteMany({
        where: { formId: id },
      });

      for (let i = 0; i < body.questions.length; i++) {
        const q = body.questions[i];
        await prisma.question.create({
          data: {
            formId: id,
            title: q.title || "Untitled Question",
            description: q.description || null,
            type: q.type || "short_text",
            isRequired: Boolean(q.isRequired),
            options: q.options ? JSON.stringify(q.options) : null,
            points: Number(q.points || 0),
            correctAnswer: q.correctAnswer ? (typeof q.correctAnswer === "string" ? q.correctAnswer : JSON.stringify(q.correctAnswer)) : null,
            orderIndex: i,
          },
        });
      }
    }

    const updatedForm = await prisma.form.update({
      where: { id },
      data: {
        title: body.title !== undefined ? body.title : existingForm.title,
        description: body.description !== undefined ? body.description : existingForm.description,
        slug: updatedSlug,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : existingForm.isPublished,
        isAcceptingResponses:
          body.isAcceptingResponses !== undefined
            ? Boolean(body.isAcceptingResponses)
            : existingForm.isAcceptingResponses,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : body.expiresAt === null ? null : existingForm.expiresAt,
        requireGoogleLogin:
          body.requireGoogleLogin !== undefined
            ? Boolean(body.requireGoogleLogin)
            : existingForm.requireGoogleLogin,
        isQuiz: body.isQuiz !== undefined ? Boolean(body.isQuiz) : existingForm.isQuiz,
        showScoreAfterSubmit:
          body.showScoreAfterSubmit !== undefined
            ? Boolean(body.showScoreAfterSubmit)
            : existingForm.showScoreAfterSubmit,
        thankYouTitle: body.thankYouTitle || existingForm.thankYouTitle,
        thankYouMessage: body.thankYouMessage || existingForm.thankYouMessage,
        themeColor: body.themeColor || existingForm.themeColor,
      },
      include: {
        questions: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    return NextResponse.json({ form: updatedForm });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/forms/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userEmail = session.user.email.toLowerCase();
    const userIsAdmin = isAdmin(userEmail);

    const existingForm = await prisma.form.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (existingForm.user.email !== userEmail && !userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.form.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Form deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
