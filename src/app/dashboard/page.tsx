"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Globe, 
  ToggleLeft, 
  ToggleRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  BarChart2, 
  Sparkles,
  Zap,
  AlertCircle
} from "lucide-react";
import { MAIN_DOMAIN, formatDateTime } from "@/lib/utils";

interface FormItem {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  isPublished: boolean;
  isAcceptingResponses: boolean;
  expiresAt: string | null;
  isQuiz: boolean;
  createdAt: string;
  _count: {
    responses: number;
    questions: number;
  };
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // New form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{ available?: boolean; reason?: string; suggestions?: string[] } | null>(null);
  const [isQuiz, setIsQuiz] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchForms();
    }
  }, [status, router]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/forms");
      const data = await res.json();
      if (data.forms) {
        setForms(data.forms);
      }
    } catch (err) {
      console.error("Failed to load forms", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlugCheck = async (slugVal: string) => {
    if (!slugVal || slugVal.length < 3) {
      setSlugStatus(null);
      return;
    }
    setSlugChecking(true);
    try {
      const res = await fetch(`/api/forms/check-subdomain?slug=${encodeURIComponent(slugVal)}`);
      const data = await res.json();
      setSlugStatus(data);
    } catch {
      setSlugStatus({ available: false, reason: "Error checking subdomain" });
    } finally {
      setSlugChecking(false);
    }
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    setCreating(true);

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          slug: newSlug || undefined,
          isQuiz,
        }),
      });

      const data = await res.json();
      if (res.ok && data.form) {
        setIsModalOpen(false);
        router.push(`/builder/${data.form.id}`);
      } else {
        alert(data.error || "Failed to create form");
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleAccepting = async (form: FormItem) => {
    try {
      const updatedStatus = !form.isAcceptingResponses;
      const res = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAcceptingResponses: updatedStatus }),
      });
      if (res.ok) {
        setForms((prev) =>
          prev.map((f) => (f.id === form.id ? { ...f, isAcceptingResponses: updatedStatus } : f))
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDeleteForm = async (formId: string, formTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${formTitle}"? All responses will be permanently removed.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/forms/${formId}`, { method: "DELETE" });
      if (res.ok) {
        setForms((prev) => prev.filter((f) => f.id !== formId));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const copyLink = (slug: string) => {
    const url = `https://${slug}.${MAIN_DOMAIN}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const totalResponses = forms.reduce((acc, f) => acc + (f._count?.responses || 0), 0);
  const activeFormsCount = forms.filter((f) => {
    const notExpired = !f.expiresAt || new Date() < new Date(f.expiresAt);
    return f.isAcceptingResponses && notExpired;
  }).length;

  if (status === "loading" || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading your ZeForm dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>My ZeForms</span>
            <span className="text-indigo-600 font-extrabold">*</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your live forms, subdomains, auto-score quizzes, and customer responses.
          </p>
        </div>

        <button
          onClick={() => {
            setNewTitle("");
            setNewSlug("");
            setSlugStatus(null);
            setIsQuiz(false);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Form</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{forms.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Forms Created
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalResponses}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Replies Received
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{activeFormsCount}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Live &amp; Accepting Subdomains
            </div>
          </div>
        </div>
      </div>

      {/* Forms List Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">Your Forms ({forms.length})</h2>
      </div>

      {/* Forms Grid */}
      {forms.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No forms yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Create your first form with a custom subdomain like <code className="text-indigo-600">my-survey.{MAIN_DOMAIN}</code>.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Form Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => {
            const isExpired = form.expiresAt && new Date() > new Date(form.expiresAt);
            const isLive = form.isAcceptingResponses && !isExpired;
            const fullSubdomainUrl = `https://${form.slug}.${MAIN_DOMAIN}`;
            const directPathUrl = `/f/${form.slug}`;

            return (
              <div
                key={form.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        isLive
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : isExpired
                          ? "bg-red-100 text-red-800 border border-red-300"
                          : "bg-slate-100 text-slate-700 border border-slate-300"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isLive ? "bg-emerald-600 animate-pulse" : isExpired ? "bg-red-600" : "bg-slate-500"
                        }`}
                      />
                      {isLive ? "Accepting Responses" : isExpired ? "Expired" : "Closed (Paused)"}
                    </span>

                    {form.isQuiz && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-extrabold bg-purple-100 text-purple-700 border border-purple-200">
                        <Zap className="w-3 h-3 text-purple-600" />
                        Auto Score Quiz
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 line-clamp-1 mb-1">
                    {form.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
                    {form.description || "No description provided."}
                  </p>

                  {/* Subdomain pill */}
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Globe className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span className="font-mono text-xs text-slate-800 font-semibold truncate">
                        {form.slug}.{MAIN_DOMAIN}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyLink(form.slug)}
                        title="Copy Subdomain Link"
                        className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded transition-colors"
                      >
                        {copiedSlug === form.slug ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <Link
                        href={directPathUrl}
                        target="_blank"
                        title="Open Live Form"
                        className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Expiry / Schedule info */}
                  {form.expiresAt && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {isExpired ? "Closed automatically on:" : "Scheduled to close on:"}{" "}
                        <strong className="text-slate-700">{formatDateTime(form.expiresAt)}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Bottom Controls */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between">
                  {/* ON / OFF toggle */}
                  <button
                    onClick={() => handleToggleAccepting(form)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
                    title={form.isAcceptingResponses ? "Click to Pause (Turn OFF)" : "Click to Resume (Turn ON)"}
                  >
                    {form.isAcceptingResponses ? (
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-slate-400" />
                    )}
                    <span>{form.isAcceptingResponses ? "Live" : "Off"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* View Responses */}
                    <Link
                      href={`/dashboard/forms/${form.id}/responses`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                    >
                      <BarChart2 className="w-3.5 h-3.5" />
                      <span>{form._count.responses} Replies</span>
                    </Link>

                    {/* Edit Builder */}
                    <Link
                      href={`/builder/${form.id}`}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg border border-slate-200 transition-colors shadow-2xs"
                      title="Edit Form"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteForm(form.id, form.title)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Form"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                <span>Create New Form</span>
                <span className="text-indigo-600">*</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Set a title and claim your custom subdomain link.
              </p>
            </div>

            <form onSubmit={handleCreateForm} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Form Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newSlug) {
                      const autoSlug = e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "");
                      setNewSlug(autoSlug);
                      handleSlugCheck(autoSlug);
                    }
                  }}
                  placeholder="e.g. Feedback Survey 2026"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 form-input-focus"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Custom Subdomain <span className="text-indigo-600">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    your-form.{MAIN_DOMAIN}
                  </span>
                </div>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100">
                  <input
                    type="text"
                    value={newSlug}
                    onChange={(e) => {
                      const val = e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, "");
                      setNewSlug(val);
                      handleSlugCheck(val);
                    }}
                    placeholder="my-cool-form"
                    className="w-full px-3.5 py-2 text-sm bg-transparent outline-none font-mono"
                  />
                  <span className="px-3 py-2 bg-slate-100 text-xs text-slate-500 font-mono flex items-center border-l border-slate-200">
                    .{MAIN_DOMAIN}
                  </span>
                </div>

                {/* Subdomain status */}
                {slugChecking && (
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    Checking availability...
                  </p>
                )}
                {!slugChecking && slugStatus && (
                  <div className="mt-2 text-xs">
                    {slugStatus.available ? (
                      <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Subdomain is available!
                      </span>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                        <div className="flex items-start gap-1.5 font-semibold text-xs leading-relaxed text-amber-800">
                          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>{slugStatus.reason}</span>
                        </div>

                        {slugStatus.suggestions && slugStatus.suggestions.length > 0 && (
                          <div className="pt-2 border-t border-amber-200">
                            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-indigo-600" />
                              <span>Available Suggestions (Click to select):</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {slugStatus.suggestions.map((sug) => (
                                <button
                                  key={sug}
                                  type="button"
                                  onClick={() => {
                                    setNewSlug(sug);
                                    setSlugStatus({ available: true, suggestions: [] });
                                  }}
                                  className="px-2.5 py-1 text-xs font-mono font-bold bg-white hover:bg-indigo-50 text-indigo-700 hover:text-indigo-900 border border-indigo-200 hover:border-indigo-400 rounded-lg shadow-2xs transition-all flex items-center gap-1"
                                >
                                  <span>{sug}</span>
                                  <span className="text-[10px] text-emerald-600 font-extrabold">✓ Available</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quiz Mode Switch */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                    <span>Auto-Score / Quiz Mode</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Assign points and calculate instant scores on submission
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isQuiz}
                  onChange={(e) => setIsQuiz(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newTitle || (slugStatus !== null && !slugStatus.available)}
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create & Open Builder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
