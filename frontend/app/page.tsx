"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { StatusChip } from "@/components/StatusChip";
import { TimelineProgressBar } from "@/components/TimelineProgressBar";

export default function Home() {
  const [selectedSpanId, setSelectedSpanId] = useState("span_eval_01");

  const eventList = [
    { id: "evt_req_8921", status: "PASS" as const, time: "14:22:01.041" },
    { id: "evt_match_8922", status: "PASS" as const, time: "14:22:01.094" },
    { id: "evt_rerank_8923", status: "ACTIVE" as const, time: "14:22:01.120" },
    { id: "evt_policy_8924", status: "WARN" as const, time: "14:22:01.185" },
    { id: "evt_token_8925", status: "FAIL" as const, time: "14:22:01.210" },
  ];

  const spans = [
    {
      id: "span_req_00",
      name: "request.sanitize_context",
      startMs: 0,
      durationMs: 24,
      offsetPct: 0,
      durationPct: 18,
    },
    {
      id: "span_eval_01",
      name: "hybrid_matcher.vector_sim",
      startMs: 24,
      durationMs: 56,
      offsetPct: 18,
      durationPct: 42,
    },
    {
      id: "span_cov_02",
      name: "concept_graph.ontology_scan",
      startMs: 45,
      durationMs: 38,
      offsetPct: 34,
      durationPct: 28,
    },
    {
      id: "span_slot_03",
      name: "availability.jaccard_overlap",
      startMs: 80,
      durationMs: 19,
      offsetPct: 60,
      durationPct: 14,
    },
    {
      id: "span_explain_04",
      name: "reasons.deterministic_builder",
      startMs: 99,
      durationMs: 32,
      offsetPct: 74,
      durationPct: 24,
    },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#52a8ff] selection:text-black">
      {/* Absolute-Positioned Header */}
      <Header />

      {/* 1. HERO SECTION (100svh Canvas Frame) */}
      <section className="relative h-[100svh] w-full flex flex-col justify-end overflow-hidden pb-16 sm:pb-20 px-6 sm:px-10 lg:px-14">
        {/* Background Image with object-fit: cover */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="AI Neural Background"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Heavy Black Scrim Overlay on the bottom 40-70% */}
          <div className="absolute inset-0 hero-scrim z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-[60%] hero-bottom-fade z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto">
          <div className="max-w-[752px] space-y-6">
            <h1 className="headline-fluid text-white">
              Ship AI agents that don&apos;t break in production.
            </h1>

            <p className="text-[16px] text-[#e7e7e7] font-normal leading-relaxed">
              Test, monitor, and improve agents before real users find the bugs
            </p>

            <div className="pt-2">
              <Link
                href="#event-stream"
                className="btn-square text-[20px] px-7 py-3"
              >
                <span>Book a demo</span>
                <ArrowUpRight className="w-[12px] h-[12px] text-[#121212]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. METRICS GRID (4-Column Border-Connected Grid) */}
      <section id="metrics" className="w-full bg-[#000000] py-16 px-6 sm:px-10 lg:px-14 border-b border-white/[0.145]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.145] border-y border-white/[0.145]">
            {/* Metric 1 */}
            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div className="flex items-baseline font-mono text-[56px] text-white font-medium tracking-[-3.36px]">
                <span>100</span>
                <span className="text-[28px] text-[#999999] tracking-normal ml-1">%</span>
              </div>
              <p className="text-[#999999] text-[14px] font-mono mt-4">
                Hit@1 Deterministic Ranking
              </p>
            </div>

            {/* Metric 2 */}
            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div className="flex items-baseline font-mono text-[56px] text-white font-medium tracking-[-3.36px]">
                <span>12</span>
                <span className="text-[28px] text-[#999999] tracking-normal ml-1">ms</span>
              </div>
              <p className="text-[#999999] text-[14px] font-mono mt-4">
                Mean Inference Pipeline
              </p>
            </div>

            {/* Metric 3 */}
            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div className="flex items-baseline font-mono text-[56px] text-white font-medium tracking-[-3.36px]">
                <span>3.4</span>
                <span className="text-[28px] text-[#999999] tracking-normal ml-1">M</span>
              </div>
              <p className="text-[#999999] text-[14px] font-mono mt-4">
                Concepts &amp; Vector Profiles
              </p>
            </div>

            {/* Metric 4 */}
            <div className="p-8 lg:p-10 flex flex-col justify-between">
              <div className="flex items-baseline font-mono text-[56px] text-white font-medium tracking-[-3.36px]">
                <span>0</span>
                <span className="text-[28px] text-[#999999] tracking-normal ml-1">ms</span>
              </div>
              <p className="text-[#999999] text-[14px] font-mono mt-4">
                Cold Start Sleep Latency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVENT STREAM TABLE (Card-Based Table Layout) */}
      <section id="event-stream" className="w-full bg-[#000000] py-20 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-[#52a8ff] uppercase tracking-widest mb-1">
                Telemetry &amp; Observability
              </p>
              <h2 className="text-[28px] sm:text-[36px] font-medium tracking-[-1px] text-white">
                Live Event Stream
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <StatusChip status="PASS" label="SYSTEM NORMAL" />
              <StatusChip status="ACTIVE" label="TRACE_8F29C41D" />
              <span className="font-mono text-xs text-[#999999]">131ms</span>
            </div>
          </div>

          {/* Main Card with 1px ring border */}
          <div className="card-dark overflow-hidden">
            {/* Table Header Bar */}
            <div className="bg-[#121212] px-6 py-3 border-b border-white/[0.145] flex items-center justify-between text-xs font-mono text-[#999999]">
              <div className="flex items-center gap-4">
                <span className="text-white font-semibold">TRACE STREAM</span>
                <span>ID: session_09bf14a</span>
              </div>
              <div className="flex items-center gap-3">
                <span>TOTAL SPANS: 5</span>
                <span className="text-[#62c073]">COMPLETED</span>
              </div>
            </div>

            {/* Split View */}
            <div className="flex flex-col md:flex-row min-h-[380px]">
              {/* Left Sidebar: 240px Event IDs */}
              <div className="w-full md:w-[240px] border-b md:border-b-0 md:border-r border-white/[0.145] bg-[#0a0a0a] divide-y divide-white/[0.08]">
                <div className="px-4 py-2.5 text-[11px] font-mono text-[#999999] uppercase tracking-wider bg-white/[0.02]">
                  Recent Events
                </div>
                {eventList.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 hover:bg-white/[0.04] cursor-pointer transition-colors flex items-center justify-between font-mono text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor:
                            evt.status === "PASS"
                              ? "#62c073"
                              : evt.status === "ACTIVE"
                              ? "#52a8ff"
                              : evt.status === "WARN"
                              ? "#999999"
                              : "#ededed",
                        }}
                      />
                      <span className="text-white">{evt.id}</span>
                    </div>
                    <span className="text-[#999999] text-[10px]">{evt.time.split(".")[0]}</span>
                  </div>
                ))}
              </div>

              {/* Right Side: Data Table */}
              <div className="flex-1 overflow-x-auto bg-[#000000]/60">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.145] text-[#999999] text-[11px] uppercase tracking-wider bg-white/[0.02]">
                      <th className="py-3 px-6 font-medium w-[45%]">SPAN</th>
                      <th className="py-3 px-6 font-medium w-[40%]">START &amp; TIMELINE</th>
                      <th className="py-3 px-6 font-medium text-right w-[15%]">DURATION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.08]">
                    {spans.map((span) => {
                      const isActive = selectedSpanId === span.id;
                      return (
                        <tr
                          key={span.id}
                          onClick={() => setSelectedSpanId(span.id)}
                          className={`cursor-pointer transition-colors ${
                            isActive
                              ? "bg-white/[0.06] text-white"
                              : "hover:bg-white/[0.03] text-[#e7e7e7]"
                          }`}
                        >
                          <td className="py-4 px-6 font-mono">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[13px] ${
                                  isActive ? "text-[#52a8ff] font-semibold" : ""
                                }`}
                              >
                                {span.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="space-y-1.5">
                              <div className="text-[10px] text-[#999999]">
                                +{span.startMs}ms
                              </div>
                              <TimelineProgressBar
                                offsetPercent={span.offsetPct}
                                durationPercent={span.durationPct}
                                isActive={isActive}
                              />
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right font-mono text-[#999999]">
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

      {/* 4. BENTO FEATURE GRID (3-Column Grid) */}
      <section id="bento" className="w-full bg-[#000000] py-20 px-6 sm:px-10 lg:px-14 border-t border-white/[0.145]">
        <div className="max-w-[1440px] mx-auto space-y-10">
          <div>
            <p className="font-mono text-xs text-[#52a8ff] uppercase tracking-widest mb-1">
              Architecture &amp; Features
            </p>
            <h2 className="text-[28px] sm:text-[36px] font-medium tracking-[-1px] text-white">
              Autonomous Safety &amp; Explainability
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Regression (Vertical list of status rows with PASS/FAIL chips) */}
            <div className="card-dark p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#999999] uppercase tracking-wider">
                    MODULE 01
                  </span>
                  <StatusChip status="PASS" label="REGRESSION SUITE" />
                </div>
                <h3 className="text-xl font-medium tracking-[-0.5px] text-white mb-2">
                  Deterministic Tests
                </h3>
                <p className="text-sm text-[#999999] leading-relaxed">
                  9-request synthetic benchmark verification against human-labelled ground truth.
                </p>
              </div>

              {/* Status Rows */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#121212] flex items-center justify-between">
                  <span className="text-white">R1_frontend_react</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#62c073] text-[11px]">+14.2%</span>
                    <StatusChip status="PASS" />
                  </div>
                </div>

                <div className="p-3 bg-[#121212] flex items-center justify-between">
                  <span className="text-white">R2_ml_senior_mentor</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#62c073] text-[11px]">+28.5%</span>
                    <StatusChip status="PASS" />
                  </div>
                </div>

                <div className="p-3 bg-[#121212] flex items-center justify-between">
                  <span className="text-white">R4_dbms_exam_prep</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#62c073] text-[11px]">+9.1%</span>
                    <StatusChip status="PASS" />
                  </div>
                </div>

                <div className="p-3 bg-[#121212] flex items-center justify-between">
                  <span className="text-white">R7_mobile_crossplatform</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#999999] text-[11px]">0.0%</span>
                    <StatusChip status="PASS" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Failure Clustering (Stacked horizontal bar charts for error metrics) */}
            <div className="card-dark p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#999999] uppercase tracking-wider">
                    MODULE 02
                  </span>
                  <StatusChip status="ACTIVE" label="DIAGNOSTICS" />
                </div>
                <h3 className="text-xl font-medium tracking-[-0.5px] text-white mb-2">
                  Failure Clustering
                </h3>
                <p className="text-sm text-[#999999] leading-relaxed">
                  Real-time telemetry grouping for slot mismatches and out-of-domain queries.
                </p>
              </div>

              {/* Stacked Horizontal Bar Charts */}
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[#999999] mb-1.5">
                    <span>Availability Contention</span>
                    <span className="text-white">64%</span>
                  </div>
                  <div className="w-full h-3 bg-[#1f1f1f] flex overflow-hidden">
                    <div className="h-full bg-[#52a8ff]" style={{ width: "64%" }} />
                    <div className="h-full bg-white/[0.18]" style={{ width: "36%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#999999] mb-1.5">
                    <span>Concept Vocabulary Miss</span>
                    <span className="text-white">22%</span>
                  </div>
                  <div className="w-full h-3 bg-[#1f1f1f] flex overflow-hidden">
                    <div className="h-full bg-[#62c073]" style={{ width: "22%" }} />
                    <div className="h-full bg-white/[0.18]" style={{ width: "78%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#999999] mb-1.5">
                    <span>Year / Seniority Gate</span>
                    <span className="text-white">14%</span>
                  </div>
                  <div className="w-full h-3 bg-[#1f1f1f] flex overflow-hidden">
                    <div className="h-full bg-[#ededed]" style={{ width: "14%" }} />
                    <div className="h-full bg-white/[0.18]" style={{ width: "86%" }} />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[#999999]">
                  <span>Total Queries: 1,420</span>
                  <span className="text-[#62c073]">Error Rate: 0.04%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Version Replay (Code-diff view with green/blue side-borders) */}
            <div className="card-dark p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#999999] uppercase tracking-wider">
                    MODULE 03
                  </span>
                  <StatusChip status="WARN" label="DIFF REPLAY" />
                </div>
                <h3 className="text-xl font-medium tracking-[-0.5px] text-white mb-2">
                  Version Replay
                </h3>
                <p className="text-sm text-[#999999] leading-relaxed">
                  Line-by-line inspection of matching weight adaptations and concept enrichment.
                </p>
              </div>

              {/* Code Diff Box */}
              <div className="bg-[#121212] p-4 font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1">
                <div className="text-[#999999] pb-2 border-b border-white/[0.1] flex justify-between">
                  <span>matcher.py</span>
                  <span>v2.1.0 &rarr; v3.0.0</span>
                </div>

                <div className="text-[#999999] pt-2">
                  @@ -16,6 +16,9 @@ hybrid score
                </div>
                <div className="pl-2 border-l-2 border-transparent text-[#999999]">
                  &nbsp;&nbsp;sem = cosine_similarity(X[-1], X[:-1])[0]
                </div>
                <div className="pl-2 border-l-2 border-[#52a8ff] bg-[#52a8ff]/10 text-white">
                  + # Hybrid 4-part explainable score
                </div>
                <div className="pl-2 border-l-2 border-[#62c073] bg-[#62c073]/10 text-[#62c073]">
                  + score = 0.45*s + 0.30*cov + 0.15*av + 0.10*ft
                </div>
                <div className="pl-2 border-l-2 border-[#62c073] bg-[#62c073]/10 text-[#62c073]">
                  + why = explain(r, p, req_c, pc, av)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#000000] py-12 px-6 sm:px-10 lg:px-14 border-t border-white/[0.145] text-xs font-mono text-[#999999]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">CampusLink</span>
            <span>&mdash;</span>
            <span>FirstCommit &apos;26 | Team EshWar</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="#product" className="hover:text-white transition-colors">
              PRD Specs
            </Link>
            <Link href="#metrics" className="hover:text-white transition-colors">
              Evaluation
            </Link>
            <Link href="#event-stream" className="hover:text-white transition-colors">
              API Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
