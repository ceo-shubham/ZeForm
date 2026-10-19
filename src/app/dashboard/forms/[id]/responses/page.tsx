"use client";
export const runtime = "edge";

import React, { useEffect, useState } from "react";
import { useSession } from "@/components/Providers";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  BarChart2, 
  Download, 
  Mail, 
  User, 
  Clock, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Globe, 
  Eye, 
  FileSpreadsheet,
  Calendar
} from "lucide-react";
import { formatDateTime, MAIN_DOMAIN } from "@/lib/utils";

interface AnswerItem {
  id: string;
  questionId: string;
  value: string;
  pointsAwarded: number;
  isCorrect: boolean | null;
  question: {
    id: string;
    title: string;
    type: string;
    points: number;
  };
}

interface FormResponseItem {
  id: string;
  respondentEmail: string | null;
  respondentName: string | null;
  totalScore: number | null;
  maxScore: number | null;
  submittedAt: string;
  answers: AnswerItem[];
}

interface ResponseData {
  form: {
    id: string;
    title: string;
    slug: string;
    isQuiz: boolean;
    questions: Array<{ id: string; title: string; points: number }>;
  };
  responses: FormResponseItem[];
}

export default function FormResponsesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const formId = params?.id as string;

  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<FormResponseItem | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && formId) {
      loadResponses();
    }
  }, [status, formId, router]);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/forms/${formId}/responses`);
      if (!res.ok) {
        router.push("/dashboard");
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error loading responses:", err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data || data.responses.length === 0) return;

    const headers = [
      "Submission ID",
      "Date & Time",
      "Respondent Email",
      "Respondent Name",
      ...(data.form.isQuiz ? ["Score", "Max Score"] : []),
      ...data.form.questions.map((q) => `"${q.title.replace(/"/g, '""')}"`),
    ];

    const rows = data.responses.map((r) => {
      const answersMap = new Map(r.answers.map((a) => [a.questionId, a.value]));
      const answerCols = data.form.questions.map((q) => {
        const val = answersMap.get(q.id) || "";
        return `"${val.replace(/"/g, '""')}"`;
      });

      return [
        r.id,
        `"${new Date(r.submittedAt).toLocaleString()}"`,
        `"${r.respondentEmail || "Anonymous"}"`,
        `"${r.respondentName || ""}"`,
        ...(data.form.isQuiz ? [r.totalScore ?? 0, r.maxScore ?? 0] : []),
        ...answerCols,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${data.form.slug}-responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading form responses telemetry...</p>
        </div>
      </div>
    );
  }

  const { form, responses } = data;
  const avgScore =
    form.isQuiz && responses.length > 0
      ? (responses.reduce((sum, r) => sum + (r.totalScore || 0), 0) / responses.length).toFixed(1)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Back to Forms"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{form.title}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                {responses.length} Submissions
              </span>
            </h1>
            <div className="text-xs text-slate-500 mt-0.5 font-mono flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{form.slug}.{MAIN_DOMAIN}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/builder/${form.id}`}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
          >
            Edit Questions
          </Link>

          <button
            onClick={exportToCSV}
            disabled={responses.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 my-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{responses.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Responses
            </div>
          </div>
        </div>

        {form.isQuiz && (
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{avgScore ?? "0"}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Average Quiz Score
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {responses.filter((r) => r.respondentEmail).length}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Verified Google Emails
            </div>
          </div>
        </div>
      </div>

      {/* Responses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">
            Submission Logs ({responses.length})
          </h2>
          <span className="text-xs text-slate-500">
            Click &ldquo;View Answers&rdquo; to see respondent&apos;s full questionnaire
          </span>
        </div>

        {responses.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-700">No submissions yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Share your link <code className="text-indigo-600 font-mono">https://{form.slug}.{MAIN_DOMAIN}</code> to start collecting replies.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Respondent</th>
                  <th className="py-3 px-6">Google Email</th>
                  <th className="py-3 px-6">Submitted At</th>
                  {form.isQuiz && <th className="py-3 px-6 text-center">Quiz Score</th>}
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {responses.map((resp) => (
                  <tr key={resp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-slate-900">
                        {resp.respondentName || "Anonymous Respondent"}
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      {resp.respondentEmail ? (
                        <div className="flex items-center gap-1.5 font-mono text-indigo-600 font-semibold">
                          <Mail className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{resp.respondentEmail}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No email required</span>
                      )}
                    </td>

                    <td className="py-3.5 px-6 text-slate-600">
                      {formatDateTime(resp.submittedAt)}
                    </td>

                    {form.isQuiz && (
                      <td className="py-3.5 px-6 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-extrabold text-xs">
                          {resp.totalScore ?? 0} / {resp.maxScore ?? 0}
                        </span>
                      </td>
                    )}

                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => setSelectedResponse(resp)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Answers</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Individual Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Response Details
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                  <span>From: <strong className="text-slate-800">{selectedResponse.respondentEmail || selectedResponse.respondentName || "Anonymous"}</strong></span>
                  <span>&bull;</span>
                  <span>{formatDateTime(selectedResponse.submittedAt)}</span>
                </div>
              </div>

              {form.isQuiz && (
                <div className="px-3 py-1 rounded-xl bg-purple-100 text-purple-900 font-extrabold text-xs">
                  Score: {selectedResponse.totalScore ?? 0} / {selectedResponse.maxScore ?? 0}
                </div>
              )}
            </div>

            {/* Modal Answers Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {selectedResponse.answers.map((ans, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-xs font-bold text-slate-800">
                      {idx + 1}. {ans.question?.title || "Question"}
                    </div>
                    {form.isQuiz && (
                      <span
                        className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                          ans.isCorrect
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {ans.pointsAwarded} / {ans.question?.points || 0} pts
                      </span>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-slate-900 bg-white p-3 rounded-lg border border-slate-200">
                    {ans.value || <span className="text-slate-400 italic">No answer provided</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedResponse(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
