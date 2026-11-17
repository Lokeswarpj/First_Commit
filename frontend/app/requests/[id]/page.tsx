"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { MatchCard } from "@/components/MatchCard";
import { StatusChip } from "@/components/StatusChip";
import { MatchResponse, requestMatches } from "@/lib/api";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";

function MatchResultsContent() {
  const params = useParams();
  const requestId = (params?.id as string) || "req_demo_01";
  const [data, setData] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load cached result from session storage first
    try {
      const cached = sessionStorage.getItem(`match_result_${requestId}`);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch (e) {
      // fallback
    }

    // Default sample match fallback
    const defaultSample = async () => {
      setLoading(true);
      const res = await requestMatches({
        kind: "mentor",
        text: "Looking for a senior mentor in machine learning to guide my mini project",
        slots: ["wkend_morn", "wkday_eve"],
        year: 2,
      });
      setData(res);
      setLoading(false);
    };

    defaultSample();
  }, [requestId]);

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/requests"
          className="inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; Back to Requests Board</span>
        </Link>

        <div className="flex items-center gap-2">
          <StatusChip status="PASS" label="AI INFERENCE COMPLETE" />
          <span className="font-mono text-xs text-slate-500">
            ID: {requestId}
          </span>
        </div>
      </div>

      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#2563eb]" />
            <span className="font-mono text-xs text-[#2563eb] uppercase tracking-widest font-semibold">
              Explainable Match Results
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Top Ranked Candidates
          </h1>
          <p className="font-mono text-xs text-slate-500 mt-1">
            Deterministic scoring based on Semantic Domain Similarity, Concept Graph Coverage, Free Slot Overlap, and Role Fit.
          </p>
        </div>

        <Link
          href="/requests"
          className="btn-square px-4 py-2 text-xs text-white bg-slate-900 hover:bg-slate-800 self-start sm:self-auto"
        >
          <span>Post Another Request</span>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-dark bg-white border border-slate-200 p-8 animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 w-1/3" />
              <div className="h-4 bg-slate-100 w-2/3" />
              <div className="h-16 bg-slate-50 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Match Cards List */}
      {!loading && data && data.matches.length > 0 && (
        <div className="space-y-6">
          {data.matches.map((cand, idx) => (
            <MatchCard key={cand.candidate_id} match={cand} rank={idx + 1} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && (!data || data.matches.length === 0) && (
        <div className="card-dark bg-white border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-lg font-semibold text-slate-900">
            No matching profiles found
          </h3>
          <p className="font-mono text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or selecting broader timeslots to discover suitable candidates.
          </p>
          <div className="pt-2">
            <Link
              href="/requests"
              className="btn-square px-5 py-2 text-xs text-white bg-slate-900 hover:bg-slate-800"
            >
              <span>Edit Request</span>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default function MatchResultsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />
      <Suspense fallback={
        <div className="max-w-[1200px] mx-auto px-6 py-12 text-center font-mono text-xs text-slate-500">
          Loading match results...
        </div>
      }>
        <MatchResultsContent />
      </Suspense>
    </div>
  );
}
