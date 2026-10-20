import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth-edge";
import { getFormBySlug, submitFormResponse, isFormExpired } from "@/lib/d1-store";

export const runtime = "edge";

interface Params {
  params: { slug: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { slug } = params;
    const body = await req.json();
    const { answers, respondentEmail: providedEmail, respondentName: providedName } = body;

    const form = await getFormBySlug(slug);

    if (!form || !form.isPublished) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.isAcceptingResponses) {
      return NextResponse.json({ error: "Form is no longer accepting responses" }, { status: 400 });
    }

    if (isFormExpired(form)) {
      return NextResponse.json({ error: "This form has expired" }, { status: 400 });
    }

    // Check if Google Login was required
    const sessionUser = await getSessionUserFromRequest(req);
    let capturedEmail = sessionUser?.email || providedEmail || null;
    let capturedName = sessionUser?.name || providedName || null;

    if (form.requireGoogleLogin && !sessionUser?.email) {
      return NextResponse.json(
        { error: "Google Sign-in is required to submit this form" },
        { status: 403 }
      );
    }

    // Format answers array
    const answersArray: { questionId: string; value: any }[] = [];
    for (const q of form.questions || []) {
      const val = answers?.[q.id];
      if (q.isRequired && (val === undefined || val === null || val === "")) {
        return NextResponse.json(
          { error: `Field "${q.title}" is required.` },
          { status: 400 }
        );
      }
      answersArray.push({ questionId: q.id, value: val ?? "" });
    }

    const result = await submitFormResponse({
      formId: form.id,
      respondentEmail: capturedEmail,
      respondentName: capturedName,
      answers: answersArray,
    });

    return NextResponse.json({
      success: true,
      responseId: result.responseId,
      totalScore: form.isQuiz ? result.totalScore : null,
      maxScore: form.isQuiz ? result.maxScore : null,
      showScoreAfterSubmit: form.showScoreAfterSubmit,
      isQuiz: form.isQuiz,
      thankYouTitle: form.thankYouTitle,
      thankYouMessage: form.thankYouMessage,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
