"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser, DEMO_FRESHER, DEMO_MENTOR, UserProfile } from "@/lib/supabase";
import { StatusChip } from "@/components/StatusChip";
import { ArrowUpRight, ShieldCheck, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    const customUser: UserProfile = {
      id: "usr_" + Math.random().toString(36).substring(7),
      name: email.split("@")[0].replace(".", " "),
      college_email: email.trim(),
      year: 2,
      is_mentor: false,
      skills: ["python", "javascript"],
      interests: "learning, campus projects",
      slots: ["wkday_aft", "wkend_morn"],
    };
    setCurrentUser(customUser);
    setSuccess(true);
    setTimeout(() => router.push("/requests"), 400);
  };

  const handleDemoLogin = (profile: UserProfile) => {
    setCurrentUser(profile);
    setSuccess(true);
    setTimeout(() => router.push("/requests"), 400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-[480px] space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="2" width="8" height="8" fill="#0f172a" />
              <rect x="14" y="2" width="8" height="8" fill="#2563eb" />
              <rect x="2" y="14" width="8" height="8" fill="#cbd5e1" />
              <rect x="14" y="14" width="8" height="8" fill="#0f172a" />
            </svg>
            <span className="font-semibold text-2xl text-slate-900 tracking-[-0.5px]">
              CampusLink
            </span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Access Campus Network
          </h1>
          <p className="font-mono text-xs text-slate-500">
            Sign in with any email address or use an instant demo account
          </p>
        </div>

        {/* Login Card */}
        <div className="card-dark bg-white border border-slate-200 shadow-sm p-8 space-y-6">
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. name@gmail.com, student@college.edu..."
                  className="w-full bg-white border border-slate-300 px-4 py-2.5 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                />
                <Mail className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {error && (
              <p className="font-mono text-xs text-red-500 leading-relaxed">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-square w-full py-2.5 text-xs text-white bg-slate-900 hover:bg-slate-800 cursor-pointer font-medium"
            >
              <span>Instant Login &rarr;</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 font-mono text-[10px] text-slate-500 uppercase tracking-widest absolute">
              OR INSTANT DEMO LOGIN
            </span>
          </div>

          {/* Demo Accounts List */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleDemoLogin(DEMO_FRESHER)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-semibold text-sm text-slate-900 group-hover:text-emerald-700">
                    {DEMO_FRESHER.name}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                  Year 1 Fresher &bull; Needs ML &amp; Web Dev Guidance
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin(DEMO_MENTOR)}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 hover:border-[#2563eb] hover:bg-blue-50/30 text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  <span className="font-semibold text-sm text-slate-900 group-hover:text-[#2563eb]">
                    {DEMO_MENTOR.name}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                  Year 3 Senior Mentor &bull; Kaggle Expert &amp; ML Guide
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
            </button>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Domain Verification &bull; Row Level Security Enabled</span>
        </div>
      </div>
    </div>
  );
}

