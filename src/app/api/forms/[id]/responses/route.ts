import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth-edge";
import { getFormById, getFormResponses } from "@/lib/d1-store";
import { isAdmin } from "@/lib/utils";

export const runtime = "edge";

interface Params {
  params: { id: string };
}

// GET /api/forms/[id]/responses
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userIsAdmin = isAdmin(user.email);

    const form = await getFormById(id);
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.userId !== user.id && !userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const responses = await getFormResponses(id);

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
