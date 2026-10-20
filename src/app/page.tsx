import React from "react";
import Link from "next/link";
import { 
  Globe, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Sliders,
  Mail,
  Zap,
  CheckCircle2,
  Lock,
  Layers
} from "lucide-react";
import HeroFormPreview from "@/components/HeroFormPreview";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-[#fbfbfe] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Clean tag badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Free Custom Subdomains on Cloudflare Edge</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
              Google Forms simplicity,{" "}
              <span className="text-indigo-600">
                your own custom subdomain.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Build clean, familiar forms in seconds. Launch them under your dedicated URL like{" "}
              <span className="font-mono font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-sm">
                your-name.zeform.zenstro.space
              </span>
              , auto-score quiz replies, and track verified respondent Google emails.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
              >
                <span>Create a Form with Google</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-all"
              >
                <span>How It Works</span>
              </Link>
            </div>
          </div>

          {/* Authentic Interactive Preview Component */}
          <HeroFormPreview />
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              Engineered for Speed &amp; Control
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Everything you need to collect and evaluate submissions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Custom Subdomains */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Custom Subdomain Routing
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose any custom slug. Your form is immediately accessible at{" "}
                <code className="text-indigo-600 font-medium">
                  your-form.zeform.zenstro.space
                </code>{" "}
                with free automatic SSL.
              </p>
            </div>

            {/* Card 2: Auto Scoring & Quiz */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Instant Quiz Auto-Scoring
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Assign points to questions and mark correct answers. Responses are automatically scored and results are calculated instantly.
              </p>
            </div>

            {/* Card 3: Form Status & Expiry Timer */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Live Toggle &amp; Auto-Expiry
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Turn responses ON or OFF anytime, or set an automated date and time deadline when the link will close automatically.
              </p>
            </div>

            {/* Card 4: Google Login & Respondent Capture */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Verified Google Respondent ID
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Require respondents to sign in with their Google account to prevent spam, duplicate submissions, and maintain an audit log.
              </p>
            </div>

            {/* Card 5: Customizable Thank You Screen */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Custom Thank You Screen
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Personalize post-submission messages: custom headline, instructions, redirect notes, and auto-score summaries for quizzes.
              </p>
            </div>

            {/* Card 6: Master Admin Access */}
            <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Master Admin Portal
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dedicated administration for <code className="text-slate-800 font-semibold">ceo.shubhampathak@gmail.com</code> to monitor registered users, emails, and forms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to launch your form?
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
            Sign in with Google, pick your custom link, add your questions, and start receiving verified replies right now.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg shadow-sm transition-all"
          >
            <span>Sign In with Google</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
