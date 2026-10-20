import { NextRequest, NextResponse } from "next/server";
import { getFormBySlug, isFormExpired } from "@/lib/d1-store";

export const runtime = "edge";

interface Params {
  params: { slug: string };
}

// GET /api/forms/public/[slug]
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;

    const form = await getFormBySlug(slug);

    if (!form || !form.isPublished) {
      return NextResponse.json({ error: "Form not found or unpublished" }, { status: 404 });
    }

    // Check if form is closed (either manually or timed out)
    if (!form.isAcceptingResponses) {
      return NextResponse.json({
        isClosed: true,
        reason: form.expiresAt && isFormExpired(form)
          ? `This form expired on ${new Date(form.expiresAt).toLocaleString()}.`
          : "This form is no longer accepting responses.",
        title: form.title,
        description: form.description,
      });
    }

    // Check if form has expired by scheduled date & time (and not manually reopened)
    if (isFormExpired(form)) {
      return NextResponse.json({
        isClosed: true,
        reason: `This form expired on ${new Date(form.expiresAt!).toLocaleString()}.`,
        title: form.title,
        description: form.description,
      });
    }

    // Sanitize questions so respondents cannot see correct answers in network tools
    const sanitizedQuestions = (form.questions || []).map((q) => {
      let parsedOptions = null;
      if (q.options) {
        try {
          parsedOptions = JSON.parse(q.options);
        } catch {
          parsedOptions = [];
        }
      }

      return {
        id: q.id,
        title: q.title,
        description: q.description,
        type: q.type,
        isRequired: q.isRequired,
        options: parsedOptions,
        points: form.isQuiz ? q.points : 0,
        orderIndex: q.orderIndex,
      };
    });

    return NextResponse.json({
      form: {
        id: form.id,
        title: form.title,
        description: form.description,
        slug: form.slug,
        creatorName: "Form Creator",
        requireGoogleLogin: form.requireGoogleLogin,
        isQuiz: form.isQuiz,
        themeColor: form.themeColor,
        expiresAt: form.expiresAt,
        questions: sanitizedQuestions,
      },
      isClosed: false,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
