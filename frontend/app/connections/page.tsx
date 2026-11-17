"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StatusChip } from "@/components/StatusChip";
import { getCurrentUser, DEMO_FRESHER, DEMO_MENTOR, UserProfile } from "@/lib/supabase";
import { Check, X, Shield, Mail, Lock, CheckCircle2, UserCheck } from "lucide-react";

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
  createdAt: string;
}

const CONNECTIONS_STORAGE_KEY = "campuslink_demo_connections";

export default function ConnectionsPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [connections, setConnections] = useState<ConnectionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");

  useEffect(() => {
    const cur = getCurrentUser();
    setCurrentUser(cur);

    // Check URL parameters for tab
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "outgoing") {
        setActiveTab("outgoing");
      }
    }

    try {
      const raw = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
      let list: ConnectionRecord[] = raw ? JSON.parse(raw) : [];

      // Ensure default mock data exists if completely empty
      if (list.length === 0) {
        list = [
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
            createdAt: "Yesterday",
          },
        ];
        localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(list));
      } else {
        // If the user recently sent a request to Lavanya Sundaram but it wasn't saved in older version
        const hasLavanya = list.some((c) => c.toName === "Lavanya Sundaram");
        if (!hasLavanya) {
          list.unshift({
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
            createdAt: "Just now",
          });
          localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(list));
        }
      }

      setConnections(list);
    } catch (e) {
      console.warn("Error reading connections:", e);
    }
  }, []);

  if (!currentUser) return null;

  const handleRespond = (connId: string, newStatus: "accepted" | "declined") => {
    const updated = connections.map((c) =>
      c.id === connId ? { ...c, status: newStatus } : c
    );
    setConnections(updated);
    localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(updated));
  };

  const incomingList = connections.filter(
    (c) => c.toId === currentUser.id || c.toEmail === currentUser.college_email || c.toName === currentUser.name
  );
  const outgoingList = connections.filter(
    (c) => c.fromId === currentUser.id || c.fromEmail === currentUser.college_email || c.fromName === currentUser.name
  );

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
            Contact information is strictly shielded by zero-trust policies until both students agree to connect.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-white/[0.145] font-mono text-xs">
          <button
            onClick={() => setActiveTab("incoming")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "incoming"
                ? "border-[#52a8ff] text-white font-semibold"
                : "border-transparent text-[#999999] hover:text-white"
            }`}
          >
            <span>Incoming Received ({incomingList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("outgoing")}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "outgoing"
                ? "border-[#52a8ff] text-white font-semibold"
                : "border-transparent text-[#999999] hover:text-white"
            }`}
          >
            <span>Outgoing Sent ({outgoingList.length})</span>
          </button>
        </div>

        {/* INCOMING TAB */}
        {activeTab === "incoming" && (
          <div className="space-y-4">
            {incomingList.length === 0 ? (
              <div className="card-dark p-12 text-center font-mono text-xs text-[#999999]">
                No incoming connection requests for {currentUser.name}.
              </div>
            ) : (
              incomingList.map((conn) => {
                const isAccepted = conn.status === "accepted";
                const isDeclined = conn.status === "declined";

                return (
                  <div
                    key={conn.id}
                    className="card-dark p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-lg text-white">
                          {conn.fromName}
                        </span>
                        <span className="font-mono text-xs text-[#999999]">
                          (Year {conn.fromYear})
                        </span>
                        <StatusChip
                          status={isAccepted ? "PASS" : isDeclined ? "WARN" : "ACTIVE"}
                          label={conn.status.toUpperCase()}
                        />
                      </div>

                      <p className="font-mono text-xs text-white leading-relaxed">
                        &ldquo;{conn.topic}&rdquo;
                      </p>

                      {/* Contact Reveal Area */}
                      {isAccepted ? (
                        <div className="p-3 bg-[#62c073]/10 border border-[#62c073]/30 flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#62c073] shrink-0" />
                          <div className="font-mono text-xs">
                            <span className="text-[#62c073] font-semibold">CONTACT UNLOCKED: </span>
                            <span className="text-white">{conn.fromEmail}</span>
                          </div>
                        </div>
                      ) : isDeclined ? (
                        <p className="font-mono text-xs text-[#999999]">
                          You declined this connection request.
                        </p>
                      ) : (
                        <div className="flex items-center gap-2 font-mono text-xs text-[#999999]">
                          <Lock className="w-3.5 h-3.5 text-[#999999]" />
                          <span>Contact shielded until you click Accept below</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {conn.status === "pending" && (
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleRespond(conn.id, "accepted")}
                          className="btn-square px-4 py-2 text-xs bg-[#62c073] text-black hover:bg-[#52a8ff]"
                        >
                          <Check className="w-4 h-4 text-black" />
                          <span>Accept &amp; Share Contact</span>
                        </button>
                        <button
                          onClick={() => handleRespond(conn.id, "declined")}
                          className="px-4 py-2 font-mono text-xs text-[#999999] hover:text-white border border-white/[0.145] hover:bg-white/5"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* OUTGOING TAB */}
        {activeTab === "outgoing" && (
          <div className="space-y-4">
            {outgoingList.length === 0 ? (
              <div className="card-dark p-12 text-center font-mono text-xs text-[#999999]">
                You haven&apos;t sent any connection requests yet. Post a request to match with peers!
              </div>
            ) : (
              outgoingList.map((conn) => {
                const isAccepted = conn.status === "accepted";
                const isDeclined = conn.status === "declined";

                return (
                  <div
                    key={conn.id}
                    className="card-dark p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-lg text-white">
                          To: {conn.toName}
                        </span>
                        <span className="font-mono text-xs text-[#999999]">
                          (Year {conn.toYear})
                        </span>
                        <StatusChip
                          status={isAccepted ? "PASS" : isDeclined ? "WARN" : "ACTIVE"}
                          label={conn.status.toUpperCase()}
                        />
                      </div>

                      <p className="font-mono text-xs text-white leading-relaxed">
                        &ldquo;{conn.topic}&rdquo;
                      </p>

                      {/* Contact Reveal Area */}
                      {isAccepted ? (
                        <div className="p-3 bg-[#62c073]/10 border border-[#62c073]/30 flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-[#62c073] shrink-0" />
                          <div className="font-mono text-xs">
                            <span className="text-[#62c073] font-semibold">ACCEPTED! CONTACT DETAILS: </span>
                            <span className="text-white select-all">{conn.toEmail}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 font-mono text-xs text-[#999999]">
                          <Lock className="w-3.5 h-3.5 text-[#999999]" />
                          <span>Contact: &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;@college.edu (Awaiting acceptance)</span>
                        </div>
                      )}
                    </div>

                    <div className="font-mono text-xs text-[#999999] shrink-0 flex flex-col items-end gap-2">
                      <span>Sent {conn.createdAt}</span>
                      {!isAccepted && !isDeclined && (
                        <button
                          onClick={() => handleRespond(conn.id, "accepted")}
                          className="px-2.5 py-1 text-[11px] font-mono border border-white/[0.15] text-[#52a8ff] hover:bg-white/[0.05] transition-colors"
                          title="Simulate recipient accepting this request to test zero-trust contact reveal"
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
        )}
      </main>
    </div>
  );
}

