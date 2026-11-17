"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { StatusChip } from "@/components/StatusChip";
import { getCurrentUser, UserProfile } from "@/lib/supabase";
import { requestMatches, PostMatchPayload } from "@/lib/api";
import { ArrowUpRight, Sparkles, Send, Clock } from "lucide-react";

interface SavedRequest {
  id: string;
  kind: "teammate" | "mentor" | "notes" | "others";
  text: string;
  slots: string[];
  createdAt: string;
  matchCount: number;
}

const STORAGE_REQUESTS_KEY = "campuslink_saved_requests";

const ALL_SLOTS = [
  { id: "wkday_aft", label: "Weekday Aft" },
  { id: "wkday_eve", label: "Weekday Eve" },
  { id: "wkend_morn", label: "Weekend Morn" },
  { id: "wkend_aft", label: "Weekend Aft" },
];

const SAMPLES_BY_KIND: Record<"mentor" | "teammate" | "notes" | "others", string[]> = {
  mentor: [
    "Looking for a senior mentor in machine learning to guide my mini project",
    "Need a senior mentor in competitive programming and DSA for campus placements",
    "How do I prepare for cloud and DevOps interviews? Need a senior guide",
    "Need an NLP mentor to guide me with fine-tuning LLMs and RAG pipelines",
  ],
  teammate: [
    "Need a frontend developer for a hackathon, comfortable with React and Next.js",
    "Need a UI/UX designer with Figma skills for a healthcare hackathon prototype",
    "Looking for a mobile app developer with Flutter to build a cross-platform app",
    "Need a backend API developer proficient in Python FastAPI and Docker",
  ],
  notes: [
    "Need comprehensive notes and SQL queries for DBMS semester exams",
    "Looking for OS concurrency and semaphores revision problem sheets",
    "Need formula sheets and solved problems for Machine Learning CIE",
    "Looking for Data Structures and Algorithms placement interview cheat sheets",
  ],
  others: [
    "Looking for a co-organizer to start an AI research reading group on campus",
    "Need a collaborator to build an IoT weather station with Arduino and ESP32",
    "Looking for robotics club members interested in ROS2 and robot navigation",
    "Seeking a peer to collaborate on writing and publishing an IEEE conference paper",
  ],
};

const PLACEHOLDERS_BY_KIND: Record<"mentor" | "teammate" | "notes" | "others", string> = {
  mentor: "e.g. Looking for a senior mentor in machine learning to guide my mini project, especially with PyTorch and NLP...",
  teammate: "e.g. Need a frontend developer for a 36-hour hackathon, comfortable with React, Tailwind, and Next.js...",
  notes: "e.g. Need comprehensive semester study materials, handwritten notes, and solved questions for DBMS...",
  others: "e.g. Looking for peers to collaborate on an open source robotics project or campus club event...",
};

export default function RequestsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [kind, setKind] = useState<"teammate" | "mentor" | "notes" | "others">("mentor");
  const [text, setText] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>(["wkend_morn", "wkday_eve"]);
  const [loading, setLoading] = useState(false);
  const [pastRequests, setPastRequests] = useState<SavedRequest[]>([]);

  useEffect(() => {
    const cur = getCurrentUser();
    setUser(cur);
    try {
      const raw = localStorage.getItem(STORAGE_REQUESTS_KEY);
      if (raw) {
        setPastRequests(JSON.parse(raw));
      } else {
        // Seed initial sample request for demo
        const initial: SavedRequest[] = [
          {
            id: "req_demo_01",
            kind: "mentor",
            text: "Looking for a senior mentor in machine learning to guide my mini project",
            slots: ["wkend_morn", "wkday_eve"],
            createdAt: "Today, 14:10",
            matchCount: 3,
          },
          {
            id: "req_demo_02",
            kind: "teammate",
            text: "Need a frontend developer for a hackathon, comfortable with React and Next.js",
            slots: ["wkend_aft", "wkday_eve"],
            createdAt: "Yesterday",
            matchCount: 3,
          },
        ];
        setPastRequests(initial);
        localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(initial));
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const handleSlotToggle = (slotId: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId) ? prev.filter((s) => s !== slotId) : [...prev, slotId]
    );
  };

  const handleCategorySelect = (selectedKind: "mentor" | "teammate" | "notes" | "others") => {
    setKind(selectedKind);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    const payload: PostMatchPayload = {
      kind,
      text: text.trim(),
      slots: selectedSlots,
      year: user?.year || 2,
    };

    try {
      const res = await requestMatches(payload);
      
      // Save result in sessionStorage for the results view
      sessionStorage.setItem(`match_result_${res.request_id}`, JSON.stringify(res));

      const newSaved: SavedRequest = {
        id: res.request_id,
        kind,
        text: payload.text,
        slots: payload.slots,
        createdAt: "Just now",
        matchCount: res.matches.length,
      };

      const updated = [newSaved, ...pastRequests];
      setPastRequests(updated);
      localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(updated));

      // Navigate to match results page
      router.push(`/requests/${res.request_id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div>
          <p className="font-mono text-xs text-[#52a8ff] uppercase tracking-widest mb-1">
            Intent-Driven Matchmaking
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Post a Campus Request
          </h1>
          <p className="font-mono text-xs text-[#999999] mt-1">
            Express what you need in plain English. The AI engine will parse concepts, check availability, and rank verified peers.
          </p>
        </div>

        {/* Post Request Card */}
        <div className="card-dark p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kind Selector */}
            <div>
              <label className="block font-mono text-xs text-[#999999] uppercase tracking-wider mb-2">
                Request Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: "mentor", label: "Senior Mentor", desc: "Guide & placement tips" },
                  { id: "teammate", label: "Hackathon Teammate", desc: "Build & collaborate" },
                  { id: "notes", label: "Notes & Exam Prep", desc: "Subject materials" },
                  { id: "others", label: "Others", desc: "Clubs, research & custom" },
                ].map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => handleCategorySelect(k.id as any)}
                    className={`p-3.5 text-left border font-mono transition-colors ${
                      kind === k.id
                        ? "bg-[#161616] border-[#52a8ff] text-white"
                        : "bg-[#0d0d0d] border-white/[0.1] text-[#888888] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{k.label}</span>
                      {kind === k.id && (
                        <span className="w-2 h-2 rounded-full bg-[#52a8ff]" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#999999] mt-1">{k.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Plain Language Prompt Textarea */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-mono text-xs text-[#999999] uppercase tracking-wider">
                  Request Description (Plain English)
                </label>
                <span className="font-mono text-[10px] text-[#52a8ff]">
                  Natural language concept enrichment enabled
                </span>
              </div>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={PLACEHOLDERS_BY_KIND[kind]}
                className="w-full bg-[#121212] border border-white/[0.145] p-4 font-mono text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#52a8ff] leading-relaxed"
              />
            </div>

            {/* Dynamic Quick Prefill Samples by Category */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#999999]">
                  Quick Test Samples ({kind.toUpperCase()}):
                </span>
                <span className="font-mono text-[10px] text-[#52a8ff]">
                  Click any sample to test
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAMPLES_BY_KIND[kind].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setText(sample)}
                    className={`px-3 py-2 border text-left font-mono text-[11px] transition-colors ${
                      text === sample
                        ? "bg-[#161616] border-[#52a8ff] text-white"
                        : "bg-[#121212] border-white/[0.1] hover:border-white/30 text-[#cccccc]"
                    }`}
                  >
                    &ldquo;{sample}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* Slot Overlap Selection */}
            <div>
              <label className="block font-mono text-xs text-[#999999] uppercase tracking-wider mb-2">
                My Free Timeslots for this Request
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ALL_SLOTS.map((s) => {
                  const active = selectedSlots.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSlotToggle(s.id)}
                      className={`p-2.5 border text-center font-mono text-xs transition-colors ${
                        active
                          ? "bg-white text-black border-white font-semibold"
                          : "bg-[#121212] text-[#888888] border-white/[0.145] hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="btn-square px-7 py-3 text-sm text-[#121212] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#121212]" />
                <span>{loading ? "Computing AI Embeddings & Scores..." : "Run AI Matcher"}</span>
                <ArrowUpRight className="w-4 h-4 text-[#121212]" />
              </button>

              <span className="font-mono text-xs text-[#999999]">
                Returns top-3 ranked candidates with explainable score breakdown
              </span>
            </div>
          </form>
        </div>

        {/* Past Requests History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium tracking-tight text-white">
              My Past Requests
            </h2>
            <span className="font-mono text-xs text-[#999999]">
              {pastRequests.length} recorded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastRequests.map((req) => (
              <div
                key={req.id}
                className="card-dark p-5 flex flex-col justify-between space-y-4 hover:border-white/30 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <StatusChip
                      status={req.kind === "mentor" ? "ACTIVE" : "PASS"}
                      label={req.kind.toUpperCase()}
                    />
                    <span className="font-mono text-[11px] text-[#999999] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {req.createdAt}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-white leading-relaxed line-clamp-2">
                    {req.text}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.1]">
                  <span className="font-mono text-[11px] text-[#999999]">
                    {req.matchCount} Top Candidates Ranked
                  </span>
                  <Link
                    href={`/requests/${req.id}`}
                    className="btn-square px-3 py-1.5 text-xs text-[#121212]"
                  >
                    <span>View Matches</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#121212]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

