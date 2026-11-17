"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser, clearCurrentUser, DEMO_FRESHER, UserProfile } from "@/lib/supabase";
import { LogOut } from "lucide-react";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const [pathname, setPathname] = useState("");
  const [user, setUser] = useState<UserProfile>(DEMO_FRESHER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    router.push("/login");
  };

  if (!mounted) {
    return (
      <nav className="w-full bg-white/95 border-b border-[#e2e8f0] px-6 sm:px-10 lg:px-14 py-3.5 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="font-medium text-[18px] text-[#0f172a]">CampusLink</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-white/90 border-b border-[#e2e8f0] px-6 sm:px-10 lg:px-14 py-3.5 sticky top-0 z-40 backdrop-blur-md shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left: Logo & Nav items */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="2" width="8" height="8" fill="#0f172a" />
              <rect x="14" y="2" width="8" height="8" fill="#2563eb" />
              <rect x="2" y="14" width="8" height="8" fill="#cbd5e1" />
              <rect x="14" y="14" width="8" height="8" fill="#0f172a" />
            </svg>
            <span className="font-semibold text-[18px] text-[#0f172a] tracking-[-0.5px]">
              CampusLink
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 font-mono text-xs">
            <Link
              href="/requests"
              className={`transition-colors ${
                pathname.startsWith("/requests")
                  ? "text-[#2563eb] font-semibold"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              POST &amp; MATCH
            </Link>
            <Link
              href="/profile"
              className={`transition-colors ${
                pathname === "/profile"
                  ? "text-[#2563eb] font-semibold"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              MY PROFILE
            </Link>
            <Link
              href="/connections"
              className={`transition-colors ${
                pathname === "/connections"
                  ? "text-[#2563eb] font-semibold"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              CONNECTIONS
            </Link>
            <Link
              href="/library"
              className={`transition-colors ${
                pathname === "/library"
                  ? "text-[#2563eb] font-semibold"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              NOTES LIBRARY
            </Link>
          </div>
        </div>

        {/* Right: User Status & Log Out Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1 font-mono text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: user.is_mentor ? "#2563eb" : "#16a34a" }}
            />
            <span className="text-[#0f172a] font-medium">{user.name}</span>
            <span className="text-[#64748b]">({user.is_mentor ? "Senior Mentor" : `Year ${user.year}`})</span>
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="btn-square px-3 py-1.5 text-xs text-white bg-[#0f172a] hover:bg-[#1e293b] cursor-pointer"
            title="Log Out of CampusLink"
          >
            <LogOut className="w-3.5 h-3.5 text-white" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
