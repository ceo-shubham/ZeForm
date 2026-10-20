import React from "react";
import Link from "next/link";
import { 
  Globe, 
  Clock, 
  ArrowRight, 
  Sliders,
  Mail,
  Zap,
  CheckCircle2,
  Lock,
  Download,
  HelpCircle
} from "lucide-react";
import HeroFormPreview from "@/components/HeroFormPreview";

export const runtime = "edge";

const faqList = [
  {
    question: "How do custom subdomains work in ZeForm?",
    answer: "Every form you create can be given a unique subdomain slug (for example, feedback.zeform.zenstro.space). When a respondent visits that URL, Cloudflare Edge DNS routes the request directly to your form and automatically provisions an SSL certificate."
  },
  {
    question: "Can I require respondents to sign in with their Google account?",
    answer: "Yes. When building your form, you can enable Google Account Verification. When enabled, respondents must sign in with Google before submitting, allowing you to capture verified respondent email addresses and prevent anonymous duplicate entries."
  },
  {
    question: "How does quiz auto-scoring work?",
    answer: "You can convert any form into an auto-scored quiz by specifying point values and correct answer keys for multiple choice questions. ZeForm automatically evaluates submissions upon arrival and presents instant score reports to respondents."
  },
  {
    question: "Can I set an automatic closing date for form submissions?",
    answer: "Yes. You can toggle forms ON or OFF manually at any time, or configure an automated expiration date and time. Once the deadline passes, ZeForm closes the form and displays your custom closed message."
  },
  {
    question: "How do I export response data?",
    answer: "Form creators can review individual submissions, monitor real-time response tables, and export all respondent answers as CSV files for analysis in Google Sheets or Microsoft Excel."
  },
  {
    question: "Is ZeForm free to use?",
    answer: "Yes. Creating forms, assigning custom subdomains on zeform.zenstro.space, using Google OAuth respondent tracking, and evaluating quizzes are completely free to use."
  }
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqList.map((item) => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* FAQ Schema for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Section */}
      <section className="pt-12 pb-16 lg:pt-16 lg:pb-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Direct, clean status tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>Dedicated Custom Subdomains on Cloudflare Edge</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
              Create forms and surveys on your own custom subdomain
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Build clean, familiar forms in seconds. Publish under your dedicated link like{" "}
              <span className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-sm">
                your-form.zeform.zenstro.space
              </span>
              , evaluate quizzes with auto-scoring, and capture verified Google logins.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/auth/signin"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-xs transition-all"
              >
                <span>Create a Form with Google</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-all"
              >
                <span>Feature Details</span>
              </Link>
            </div>
          </div>

          {/* Interactive Preview Component */}
          <HeroFormPreview />
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Core Capabilities
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Form creation, routing, and submission management
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Custom Subdomains */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-xs">
              <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Custom Subdomain Routing
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Assign any available subdomain slug. Your form resolves globally at{" "}
                <code className="text-indigo-600 font-medium">
                  your-form.zeform.zenstro.space
                </code>{" "}
                with automated SSL certificate generation.
              </p>
            </div>

            {/* Card 2: Auto Scoring & Quiz */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-xs">
              <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Instant Quiz Auto-Scoring
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Assign points to questions and specify correct answer keys. Submissions are graded immediately upon arrival with respondent score breakdowns.
              </p>
            </div>

            {/* Card 3: Form Status & Expiry Timer */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-xs">
              <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Live Toggle &amp; Auto-Expiry
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Control form availability with an immediate active toggle, or set an automated expiration date and time to close submissions without manual intervention.
              </p>
            </div>

            {/* Card 4: Google Login & Respondent Capture */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-xs">
              <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Verified Google Respondent ID
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Require respondents to sign in through Google OAuth before submitting. Capture authentic email identities and eliminate anonymous spam.
              </p>
            </div>

            {/* Card 5: Customizable Thank You Screen */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-xs">
              <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Custom Post-Submission Page
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Define custom thank you messages, completion instructions, next steps, and quiz score reviews displayed to users after form submission.
              </p>
            </div>

            {/* Card 6: Response Export & Data Management */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white shadow-xs">
              <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                CSV Export &amp; Response Table
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Inspect every submission directly in your dashboard with full question answers, timestamps, and verified email records, or export as CSV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (SEO & High Search Intent) */}
      <section id="faq" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Frequently Asked Questions
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Common questions about ZeForm
            </h3>
          </div>

          <div className="space-y-4">
            {faqList.map((item, idx) => (
              <details
                key={idx}
                className="group p-5 rounded-lg border border-slate-200 bg-slate-50/50 open:bg-white open:border-slate-300 transition-colors"
              >
                <summary className="flex items-center justify-between font-semibold text-slate-900 text-sm cursor-pointer list-none">
                  <span>{item.question}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">
                    ↓
                  </span>
                </summary>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed pt-2 border-t border-slate-100">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Start creating your form
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
            Sign in with Google, pick your custom link, add your questions, and start collecting verified responses.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-md shadow-xs transition-all"
          >
            <span>Sign In with Google</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
