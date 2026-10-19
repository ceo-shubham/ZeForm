import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isValidSubdomain, slugify, MAIN_DOMAIN, RESERVED_SUBDOMAINS } from "@/lib/utils";

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
        suggestions: [],
      });
    }

    const existing = await prisma.form.findFirst({
      where: {
        slug,
        ...(currentFormId ? { NOT: { id: currentFormId } } : {}),
      },
    });

    if (existing) {
      // Generate intelligent alternative suggestions
      const candidateList = [
        `${slug}-2026`,
        `${slug}-form`,
        `${slug}-app`,
        `get-${slug}`,
        `${slug}-live`,
        `${slug}-hub`,
        `${slug}-${Math.floor(100 + Math.random() * 899)}`,
      ];

      // Filter candidates that are valid and not reserved
      const validCandidates = candidateList.filter((c) => {
        const v = isValidSubdomain(c);
        return v.valid && !RESERVED_SUBDOMAINS.includes(c);
      });

      // Check which candidates are already taken in the database
      const takenForms = await prisma.form.findMany({
        where: {
          slug: { in: validCandidates },
        },
        select: { slug: true },
      });

      const takenSlugs = new Set(takenForms.map((f) => f.slug));
      const freeSuggestions = validCandidates.filter((c) => !takenSlugs.has(c)).slice(0, 4);

      return NextResponse.json({
        available: false,
        slug,
        reason: `Subdomain "${slug}.${MAIN_DOMAIN}" pehle se hi kisi user dwara LIVE hai! Kripya niche diye gaye suggestions me se choose karein ya naya naam dalein.`,
        suggestions: freeSuggestions,
      });
    }

    return NextResponse.json({
      available: true,
      slug,
      fullDomain: `${slug}.${MAIN_DOMAIN}`,
      suggestions: [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
