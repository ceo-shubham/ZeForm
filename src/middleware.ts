import { NextRequest, NextResponse } from "next/server";
import { RESERVED_SUBDOMAINS } from "@/lib/utils";

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Define root domains for both production and local development
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || "zeform.zenstro.space";

  // Check if current host has a subdomain
  let currentSubdomain: string | null = null;

  if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
    const parts = hostname.split(":");
    const domainParts = parts[0].split(".");
    if (domainParts.length > 1 && domainParts[0] !== "localhost" && domainParts[0] !== "127") {
      currentSubdomain = domainParts[0];
    }
  } else if (hostname.endsWith(`.${mainDomain}`)) {
    currentSubdomain = hostname.replace(`.${mainDomain}`, "");
  } else if (hostname.endsWith(".zenstro.space") && hostname !== "zeform.zenstro.space") {
    // In case user sets xxxx.zeform.zenstro.space
    const withoutSuffix = hostname.replace(".zenstro.space", "");
    if (withoutSuffix.endsWith(".zeform")) {
      currentSubdomain = withoutSuffix.replace(".zeform", "");
    }
  }

  // If we found a valid custom subdomain that isn't a reserved keyword
  if (currentSubdomain && !RESERVED_SUBDOMAINS.includes(currentSubdomain.toLowerCase())) {
    const pathname = url.pathname === "/" ? "" : url.pathname;
    // Transparently rewrite to the public subdomain form route
    return NextResponse.rewrite(
      new URL(`/forms/subdomain/${currentSubdomain}${pathname}`, req.url)
    );
  }

  return NextResponse.next();
}
