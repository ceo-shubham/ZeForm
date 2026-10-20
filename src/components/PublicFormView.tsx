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
  AlertCircle,
  Check
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
    <div className="min-h-screen bg-[#ede7f6]/60 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Form Header Card */}
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-[0_1px_3px_rgba(60,64,67,0.15)] overflow-hidden">
          <div className="h-2.5 bg-indigo-600 w-full" />
          <div className="p-6 sm:p-7">
            <h1 className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight mb-2">
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
                <div className="text-slate-600 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                    {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <span>
                    Responding as: <strong className="text-slate-800">{session.user.email}</strong>
                  </span>
                  <button 
                    type="button"
                    onClick={() => signIn("google-clients", { callbackUrl: window.location.href })}
                    className="text-indigo-600 hover:underline cursor-pointer ml-1"
                  >
                    Switch account
                  </button>
                </div>
              ) : (
                <div className="text-slate-500">
                  Responses are anonymous
                </div>
              )}

              {form.isQuiz && (
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs font-semibold flex items-center gap-1 border border-purple-200">
                  <Zap className="w-3 h-3 text-purple-600" />
                  Scored Quiz
                </span>
              )}
            </div>

            <div className="mt-3 text-xs text-red-500 font-normal">
              * Indicates required question
            </div>
          </div>
        </div>

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {form.questions.map((q, idx) => {
            const hasError = validationErrors[q.id];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-lg border shadow-[0_1px_3px_rgba(60,64,67,0.15)] p-6 transition-all focus-within:border-l-4 focus-within:border-l-indigo-600 ${
                  hasError 
                    ? "border-red-400 border-l-4 border-l-red-500" 
                    : "border-slate-200/90"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <label className="text-sm sm:text-base font-normal text-slate-900 leading-snug">
                    {idx + 1}. {q.title}{" "}
                    {q.isRequired && <span className="text-red-500 font-bold">*</span>}
                  </label>

                  {form.isQuiz && q.points > 0 && (
                    <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
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
                      className="w-full sm:w-80 py-1.5 text-sm bg-transparent border-b border-slate-300 focus:border-b-2 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                    />
                  )}

                  {/* Paragraph */}
                  {q.type === "paragraph" && (
                    <textarea
                      rows={2}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder="Your answer"
                      className="w-full py-1.5 text-sm bg-transparent border-b border-slate-300 focus:border-b-2 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 text-slate-800 resize-none"
                    />
                  )}

                  {/* Multiple Choice (Radio) */}
                  {q.type === "multiple_choice" && (
                    <div className="space-y-1 mt-2">
                      {(q.options || []).map((opt, optIdx) => {
                        const isSelected = answers[q.id] === opt;
                        return (
                          <label
                            key={optIdx}
                            className="flex items-center gap-3 py-2 px-1 rounded hover:bg-slate-50/80 cursor-pointer group transition-colors"
                          >
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? "border-indigo-600 bg-white"
                                  : "border-slate-400 group-hover:border-slate-600"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                              )}
                            </div>
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={isSelected}
                              onChange={() => handleTextChange(q.id, opt)}
                              className="sr-only"
                            />
                            <span className={`text-sm ${isSelected ? "text-slate-900 font-medium" : "text-slate-700"}`}>
                              {opt}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* Checkboxes (Multi Select) */}
                  {q.type === "checkboxes" && (
                    <div className="space-y-1 mt-2">
                      {(q.options || []).map((opt, optIdx) => {
                        const isChecked =
                          Array.isArray(answers[q.id]) && answers[q.id].includes(opt);
                        return (
                          <label
                            key={optIdx}
                            className="flex items-center gap-3 py-2 px-1 rounded hover:bg-slate-50/80 cursor-pointer group transition-colors"
                          >
                            <div
                              className={`w-4 h-4 rounded-[3px] border-2 flex items-center justify-center transition-all ${
                                isChecked
                                  ? "border-indigo-600 bg-indigo-600 text-white"
                                  : "border-slate-400 group-hover:border-slate-600 bg-white"
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleCheckboxChange(q.id, opt, e.target.checked)}
                              className="sr-only"
                            />
                            <span className={`text-sm ${isChecked ? "text-slate-900 font-medium" : "text-slate-700"}`}>
                              {opt}
                            </span>
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
                      className="w-full sm:w-2/3 px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:border-indigo-600 outline-none"
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
                    <div className="flex items-center gap-2 py-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = (answers[q.id] || 0) >= star;
                        return (
                          <button
                            type="button"
                            key={star}
                            onClick={() => handleTextChange(q.id, star)}
                            className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                          >
                            <span className={active ? "text-amber-400" : "text-slate-300"}>
                              ★
                            </span>
                          </button>
                        );
                      })}
                      {answers[q.id] && (
                        <span className="text-xs font-medium text-slate-500 ml-2">
                          {answers[q.id]} / 5
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
                      className="w-48 py-1.5 text-sm bg-transparent border-b border-slate-300 focus:border-b-2 focus:border-indigo-600 outline-none"
                    />
                  )}

                  {/* Date */}
                  {q.type === "date" && (
                    <input
                      type="date"
                      value={answers[q.id] || ""}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      className="w-48 py-1.5 text-sm bg-transparent border-b border-slate-300 focus:border-b-2 focus:border-indigo-600 outline-none"
                    />
                  )}
                </div>

                {/* Validation Error Message */}
                {hasError && (
                  <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{hasError}</span>
                  </p>
                )}
              </div>
            );
          })}

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-md shadow-sm transition-all disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm("Clear all answers?")) {
                  setAnswers({});
                  setValidationErrors({});
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5 hover:bg-slate-200/50 rounded transition-colors"
            >
              Clear form
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 py-6 space-y-1">
          <div>Never submit passwords through ZeForm.</div>
          <div className="text-slate-400">
            Powered by <strong className="text-slate-600 font-semibold">ZeForm.</strong> • Custom Subdomain Form Engine
          </div>
        </div>
      </div>
    </div>
  );
}
