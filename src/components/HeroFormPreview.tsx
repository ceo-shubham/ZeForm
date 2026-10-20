"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Check, 
  Lock, 
  BarChart3, 
  FileText, 
  Settings2, 
  Sparkles, 
  Copy, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock,
  UserCheck
} from "lucide-react";

export default function HeroFormPreview() {
  const [activeTab, setActiveTab] = useState<"form" | "responses" | "subdomain">("form");
  const [selectedRadio, setSelectedRadio] = useState<number>(0);
  const [checkedBoxes, setCheckedBoxes] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [customSlug, setCustomSlug] = useState("annual-dev-survey");
  const [copied, setCopied] = useState(false);

  const radioOptions = [
    { text: "Dedicated Custom Subdomain (e.g. survey.zeform.zenstro.space)", correct: true, points: 10 },
    { text: "Standard unbranded generic link (docs.google.com/forms/d/e/...)", correct: false, points: 0 },
    { text: "Manual export with third-party spreadsheets", correct: false, points: 0 }
  ];

  const checkboxOptions = [
    "Automatic quiz auto-scoring & instant grading",
    "Google account email verification (prevent spam)",
    "Scheduled auto-close date & expiry timer",
    "Customizable Thank You screen with score review"
  ];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://${customSlug}.zeform.zenstro.space`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-slate-300/80 shadow-[0_20px_50px_rgba(15,23,42,0.12)] bg-white overflow-hidden text-left">
      {/* Authentic Browser Chrome Bar */}
      <div className="bg-[#f8f9fa] border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>
          
          {/* Navigation view tabs */}
          <div className="hidden sm:flex items-center ml-4 bg-slate-200/70 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            <button
              onClick={() => setActiveTab("form")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === "form" 
                  ? "bg-white text-slate-900 shadow-sm font-semibold" 
                  : "hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Form View</span>
            </button>
            <button
              onClick={() => setActiveTab("responses")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === "responses" 
                  ? "bg-white text-slate-900 shadow-sm font-semibold" 
                  : "hover:text-slate-900"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
              <span>Responses (148)</span>
            </button>
            <button
              onClick={() => setActiveTab("subdomain")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all ${
                activeTab === "subdomain" 
                  ? "bg-white text-slate-900 shadow-sm font-semibold" 
                  : "hover:text-slate-900"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Subdomain</span>
            </button>
          </div>
        </div>

        {/* Realistic URL Address Bar */}
        <div className="flex-1 max-w-md mx-auto flex items-center justify-between bg-white border border-slate-300 rounded-lg px-3 py-1 text-xs text-slate-600 shadow-inner">
          <div className="flex items-center gap-1.5 truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="text-slate-400">https://</span>
            <span className="font-semibold text-slate-900">{customSlug}</span>
            <span className="text-slate-500">.zeform.zenstro.space</span>
          </div>
          <button 
            onClick={handleCopyLink}
            title="Copy URL"
            className="text-slate-400 hover:text-slate-700 ml-2 p-0.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Accepting Responses</span>
        </div>
      </div>

      {/* Main Canvas Body - Authentic Google Forms Styling */}
      <div className="bg-[#ede7f6]/60 p-4 sm:p-8 min-h-[460px]">
        {activeTab === "form" && (
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Header Card with Google Forms Purple/Indigo Top Strip */}
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-[0_1px_3px_rgba(60,64,67,0.15)] overflow-hidden">
              <div className="h-2.5 bg-indigo-600 w-full" />
              <div className="p-6 sm:p-7">
                <h2 className="text-2xl sm:text-3xl font-normal text-slate-900 tracking-tight">
                  Developer Community Survey 2026
                </h2>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Help us understand how modern teams deploy forms, collect feedback, and auto-evaluate responses.
                </p>

                {/* Google Identity & Draft Status */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                      S
                    </div>
                    <span>
                      Responding as <strong className="text-slate-800">ceo.shubhampathak@gmail.com</strong>
                    </span>
                    <span className="text-indigo-600 hover:underline cursor-pointer">
                      Switch account
                    </span>
                  </div>
                  <span className="text-slate-400 hidden sm:inline">Draft saved</span>
                </div>

                <div className="mt-3 text-xs text-red-500 font-normal">
                  * Indicates required question
                </div>
              </div>
            </div>

            {/* Question 1: Active Google Forms Card with Blue/Indigo Left Bar */}
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-[0_1px_3px_rgba(60,64,67,0.15)] border-l-4 border-l-indigo-600 p-6 transition-all">
              <div className="flex items-start justify-between gap-2 mb-3">
                <label className="text-sm sm:text-base font-normal text-slate-900 leading-snug">
                  1. Which form delivery model does your team prefer?{" "}
                  <span className="text-red-500 font-bold">*</span>
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

              {/* Instant feedback badge */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-indigo-700 font-medium">
                  <Zap className="w-3.5 h-3.5" />
                  Auto-evaluation: {radioOptions[selectedRadio].correct ? "10/10 pts (Correct)" : "0/10 pts"}
                </span>
                <span className="text-slate-400 text-[11px]">Instant result after submit</span>
              </div>
            </div>

            {/* Question 2: Checkboxes Card */}
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-[0_1px_3px_rgba(60,64,67,0.15)] p-6">
              <label className="text-sm sm:text-base font-normal text-slate-900 block mb-3">
                2. Select all capabilities required in your workflow:
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
                        className={`w-4 h-4 rounded-[3px] border-2 flex items-center justify-center transition-all ${
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

            {/* Question 3: Signature Underline Input Card */}
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-[0_1px_3px_rgba(60,64,67,0.15)] p-6">
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

            {/* Authentic Google Forms Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button 
                type="button"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-md shadow-sm transition-all"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRadio(0);
                  setCheckedBoxes({});
                }}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5 hover:bg-slate-200/50 rounded transition-colors"
              >
                Clear form
              </button>
            </div>

            {/* Authentic Footer Note */}
            <div className="text-center text-[11px] text-slate-500 pt-3 space-y-1">
              <div>Never submit passwords through ZeForm.</div>
              <div className="text-slate-400">
                Powered by <strong className="text-slate-600 font-semibold">ZeForm.</strong> • Custom Subdomain Form Engine
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Responses Preview */}
        {activeTab === "responses" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">148 Responses</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Average Auto-Score: 28 / 30 pts</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Live Syncing
                  </span>
                </div>
              </div>

              {/* Table of respondents */}
              <div className="mt-4 divide-y divide-slate-100 text-xs">
                <div className="py-2.5 grid grid-cols-12 font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                  <span className="col-span-6">Respondent (Verified Google)</span>
                  <span className="col-span-3 text-center">Score</span>
                  <span className="col-span-3 text-right">Submitted</span>
                </div>

                <div className="py-2.5 grid grid-cols-12 items-center text-slate-700">
                  <span className="col-span-6 font-mono text-slate-900 truncate flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    ceo.shubhampathak@gmail.com
                  </span>
                  <span className="col-span-3 text-center font-bold text-indigo-600">30 / 30 pts</span>
                  <span className="col-span-3 text-right text-slate-400">2 mins ago</span>
                </div>

                <div className="py-2.5 grid grid-cols-12 items-center text-slate-700">
                  <span className="col-span-6 font-mono text-slate-900 truncate flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    sarah.engineer@gmail.com
                  </span>
                  <span className="col-span-3 text-center font-bold text-indigo-600">30 / 30 pts</span>
                  <span className="col-span-3 text-right text-slate-400">14 mins ago</span>
                </div>

                <div className="py-2.5 grid grid-cols-12 items-center text-slate-700">
                  <span className="col-span-6 font-mono text-slate-900 truncate flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    alex.designer@outlook.com
                  </span>
                  <span className="col-span-3 text-center font-bold text-indigo-600">20 / 30 pts</span>
                  <span className="col-span-3 text-right text-slate-400">1 hour ago</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <span className="text-xs text-indigo-600 font-medium hover:underline cursor-pointer">
                  Export all 148 responses as CSV or view detailed per-question analytics →
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Subdomain Router Preview */}
        {activeTab === "subdomain" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Custom Subdomain & Routing
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Pick any available slug for your form. It activates immediately with free Cloudflare SSL.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Choose Your Link Name
                  </label>
                  <div className="flex items-center rounded-lg border border-slate-300 bg-white focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 overflow-hidden shadow-sm">
                    <span className="pl-3 text-xs text-slate-400 font-mono">https://</span>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="flex-1 px-1 py-2 text-sm font-semibold text-slate-900 outline-none"
                      placeholder="your-name"
                    />
                    <span className="pr-3 text-xs text-slate-500 font-mono bg-slate-50 py-2.5 px-2 border-l border-slate-200">
                      .zeform.zenstro.space
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Domain is available! Instant Cloudflare Edge routing ready.</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      Auto-Expiration Timer
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Schedule a deadline to automatically close submissions.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                      Google Login Guard
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Require respondents to sign in with Google before submitting.
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
