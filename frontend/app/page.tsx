"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Shield, Users, BookOpen, Clock, Check, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { StatusChip } from "@/components/StatusChip";
import { TimelineProgressBar } from "@/components/TimelineProgressBar";

export default function Home() {
  const [selectedSpanId, setSelectedSpanId] = useState("span_eval_01");

  const telemetryEvents = [
    { id: "evt_req_token_01", step: "request.concept_extraction", status: "PASS" as const, latency: "2.4ms" },
    { id: "evt_req_sim_02", step: "hybrid_engine.tfidf_cosine", status: "PASS" as const, latency: "5.1ms" },
    { id: "evt_graph_cov_03", step: "concept_graph.ontology_map", status: "ACTIVE" as const, latency: "3.2ms" },
    { id: "evt_slot_jac_04", step: "timeslot.jaccard_overlap", status: "PASS" as const, latency: "1.8ms" },
    { id: "evt_fit_gate_05", step: "seniority.mentor_verification", status: "PASS" as const, latency: "1.1ms" },
  ];

  const executionSpans = [
    {
      id: "span_req_00",
      name: "1. text.concept_enrichment",
      tag: "TF-IDF + Ontology",
      startMs: 0,
      durationMs: 4,
      offsetPct: 0,
      durationPct: 22,
    },
    {
      id: "span_eval_01",
      name: "2. matcher.semantic_vector_cosine",
      tag: "45% Weight",
      startMs: 4,
      durationMs: 6,
      offsetPct: 22,
      durationPct: 35,
    },
    {
      id: "span_cov_02",
      name: "3. concept_graph.coverage_scoring",
      tag: "30% Weight",
      startMs: 10,
      durationMs: 4,
      offsetPct: 57,
      durationPct: 20,
    },
    {
      id: "span_slot_03",
      name: "4. schedule.slot_jaccard_overlap",
      tag: "15% Weight",
      startMs: 14,
      durationMs: 2,
      offsetPct: 77,
      durationPct: 12,
    },
    {
      id: "span_explain_04",
      name: "5. fit_gate.senior_verification",
      tag: "10% Weight",
      startMs: 16,
      durationMs: 2,
      offsetPct: 89,
      durationPct: 11,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-[#2563eb] selection:text-white font-sans">
      {/* Top Header */}
      <Header />

      {/* 1. HERO SECTION (Clean Light Canvas - Subtle Accent Glow & Crisp Tech Grid) */}
      <section className="relative min-h-[92vh] w-full flex flex-col justify-center overflow-hidden pt-36 pb-20 px-6 sm:px-10 lg:px-14">
        {/* Subtle Radial Blue Accent Glow and Geometric Tech Grid */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 18%, rgba(37, 99, 235, 0.08) 0%, rgba(248, 250, 252, 0) 65%),
              linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "100% 100%, 56px 56px, 56px 56px",
          }}
        />

        {/* Ambient Top Glow Border Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2563eb]/20 to-transparent" />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto space-y-8">
          {/* Status Chip Indicator */}
          <div className="flex items-center gap-3">
            <StatusChip status="PASS" label="FIRSTCOMMIT '26 • ROUND 3 PROTOTYPE" />
            <span className="font-mono text-xs text-slate-500 hidden sm:inline font-medium">
              TEAM ESHWAR &bull; CAMPUS &amp; STUDENT LIFE
            </span>
          </div>

          {/* Main Hero Headline */}
          <div className="max-w-[920px] space-y-6">
            <h1 className="headline-fluid text-slate-900 font-bold">
              Match with project teammates &amp; senior mentors. Explained by AI.
            </h1>

            <p className="text-[17px] sm:text-[19px] text-slate-600 font-normal leading-relaxed max-w-[760px]">
              Stop spamming chaotic WhatsApp groups. CampusLink parses plain-English requests across skills, concept graphs, cohort year, and mutually free timeslots &mdash; with 100% transparent score breakdowns.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="btn-square text-[16px] px-8 py-3.5 bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
              >
                <span>Launch Interactive App</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </Link>

              <Link
                href="/requests"
                className="px-6 py-3.5 border border-slate-300 hover:border-slate-900 text-slate-800 font-mono text-xs transition-colors bg-white shadow-sm font-semibold"
              >
                Post a Request &rarr;
              </Link>
            </div>
          </div>

          {/* Hero Live Matcher Preview Card */}
          <div className="pt-10 max-w-[1100px]">
            <div className="card-dark bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="font-mono text-xs text-slate-900 uppercase tracking-wider font-semibold">
                    LIVE AI INFERENCE PREVIEW
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                  <span>Target: Year 3 Senior ML Mentor</span>
                  <StatusChip status="PASS" label="HIT@1 100%" />
                </div>
              </div>

              {/* Sample Top Candidate Card Result */}
              <div className="bg-slate-50/70 border border-slate-200 p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-[#2563eb] border border-blue-200 font-mono text-xs font-semibold">
                        RANK #1
                      </span>
                      <span className="text-xl font-semibold text-slate-900">Ananya Roy</span>
                      <StatusChip status="PASS" label="VERIFIED YEAR-3 MENTOR" />
                    </div>
                    <p className="font-mono text-xs text-slate-500 mt-1">
                      Skills: python, machine learning, scikit-learn, pandas, deep learning
                    </p>
                  </div>

                  <div className="flex items-baseline font-mono text-3xl font-bold text-slate-900 tracking-tight">
                    <span>92.5</span>
                    <span className="text-xs text-slate-500 ml-1">/100</span>
                  </div>
                </div>

                {/* Why Attribution */}
                <div className="p-3 bg-blue-50/80 border-l-2 border-[#2563eb] font-mono text-xs text-slate-800 flex items-center gap-2 font-medium">
                  <span className="text-[#2563eb] font-bold">WHY:</span>
                  <span>covers ml; verified year-3 mentor; 2 shared free slot(s)</span>
                </div>

                {/* 4 Score Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 font-mono text-xs">
                  <div>
                    <div className="flex justify-between text-slate-500 mb-1 text-[11px]">
                      <span>Semantic (45%)</span>
                      <span className="text-slate-900 font-semibold">100%</span>
                    </div>
                    <TimelineProgressBar offsetPercent={0} durationPercent={100} isActive={true} />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-1 text-[11px]">
                      <span>Coverage (30%)</span>
                      <span className="text-slate-900 font-semibold">100%</span>
                    </div>
                    <TimelineProgressBar offsetPercent={0} durationPercent={100} isActive={false} />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-1 text-[11px]">
                      <span>Availability (15%)</span>
                      <span className="text-slate-900 font-semibold">50%</span>
                    </div>
                    <TimelineProgressBar offsetPercent={0} durationPercent={50} isActive={false} />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-1 text-[11px]">
                      <span>Senior Fit (10%)</span>
                      <span className="text-slate-900 font-semibold">100%</span>
                    </div>
                    <TimelineProgressBar offsetPercent={0} durationPercent={100} isActive={false} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. METRICS GRID */}
      <section id="metrics" className="w-full bg-white py-16 px-6 sm:px-10 lg:px-14 border-y border-slate-200">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-y border-slate-200">
            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div className="flex items-baseline font-mono text-[56px] text-slate-900 font-bold tracking-[-3.36px]">
                <span>100</span>
                <span className="text-[28px] text-slate-400 tracking-normal ml-1">%</span>
              </div>
              <p className="text-slate-600 text-[14px] font-mono mt-4 font-medium">
                Hit@1 Top Match Precision
              </p>
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div className="flex items-baseline font-mono text-[56px] text-slate-900 font-bold tracking-[-3.36px]">
                <span>+28.5</span>
                <span className="text-[28px] text-slate-400 tracking-normal ml-1">%</span>
              </div>
              <p className="text-slate-600 text-[14px] font-mono mt-4 font-medium">
                Gain Over Keyword Search
              </p>
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div className="flex items-baseline font-mono text-[56px] text-slate-900 font-bold tracking-[-3.36px]">
                <span>4-Part</span>
              </div>
              <p className="text-slate-600 text-[14px] font-mono mt-4 font-medium">
                Explainable Score Breakdown
              </p>
            </div>

            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div className="flex items-baseline font-mono text-[56px] text-slate-900 font-bold tracking-[-3.36px]">
                <span>Zero</span>
              </div>
              <p className="text-slate-600 text-[14px] font-mono mt-4 font-medium">
                Contact Leaks Before Accept
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVENT STREAM TABLE (Matching Engine Telemetry) */}
      <section id="event-stream" className="w-full bg-[#f8fafc] py-20 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-[#2563eb] uppercase tracking-widest mb-1 font-semibold">
                Telemetry &amp; Engine Execution
              </p>
              <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-[-1px] text-slate-900">
                Matching Pipeline Execution Stream
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <StatusChip status="PASS" label="PIPELINE OK" />
              <StatusChip status="ACTIVE" label="SESSION_09BF14A" />
              <span className="font-mono text-xs text-slate-500 font-medium">13.6ms total</span>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="card-dark bg-white border border-slate-200 shadow-sm overflow-hidden">
            {/* Table Header Bar */}
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-mono text-slate-600 font-medium">
              <div className="flex items-center gap-4">
                <span className="text-slate-900 font-bold">STAGE TELEMETRY</span>
                <span>Trace: req_mentor_ml_01</span>
              </div>
              <div className="flex items-center gap-3">
                <span>CANDIDATES EVALUATED: 30</span>
                <span className="text-emerald-600 font-bold">DETERMINISTIC RANK COMPLETE</span>
              </div>
            </div>

            {/* Split View */}
            <div className="flex flex-col md:flex-row min-h-[360px]">
              {/* Left Sidebar */}
              <div className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/60 divide-y divide-slate-200">
                <div className="px-4 py-2.5 text-[11px] font-mono text-slate-500 uppercase tracking-wider bg-slate-100 font-semibold">
                  Pipeline Stage ID
                </div>
                {telemetryEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 hover:bg-slate-100 cursor-pointer transition-colors flex items-center justify-between font-mono text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            evt.status === "PASS"
                              ? "#16a34a"
                              : evt.status === "ACTIVE"
                              ? "#2563eb"
                              : "#94a3b8",
                        }}
                      />
                      <span className="text-slate-900 font-medium">{evt.step.split(".")[1]}</span>
                    </div>
                    <span className="text-slate-400 text-[10px]">{evt.latency}</span>
                  </div>
                ))}
              </div>

              {/* Right Side: Data Table */}
              <div className="flex-1 overflow-x-auto bg-white">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50 font-semibold">
                      <th className="py-3 px-6 font-semibold w-[45%]">SPAN &amp; WEIGHT</th>
                      <th className="py-3 px-6 font-semibold w-[40%]">START &amp; LATENCY TIMELINE</th>
                      <th className="py-3 px-6 font-semibold text-right w-[15%]">DURATION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {executionSpans.map((span) => {
                      const isActive = selectedSpanId === span.id;
                      return (
                        <tr
                          key={span.id}
                          onClick={() => setSelectedSpanId(span.id)}
                          className={`cursor-pointer transition-colors ${
                            isActive
                              ? "bg-blue-50/60 text-slate-900"
                              : "hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <td className="py-4 px-6 font-mono">
                            <div className="flex items-center gap-3">
                              <span className={`text-[13px] ${isActive ? "text-[#2563eb] font-bold" : "font-medium"}`}>
                                {span.name}
                              </span>
                              <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-medium">
                                {span.tag}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1.5">
                              <div className="text-[10px] text-slate-400">
                                +{span.startMs}ms
                              </div>
                              <TimelineProgressBar
                                offsetPercent={span.offsetPct}
                                durationPercent={span.durationPct}
                                isActive={isActive}
                              />
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right font-mono text-slate-500">
                            {span.durationMs}ms
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BENTO FEATURE GRID */}
      <section id="bento" className="w-full bg-white py-20 px-6 sm:px-10 lg:px-14 border-t border-slate-200">
        <div className="max-w-[1440px] mx-auto space-y-10">
          <div>
            <p className="font-mono text-xs text-[#2563eb] uppercase tracking-widest mb-1 font-semibold">
              Core Capabilities
            </p>
            <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-[-1px] text-slate-900">
              Why CampusLink Outperforms Broadcast Groups
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Benchmark Regression */}
            <div className="card-dark bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    MODULE 01
                  </span>
                  <StatusChip status="PASS" label="BENCHMARK 100%" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">
                  Multi-Criteria Precision
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  9-request labelled benchmark testing against human ground truth. Replaces exact word counts with concept-aware n-gram vectors.
                </p>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-900 font-medium">ML Senior Mentor</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">+28.5%</span>
                    <StatusChip status="PASS" label="HIT@1" />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-900 font-medium">Frontend Teammate</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">+14.2%</span>
                    <StatusChip status="PASS" label="HIT@1" />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-900 font-medium">DBMS Exam Prep</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">+9.1%</span>
                    <StatusChip status="PASS" label="HIT@1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Concept Graph Vocabulary Enrichment */}
            <div className="card-dark bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    MODULE 02
                  </span>
                  <StatusChip status="ACTIVE" label="CONCEPT GRAPH" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">
                  Vocabulary Enrichment
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Bridges lexical misses automatically &mdash; linking NLP to RAG chatbots, OpenCV to Computer Vision, and Spring Boot to Backend APIs.
                </p>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-500 mb-1.5 font-medium">
                    <span>Direct Domain Concept Match</span>
                    <span className="text-slate-900 font-bold">100% Credit</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 flex overflow-hidden rounded-full">
                    <div className="h-full bg-[#2563eb]" style={{ width: "70%" }} />
                    <div className="h-full bg-slate-200" style={{ width: "30%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-500 mb-1.5 font-medium">
                    <span>Related Field Overlap (ML &harr; Vision)</span>
                    <span className="text-slate-900 font-bold">50% Credit</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 flex overflow-hidden rounded-full">
                    <div className="h-full bg-emerald-600" style={{ width: "50%" }} />
                    <div className="h-full bg-slate-200" style={{ width: "50%" }} />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Active Ontology Concepts: 13</span>
                  <span className="text-emerald-600 font-bold">Zero Cold Start Delay</span>
                </div>
              </div>
            </div>

            {/* Card 3: Privacy Vault */}
            <div className="card-dark bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    MODULE 03
                  </span>
                  <StatusChip status="PASS" label="ZERO-TRUST" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">
                  Privacy-First Contact Vault
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Strict Row Level Security (RLS) ensures contact details remain masked until a recipient explicitly accepts the match.
                </p>
              </div>

              <div className="bg-slate-50 p-4 font-mono text-[11px] leading-relaxed space-y-2 border border-slate-200">
                <div className="text-slate-500 pb-2 border-b border-slate-200 flex justify-between font-semibold">
                  <span>privacy_policy.sql</span>
                  <span className="text-emerald-600">ENFORCED</span>
                </div>

                <div className="text-slate-500">
                  -- Zero-Trust Contact Rule
                </div>
                <div className="pl-2 border-l-2 border-[#2563eb] text-slate-800 font-medium">
                  status == &apos;pending&apos; &rarr; email masked
                </div>
                <div className="pl-2 border-l-2 border-emerald-600 text-emerald-700 font-medium">
                  status == &apos;accepted&apos; &rarr; contact revealed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-white py-12 px-6 sm:px-10 lg:px-14 border-t border-slate-200 text-xs font-mono text-slate-500">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-slate-900 font-semibold text-sm">CampusLink</span>
            <span>&mdash;</span>
            <span>FirstCommit &apos;26 | Team EshWar (solo)</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/requests" className="hover:text-slate-900 transition-colors">
              Post Request
            </Link>
            <Link href="/library" className="hover:text-slate-900 transition-colors">
              Notes Library
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition-colors">
              Demo Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
