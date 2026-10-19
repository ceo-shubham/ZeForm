import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  BarChart3,
  Sliders,
  Mail,
  Zap
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6 tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>THE MODERN GOOGLE FORMS ALTERNATIVE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Create Forms with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
                Custom Subdomains
              </span>{" "}
              &amp; Superpowers
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
              Design powerful forms in seconds. Give every form its own dedicated link like{" "}
              <span className="font-mono font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                xxxx.zeform.zenstro.space
              </span>
              , auto-score quiz replies, set auto-expiry deadlines, and track Google respondent emails.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5"
              >
                <span>Get Started with Google</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
              >
                <span>Explore Features</span>
              </Link>
            </div>
          </div>

          {/* Interactive Form Visual Mockup */}
          <div className="mt-14 max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Browser top bar */}
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 font-mono text-slate-400 flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-md">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  https://<strong className="text-white">annual-tech-survey</strong>.zeform.zenstro.space
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Accepting Responses
                </span>
              </div>
            </div>

            {/* Form Header Sample */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <div className="inline-block px-2.5 py-1 bg-white/20 rounded-md text-xs font-semibold uppercase tracking-wider mb-2">
                Sample ZeForm Preview
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">
                Developer Community Survey 2026
              </h2>
              <p className="text-indigo-100 text-sm">
                Sign in with Google enabled &bull; Automatic quiz evaluation &bull; Instant Results
              </p>
            </div>

            {/* Questions preview */}
            <div className="p-6 sm:p-8 space-y-6 bg-slate-50/60">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-800">
                    1. Which cloud and form tool do you prefer? <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                    +10 Points (Auto Score)
                  </span>
                </div>
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg border border-indigo-500 bg-indigo-50/50 text-indigo-900 font-medium text-sm">
                    <div className="w-4 h-4 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-600" />
                    </div>
                    <span>ZeForm with Custom Subdomains</span>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 text-slate-700 text-sm">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                    <span>Traditional Google Forms</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <label className="text-sm font-bold text-slate-800 block mb-2">
                  2. Share your feedback or requirements:
                </label>
                <div className="w-full h-16 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-400">
                  Type your detailed reply here...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
              All-In-One Form Engine
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Everything you requested, built right in
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Custom Subdomains */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Custom Subdomain Routing
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Give your form any unique name you want. It immediately resolves at{" "}
                <code className="text-indigo-600 bg-indigo-50 px-1 py-0.5 rounded text-xs font-bold">
                  xxxx.zeform.zenstro.space
                </code>{" "}
                via Cloudflare DNS wildcard mapping.
              </p>
            </div>

            {/* Card 2: Auto Scoring & Quiz */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Auto-Score &amp; Quiz Engine
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Assign points to questions and set correct answers. The engine instantly evaluates submissions and provides automated score reports to respondents.
              </p>
            </div>

            {/* Card 3: Form Status & Expiry Timer */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Live Toggle &amp; Auto-Expiry
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Turn your form ON or OFF with a single toggle, or schedule a future date and time for the form to close itself automatically.
              </p>
            </div>

            {/* Card 4: Google Login & Respondent Capture */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Respondent Email Tracking
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Know exactly which Google account submitted each reply. Require Google sign-in to prevent spam and maintain a clean respondent log.
              </p>
            </div>

            {/* Card 5: Customizable Thank You Screen */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-5">
                <Sliders className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Custom Thank You Page
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Personalize what the user sees after submitting: custom title, custom instructions, celebratory messages, and score summaries.
              </p>
            </div>

            {/* Card 6: Master Admin Access */}
            <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/30 hover:bg-white hover:border-amber-400 hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Master Admin Portal
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Solely dedicated to <code className="text-amber-800 font-bold">ceo.shubhampathak@gmail.com</code>. View all registered users, their emails, their forms, and access any form across the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 font-bold text-2xl mb-4">
            <span>ZeForm</span>
            <span className="text-indigo-400 text-3xl leading-none">*</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to launch your custom form link?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Log in with your Google account, pick your subdomain, add your questions, and start collecting responses immediately.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <span>Sign In &amp; Launch a Form</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
