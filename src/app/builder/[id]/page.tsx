"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  Save, 
  Eye, 
  Share2, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  ArrowLeft, 
  Settings, 
  Zap, 
  Clock, 
  Globe, 
  HelpCircle,
  GripVertical,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { MAIN_DOMAIN, isValidSubdomain, slugify, formatDateTime } from "@/lib/utils";

interface QuestionItem {
  id?: string;
  title: string;
  description?: string;
  type: string;
  isRequired: boolean;
  options?: string[];
  points: number;
  correctAnswer?: string;
  orderIndex: number;
}

interface FormData {
  id: string;
  title: string;
  description: string;
  slug: string;
  isPublished: boolean;
  isAcceptingResponses: boolean;
  expiresAt: string | null;
  requireGoogleLogin: boolean;
  isQuiz: boolean;
  showScoreAfterSubmit: boolean;
  thankYouTitle: string;
  thankYouMessage: string;
  themeColor: string;
  questions: QuestionItem[];
}

const QUESTION_TYPES = [
  { value: "short_text", label: "Short Answer" },
  { value: "paragraph", label: "Paragraph / Long Text" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "checkboxes", label: "Checkboxes (Multiple Answers)" },
  { value: "dropdown", label: "Dropdown Select" },
  { value: "rating", label: "Star Rating (1 - 5)" },
  { value: "number", label: "Number Input" },
  { value: "date", label: "Date Picker" },
];

export default function FormBuilder() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const formId = params?.id as string;

  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active builder tab
  const [activeTab, setActiveTab] = useState<"questions" | "settings" | "thankyou" | "share">("questions");

  // Subdomain validation state
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{ available?: boolean; reason?: string; suggestions?: string[] } | null>(null);

  // Share link copy state
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && formId) {
      loadForm();
    }
  }, [status, formId, router]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/forms/${formId}`);
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      if (data.form) {
        // Parse options in questions if string
        const parsedQuestions = (data.form.questions || []).map((q: any) => ({
          ...q,
          options: q.options
            ? typeof q.options === "string"
              ? JSON.parse(q.options)
              : q.options
            : ["Option 1", "Option 2"],
        }));
        setForm({
          ...data.form,
          questions: parsedQuestions,
        });
      }
    } catch (err) {
      console.error("Error loading form:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlugCheck = async (slugVal: string) => {
    if (!slugVal || slugVal.length < 3) {
      setSlugStatus(null);
      return;
    }
    if (form && slugVal === form.slug) {
      setSlugStatus({ available: true });
      return;
    }
    setSlugChecking(true);
    try {
      const res = await fetch(
        `/api/forms/check-subdomain?slug=${encodeURIComponent(slugVal)}&formId=${formId}`
      );
      const data = await res.json();
      setSlugStatus(data);
    } catch {
      setSlugStatus({ available: false, reason: "Error checking subdomain" });
    } finally {
      setSlugChecking(false);
    }
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          slug: form.slug,
          isAcceptingResponses: form.isAcceptingResponses,
          expiresAt: form.expiresAt,
          requireGoogleLogin: form.requireGoogleLogin,
          isQuiz: form.isQuiz,
          showScoreAfterSubmit: form.showScoreAfterSubmit,
          thankYouTitle: form.thankYouTitle,
          thankYouMessage: form.thankYouMessage,
          themeColor: form.themeColor,
          questions: form.questions,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        alert(data.error || "Failed to save form changes");
      }
    } catch (err: any) {
      alert(err.message || "Failed to save form");
    } finally {
      setSaving(false);
    }
  };

  // Question manipulation helpers
  const addQuestion = (type = "short_text") => {
    if (!form) return;
    const newQ: QuestionItem = {
      title: "Untitled Question",
      type,
      isRequired: false,
      options: ["Option 1", "Option 2"],
      points: form.isQuiz ? 5 : 0,
      correctAnswer: "",
      orderIndex: form.questions.length,
    };
    setForm({ ...form, questions: [...form.questions, newQ] });
  };

  const updateQuestion = (index: number, updates: Partial<QuestionItem>) => {
    if (!form) return;
    const updated = [...form.questions];
    updated[index] = { ...updated[index], ...updates };
    setForm({ ...form, questions: updated });
  };

  const deleteQuestion = (index: number) => {
    if (!form) return;
    const updated = form.questions.filter((_, i) => i !== index);
    setForm({ ...form, questions: updated });
  };

  const duplicateQuestion = (index: number) => {
    if (!form) return;
    const target = form.questions[index];
    const copy = {
      ...target,
      id: undefined,
      title: `${target.title} (Copy)`,
      orderIndex: form.questions.length,
    };
    setForm({ ...form, questions: [...form.questions, copy] });
  };

  // Option handlers for multiple choice / checkboxes
  const addOption = (qIndex: number) => {
    if (!form) return;
    const q = form.questions[qIndex];
    const opts = q.options || [];
    const newOpts = [...opts, `Option ${opts.length + 1}`];
    updateQuestion(qIndex, { options: newOpts });
  };

  const updateOption = (qIndex: number, optIndex: number, text: string) => {
    if (!form) return;
    const q = form.questions[qIndex];
    const newOpts = [...(q.options || [])];
    newOpts[optIndex] = text;
    updateQuestion(qIndex, { options: newOpts });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    if (!form) return;
    const q = form.questions[qIndex];
    const newOpts = (q.options || []).filter((_, i) => i !== optIndex);
    updateQuestion(qIndex, { options: newOpts });
  };

  const copyShareLink = () => {
    if (!form) return;
    const url = `https://${form.slug}.${MAIN_DOMAIN}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading || !form) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading ZeForm Builder...</p>
        </div>
      </div>
    );
  }

  const subdomainUrl = `https://${form.slug}.${MAIN_DOMAIN}`;
  const directUrl = `/f/${form.slug}`;

  return (
    <div className="min-h-screen bg-slate-100/70 pb-24">
      {/* Builder Top Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="text-lg font-bold text-slate-900 bg-transparent hover:bg-slate-50 px-2 py-0.5 rounded-lg border border-transparent focus:border-slate-300 focus:bg-white outline-none"
              placeholder="Form Title"
            />
            <div className="text-[11px] text-slate-500 px-2 flex items-center gap-1.5 font-mono">
              <Globe className="w-3 h-3 text-indigo-500" />
              <span>{form.slug}.{MAIN_DOMAIN}</span>
            </div>
          </div>
        </div>

        {/* Builder Center Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("questions")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "questions" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Questions ({form.questions.length})
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "settings" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Settings &amp; Expiry
          </button>
          <button
            onClick={() => setActiveTab("thankyou")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "thankyou" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Thank You Screen
          </button>
          <button
            onClick={() => setActiveTab("share")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "share" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Share &amp; Subdomain
          </button>
        </div>

        {/* Builder Actions */}
        <div className="flex items-center gap-2">
          {/* Live Preview Button */}
          <Link
            href={directUrl}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </Link>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Builder Canvas */}
      <div className="max-w-3xl mx-auto px-4 mt-8">
        {/* ================= TAB 1: QUESTIONS ================= */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            {/* Form Title & Description Card */}
            <div className="bg-white rounded-2xl border-t-8 border-indigo-600 p-6 sm:p-8 shadow-sm border-x border-b border-slate-200">
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full text-2xl sm:text-3xl font-black text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 outline-none pb-1"
                placeholder="Form Title"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full text-sm text-slate-600 mt-3 border-b border-transparent hover:border-slate-300 focus:border-indigo-600 outline-none resize-none"
                placeholder="Form description or instructions for respondents..."
              />

              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
                {form.isQuiz && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg font-bold">
                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                    Quiz Auto-Scoring Active
                  </span>
                )}
                {form.expiresAt && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Closes on {formatDateTime(form.expiresAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Questions List */}
            {form.questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-indigo-300 transition-all space-y-4"
              >
                {/* Question Header: Title & Type Selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-2/3">
                    <span className="font-bold text-slate-400 text-sm">{qIndex + 1}.</span>
                    <input
                      type="text"
                      value={question.title}
                      onChange={(e) => updateQuestion(qIndex, { title: e.target.value })}
                      placeholder="Question text..."
                      className="w-full font-bold text-base text-slate-900 border-b border-transparent hover:border-slate-200 focus:border-indigo-600 outline-none pb-1"
                    />
                  </div>

                  {/* Type dropdown */}
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(qIndex, { type: e.target.value })}
                    className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-indigo-600"
                  >
                    {QUESTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subtitle / Question Description */}
                <input
                  type="text"
                  value={question.description || ""}
                  onChange={(e) => updateQuestion(qIndex, { description: e.target.value })}
                  placeholder="Additional context or description (optional)"
                  className="w-full text-xs text-slate-500 border-b border-transparent hover:border-slate-200 focus:border-indigo-600 outline-none"
                />

                {/* Question Type Specific Inputs */}
                <div className="pt-2">
                  {/* Short Answer Preview */}
                  {question.type === "short_text" && (
                    <div className="w-full sm:w-1/2 p-2.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 font-mono">
                      Short text reply field
                    </div>
                  )}

                  {/* Paragraph Preview */}
                  {question.type === "paragraph" && (
                    <div className="w-full h-16 p-2.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 font-mono">
                      Paragraph / long answer reply field
                    </div>
                  )}

                  {/* Number Preview */}
                  {question.type === "number" && (
                    <div className="w-48 p-2.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 font-mono">
                      Number input (e.g. 42)
                    </div>
                  )}

                  {/* Date Preview */}
                  {question.type === "date" && (
                    <div className="w-48 p-2.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400 font-mono">
                      YYYY-MM-DD
                    </div>
                  )}

                  {/* Rating Preview */}
                  {question.type === "rating" && (
                    <div className="flex items-center gap-2 p-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-2xl text-amber-400">★</span>
                      ))}
                      <span className="text-xs text-slate-400 ml-2">(1 to 5 Stars)</span>
                    </div>
                  )}

                  {/* Multiple Choice / Checkboxes / Dropdown Options */}
                  {["multiple_choice", "checkboxes", "dropdown"].includes(question.type) && (
                    <div className="space-y-2 mt-2">
                      {(question.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs">
                            {question.type === "multiple_choice"
                              ? "○"
                              : question.type === "checkboxes"
                              ? "□"
                              : `${optIdx + 1}.`}
                          </span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(qIndex, optIdx, e.target.value)}
                            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white form-input-focus"
                          />
                          {(question.options || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, optIdx)}
                              className="text-slate-400 hover:text-red-500 p-1"
                              title="Remove Option"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Option</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Auto-Score Quiz Config (Visible if form.isQuiz is true) */}
                {form.isQuiz && (
                  <div className="mt-4 p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-purple-600" />
                        <span>Quiz Scoring &amp; Answer Key</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <label className="text-xs font-bold text-purple-900">Points:</label>
                        <input
                          type="number"
                          min="0"
                          value={question.points}
                          onChange={(e) =>
                            updateQuestion(qIndex, { points: parseInt(e.target.value) || 0 })
                          }
                          className="w-16 px-2 py-1 text-xs rounded border border-purple-300 bg-white font-bold text-center"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-purple-800 uppercase tracking-wider mb-1">
                        Correct Answer (for auto score):
                      </label>

                      {["multiple_choice", "dropdown"].includes(question.type) ? (
                        <select
                          value={question.correctAnswer || ""}
                          onChange={(e) => updateQuestion(qIndex, { correctAnswer: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-purple-300 bg-white text-slate-800"
                        >
                          <option value="">-- Select Correct Option --</option>
                          {(question.options || []).map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={question.correctAnswer || ""}
                          onChange={(e) => updateQuestion(qIndex, { correctAnswer: e.target.value })}
                          placeholder="Type exact answer (e.g. 42 or Paris)"
                          className="w-full text-xs px-3 py-2 rounded-lg border border-purple-300 bg-white text-slate-800"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Bottom Card Controls: Required toggle, Duplicate, Delete */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-semibold select-none">
                    <input
                      type="checkbox"
                      checked={question.isRequired}
                      onChange={(e) => updateQuestion(qIndex, { isRequired: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span>Required question</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => duplicateQuestion(qIndex)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Duplicate Question"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuestion(qIndex)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Question Floating / Canvas Button */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => addQuestion("short_text")}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-indigo-600 font-bold text-xs uppercase tracking-wider rounded-xl border border-indigo-200 shadow-sm hover:shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: SETTINGS & EXPIRY ================= */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Subdomain Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                <span>Custom Subdomain URL</span>
              </h3>
              <p className="text-xs text-slate-500">
                Choose the exact subdomain for this form. Respondents will access it at this unique address.
              </p>

              <div>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => {
                      const val = slugify(e.target.value);
                      setForm({ ...form, slug: val });
                      handleSlugCheck(val);
                    }}
                    placeholder="my-form-name"
                    className="w-full px-3.5 py-2.5 text-sm bg-transparent outline-none font-mono"
                  />
                  <span className="px-4 py-2.5 bg-slate-100 text-xs text-slate-600 font-mono flex items-center border-l border-slate-200 font-bold">
                    .{MAIN_DOMAIN}
                  </span>
                </div>

                {slugChecking && (
                  <p className="text-[11px] text-slate-400 mt-1">Checking availability...</p>
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
                              <span>Available Suggestions (Click to apply):</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {slugStatus.suggestions.map((sug) => (
                                <button
                                  key={sug}
                                  type="button"
                                  onClick={() => {
                                    setForm({ ...form, slug: sug });
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
            </div>

            {/* Access & Expiry Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <span>Form Status &amp; Auto-Expiry Scheduling</span>
              </h3>

              {/* Manual Toggle Switch */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <div className="text-sm font-bold text-slate-900">Accept Responses</div>
                  <div className="text-xs text-slate-500">
                    Immediately open or pause responses manually
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isAcceptingResponses: !form.isAcceptingResponses })}
                  className="flex items-center gap-1 text-sm font-bold text-slate-800"
                >
                  {form.isAcceptingResponses ? (
                    <ToggleRight className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-400" />
                  )}
                  <span>{form.isAcceptingResponses ? "Active (ON)" : "Closed (OFF)"}</span>
                </button>
              </div>

              {/* Automatic Expiry Date & Time */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Automatic Expiry Date &amp; Time
                  </div>
                  <div className="text-xs text-slate-500">
                    Set a time for the form to close itself automatically. When expired, respondents will see a closed message.
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="datetime-local"
                    value={
                      form.expiresAt
                        ? new Date(form.expiresAt).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className="w-full sm:w-auto px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                  />

                  {form.expiresAt && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, expiresAt: null })}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Clear Expiry Date
                    </button>
                  )}
                </div>

                {form.expiresAt && (
                  <div className="text-xs text-indigo-700 font-semibold bg-indigo-50 p-2 rounded-lg">
                    Form will automatically stop accepting responses on {formatDateTime(form.expiresAt)}.
                  </div>
                )}
              </div>

              {/* Require Google Sign-In */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div>
                  <div className="text-sm font-bold text-slate-900">Require Google Sign-in</div>
                  <div className="text-xs text-slate-500">
                    Respondents must log in with their Google email to submit. Records their verified email.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.requireGoogleLogin}
                  onChange={(e) => setForm({ ...form, requireGoogleLogin: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>

              {/* Quiz Mode Enable */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-purple-50/50">
                <div>
                  <div className="text-sm font-bold text-purple-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span>Quiz &amp; Auto-Score Evaluation</span>
                  </div>
                  <div className="text-xs text-purple-700">
                    Enables point assigning and instant automated grading upon submission
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.isQuiz}
                  onChange={(e) => setForm({ ...form, isQuiz: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: THANK YOU SCREEN ================= */}
        {activeTab === "thankyou" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Customize Confirmation / Thank You Page
              </h3>
              <p className="text-xs text-slate-500">
                Configure what the respondent sees after clicking Submit.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Thank You Heading
                </label>
                <input
                  type="text"
                  value={form.thankYouTitle}
                  onChange={(e) => setForm({ ...form, thankYouTitle: e.target.value })}
                  placeholder="e.g. Thank You! Your response has been saved."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 form-input-focus"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirmation Message
                </label>
                <textarea
                  rows={3}
                  value={form.thankYouMessage}
                  onChange={(e) => setForm({ ...form, thankYouMessage: e.target.value })}
                  placeholder="e.g. We have received your answers. You will receive further updates shortly."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 form-input-focus"
                />
              </div>

              {form.isQuiz && (
                <div className="flex items-center justify-between p-4 rounded-xl border border-purple-200 bg-purple-50">
                  <div>
                    <div className="text-xs font-bold text-purple-900">
                      Show Quiz Score to Respondent
                    </div>
                    <div className="text-[11px] text-purple-700">
                      Displays respondent's score immediately on the confirmation screen (e.g. "Score: 40/50")
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.showScoreAfterSubmit}
                    onChange={(e) => setForm({ ...form, showScoreAfterSubmit: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Thank You Preview */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-3">
                Confirmation Screen Preview
              </span>
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black text-slate-900 mb-1">
                {form.thankYouTitle || "Thank You!"}
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mb-3">
                {form.thankYouMessage || "Your response has been recorded successfully."}
              </p>
              {form.isQuiz && form.showScoreAfterSubmit && (
                <div className="inline-block px-4 py-1.5 bg-purple-100 text-purple-800 rounded-full font-bold text-xs">
                  Your Score: 85 / 100
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: SHARE & SUBDOMAIN ================= */}
        {activeTab === "share" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-600" />
                <span>Share Your ZeForm</span>
              </h3>
              <p className="text-xs text-slate-500">
                Share your branded subdomain link with your audience.
              </p>
            </div>

            {/* Subdomain link */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Branded Subdomain Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={subdomainUrl}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-slate-200 bg-slate-50 text-indigo-600 font-bold"
                />
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? "Copied!" : "Copy"}</span>
                </button>
                <Link
                  href={directUrl}
                  target="_blank"
                  className="p-2.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl"
                  title="Open Form"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Direct fallback link */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Direct Path Alternative Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://${MAIN_DOMAIN}${directUrl}`}
                  className="flex-1 px-4 py-2 text-xs font-mono rounded-xl border border-slate-200 bg-slate-50 text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://${MAIN_DOMAIN}${directUrl}`);
                    alert("Direct path link copied!");
                  }}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Copy
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Both links automatically route to the same form and collect replies in the same dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
