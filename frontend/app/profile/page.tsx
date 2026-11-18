"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { getCurrentUser, setCurrentUser, UserProfile } from "@/lib/supabase";
import { StatusChip } from "@/components/StatusChip";
import { Check, Plus, X, Lock, Eye, EyeOff } from "lucide-react";

const ALL_SLOTS = [
  { id: "wkday_aft", label: "Weekday Afternoon (2 PM - 5 PM)" },
  { id: "wkday_eve", label: "Weekday Evening (5 PM - 9 PM)" },
  { id: "wkend_morn", label: "Weekend Morning (9 AM - 1 PM)" },
  { id: "wkend_aft", label: "Weekend Afternoon (1 PM - 6 PM)" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(getCurrentUser());
  }, []);

  if (!profile) return null;

  const handleSlotToggle = (slotId: string) => {
    const current = profile.slots || [];
    const next = current.includes(slotId)
      ? current.filter((s) => s !== slotId)
      : [...current, slotId];
    setProfile({ ...profile, slots: next });
    setSaved(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const s = newSkill.trim().toLowerCase();
    const currSkills = profile.skills || [];
    if (!currSkills.includes(s)) {
      setProfile({ ...profile, skills: [...currSkills, s] });
      setSaved(false);
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: (profile.skills || []).filter((s) => s !== skillToRemove),
    });
    setSaved(false);
  };

  const handleSave = () => {
    setCurrentUser(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-6 py-12 space-y-8">
        <div>
          <p className="font-mono text-xs text-[#2563eb] uppercase tracking-widest mb-1 font-semibold">
            Student Identity &amp; Capabilities
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            My Campus Profile
          </h1>
          <p className="font-mono text-xs text-slate-500 mt-1">
            Used by the AI matcher to score domain alignment and role suitability
          </p>
        </div>

        <div className="card-dark bg-white border border-slate-200 p-8 space-y-8 shadow-sm">
          {/* Basic Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
            <div>
              <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => {
                  setProfile({ ...profile, name: e.target.value });
                  setSaved(false);
                }}
                className="w-full bg-white border border-slate-300 px-4 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={profile.college_email}
                onChange={(e) => {
                  setProfile({ ...profile, college_email: e.target.value });
                  setSaved(false);
                }}
                className="w-full bg-white border border-slate-300 px-4 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
              />
            </div>
          </div>

          {/* Account Password Section */}
          <div className="pb-6 border-b border-slate-200">
            <div className="max-w-md">
              <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
                Account Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={profile.password || ""}
                  onChange={(e) => {
                    setProfile({ ...profile, password: e.target.value });
                    setSaved(false);
                  }}
                  placeholder="Set or change your account password..."
                  className="w-full bg-white border border-slate-300 px-4 py-2 font-mono text-xs text-slate-900 focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="font-mono text-[10px] text-slate-400 mt-1">
                Used to log in securely to your CampusLink student profile
              </p>
            </div>
          </div>

          {/* Academic Year & Mentor Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
            <div>
              <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
                Academic Year
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setProfile({
                        ...profile,
                        year: yr,
                        is_mentor: yr >= 3 ? profile.is_mentor : false,
                      });
                      setSaved(false);
                    }}
                    className={`py-2 text-xs font-mono border transition-colors ${
                      profile.year === yr
                        ? "bg-slate-900 text-white border-slate-900 font-bold"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    Year {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Mentor Toggle */}
            <div>
              <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider mb-2 font-medium">
                Verified Mentor Role
              </label>
              <div className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-900 font-medium">
                      I want to guide junior students
                    </span>
                    {profile.is_mentor && (
                      <StatusChip status="PASS" label="VERIFIED" />
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                    {profile.year >= 3
                      ? "Eligible for mentor matching requests"
                      : "Mentorship requires Year 3 or Year 4 seniority"}
                  </p>
                </div>

                <input
                  type="checkbox"
                  disabled={profile.year < 3}
                  checked={profile.is_mentor}
                  onChange={(e) => {
                    setProfile({ ...profile, is_mentor: e.target.checked });
                    setSaved(false);
                  }}
                  className="w-4 h-4 accent-[#2563eb] cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Skills Tag Input */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider font-medium">
              Skills &amp; Technologies
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {(profile.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 font-mono text-xs text-slate-800"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(profile.skills || []).length === 0 && (
                <span className="font-mono text-xs text-slate-400 italic">
                  No skills added yet. Type below to add your skills.
                </span>
              )}
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm pt-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. react, pytorch, sql..."
                className="flex-1 bg-white border border-slate-300 px-3 py-1.5 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
              />
              <button
                type="submit"
                className="btn-square px-3 py-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Interests & Bio */}
          <div className="space-y-2 pb-6 border-b border-slate-200">
            <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider font-medium">
              Research Interests &amp; Project Passions
            </label>
            <textarea
              rows={3}
              value={profile.interests}
              onChange={(e) => {
                setProfile({ ...profile, interests: e.target.value });
                setSaved(false);
              }}
              placeholder="e.g. hackathons, medical imaging, competitive programming, open source..."
              className="w-full bg-white border border-slate-300 p-3 font-mono text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2563eb]"
            />
          </div>

          {/* Free Time Slot Checkboxes */}
          <div className="space-y-3">
            <label className="block font-mono text-xs text-slate-500 uppercase tracking-wider font-medium">
              Weekly Free Availability Slots
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_SLOTS.map((slot) => {
                const checked = (profile.slots || []).includes(slot.id);
                return (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotToggle(slot.id)}
                    className={`p-3 border cursor-pointer font-mono text-xs flex items-center justify-between transition-colors ${
                      checked
                        ? "bg-blue-50/70 border-[#2563eb] text-slate-900 font-medium"
                        : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span>{slot.label}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="w-4 h-4 accent-[#2563eb]"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save Action Bar */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={handleSave}
              className="btn-square px-6 py-2.5 text-xs text-white bg-slate-900 hover:bg-slate-800"
            >
              <span>Save Profile Changes</span>
            </button>

            {saved && (
              <div className="flex items-center gap-2 font-mono text-xs text-emerald-600 font-medium">
                <Check className="w-4 h-4" />
                <span>Profile updated &amp; synced successfully</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

