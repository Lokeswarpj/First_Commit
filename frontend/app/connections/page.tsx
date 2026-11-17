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
    <div className="min-h-screen bg-[#000000] text-white">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-8">
        <div>
          <p className="font-mono text-xs text-[#52a8ff] uppercase tracking-widest mb-1">
            Privacy-Preserving Contact Exchange
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-white">
            Connection Requests
          </h1>
          <p className="font-mono text-xs text-[#999999] mt-1">
            Zero-Trust Privacy: Contact information remains cryptographically shielded until both students accept.
          </p>
        </div>

        {/* Recently Sent Notification Banner */}
        {recentSentAlert && (
          <div className="p-4 bg-[#52a8ff]/10 border border-[#52a8ff]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2.5 text-[#52a8ff]">
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
              className="text-[#999999] hover:text-white underline text-[11px] self-start sm:self-auto"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex border-b border-white/[0.145] font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "all"
                ? "border-[#52a8ff] text-white font-semibold"
                : "border-transparent text-[#999999] hover:text-white"
            }`}
          >
            <span>All Requests ({connections.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("outgoing")}
            className={`pb-3 px-5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "outgoing"
                ? "border-[#52a8ff] text-white font-semibold"
                : "border-transparent text-[#999999] hover:text-white"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Outgoing Sent ({outgoingList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("incoming")}
            className={`pb-3 px-5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "incoming"
                ? "border-[#52a8ff] text-white font-semibold"
                : "border-transparent text-[#999999] hover:text-white"
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Incoming Received ({incomingList.length})</span>
          </button>
        </div>

        {/* CONNECTION LIST */}
        <div className="space-y-4">
          {displayList.length === 0 ? (
            <div className="card-dark p-12 text-center font-mono text-xs text-[#999999]">
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
                  className="card-dark p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3 max-w-2xl">
                    {/* Header: Direction, Peer Name, Status */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`font-mono text-[11px] px-2 py-0.5 border ${
                          outgoing
                            ? "bg-[#52a8ff]/10 text-[#52a8ff] border-[#52a8ff]/30"
                            : "bg-[#a855f7]/10 text-[#c084fc] border-[#a855f7]/30"
                        }`}
                      >
                        {outgoing ? "OUTGOING SENT" : "INCOMING RECEIVED"}
                      </span>

                      <span className="font-medium text-lg text-white">
                        {outgoing ? `To: ${conn.toName}` : `From: ${conn.fromName}`}
                      </span>

                      <span className="font-mono text-xs text-[#999999]">
                        (Year {outgoing ? conn.toYear : conn.fromYear})
                      </span>

                      <StatusChip
                        status={isAccepted ? "PASS" : isDeclined ? "WARN" : "ACTIVE"}
                        label={conn.status.toUpperCase()}
                      />
                    </div>

                    {/* Topic / Explanation */}
                    <p className="font-mono text-xs text-white leading-relaxed">
                      &ldquo;{conn.topic}&rdquo;
                    </p>

                    {/* Privacy & Contact Reveal Area */}
                    {isAccepted ? (
                      <div className="p-3 bg-[#62c073]/10 border border-[#62c073]/30 flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#62c073] shrink-0" />
                        <div className="font-mono text-xs">
                          <span className="text-[#62c073] font-semibold">
                            CONTACT UNLOCKED:{" "}
                          </span>
                          <span className="text-white select-all">
                            {outgoing ? conn.toEmail : conn.fromEmail}
                          </span>
                        </div>
                      </div>
                    ) : isDeclined ? (
                      <p className="font-mono text-xs text-[#999999]">
                        Connection request declined.
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 font-mono text-xs text-[#999999]">
                        <Lock className="w-3.5 h-3.5 text-[#999999]" />
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
                  <div className="font-mono text-xs text-[#999999] shrink-0 flex flex-col items-start md:items-end gap-3">
                    <span>Sent {conn.createdAt}</span>

                    {/* Incoming Actions: Accept / Decline */}
                    {!outgoing && conn.status === "pending" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRespond(conn.id, "accepted")}
                          className="btn-square px-3 py-1.5 text-xs bg-[#62c073] text-black hover:bg-[#52a8ff]"
                        >
                          <Check className="w-3.5 h-3.5 text-black" />
                          <span>Accept &amp; Share</span>
                        </button>
                        <button
                          onClick={() => handleRespond(conn.id, "declined")}
                          className="px-3 py-1.5 font-mono text-xs text-[#999999] hover:text-white border border-white/[0.145] hover:bg-white/5"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Outgoing Action: Demo Simulate Accept Button */}
                    {outgoing && !isAccepted && !isDeclined && (
                      <button
                        onClick={() => handleRespond(conn.id, "accepted")}
                        className="px-3 py-1.5 text-[11px] font-mono border border-white/[0.15] text-[#52a8ff] hover:bg-white/[0.05] transition-colors"
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
