"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { getCurrentUser, setCurrentUser, UserProfile } from "@/lib/supabase";
import { StatusChip } from "@/components/StatusChip";
import { Check, Plus, X } from "lucide-react";

const ALL_SLOTS = [
  { id: "wkday_aft", label: "Weekday Afternoon (2 PM - 5 PM)" },
  { id: "wkday_eve", label: "Weekday Evening (5 PM - 9 PM)" },
  { id: "wkend_morn", label: "Weekend Morning (9 AM - 1 PM)" },
  { id: "wkend_aft", label: "Weekend Afternoon (1 PM - 6 PM)" },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [newSkill, setNewSkill] = useState("");
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
    if (!profile.skills.includes(s)) {
      setProfile({ ...profile, skills: [...profile.skills, s] });
      setSaved(false);
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    });
    setSaved(false);
  };

  const handleSave = () => {
    setCurrentUser(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Navbar />

      <main className="max-w-[1000px] mx-auto px-6 py-12 space-y-8">
        <div>
          <p className="font-mono text-xs text-[#52a8ff] uppercase tracking-widest mb-1">
            Student Identity &amp; Capabilities
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            My Campus Profile
          </h1>
          <p className="font-mono text-xs text-[#999999] mt-1">
            Used by the AI matcher to score domain alignment and role suitability
          </p>
        </div>

        <div className="card-dark p-8 space-y-8">
          {/* Basic Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/[0.145]">
            <div>
              <label className="block font-mono text-xs text-[#999999] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => {
                  setProfile({ ...profile, name: e.target.value });
                  setSaved(false);
                }}
                className="w-full bg-[#121212] border border-white/[0.145] px-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-[#52a8ff]"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-[#999999] uppercase tracking-wider mb-2">
                College Email (Domain Authenticated)
              </label>
              <input
                type="text"
                disabled
                value={profile.college_email}
                className="w-full bg-[#161616] border border-white/[0.1] px-4 py-2 font-mono text-xs text-[#888888] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Academic Year & Mentor Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/[0.145]">
            <div>
              <label className="block font-mono text-xs text-[#999999] uppercase tracking-wider mb-2">
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
                        ? "bg-white text-black border-white font-bold"
                        : "bg-[#121212] text-[#999999] border-white/[0.145] hover:text-white"
                    }`}
                  >
                    Year {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Mentor Toggle */}
            <div>
              <label className="block font-mono text-xs text-[#999999] uppercase tracking-wider mb-2">
                Verified Mentor Role
              </label>
              <div className="p-3 bg-[#121212] border border-white/[0.145] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white">
                      I want to guide junior students
                    </span>
                    {profile.is_mentor && (
                      <StatusChip status="PASS" label="VERIFIED" />
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-[#999999] mt-0.5">
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
                  className="w-4 h-4 accent-[#52a8ff] cursor-pointer disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Skills Tag Input */}
          <div className="space-y-3 pb-6 border-b border-white/[0.145]">
            <label className="block font-mono text-xs text-[#999999] uppercase tracking-wider">
              Skills &amp; Technologies
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#161616] border border-white/[0.145] font-mono text-xs text-white"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#999999] hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2 max-w-sm pt-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. react, pytorch, sql..."
                className="flex-1 bg-[#121212] border border-white/[0.145] px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-[#52a8ff]"
              />
              <button
                type="submit"
                className="btn-square px-3 py-1.5 text-xs text-[#121212]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Interests & Bio */}
          <div className="space-y-2 pb-6 border-b border-white/[0.145]">
            <label className="block font-mono text-xs text-[#999999] uppercase tracking-wider">
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
              className="w-full bg-[#121212] border border-white/[0.145] p-3 font-mono text-xs text-white focus:outline-none focus:border-[#52a8ff]"
            />
          </div>

          {/* Free Time Slot Checkboxes */}
          <div className="space-y-3">
            <label className="block font-mono text-xs text-[#999999] uppercase tracking-wider">
              Weekly Free Availability Slots
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_SLOTS.map((slot) => {
                const checked = profile.slots.includes(slot.id);
                return (
                  <div
                    key={slot.id}
                    onClick={() => handleSlotToggle(slot.id)}
                    className={`p-3 border cursor-pointer font-mono text-xs flex items-center justify-between transition-colors ${
                      checked
                        ? "bg-[#161616] border-[#52a8ff] text-white"
                        : "bg-[#0f0f0f] border-white/[0.1] text-[#888888] hover:text-white"
                    }`}
                  >
                    <span>{slot.label}</span>
                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="w-4 h-4 accent-[#52a8ff]"
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
              className="btn-square px-6 py-2.5 text-xs text-[#121212]"
            >
              <span>Save Profile Changes</span>
            </button>

            {saved && (
              <div className="flex items-center gap-2 font-mono text-xs text-[#62c073]">
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

