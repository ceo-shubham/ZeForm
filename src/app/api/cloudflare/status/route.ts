import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth-edge";
import { isAdmin, MAIN_DOMAIN } from "@/lib/utils";
import { testCloudflareConnection } from "@/lib/cloudflare";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUserFromRequest(req);
    const userEmail = user?.email?.toLowerCase();

    if (!user || !isAdmin(userEmail)) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const cfStatus = await testCloudflareConnection();

    return NextResponse.json({
      mainDomain: MAIN_DOMAIN,
      cloudflareConfigured: Boolean(process.env.CLOUDFLARE_API_TOKEN),
      zoneIdConfigured: Boolean(process.env.CLOUDFLARE_ZONE_ID),
      connectionTest: cfStatus,
      instructions: {
        wildcardDns: `Add a CNAME record in Cloudflare: Name = *.zeform, Target = ${MAIN_DOMAIN} with Proxy turned ON. This immediately powers all your-form.zeform.zenstro.space custom subdomains!`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
