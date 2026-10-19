import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth-edge";
import { getFormsByUser, createForm, isSubdomainAvailable } from "@/lib/d1-store";
import { slugify } from "@/lib/utils";
import { createSubdomainDnsRecord, registerPagesCustomDomain } from "@/lib/cloudflare";

export const runtime = "edge";

// GET /api/forms - Get user's forms
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const forms = await getFormsByUser(user.id);
    return NextResponse.json({ forms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/forms - Create a new form
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const title = body.title?.trim() || "Untitled Form";

    // Generate unique slug
    let baseSlug = body.slug ? slugify(body.slug) : slugify(title);
    if (!baseSlug || baseSlug.length < 3) {
      baseSlug = `form-${Date.now().toString().slice(-6)}`;
    }

    let finalSlug = baseSlug;
    let counter = 1;
    while (!(await isSubdomainAvailable(finalSlug))) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const form = await createForm({
      userId: user.id,
      title,
      description: body.description || "Please fill out this form.",
      slug: finalSlug,
      isPublished: true,
      isAcceptingResponses: true,
      isQuiz: Boolean(body.isQuiz),
      questions: [
        {
          title: "What is your name?",
          type: "short_text",
          isRequired: true,
          orderIndex: 0,
        },
        {
          title: "What is your feedback or message?",
          type: "paragraph",
          isRequired: false,
          orderIndex: 1,
        },
      ],
    });

    // Attempt Cloudflare DNS and Pages custom domain registration in background
    createSubdomainDnsRecord(finalSlug).catch((err) =>
      console.warn("Cloudflare DNS auto-record warning:", err)
    );
    registerPagesCustomDomain(finalSlug).catch((err) =>
      console.warn("Cloudflare Pages custom domain warning:", err)
    );

    return NextResponse.json({ form }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
