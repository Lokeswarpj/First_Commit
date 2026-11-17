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
    if (!email.includes("@") || !email.endsWith(".edu")) {
      setError("Please use a valid college email address ending with .edu (or select a demo account below).");
      return;
    }
    setError("");
    const customUser: UserProfile = {
      id: "usr_" + Math.random().toString(36).substring(7),
      name: email.split("@")[0].replace(".", " "),
      college_email: email,
      year: 2,
      is_mentor: false,
      skills: ["python", "javascript"],
      interests: "learning, campus projects",
      slots: ["wkday_aft", "wkend_morn"],
    };
    setCurrentUser(customUser);
    setSuccess(true);
    setTimeout(() => router.push("/requests"), 600);
  };

  const handleDemoLogin = (profile: UserProfile) => {
    setCurrentUser(profile);
    setSuccess(true);
    setTimeout(() => router.push("/requests"), 400);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-center items-center px-6 py-12">
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
              <rect x="2" y="2" width="8" height="8" fill="#ffffff" />
              <rect x="14" y="2" width="8" height="8" fill="#52a8ff" />
              <rect x="2" y="14" width="8" height="8" fill="rgba(255,255,255,0.4)" />
              <rect x="14" y="14" width="8" height="8" fill="#ffffff" />
            </svg>
            <span className="font-medium text-2xl text-white tracking-[-0.5px]">
              CampusLink
            </span>
          </Link>
          <h1 className="text-2xl font-medium tracking-tight text-white">
            Access Campus Network
          </h1>
          <p className="font-mono text-xs text-[#999999]">
            Restricted to authenticated college email domains
          </p>
        </div>

        {/* Login Card */}
        <div className="card-dark p-8 space-y-6">
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-[#999999] uppercase tracking-wider mb-2">
                College Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student.cs25@college.edu"
                  className="w-full bg-[#121212] border border-white/[0.145] px-4 py-2.5 font-mono text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#52a8ff]"
                />
                <Mail className="absolute right-3 top-3 w-4 h-4 text-[#666666]" />
              </div>
            </div>

            {error && (
              <p className="font-mono text-xs text-red-400 leading-relaxed">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-square w-full py-2.5 text-xs text-[#121212]"
            >
              <span>Send Magic Link &rarr;</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-white/[0.145] w-full" />
            <span className="bg-[#0a0a0a] px-3 font-mono text-[10px] text-[#999999] uppercase tracking-widest absolute">
              OR INSTANT DEMO LOGIN
            </span>
          </div>

          {/* Demo Accounts List */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleDemoLogin(DEMO_FRESHER)}
              className="w-full p-3.5 bg-[#121212] border border-white/[0.145] hover:border-[#62c073] text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#62c073]" />
                  <span className="font-medium text-sm text-white group-hover:text-[#62c073]">
                    {DEMO_FRESHER.name}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#999999] mt-0.5">
                  Year 1 Fresher &bull; Needs ML &amp; Web Dev Guidance
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#999999] group-hover:text-white" />
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin(DEMO_MENTOR)}
              className="w-full p-3.5 bg-[#121212] border border-white/[0.145] hover:border-[#52a8ff] text-left transition-colors flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#52a8ff]" />
                  <span className="font-medium text-sm text-white group-hover:text-[#52a8ff]">
                    {DEMO_MENTOR.name}
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#999999] mt-0.5">
                  Year 3 Senior Mentor &bull; Kaggle Expert &amp; ML Guide
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#999999] group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Security Footer Notice */}
        <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-[#999999]">
          <ShieldCheck className="w-4 h-4 text-[#62c073]" />
          <span>Domain Verification &bull; Row Level Security Enabled</span>
        </div>
      </div>
    </div>
  );
}

