"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "@/components/Providers";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Lock, 
  Send, 
  LogIn, 
  Zap, 
  Sparkles,
  FileText,
  AlertCircle
} from "lucide-react";

interface PublicQuestion {
  id: string;
  title: string;
  description?: string;
  type: string;
  isRequired: boolean;
  options?: string[];
  points: number;
}

interface PublicFormData {
  id: string;
  title: string;
  description: string;
  slug: string;
  creatorName: string;
  requireGoogleLogin: boolean;
  isQuiz: boolean;
  themeColor: string;
  expiresAt: string | null;
  questions: PublicQuestion[];
}

export default function PublicFormView({ slug }: { slug: string }) {
  const { data: session, status } = useSession();

  const [form, setForm] = useState<PublicFormData | null>(null);
  const [isClosed, setIsClosed] = useState(false);
  const [closedReason, setClosedReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);

  // Form answer state: questionId -> value (string or string[])
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Optional manual email/name if not using Google login
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    fetchFormData();
  }, [slug]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/forms/public/${slug}`);
      const data = await res.json();

      if (data.isClosed) {
        setIsClosed(true);
        setClosedReason(data.reason || "This form is no longer accepting responses.");
      } else if (data.form) {
        setForm(data.form);
      } else {
        setIsClosed(true);
        setClosedReason("Form not found or has been removed.");
      }
    } catch (err) {
      setIsClosed(true);
      setClosedReason("Unable to reach ZeForm server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (qId: string, optionValue: string, checked: boolean) => {
    const currentList: string[] = Array.isArray(answers[qId]) ? [...answers[qId]] : [];
    if (checked) {
      if (!currentList.includes(optionValue)) currentList.push(optionValue);
    } else {
      const idx = currentList.indexOf(optionValue);
      if (idx > -1) currentList.splice(idx, 1);
    }
    setAnswers({ ...answers, [qId]: currentList });
    if (validationErrors[qId]) {
      const errs = { ...validationErrors };
      delete errs[qId];
      setValidationErrors(errs);
    }
  };

  const handleTextChange = (qId: string, val: any) => {
    setAnswers({ ...answers, [qId]: val });
    if (validationErrors[qId]) {
      const errs = { ...validationErrors };
      delete errs[qId];
      setValidationErrors(errs);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    // Validate required questions
    const errors: Record<string, string> = {};
    for (const q of form.questions) {
      if (q.isRequired) {
        const a = answers[q.id];
        if (a === undefined || a === null || a === "" || (Array.isArray(a) && a.length === 0)) {
          errors[q.id] = "This is a required question";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/forms/public/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          respondentEmail: session?.user?.email || guestEmail || null,
          respondentName: session?.user?.name || guestName || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedResult(data);
      } else {
        alert(data.error || "Failed to submit response");
      }
    } catch (err: any) {
      alert(err.message || "Failed to submit response");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100/70 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading ZeForm...</p>
        </div>
      </div>
    );
  }

  // Form Closed / Expired Screen
  if (isClosed || !form) {
    return (
      <div className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Form Closed</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            {closedReason}
          </p>
          <div className="pt-6 border-t border-slate-100 text-xs text-slate-400">
            Powered by <strong>ZeForm.</strong> &bull; Custom Form Engine
          </div>
        </div>
      </div>
    );
  }

  // Submission Completed / Thank You Screen
  if (submittedResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-12 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            {submittedResult.thankYouTitle || "Thank You!"}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
            {submittedResult.thankYouMessage || "Your response has been recorded successfully."}
          </p>

          {/* Auto-Score Quiz Result Banner */}
          {submittedResult.isQuiz && submittedResult.showScoreAfterSubmit && (
            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 my-6">
              <div className="text-xs uppercase font-extrabold text-purple-700 tracking-wider mb-1 flex items-center justify-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-600" />
                <span>Auto-Score Evaluation</span>
              </div>
              <div className="text-3xl font-black text-purple-900">
                {submittedResult.totalScore ?? 0}{" "}
                <span className="text-base font-semibold text-purple-600">
                  / {submittedResult.maxScore ?? 0} Points
                </span>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <span>Submitted via</span>
            <span className="font-bold text-slate-700">
              ZeForm<span className="text-indigo-600 font-bold">.</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Google Login Gate
  if (form.requireGoogleLogin && !session?.user) {
    return (
      <div className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Google Sign-in Required</h2>
          <p className="text-sm text-slate-600 mb-6">
            The creator of <strong>{form.title}</strong> requires respondents to verify their Google identity before submitting.
          </p>
          <button
            onClick={() => signIn("google-clients", { callbackUrl: window.location.href })}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Google (Client)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Form Header Card */}
        <div className="bg-white rounded-2xl border-t-8 border-indigo-600 p-6 sm:p-8 shadow-sm border-x border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            {form.title}
          </h1>

          {form.description && (
            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed mb-4">
              {form.description}
            </p>
          )}

          {/* User Sign-In Banner */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            {session?.user?.email ? (
              <div className="text-slate-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  Responding as: <strong className="font-mono text-slate-800">{session.user.email}</strong>
                </span>
              </div>
            ) : (
              <div className="text-slate-500">
                Responses are anonymous &bull; <span className="text-red-500">* Required fields</span>
              </div>
            )}

            {form.isQuiz && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-extrabold flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-600" />
                Scored Quiz
              </span>
            )}
          </div>
        </div>

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {form.questions.map((q, idx) => {
            const hasError = validationErrors[q.id];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border p-6 sm:p-7 shadow-sm transition-all ${
                  hasError ? "border-red-400 ring-2 ring-red-100" : "border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <label className="text-base font-bold text-slate-900 leading-snug">
                    {idx + 1}. {q.title}{" "}
                    {q.isRequired && <span className="text-red-500 font-bold">*</span>}
                  </label>

                  {form.isQuiz && q.points > 0 && (
                    <span className="flex-shrink-0 text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-extrabold border border-purple-200">
                      {q.points} pts
                    </span>
                  )}
                </div>

                {q.description && (
                  <p className="text-xs text-slate-500 mb-4">{q.description}</p>
                )}

                {/* Input Controls */}
                <div className="mt-3">
                  {/* Short text */}
                  {q.type === "short_text" && (
                    <input
                      type="text"
                      value={answers[q.id] || ""}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder="Your answer"
                      className="w-full sm:w-3/4 px-3.5 py-2 text-sm border-b-2 border-slate-200 focus:border-indigo-600 outline-none transition-colors"
                    />
                  )}

                  {/* Paragraph */}
                  {q.type === "paragraph" && (
                    <textarea
                      rows={3}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder="Your answer"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 form-input-focus resize-none"
                    />
                  )}

                  {/* Multiple Choice (Radio) */}
                  {q.type === "multiple_choice" && (
                    <div className="space-y-2.5 mt-2">
                      {(q.options || []).map((opt, optIdx) => {
                        const isSelected = answers[q.id] === opt;
                        return (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium"
                                : "border-slate-200 hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={isSelected}
                              onChange={() => handleTextChange(q.id, opt)}
                              className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-sm">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Checkboxes (Multi Select) */}
                  {q.type === "checkboxes" && (
                    <div className="space-y-2.5 mt-2">
                      {(q.options || []).map((opt, optIdx) => {
                        const isChecked =
                          Array.isArray(answers[q.id]) && answers[q.id].includes(opt);
                        return (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? "border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium"
                                : "border-slate-200 hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleCheckboxChange(q.id, opt, e.target.checked)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className="text-sm">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Dropdown */}
                  {q.type === "dropdown" && (
                    <select
                      value={answers[q.id] || ""}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      className="w-full sm:w-2/3 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white form-input-focus"
                    >
                      <option value="">-- Choose an option --</option>
                      {(q.options || []).map((opt, optIdx) => (
                        <option key={optIdx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Rating (1 to 5 Stars) */}
                  {q.type === "rating" && (
                    <div className="flex items-center gap-3 py-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = (answers[q.id] || 0) >= star;
                        return (
                          <button
                            type="button"
                            key={star}
                            onClick={() => handleTextChange(q.id, star)}
                            className="text-3xl transition-transform hover:scale-125 focus:outline-none"
                          >
                            <span className={active ? "text-amber-400" : "text-slate-300"}>
                              ★
                            </span>
                          </button>
                        );
                      })}
                      {answers[q.id] && (
                        <span className="text-xs font-bold text-slate-500 ml-2">
                          {answers[q.id]} / 5 Stars
                        </span>
                      )}
                    </div>
                  )}

                  {/* Number */}
                  {q.type === "number" && (
                    <input
                      type="number"
                      value={answers[q.id] || ""}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder="0"
                      className="w-48 px-3.5 py-2 text-sm rounded-xl border border-slate-200 form-input-focus"
                    />
                  )}

                  {/* Date */}
                  {q.type === "date" && (
                    <input
                      type="date"
                      value={answers[q.id] || ""}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      className="w-48 px-3.5 py-2 text-sm rounded-xl border border-slate-200 form-input-focus"
                    />
                  )}
                </div>

                {/* Validation Error Message */}
                {hasError && (
                  <p className="text-xs text-red-500 mt-2 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{hasError}</span>
                  </p>
                )}
              </div>
            );
          })}

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Submitting..." : "Submit Response"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm("Clear all answers?")) {
                  setAnswers({});
                  setValidationErrors({});
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Clear form
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 py-6">
          Powered by <strong>ZeForm.</strong> &bull; Custom Subdomain Form Engine
        </div>
      </div>
    </div>
  );
}
