import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import type { Metadata } from "next";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Privacy Policy - ZeForm.",
  description: "Learn how ZeForm collects, uses, and protects your personal information and form data.",
};

export default function PrivacyPolicyPage() {
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
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
              <p className="text-sm text-slate-500 mt-1">Effective Date: October 20, 2026</p>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Overview</h2>
            <p>
              ZeForm (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the form creation and response platform available at zeform.zenstro.space and its designated subdomains. We take data privacy seriously and are committed to protecting the personal information of form creators and respondents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Information We Collect</h2>
            <p className="mb-2">We collect only the information necessary to provide our services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Google Account Information:</strong> When you sign in using Google OAuth (either as a form creator or as a respondent), we receive your Google identifier, email address, name, and profile image URL. We use this solely to authenticate your identity and attribute form responses.
              </li>
              <li>
                <strong>Form Data:</strong> Titles, descriptions, question configurations, point allocations, expiration timers, and custom subdomains created by form authors.
              </li>
              <li>
                <strong>Form Responses:</strong> Answers submitted by respondents, timestamps, evaluated scores (for quizzes), and the respondent&apos;s verified Google email if required by the form author.
              </li>
              <li>
                <strong>Technical Logs:</strong> Standard web traffic information such as IP addresses, browser user-agents, and referrer headers collected by Cloudflare infrastructure to prevent denial-of-service and abuse.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide, operate, and maintain form creation and delivery infrastructure.</li>
              <li>To calculate automated quiz scores and generate respondent reports.</li>
              <li>To enforce form access permissions and expiration schedules.</li>
              <li>To prevent fraudulent, spam, or abusive form submissions.</li>
              <li>We do not sell, rent, or monetize your personal information or form submissions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Data Storage and Security</h2>
            <p>
              All application data is stored in serverless relational databases (Cloudflare D1) with encryption at rest and in transit (TLS 1.3). Access to administrative tools is restricted to authorized personnel.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Google API Services User Data Policy</h2>
            <p>
              ZeForm&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{" "}
              <a 
                href="https://developers.google.com/terms/api-services-user-data-policy" 
                target="_blank" 
                rel="noreferrer" 
                className="text-indigo-600 hover:underline"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">6. Your Rights &amp; Data Deletion</h2>
            <p>
              Form creators have the right to delete their forms and all associated responses at any time directly through their dashboard. Respondents who wish to have their submitted replies purged may contact the respective form author or email us directly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">7. Contact Us</h2>
            <p>
              If you have any questions or privacy concerns regarding ZeForm, contact our administration team at{" "}
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
