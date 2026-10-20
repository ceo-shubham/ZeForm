import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://zeform.zenstro.space"),
  title: "ZeForm. - Custom Subdomain Forms & Instant Quiz Evaluation",
  description:
    "Build clean, familiar forms like Google Forms with custom subdomains (your-form.zeform.zenstro.space). Features verified Google login, instant auto-scoring, and scheduled deadlines.",
  keywords: [
    "custom subdomain forms",
    "google forms alternative",
    "form builder custom domain",
    "quiz auto score",
    "google login forms",
    "scheduled form closing",
    "cloudflare forms",
    "zeform"
  ],
  authors: [{ name: "ZeForm" }],
  creator: "ZeForm",
  publisher: "ZeForm",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://zeform.zenstro.space",
  },
  openGraph: {
    title: "ZeForm. - Custom Subdomain Forms & Instant Quiz Evaluation",
    description:
      "Create forms under your own dedicated URL (e.g. your-name.zeform.zenstro.space). Instant quiz auto-scoring and Google respondent verification.",
    url: "https://zeform.zenstro.space",
    siteName: "ZeForm.",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZeForm. - Custom Subdomain Forms",
    description:
      "Google Forms simplicity with dedicated subdomains and instant quiz grading.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://zeform.zenstro.space/#webapp",
      "name": "ZeForm.",
      "url": "https://zeform.zenstro.space",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description":
        "A form and quiz builder with dedicated custom subdomains, Google OAuth respondent verification, and automated quiz evaluation.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "featureList": [
        "Dedicated Custom Subdomains (*.zeform.zenstro.space)",
        "Instant Quiz Auto-Scoring",
        "Scheduled Expiration Timers",
        "Google Account Respondent Verification",
        "Cloudflare Edge Deployment"
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://zeform.zenstro.space/#organization",
      "name": "ZeForm",
      "url": "https://zeform.zenstro.space",
      "logo": "https://zeform.zenstro.space/icon.svg"
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">
                    ZeForm<span className="text-indigo-600">.</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span>Forms hosted on dedicated subdomains</span>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-slate-600">
                  <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="hover:text-slate-900 transition-colors">
                    Terms &amp; Conditions
                  </Link>
                  <Link href="/auth/signin" className="hover:text-slate-900 transition-colors">
                    Sign In
                  </Link>
                  <a 
                    href="https://github.com/ceo-shubham/ZeForm" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:text-slate-900 transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px]">
                <span>&copy; {new Date().getFullYear()} ZeForm. All rights reserved.</span>
                <span>Powered by Cloudflare Pages &amp; D1 Edge Infrastructure</span>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
