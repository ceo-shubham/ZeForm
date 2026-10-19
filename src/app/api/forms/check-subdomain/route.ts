import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidSubdomain, slugify } from "@/lib/utils";

// GET /api/forms/check-subdomain?slug=my-form&formId=optional
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get("slug") || "";
    const currentFormId = searchParams.get("formId");

    const slug = slugify(rawSlug);
    const validation = isValidSubdomain(slug);

    if (!validation.valid) {
      return NextResponse.json({
        available: false,
        slug,
        reason: validation.error,
      });
    }

    const existing = await prisma.form.findFirst({
      where: {
        slug,
        ...(currentFormId ? { NOT: { id: currentFormId } } : {}),
      },
    });

    if (existing) {
      return NextResponse.json({
        available: false,
        slug,
        reason: `Subdomain "${slug}" is already in use by another form`,
      });
    }

    return NextResponse.json({
      available: true,
      slug,
      fullDomain: `${slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || "zeform.zenstro.space"}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
