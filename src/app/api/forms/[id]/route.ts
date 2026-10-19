import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth-edge";
import { getFormById, updateForm, deleteForm, isSubdomainAvailable } from "@/lib/d1-store";
import { isAdmin, isValidSubdomain, slugify } from "@/lib/utils";
import { createSubdomainDnsRecord } from "@/lib/cloudflare";

export const runtime = "edge";

interface Params {
  params: { id: string };
}

// GET /api/forms/[id]
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

    return NextResponse.json({ form });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/forms/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userIsAdmin = isAdmin(user.email);

    const existingForm = await getFormById(id);
    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (existingForm.userId !== user.id && !userIsAdmin) {
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

      const available = await isSubdomainAvailable(formattedSlug, id);
      if (!available) {
        return NextResponse.json(
          { error: `Subdomain "${formattedSlug}" is already taken.` },
          { status: 400 }
        );
      }
      updatedSlug = formattedSlug;

      // Register with Cloudflare if configured
      createSubdomainDnsRecord(updatedSlug).catch(() => {});
    }

    const updated = await updateForm(id, {
      ...body,
      slug: updatedSlug,
    });

    return NextResponse.json({ form: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/forms/[id]
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const user = await getSessionUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const userIsAdmin = isAdmin(user.email);

    const existingForm = await getFormById(id);
    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (existingForm.userId !== user.id && !userIsAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteForm(id);
    return NextResponse.json({ success: true, message: "Form deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
