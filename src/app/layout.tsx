import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ZeForm. - Modern Form Builder with Custom Subdomains & Auto Scoring",
  description:
    "Build beautiful forms like Google Forms with custom subdomains (your-form.zeform.zenstro.space), automated expiration timers, instant quiz auto-scoring, and respondent Google tracking.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="font-semibold text-slate-700">
                ZeForm<span className="text-indigo-600 font-bold">.</span> &bull; Powered by Cloudflare &amp; Zenstro
              </div>
              <div className="flex items-center gap-4">
                <span>Subdomain: <code className="text-indigo-600">*.zeform.zenstro.space</code></span>
                <span>&bull;</span>
                <span>Admin: <code className="text-slate-600">ceo.shubhampathak@gmail.com</code></span>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
