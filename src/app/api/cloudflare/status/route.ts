import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin, MAIN_DOMAIN } from "@/lib/utils";
import { testCloudflareConnection } from "@/lib/cloudflare";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase();

    if (!session || !isAdmin(userEmail)) {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const cfStatus = await testCloudflareConnection();

    return NextResponse.json({
      mainDomain: MAIN_DOMAIN,
      cloudflareConfigured: Boolean(process.env.CLOUDFLARE_API_TOKEN),
      zoneIdConfigured: Boolean(process.env.CLOUDFLARE_ZONE_ID),
      connectionTest: cfStatus,
      instructions: {
        wildcardDns: `Add a CNAME record in Cloudflare: Name = *.zeform, Target = ${MAIN_DOMAIN} (or your server/Vercel CNAME) with Proxy turned ON. This immediately powers all your-form.zeform.zenstro.space custom subdomains!`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
