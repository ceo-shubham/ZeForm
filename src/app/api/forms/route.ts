import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { slugify, isValidSubdomain } from "@/lib/utils";
import { createSubdomainDnsRecord } from "@/lib/cloudflare";

// GET /api/forms - Get user's forms
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const forms = await prisma.form.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: {
            responses: true,
            questions: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ forms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/forms - Create a new form
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
    while (await prisma.form.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const form = await prisma.form.create({
      data: {
        title,
        description: body.description || "Please fill out this form.",
        slug: finalSlug,
        userId: user.id,
        isPublished: true,
        isAcceptingResponses: true,
        isQuiz: Boolean(body.isQuiz),
        questions: {
          create: [
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
        },
      },
      include: {
        questions: true,
      },
    });

    // Optionally attempt Cloudflare CNAME registration in the background
    createSubdomainDnsRecord(finalSlug).catch((err) =>
      console.warn("Cloudflare DNS auto-record warning:", err)
    );

    return NextResponse.json({ form }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
