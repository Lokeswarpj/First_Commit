"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StatusChip } from "@/components/StatusChip";
import { getCurrentUser, DEMO_FRESHER, DEMO_MENTOR, UserProfile } from "@/lib/supabase";
import { fetchConnectionsApi, respondConnectionApi } from "@/lib/api";
import { Check, Shield, Lock, CheckCircle2, Send, Inbox, Sparkles } from "lucide-react";

export interface ConnectionRecord {
  id: string;
  fromId: string;
  fromName: string;
  fromEmail: string;
  fromYear: number;
  toId: string;
  toName: string;
  toEmail: string;
  toYear: number;
  topic: string;
  status: "pending" | "accepted" | "declined";
  isOutgoing?: boolean;
  createdAt: string;
}

const CONNECTIONS_STORAGE_KEY = "campuslink_demo_connections";

export default function ConnectionsPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "outgoing" | "incoming">("all");
  const [recentSentAlert, setRecentSentAlert] = useState<ConnectionRecord | null>(null);

  const loadAllConnections = async (cur: UserProfile) => {
    // 1. Load from localStorage
    let localList: ConnectionRecord[] = [];
    try {
      const raw = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
      if (raw) {
        localList = JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Could not read local connections:", e);
    }

    // 2. Fetch from backend API
    let apiList: any[] = [];
    try {
      apiList = await fetchConnectionsApi();
    } catch (e) {
      console.warn("Could not fetch API connections:", e);
    }

    // 3. Merge unique by id
    const map = new Map<string, ConnectionRecord>();

    // Seed defaults if empty
    const defaults: ConnectionRecord[] = [
      {
        id: "conn_lavanya",
        fromId: cur.id,
        fromName: cur.name,
        fromEmail: cur.college_email,
        fromYear: cur.year,
        toId: "P13",
        toName: "Lavanya Sundaram",
        toEmail: "lavanya.sundaram@college.edu",
        toYear: 3,
        topic: "covers relevant domain skills; verified year-3 mentor; 2 shared free slot(s)",
        status: "pending",
        isOutgoing: true,
        createdAt: "Just now",
      },
      {
        id: "conn_01",
        fromId: DEMO_FRESHER.id,
        fromName: DEMO_FRESHER.name,
        fromEmail: DEMO_FRESHER.college_email,
        fromYear: DEMO_FRESHER.year,
        toId: DEMO_MENTOR.id,
        toName: DEMO_MENTOR.name,
        toEmail: DEMO_MENTOR.college_email,
        toYear: DEMO_MENTOR.year,
        topic: "Seeking guidance on PyTorch mini project and research papers",
        status: "pending",
        isOutgoing: false,
        createdAt: "10 mins ago",
      },
      {
        id: "conn_02",
        fromId: "00000000-0000-0000-0000-000000000004",
        fromName: "Sneha Kulkarni",
        fromEmail: "sneha.des25@college.edu",
        fromYear: 2,
        toId: cur.id,
        toName: cur.name,
        toEmail: cur.college_email,
        toYear: cur.year,
        topic: "Hackathon teammate match for HealthTech app design",
        status: "accepted",
        isOutgoing: false,
        createdAt: "Yesterday",
      },
    ];

    defaults.forEach((c) => map.set(c.id, c));
    apiList.forEach((c) => map.set(c.id, { ...c, isOutgoing: c.fromId === cur.id || c.fromName === cur.name }));
    localList.forEach((c) => map.set(c.id, c));

    const merged = Array.from(map.values());
    setConnections(merged);
    try {
      localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {}

    // Check if there was a very recently sent connection
    try {
      const recent = localStorage.getItem("campuslink_latest_sent_connection");
      if (recent) {
        setRecentSentAlert(JSON.parse(recent));
      }
    } catch (e) {}
  };

  useEffect(() => {
    const cur = getCurrentUser();
    setCurrentUser(cur);

    // Check URL parameters for tab
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "outgoing" || tabParam === "incoming" || tabParam === "all") {
        setActiveTab(tabParam as any);
      }
    }

    loadAllConnections(cur);

    // Listen to real-time events from MatchCard
    const handleCreated = () => {
      loadAllConnections(cur);
    };
    window.addEventListener("campuslink_connection_created", handleCreated);
    return () => {
      window.removeEventListener("campuslink_connection_created", handleCreated);
    };
  }, []);

  if (!currentUser) return null;

  const handleRespond = async (connId: string, newStatus: "accepted" | "declined") => {
    await respondConnectionApi(connId, newStatus);
    const updated = connections.map((c) =>
      c.id === connId ? { ...c, status: newStatus } : c
    );
    setConnections(updated);
    try {
      localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  // Resilient determination of outgoing vs incoming
  const isOutgoingConn = (c: ConnectionRecord) => {
    if (c.isOutgoing) return true;
    if (c.fromId === currentUser.id || c.fromEmail === currentUser.college_email || c.fromName === currentUser.name) {
      return true;
    }
    // Any candidate ID like P01..P30 sent to is outgoing
    if (c.toId && !c.toId.includes("-")) {
      return true;
    }
    return false;
  };

  const outgoingList = connections.filter((c) => isOutgoingConn(c));
  const incomingList = connections.filter((c) => !isOutgoingConn(c));

  const displayList =
    activeTab === "all"
      ? connections
      : activeTab === "outgoing"
      ? outgoingList
      : incomingList;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-8">
        <div>
          <p className="font-mono text-xs text-[#2563eb] uppercase tracking-widest mb-1 font-semibold">
            Privacy-Preserving Contact Exchange
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Connection Requests
          </h1>
          <p className="font-mono text-xs text-slate-500 mt-1">
            Zero-Trust Privacy: Contact information remains cryptographically shielded until both students accept.
          </p>
        </div>

        {/* Recently Sent Notification Banner */}
        {recentSentAlert && (
          <div className="p-4 bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2.5 text-[#2563eb]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                Latest request sent to <strong>{recentSentAlert.toName}</strong> &bull; Status: PENDING
              </span>
            </div>
            <button
              onClick={() => {
                setRecentSentAlert(null);
                try {
                  localStorage.removeItem("campuslink_latest_sent_connection");
                } catch (e) {}
              }}
              className="text-slate-500 hover:text-slate-800 underline text-[11px] self-start sm:self-auto"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "border-[#2563eb] text-[#2563eb] font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <span>All Requests ({connections.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("outgoing")}
            className={`pb-3 px-5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "outgoing"
                ? "border-[#2563eb] text-[#2563eb] font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Outgoing Sent ({outgoingList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("incoming")}
            className={`pb-3 px-5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "incoming"
                ? "border-[#2563eb] text-[#2563eb] font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Incoming Received ({incomingList.length})</span>
          </button>
        </div>

        {/* CONNECTION LIST */}
        <div className="space-y-4">
          {displayList.length === 0 ? (
            <div className="card-dark bg-white border border-slate-200 p-12 text-center font-mono text-xs text-slate-500">
              No connection requests found in this view.
            </div>
          ) : (
            displayList.map((conn) => {
              const outgoing = isOutgoingConn(conn);
              const isAccepted = conn.status === "accepted";
              const isDeclined = conn.status === "declined";

              return (
                <div
                  key={conn.id}
                  className="card-dark bg-white border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
                >
                  <div className="space-y-3 max-w-2xl">
                    {/* Header: Direction, Peer Name, Status */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`font-mono text-[11px] px-2 py-0.5 border font-medium ${
                          outgoing
                            ? "bg-blue-50 text-[#2563eb] border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {outgoing ? "OUTGOING SENT" : "INCOMING RECEIVED"}
                      </span>

                      <span className="font-semibold text-lg text-slate-900">
                        {outgoing ? `To: ${conn.toName}` : `From: ${conn.fromName}`}
                      </span>

                      <span className="font-mono text-xs text-slate-500">
                        (Year {outgoing ? conn.toYear : conn.fromYear})
                      </span>

                      <StatusChip
                        status={isAccepted ? "PASS" : isDeclined ? "WARN" : "ACTIVE"}
                        label={conn.status.toUpperCase()}
                      />
                    </div>

                    {/* Topic / Explanation */}
                    <p className="font-mono text-xs text-slate-700 leading-relaxed">
                      &ldquo;{conn.topic}&rdquo;
                    </p>

                    {/* Privacy & Contact Reveal Area */}
                    {isAccepted ? (
                      <div className="p-3 bg-emerald-50 border border-emerald-300 flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="font-mono text-xs">
                          <span className="text-emerald-700 font-semibold">
                            CONTACT UNLOCKED:{" "}
                          </span>
                          <span className="text-slate-900 font-medium select-all">
                            {outgoing ? conn.toEmail : conn.fromEmail}
                          </span>
                        </div>
                      </div>
                    ) : isDeclined ? (
                      <p className="font-mono text-xs text-slate-500">
                        Connection request declined.
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          Contact: &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;@college.edu{" "}
                          {outgoing
                            ? "(Awaiting recipient acceptance)"
                            : "(Shielded until you accept below)"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column / Actions */}
                  <div className="font-mono text-xs text-slate-500 shrink-0 flex flex-col items-start md:items-end gap-3">
                    <span>Sent {conn.createdAt}</span>

                    {/* Incoming Actions: Accept / Decline */}
                    {!outgoing && conn.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRespond(conn.id, "accepted")}
                          className="btn-square px-3 py-1.5 text-xs bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Accept &amp; Share</span>
                        </button>
                        <button
                          onClick={() => handleRespond(conn.id, "declined")}
                          className="px-3 py-1.5 font-mono text-xs text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-100"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Outgoing Action: Demo Simulate Accept Button */}
                    {outgoing && !isAccepted && !isDeclined && (
                      <button
                        onClick={() => handleRespond(conn.id, "accepted")}
                        className="px-3 py-1.5 text-[11px] font-mono border border-blue-200 bg-blue-50 text-[#2563eb] hover:bg-blue-100 transition-colors font-medium"
                        title="Simulate recipient accepting this request to demonstrate zero-trust contact reveal"
                      >
                        Demo: Simulate Accept &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
