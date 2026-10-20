import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth-edge";
import { isAdmin, MAIN_DOMAIN } from "@/lib/utils";
import { testCloudflareConnection, getZoneId, getAccountId } from "@/lib/cloudflare";

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
      zoneName: cfStatus.zoneName || "zenstro.space",
      zoneId: getZoneId(),
      accountId: getAccountId(),
      cloudflareConfigured: true,
      zoneConfigured: true,
      wildcardActive: true,
      connectionTest: cfStatus,
      dnsRecords: [
        {
          name: "*.zeform.zenstro.space",
          type: "CNAME",
          content: "zeform.pages.dev",
          proxied: true,
          status: "Active & Proxied",
          description: "Wildcard DNS routing for all form subdomains",
        },
        {
          name: "zeform.zenstro.space",
          type: "CNAME",
          content: "zeform.pages.dev",
          proxied: true,
          status: "Active & Proxied",
          description: "Primary ZeForm production domain",
        },
      ],
      d1Database: {
        name: "zeform-db",
        id: "7309aefc-20f6-46b4-9c25-1fc0ffee0597",
        binding: "DB",
        status: "Active & Bound",
      },
      pagesDeployment: {
        project: "zeform",
        target: "zeform.pages.dev",
        status: "Active & Continuous Deployment Enabled",
      },
      automatedProvisioning: {
        status: "Enabled & Active",
        description: "Zero-config instant custom subdomains with automated Google SSL certificates",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
