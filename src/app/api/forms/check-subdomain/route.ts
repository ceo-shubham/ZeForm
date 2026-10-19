import { NextRequest, NextResponse } from "next/server";
import { isSubdomainAvailable } from "@/lib/d1-store";
import { isValidSubdomain, slugify, MAIN_DOMAIN, RESERVED_SUBDOMAINS } from "@/lib/utils";

export const runtime = "edge";

// GET /api/forms/check-subdomain?slug=my-form&formId=optional
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get("slug") || "";
    const currentFormId = searchParams.get("formId") || undefined;

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

    const available = await isSubdomainAvailable(slug, currentFormId);

    if (!available) {
      const candidateList = [
        `${slug}-2026`,
        `${slug}-form`,
        `${slug}-app`,
        `get-${slug}`,
        `${slug}-live`,
        `${slug}-hub`,
        `${slug}-${Math.floor(100 + Math.random() * 899)}`,
      ];

      const freeSuggestions: string[] = [];
      for (const cand of candidateList) {
        if (!RESERVED_SUBDOMAINS.includes(cand) && isValidSubdomain(cand).valid) {
          const isFree = await isSubdomainAvailable(cand);
          if (isFree) {
            freeSuggestions.push(cand);
            if (freeSuggestions.length >= 4) break;
          }
        }
      }

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
