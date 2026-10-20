import React from "react";
import Link from "next/link";
import { ArrowLeft, FileCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - ZeForm.",
  description: "Terms and conditions governing the use of the ZeForm form builder and subdomain service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-xl border border-slate-200 shadow-sm">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Terms and Conditions</h1>
              <p className="text-sm text-slate-500 mt-1">Effective Date: October 20, 2026</p>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing or using ZeForm (zeform.zenstro.space) or any associated custom subdomains, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any portion of these terms, you must discontinue use immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Acceptable Use Policy</h2>
            <p className="mb-2">You agree not to use ZeForm to create, host, or distribute:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Phishing schemes, credential harvesters, or deceptive password collection forms.</li>
              <li>Malicious software, viruses, or links to harmful websites.</li>
              <li>Content that violates third-party intellectual property or privacy rights.</li>
              <li>Unsolicited promotional content, pyramid schemes, or illegal activities.</li>
            </ul>
            <p className="mt-2">
              Any forms found violating these terms are subject to immediate termination and the associated account may be permanently suspended.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Subdomain Ownership and Reservation</h2>
            <p>
              ZeForm provides custom subdomains in the format of <code>[slug].zeform.zenstro.space</code>. We reserve the right to reclaim, modify, or reassign subdomains that infringe upon registered trademarks, impersonate public institutions, or remain dormant.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. User Content and Responses</h2>
            <p>
              Form creators retain full ownership of the questions and responses collected on their forms. You grant ZeForm a non-exclusive license solely to host, display, and process your forms and responses as directed by your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Service Availability and Modifications</h2>
            <p>
              We strive to provide uninterrupted service on Cloudflare Edge infrastructure. However, ZeForm is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. We may update features, modify infrastructure, or adjust rate limits without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, ZeForm and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from lost response data, service downtime, or unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">7. Contact Information</h2>
            <p>
              For legal inquiries or abuse reports regarding hosted forms, contact{" "}
              <a href="mailto:ceo.shubhampathak@gmail.com" className="text-indigo-600 font-semibold hover:underline">
                ceo.shubhampathak@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
