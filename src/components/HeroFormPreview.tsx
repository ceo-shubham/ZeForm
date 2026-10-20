"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Check, 
  Lock, 
  FileText, 
  Copy, 
  Zap, 
  Clock, 
  UserCheck,
  CheckCircle2,
  Sliders
} from "lucide-react";

export default function HeroFormPreview() {
  const [activeTab, setActiveTab] = useState<"form" | "quiz" | "subdomain">("form");
  const [selectedRadio, setSelectedRadio] = useState<number>(0);
  const [checkedBoxes, setCheckedBoxes] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [customSlug, setCustomSlug] = useState("developer-feedback");
  const [copied, setCopied] = useState(false);

  const radioOptions = [
    { text: "Dedicated Custom Subdomain (e.g. feedback.zeform.zenstro.space)", correct: true },
    { text: "Standard unbranded URL", correct: false },
    { text: "Manual spreadsheet integration", correct: false }
  ];

  const checkboxOptions = [
    "Automatic quiz evaluation with instant score calculation",
    "Verified Google OAuth respondent identity tracking",
    "Scheduled automatic closing date and timer",
    "Custom post-submission instructions and message"
  ];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://${customSlug}.zeform.zenstro.space`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg border border-slate-300 bg-white shadow-sm overflow-hidden text-left">
      {/* Clean Minimalist Window Header */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-md text-xs font-medium text-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all ${
              activeTab === "form" 
                ? "bg-white text-slate-900 font-semibold shadow-xs" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Form Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all ${
              activeTab === "quiz" 
                ? "bg-white text-slate-900 font-semibold shadow-xs" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quiz &amp; Scoring Logic</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subdomain")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-all ${
              activeTab === "subdomain" 
                ? "bg-white text-slate-900 font-semibold shadow-xs" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>Subdomain Settings</span>
          </button>
        </div>

        {/* Real Address Bar */}
        <div className="flex-1 max-w-md flex items-center justify-between bg-white border border-slate-300 rounded-md px-3 py-1 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="text-slate-400">https://</span>
            <span className="font-semibold text-slate-900">{customSlug}</span>
            <span className="text-slate-500">.zeform.zenstro.space</span>
          </div>
          <button 
            type="button"
            onClick={handleCopyLink}
            title="Copy URL"
            className="text-slate-400 hover:text-slate-700 ml-2"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Status: Accepting Responses</span>
        </div>
      </div>

      {/* Main Canvas Body */}
      <div className="bg-slate-100/70 p-4 sm:p-8 min-h-[440px]">
        {activeTab === "form" && (
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Header Card with Clean Indigo Top Bar */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="h-2 bg-indigo-600 w-full" />
              <div className="p-6 sm:p-7">
                <h2 className="text-2xl font-normal text-slate-900 tracking-tight">
                  Developer Community Feedback 2026
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Please share your feedback regarding form delivery preferences and respondent identity tracking.
                </p>

                {/* Google Identity & Draft Status */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                      G
                    </div>
                    <span>
                      Responding as verified Google user
                    </span>
                  </div>
                  <span className="text-slate-400">All questions required unless noted</span>
                </div>

                <div className="mt-3 text-xs text-red-500 font-normal">
                  * Indicates required question
                </div>
              </div>
            </div>

            {/* Question 1: Active Card */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs border-l-4 border-l-indigo-600 p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <label className="text-sm sm:text-base font-normal text-slate-900 leading-snug">
                  1. Which form delivery model do you prefer? <span className="text-red-500 font-bold">*</span>
                </label>
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 font-medium rounded">
                  10 points
                </span>
              </div>

              {/* Clean Google Forms Radio Rows */}
              <div className="space-y-1 mt-3">
                {radioOptions.map((opt, idx) => {
                  const isSelected = selectedRadio === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedRadio(idx)}
                      className="flex items-center gap-3 py-2 px-2 rounded hover:bg-slate-50 cursor-pointer group transition-colors"
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
                      <span className={`text-sm ${isSelected ? "text-slate-900 font-medium" : "text-slate-700"}`}>
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question 2: Checkboxes */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6">
              <label className="text-sm sm:text-base font-normal text-slate-900 block mb-3">
                2. Select all capabilities needed in your workflow:
              </label>

              <div className="space-y-1">
                {checkboxOptions.map((opt, idx) => {
                  const isChecked = !!checkedBoxes[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => setCheckedBoxes({ ...checkedBoxes, [idx]: !isChecked })}
                      className="flex items-center gap-3 py-2 px-2 rounded hover:bg-slate-50 cursor-pointer group transition-colors"
                    >
                      <div
                        className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center transition-all ${
                          isChecked
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-400 group-hover:border-slate-600 bg-white"
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-sm text-slate-700">{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question 3: Underline Input */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6">
              <label className="text-sm sm:text-base font-normal text-slate-900 block mb-1">
                3. Additional requirements or questions:
              </label>
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Your answer"
                  className="w-full sm:w-80 py-1.5 text-sm bg-transparent border-b border-slate-300 focus:border-b-2 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button 
                type="button"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-md shadow-xs transition-all"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRadio(0);
                  setCheckedBoxes({});
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5 hover:bg-slate-200 rounded transition-colors"
              >
                Clear form
              </button>
            </div>

            {/* Footer Note */}
            <div className="text-center text-xs text-slate-400 pt-3">
              Never submit passwords through ZeForm.
            </div>
          </div>
        )}

        {/* Tab 2: Quiz Logic & Scoring */}
        {activeTab === "quiz" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Quiz Auto-Evaluation Configuration</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Define points and answer keys for automatic grading</p>
                </div>
                <div className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-800 rounded">
                  Mode: Graded Quiz
                </div>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div className="p-4 rounded-md border border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-2">
                    <span>Question 1 Answer Key</span>
                    <span className="text-indigo-600">10 Points</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 bg-white p-2.5 rounded border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Dedicated Custom Subdomain (e.g. feedback.zeform.zenstro.space)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Submissions matching this answer receive full points automatically.
                  </p>
                </div>

                <div className="p-4 rounded-md border border-slate-200 bg-slate-50">
                  <div className="font-semibold text-slate-800 mb-1">
                    Post-Submission Score Display
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Respondents can immediately view their earned points, total possible score, and custom completion instructions after submitting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Subdomain Router */}
        {activeTab === "subdomain" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Custom Subdomain Configuration
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Every form can be assigned an available subdomain slug with automatic SSL provisioning.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Subdomain Slug
                  </label>
                  <div className="flex items-center rounded-md border border-slate-300 bg-white focus-within:border-indigo-600 overflow-hidden">
                    <span className="pl-3 text-xs text-slate-400 font-mono">https://</span>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="flex-1 px-1 py-2 text-sm font-semibold text-slate-900 outline-none"
                      placeholder="your-form-name"
                    />
                    <span className="pr-3 text-xs text-slate-500 font-mono bg-slate-50 py-2.5 px-2 border-l border-slate-200">
                      .zeform.zenstro.space
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-2 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DNS wildcard route active on Cloudflare Edge</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      Auto-Expiration Schedule
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Set a specific date and time when the form will automatically stop accepting responses.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                      Google Identity Verification
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Require respondents to authenticate with Google before submitting their responses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
