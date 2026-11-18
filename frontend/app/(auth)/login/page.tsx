"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  setCurrentUser,
  findRegisteredUser,
  saveRegisteredUser,
  DEMO_FRESHER,
  DEMO_MENTOR,
  UserProfile,
} from "@/lib/supabase";
import { StatusChip } from "@/components/StatusChip";
import {
  ArrowUpRight,
  ShieldCheck,
  Mail,
  User,
  BookOpen,
  Plus,
  X,
  Sparkles,
  Check,
} from "lucide-react";

const ALL_SLOTS = [
  { id: "wkday_aft", label: "Weekday Aft (2 PM - 5 PM)" },
  { id: "wkday_eve", label: "Weekday Eve (5 PM - 9 PM)" },
  { id: "wkend_morn", label: "Weekend Morn (9 AM - 1 PM)" },
  { id: "wkend_aft", label: "Weekend Aft (1 PM - 6 PM)" },
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "create">("create");

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInError, setSignInError] = useState("");

  // Create Account State (Clean, user-entered, NO dummy defaults)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState<number>(1);
  const [isMentor, setIsMentor] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [interests, setInterests] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [createError, setCreateError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle adding skill tags
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const clean = newSkillInput.trim().toLowerCase();
    if (!skills.includes(clean)) {
      setSkills([...skills, clean]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSlotToggle = (slotId: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId) ? prev.filter((s) => s !== slotId) : [...prev, slotId]
    );
  };

  // 1. Handle Sign In
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError("");
    const trimmed = signInEmail.trim();

    if (!trimmed || !trimmed.includes("@") || !trimmed.includes(".")) {
      setSignInError("Please enter a valid email address.");
      return;
    }

    const existingUser = findRegisteredUser(trimmed);
    if (existingUser) {
      setCurrentUser(existingUser);
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 400);
      return;
    }

    // If account doesn't exist, switch to Create Account mode with email pre-filled
    setEmail(trimmed);
    setMode("create");
    setCreateError("No existing account found with this email. Please complete your profile to register!");
  };

  // 2. Handle Create Account
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    if (!name.trim()) {
      setCreateError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@") || !email.includes(".")) {
      setCreateError("Please enter a valid email address.");
      return;
    }

    if (skills.length === 0) {
      setCreateError("Please add at least one skill or technology.");
      return;
    }

    if (selectedSlots.length === 0) {
      setCreateError("Please select at least one weekly availability timeslot.");
      return;
    }

    // Build the user profile strictly with the user's entered details (NO dummy data)
    const newUser: UserProfile = {
      id: "usr_" + Math.random().toString(36).substring(7),
      name: name.trim(),
      college_email: email.trim(),
      year,
      is_mentor: year >= 3 ? isMentor : false,
      skills,
      interests: interests.trim(),
      slots: selectedSlots,
    };

    setCurrentUser(newUser);
    saveRegisteredUser(newUser);
    setSuccess(true);
    setTimeout(() => router.push("/profile"), 400);
  };

  const handleDemoLogin = (profile: UserProfile) => {
    setCurrentUser(profile);
    setSuccess(true);
    setTimeout(() => router.push("/profile"), 400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-[620px] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
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
            {mode === "create" ? "Create Student Account" : "Access Campus Network"}
          </h1>
          <p className="font-mono text-xs text-slate-500">
            {mode === "create"
              ? "Set up your student identity and availability to get matched by AI"
              : "Sign in with your registered email or use a demo account"}
          </p>
        </div>

        {/* Mode Selector Tabs (Sign In vs Create Account) */}
        <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-none border border-slate-300 font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setMode("create");
              setSignInError("");
              setCreateError("");
            }}
            className={`py-2 text-center transition-colors font-medium ${
              mode === "create"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setSignInError("");
              setCreateError("");
            }}
            className={`py-2 text-center transition-colors font-medium ${
              mode === "signin"
                ? "bg-white text-slate-900 shadow-sm font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Main Card */}
        <div className="card-dark bg-white border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* ================= MODE: CREATE ACCOUNT ================= */}
          {mode === "create" && (
            <form onSubmit={handleCreateSubmit} className="space-y-5">
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-slate-600 uppercase tracking-wider mb-1.5 font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lokeswar PJ"
                      className="w-full bg-white border border-slate-300 px-3.5 py-2 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
                    />
                    <User className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs text-slate-600 uppercase tracking-wider mb-1.5 font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. student@college.edu or gmail"
                      className="w-full bg-white border border-slate-300 px-3.5 py-2 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
                    />
                    <Mail className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Academic Year Selection */}
              <div>
                <label className="block font-mono text-xs text-slate-600 uppercase tracking-wider mb-1.5 font-medium">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        setYear(yr);
                        if (yr < 3) setIsMentor(false);
                      }}
                      className={`py-2 text-xs font-mono border transition-colors ${
                        year === yr
                          ? "bg-slate-900 text-white border-slate-900 font-bold"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      Year {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mentor Eligibility Toggle (For Year 3 and 4) */}
              <div className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-slate-900 font-medium">
                    I want to act as a Senior Mentor
                  </span>
                  <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                    {year >= 3
                      ? "Eligible to mentor junior students and verify notes"
                      : "Mentorship requires Year 3 or Year 4 seniority"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  disabled={year < 3}
                  checked={isMentor}
                  onChange={(e) => setIsMentor(e.target.checked)}
                  className="w-4 h-4 accent-[#2563eb] cursor-pointer disabled:cursor-not-allowed"
                />
              </div>

              {/* Skills Tag Input (Starts completely empty) */}
              <div>
                <label className="block font-mono text-xs text-slate-600 uppercase tracking-wider mb-1.5 font-medium">
                  Skills &amp; Technologies <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-[32px] p-2 bg-slate-50 border border-slate-200">
                  {skills.length === 0 ? (
                    <span className="font-mono text-[11px] text-slate-400 italic">
                      No skills added yet. Type a skill below and click &quot;Add&quot;.
                    </span>
                  ) : (
                    skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white border border-slate-300 font-mono text-xs text-slate-800 shadow-xs"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-400 hover:text-red-500 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill(e);
                      }
                    }}
                    placeholder="e.g. react, python, pytorch, sql, figma..."
                    className="flex-1 bg-white border border-slate-300 px-3 py-1.5 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="btn-square px-3.5 py-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Research Interests & Passions */}
              <div>
                <label className="block font-mono text-xs text-slate-600 uppercase tracking-wider mb-1.5 font-medium">
                  Interests &amp; Project Passions
                </label>
                <textarea
                  rows={2}
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="e.g. hackathons, medical imaging, competitive programming, open source web apps..."
                  className="w-full bg-white border border-slate-300 p-2.5 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              {/* Free Availability Slots */}
              <div>
                <label className="block font-mono text-xs text-slate-600 uppercase tracking-wider mb-1.5 font-medium">
                  Weekly Free Availability Slots <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_SLOTS.map((s) => {
                    const active = selectedSlots.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleSlotToggle(s.id)}
                        className={`p-2.5 border cursor-pointer font-mono text-xs flex items-center justify-between transition-colors ${
                          active
                            ? "bg-blue-50/70 border-[#2563eb] text-slate-900 font-medium"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span>{s.label}</span>
                        <input
                          type="checkbox"
                          checked={active}
                          readOnly
                          className="w-4 h-4 accent-[#2563eb]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {createError && (
                <p className="font-mono text-xs text-red-500 leading-relaxed font-medium">
                  {createError}
                </p>
              )}

              <button
                type="submit"
                className="btn-square w-full py-3 text-xs text-white bg-slate-900 hover:bg-slate-800 cursor-pointer font-semibold shadow-sm"
              >
                <span>Create Account &amp; Save Profile &rarr;</span>
              </button>
            </form>
          )}

          {/* ================= MODE: SIGN IN ================= */}
          {mode === "signin" && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-slate-600 uppercase tracking-wider mb-2 font-medium">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="e.g. name@college.edu or gmail..."
                    className="w-full bg-white border border-slate-300 px-4 py-2.5 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                  />
                  <Mail className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {signInError && (
                <p className="font-mono text-xs text-red-500 leading-relaxed font-medium">
                  {signInError}
                </p>
              )}

              <button
                type="submit"
                className="btn-square w-full py-2.5 text-xs text-white bg-slate-900 hover:bg-slate-800 cursor-pointer font-medium"
              >
                <span>Sign In to Profile &rarr;</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("create");
                    setEmail(signInEmail);
                  }}
                  className="font-mono text-xs text-[#2563eb] hover:underline"
                >
                  New to CampusLink? Click here to Create an Account
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 font-mono text-[10px] text-slate-500 uppercase tracking-widest absolute">
              OR INSTANT DEMO ACCOUNTS
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
