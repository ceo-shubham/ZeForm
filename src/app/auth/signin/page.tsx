"use client";

import React, { useState } from "react";
import { signIn } from "@/components/Providers";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, ArrowRight, Sparkles } from "lucide-react";
import { ADMIN_EMAIL } from "@/lib/utils";

export const runtime = "edge";

export default function SignInPage() {
  const router = useRouter();
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleAdminQuickSignIn = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: ADMIN_EMAIL, name: "Shubham Pathak (CEO)" }),
      });
      if (res.ok) {
        window.location.href = "/dashboard/admin";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/quick-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: customEmail, name: customName || customEmail.split("@")[0] }),
      });
      if (res.ok) {
        window.location.href = "/dashboard";
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center bg-gradient-to-b from-indigo-50/60 to-white border-b border-slate-100">
          <div className="flex items-center justify-center font-black text-3xl tracking-tight text-slate-900">
            <span>ZeForm</span>
            <span className="text-indigo-600 text-4xl font-black leading-none">.</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Sign in to create, manage, and monitor your forms
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Official Google Login Button */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-sm hover:shadow transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              (Uses Google OAuth when GOOGLE_CLIENT_ID is configured)
            </p>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs uppercase font-bold text-slate-400 tracking-wider">
              Quick Sign In Options
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Quick Sign-In as Master Admin */}
          <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                CEO / Master Admin Access
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-extrabold uppercase">
                Admin
              </span>
            </div>
            <p className="text-xs text-amber-800 mb-3">
              Sign in as <strong className="font-mono">{ADMIN_EMAIL}</strong> to test the full Admin Dashboard.
            </p>
            <button
              onClick={handleAdminQuickSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login as Master Admin</span>
            </button>
          </div>

          {/* Sign in with test email */}
          <form onSubmit={handleCustomSignIn} className="space-y-3 pt-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Or Sign In with Any Email
            </label>
            <input
              type="email"
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="e.g. user@zenstro.space"
              required
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white form-input-focus"
            />
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Your Name (Optional)"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white form-input-focus"
            />
            <button
              type="submit"
              disabled={loading || !customEmail}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm transition-colors disabled:opacity-50"
            >
              <User className="w-4 h-4" />
              <span>Enter ZeForm Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
