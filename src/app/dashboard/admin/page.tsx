"use client";
export const runtime = "edge";

import React, { useEffect, useState } from "react";
import { useSession } from "@/components/Providers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  BarChart3, 
  Globe, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Server, 
  RefreshCw,
  Eye,
  Clock,
  Zap,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { ADMIN_EMAIL, MAIN_DOMAIN, formatDateTime } from "@/lib/utils";

interface PlatformUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  formsCount: number;
  totalResponsesReceived: number;
  forms: Array<{
    id: string;
    title: string;
    slug: string;
    isAcceptingResponses: boolean;
    createdAt: string;
    _count: { responses: number };
  }>;
}

interface PlatformForm {
  id: string;
  title: string;
  slug: string;
  isAcceptingResponses: boolean;
  isQuiz: boolean;
  expiresAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  _count: {
    responses: number;
    questions: number;
  };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"users" | "forms" | "cloudflare">("users");
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [forms, setForms] = useState<PlatformForm[]>([]);
  const [cfStatus, setCfStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const userEmail = session?.user?.email?.toLowerCase();
  const isMasterAdmin = userEmail === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && isMasterAdmin) {
      loadAdminData();
    }
  }, [status, isMasterAdmin, router]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, formsRes, cfRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/forms"),
        fetch("/api/cloudflare/status"),
      ]);

      const [usersData, formsData, cfData] = await Promise.all([
        usersRes.json(),
        formsRes.json(),
        cfRes.json(),
      ]);

      if (usersData.users) setUsers(usersData.users);
      if (formsData.forms) setForms(formsData.forms);
      if (cfData) setCfStatus(cfData);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFormStatus = async (formId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAcceptingResponses: !currentStatus }),
      });
      if (res.ok) {
        setForms((prev) =>
          prev.map((f) => (f.id === formId ? { ...f, isAcceptingResponses: !currentStatus } : f))
        );
      }
    } catch (err) {
      console.error("Admin toggle error", err);
    }
  };

  if (status === "loading" || (status === "authenticated" && isMasterAdmin && loading)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">
            Verifying Master Admin authorization...
          </p>
        </div>
      </div>
    );
  }

  // Security gate: only ceo.shubhampathak@gmail.com
  if (!isMasterAdmin) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-red-200 shadow-xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Admin Access Restricted</h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          The ZeForm Admin Panel is strictly protected and exclusively authorized for{" "}
          <strong className="font-mono text-indigo-600">{ADMIN_EMAIL}</strong>.
        </p>
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm"
        >
          <span>Sign In as Master Admin</span>
        </Link>
      </div>
    );
  }

  // Calculated Stats
  const totalSubmissions = forms.reduce((acc, f) => acc + (f._count?.responses || 0), 0);
  const totalQuestions = forms.reduce((acc, f) => acc + (f._count?.questions || 0), 0);

  const filteredForms = forms.filter(
    (f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-200" />
              <span>Master Administrator Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              ZeForm. System Operations
            </h1>
            <p className="text-amber-100 text-sm mt-1 max-w-xl">
              Logged in as <strong className="font-mono underline">{userEmail}</strong>. You have full oversight of all platform users, generated forms, and response telemetry.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold backdrop-blur-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Users
            </span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{users.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Registered Google accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Forms
            </span>
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{forms.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Across all user accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Submissions
            </span>
            <BarChart3 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalSubmissions}</div>
          <p className="text-[11px] text-slate-400 mt-1">Answers collected platform-wide</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Domain Engine
            </span>
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-base font-bold text-slate-900 truncate font-mono">
            *.{MAIN_DOMAIN}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Wildcard Routing Ready</p>
        </div>
      </div>

      {/* Tabs & Search Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "users"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("forms")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "forms"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Platform Forms ({forms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("cloudflare")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "cloudflare"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Cloudflare &amp; DNS</span>
          </button>
        </div>

        {/* Global Search Bar */}
        {activeTab !== "cloudflare" && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user email, slug, form title..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white form-input-focus"
            />
          </div>
        )}
      </div>

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              User Accounts Directory ({filteredUsers.length})
            </h2>
            <span className="text-xs text-slate-500">
              Every user who creates an account via Google
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">User / Email</th>
                  <th className="py-3 px-6">Joined Date</th>
                  <th className="py-3 px-6 text-center">Forms Created</th>
                  <th className="py-3 px-6 text-center">Total Replies Received</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No users match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isCEO = u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                              {(u.name || u.email).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{u.name || "Anonymous User"}</span>
                                {isCEO && (
                                  <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 border border-amber-300 rounded text-[9px] font-black uppercase">
                                    Master CEO
                                  </span>
                                )}
                              </div>
                              <div className="font-mono text-slate-500 text-[11px]">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-6 text-slate-600">
                          {formatDateTime(u.createdAt)}
                        </td>

                        <td className="py-3.5 px-6 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-800">
                            {u.formsCount}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                            {u.totalResponsesReceived}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-right">
                          <button
                            onClick={() => {
                              setSearchQuery(u.email);
                              setActiveTab("forms");
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs transition-colors"
                          >
                            <span>Inspect Forms ({u.formsCount})</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PLATFORM FORMS EXPLORER */}
      {activeTab === "forms" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Platform Forms Directory ({filteredForms.length})
            </h2>
            <span className="text-xs text-slate-500">
              Full admin access to inspect and manage any user's form
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Form Title / Subdomain</th>
                  <th className="py-3 px-6">Creator</th>
                  <th className="py-3 px-6">Status / Expiry</th>
                  <th className="py-3 px-6 text-center">Questions</th>
                  <th className="py-3 px-6 text-center">Replies</th>
                  <th className="py-3 px-6 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredForms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No forms found.
                    </td>
                  </tr>
                ) : (
                  filteredForms.map((form) => {
                    const isExpired = form.expiresAt && new Date() > new Date(form.expiresAt);
                    const isLive = form.isAcceptingResponses && !isExpired;

                    return (
                      <tr key={form.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="font-bold text-slate-900 text-sm line-clamp-1">
                            {form.title}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-indigo-600 font-semibold text-[11px]">
                              {form.slug}.{MAIN_DOMAIN}
                            </span>
                            {form.isQuiz && (
                              <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">
                                Quiz
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-6">
                          <div className="font-semibold text-slate-800">
                            {form.user.name || "User"}
                          </div>
                          <div className="font-mono text-slate-500 text-[11px]">
                            {form.user.email}
                          </div>
                        </td>

                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isLive ? "bg-emerald-500" : isExpired ? "bg-red-500" : "bg-slate-400"
                              }`}
                            />
                            <span className="font-bold text-slate-700">
                              {isLive ? "Active" : isExpired ? "Expired" : "Off"}
                            </span>
                          </div>
                          {form.expiresAt && (
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              Exp: {formatDateTime(form.expiresAt)}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-6 text-center">
                          <span className="font-bold text-slate-700">
                            {form._count.questions}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-center">
                          <Link
                            href={`/dashboard/forms/${form.id}/responses`}
                            className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors"
                          >
                            {form._count.responses} Replies
                          </Link>
                        </td>

                        <td className="py-3.5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle ON/OFF */}
                            <button
                              onClick={() => handleToggleFormStatus(form.id, form.isAcceptingResponses)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 rounded"
                              title={form.isAcceptingResponses ? "Admin Pause Form" : "Admin Resume Form"}
                            >
                              {form.isAcceptingResponses ? (
                                <ToggleRight className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-slate-400" />
                              )}
                            </button>

                            {/* Open live form */}
                            <Link
                              href={`/f/${form.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 rounded"
                              title="Preview Public Form"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* Access Builder */}
                            <Link
                              href={`/builder/${form.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CLOUDFLARE & DOMAIN CONFIG */}
      {activeTab === "cloudflare" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Cloudflare Edge & DNS Infrastructure
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live Edge Routing, Automated Custom Subdomains, and Database for{" "}
                    <code className="text-indigo-600 font-bold">{MAIN_DOMAIN}</code>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  All Systems Operational & Automated
                </div>
                <button
                  onClick={loadAdminData}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Refresh Cloudflare Status"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Cloudflare Zone
                  </span>
                  <Globe className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-base font-bold text-slate-900">
                  {cfStatus?.zoneName || "zenstro.space"}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active & Verified</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Wildcard Subdomains
                  </span>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-base font-bold text-slate-900">
                  *.zeform.{cfStatus?.zoneName || "zenstro.space"}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Proxied (Orange Cloud)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Custom Subdomains
                  </span>
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-base font-bold text-slate-900">
                  Automated via API
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Auto SSL & Zero-Config</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Cloudflare D1 Database
                  </span>
                  <Server className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-base font-bold text-slate-900">
                  {cfStatus?.d1Database?.name || "zeform-db"}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bound & Connected</span>
                </div>
              </div>
            </div>

            {/* Active DNS Records Table */}
            <div className="space-y-4 mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Active Cloudflare DNS Routing Records
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <th className="py-3 px-4">Record Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Target Content</th>
                      <th className="py-3 px-4">Proxy Status</th>
                      <th className="py-3 px-4">Purpose</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">*.zeform.zenstro.space</td>
                      <td className="py-3 px-4 text-indigo-600 font-bold">CNAME</td>
                      <td className="py-3 px-4 text-slate-600">zeform.pages.dev</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-orange-600 font-bold">
                          ● Proxied (CDN + WAF)
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-600">
                        Dynamic subdomains (e.g. <code>custom.zeform.zenstro.space</code>)
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-sans font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">zeform.zenstro.space</td>
                      <td className="py-3 px-4 text-indigo-600 font-bold">CNAME</td>
                      <td className="py-3 px-4 text-slate-600">zeform.pages.dev</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-orange-600 font-bold">
                          ● Proxied (CDN + WAF)
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-600">
                        Primary ZeForm web app & admin console
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-sans font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* How Automation Works */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Zero-Config Automated Provisioning
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                ZeForm automates custom subdomains natively via Cloudflare Edge API. When any user sets a custom subdomain slug on their form, the system immediately binds it to Cloudflare Pages, generates a Google CA TLS/SSL certificate, and resolves incoming traffic in under 5 milliseconds via Next.js Edge Middleware.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-0.5">1. Subdomain Assigned</div>
                  <div className="text-slate-500 text-[11px]">User chooses custom slug on form settings</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-0.5">2. Edge API Registered</div>
                  <div className="text-slate-500 text-[11px]">Automatic Cloudflare Pages domain registration</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-0.5">3. Instant SSL & Live</div>
                  <div className="text-slate-500 text-[11px]">Edge certificate issued with zero manual DNS edits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
