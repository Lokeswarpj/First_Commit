"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StatusChip } from "@/components/StatusChip";
import { TimelineProgressBar } from "@/components/TimelineProgressBar";
import { MatchCandidate, connectCandidate, sendFeedback } from "@/lib/api";
import { getCurrentUser } from "@/lib/supabase";
import { ArrowUpRight, Check, ThumbsUp, ThumbsDown } from "lucide-react";

interface MatchCardProps {
  match: MatchCandidate;
  rank: number;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, rank }) => {
  const [connectStatus, setConnectStatus] = useState<"idle" | "sending" | "connected">("idle");
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  const handleConnect = async () => {
    setConnectStatus("sending");
    const cur = getCurrentUser();

    // Call API with full details so backend can store it
    await connectCandidate(match.candidate_id, {
      from_name: cur.name,
      from_email: cur.college_email,
      from_year: cur.year,
      to_name: match.name,
      to_year: match.year,
      topic: match.reason,
    });

    // Save to connections storage so it immediately reflects in /connections
    try {
      const raw = localStorage.getItem("campuslink_demo_connections");
      const list = raw ? JSON.parse(raw) : [];
      const newConn = {
        id: "conn_" + Math.random().toString(36).substring(7),
        fromId: cur.id,
        fromName: cur.name,
        fromEmail: cur.college_email,
        fromYear: cur.year,
        toId: match.candidate_id,
        toName: match.name,
        toEmail: `${match.name.toLowerCase().replace(/\s+/g, ".")}@college.edu`,
        toYear: match.year,
        topic: match.reason,
        status: "pending",
        isOutgoing: true,
        createdAt: "Just now",
      };

      // Filter out any older duplicate to the same recipient, put newest on top
      const filtered = list.filter((c: any) => c.toName !== match.name);
      localStorage.setItem("campuslink_demo_connections", JSON.stringify([newConn, ...filtered]));
      localStorage.setItem("campuslink_latest_sent_connection", JSON.stringify(newConn));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("campuslink_connection_created", { detail: newConn }));
      }
    } catch (e) {
      console.warn("Could not save connection locally:", e);
    }

    setConnectStatus("connected");
  };

  const handleFeedback = async (val: "good" | "bad") => {
    setFeedback(val);
    await sendFeedback(match.candidate_id, val);
  };

  return (
    <div className="card-dark p-6 sm:p-8 flex flex-col justify-between space-y-6 relative group overflow-hidden">
      {/* Top Bar: Rank, Name, Year, Score */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.145]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 bg-white/[0.06] text-[#52a8ff] border border-white/[0.1]">
              RANK #{rank}
            </span>
            <div>
              <h3 className="text-xl font-medium text-white tracking-[-0.5px]">
                {match.name}
              </h3>
              <p className="font-mono text-xs text-[#999999] mt-0.5">
                Academic Year {match.year} &bull; Candidate ID: {match.candidate_id}
              </p>
            </div>
          </div>

          {/* High-Contrast Match Score Pill */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-mono text-[28px] sm:text-[32px] font-bold text-white tracking-tight">
                {match.score}
              </span>
              <span className="font-mono text-xs text-[#999999] ml-1">/100</span>
            </div>
            <StatusChip
              status={match.score >= 80 ? "PASS" : match.score >= 50 ? "ACTIVE" : "WARN"}
              label={match.score >= 80 ? "HIGH MATCH" : match.score >= 50 ? "MEDIUM FIT" : "PARTIAL"}
            />
          </div>
        </div>

        {/* Explainability "Why" Callout */}
        <div className="mt-4 p-3.5 bg-[#121212] border-l-2 border-[#52a8ff] flex items-start gap-3">
          <span className="font-mono text-xs font-semibold text-[#52a8ff] uppercase tracking-wider shrink-0 mt-0.5">
            WHY THIS MATCH:
          </span>
          <span className="font-mono text-xs text-white leading-relaxed">
            {match.reason}
          </span>
        </div>

        {/* Four Score Breakdown Bars (The Proof that AI Matching Works) */}
        <div className="mt-6 space-y-3 font-mono text-xs">
          <p className="text-[11px] text-[#999999] uppercase tracking-wider">
            Algorithmic Score Breakdown
          </p>

          {/* 1. Semantic Similarity (Weight: 45%) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[#999999]">
              <span>Semantic Domain Alignment (45%)</span>
              <span className="text-white">{Math.round(match.parts.semantic * 100)}%</span>
            </div>
            <TimelineProgressBar
              offsetPercent={0}
              durationPercent={match.parts.semantic * 100}
              isActive={true}
            />
          </div>

          {/* 2. Concept Coverage (Weight: 30%) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[#999999]">
              <span>Concept Graph Coverage (30%)</span>
              <span className="text-white">{Math.round(match.parts.coverage * 100)}%</span>
            </div>
            <TimelineProgressBar
              offsetPercent={0}
              durationPercent={match.parts.coverage * 100}
              isActive={false}
            />
          </div>

          {/* 3. Free Slot Availability (Weight: 15%) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[#999999]">
              <span>Mutual Time Availability (15%)</span>
              <span className="text-white">{Math.round(match.parts.availability * 100)}%</span>
            </div>
            <TimelineProgressBar
              offsetPercent={0}
              durationPercent={match.parts.availability * 100}
              isActive={false}
            />
          </div>

          {/* 4. Fit / Seniority (Weight: 10%) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[#999999]">
              <span>Role / Seniority Fit (10%)</span>
              <span className="text-white">{Math.round(match.parts.fit * 100)}%</span>
            </div>
            <TimelineProgressBar
              offsetPercent={0}
              durationPercent={match.parts.fit * 100}
              isActive={false}
            />
          </div>
        </div>

        {/* Skills Tag Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5 font-mono text-xs">
          <span className="text-[#999999] mr-1">Skills:</span>
          {match.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-white/[0.06] border border-white/[0.1] text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Bottom Row: Connect CTA & Feedback */}
      <div className="pt-4 border-t border-white/[0.145] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Connect Button */}
        <div>
          {connectStatus === "connected" ? (
            <Link
              href="/connections?tab=outgoing"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#62c073]/20 border border-[#62c073]/40 text-[#62c073] font-mono text-xs hover:bg-[#62c073]/30 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>REQUEST SENT &bull; VIEW IN CONNECTIONS &rarr;</span>
            </Link>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connectStatus === "sending"}
              className="btn-square px-5 py-2.5 text-xs text-[#121212]"
            >
              <span>{connectStatus === "sending" ? "Sending..." : "Connect Request"}</span>
              <ArrowUpRight className="w-4 h-4 text-[#121212]" />
            </button>
          )}
        </div>

        {/* Good Match / Not Useful Feedback Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#999999]">
          <span>Judge AI Match:</span>
          <button
            onClick={() => handleFeedback("good")}
            className={`p-1.5 border transition-colors ${
              feedback === "good"
                ? "bg-[#62c073]/20 border-[#62c073] text-[#62c073]"
                : "border-white/[0.145] hover:bg-white/10 text-white"
            }`}
            title="Good match"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleFeedback("bad")}
            className={`p-1.5 border transition-colors ${
              feedback === "bad"
                ? "bg-red-500/20 border-red-500 text-red-400"
                : "border-white/[0.145] hover:bg-white/10 text-white"
            }`}
            title="Not useful"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

