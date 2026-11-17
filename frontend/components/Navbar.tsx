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
      <nav className="w-full bg-[#000000] border-b border-white/[0.145] px-6 sm:px-10 lg:px-14 py-3.5 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="font-medium text-[18px] text-white">CampusLink</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-[#000000] border-b border-white/[0.145] px-6 sm:px-10 lg:px-14 py-3.5 sticky top-0 z-40 backdrop-blur-md">
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
              <rect x="2" y="2" width="8" height="8" fill="#ffffff" />
              <rect x="14" y="2" width="8" height="8" fill="#52a8ff" />
              <rect x="2" y="14" width="8" height="8" fill="rgba(255,255,255,0.4)" />
              <rect x="14" y="14" width="8" height="8" fill="#ffffff" />
            </svg>
            <span className="font-medium text-[18px] text-white tracking-[-0.5px]">
              CampusLink
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 font-mono text-xs">
            <Link
              href="/requests"
              className={`transition-colors ${
                pathname.startsWith("/requests")
                  ? "text-[#52a8ff] font-semibold"
                  : "text-[#999999] hover:text-white"
              }`}
            >
              POST &amp; MATCH
            </Link>
            <Link
              href="/profile"
              className={`transition-colors ${
                pathname === "/profile"
                  ? "text-[#52a8ff] font-semibold"
                  : "text-[#999999] hover:text-white"
              }`}
            >
              MY PROFILE
            </Link>
            <Link
              href="/connections"
              className={`transition-colors ${
                pathname === "/connections"
                  ? "text-[#52a8ff] font-semibold"
                  : "text-[#999999] hover:text-white"
              }`}
            >
              CONNECTIONS
            </Link>
            <Link
              href="/library"
              className={`transition-colors ${
                pathname === "/library"
                  ? "text-[#52a8ff] font-semibold"
                  : "text-[#999999] hover:text-white"
              }`}
            >
              NOTES LIBRARY
            </Link>
          </div>
        </div>

        {/* Right: User Status & Log Out Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-[#121212] border border-white/[0.145] px-3 py-1 font-mono text-xs">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: user.is_mentor ? "#52a8ff" : "#62c073" }}
            />
            <span className="text-white font-medium">{user.name}</span>
            <span className="text-[#999999]">({user.is_mentor ? "Senior Mentor" : `Year ${user.year}`})</span>
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="btn-square px-3 py-1.5 text-xs text-[#121212] hover:bg-[#ededed] cursor-pointer"
            title="Log Out of CampusLink"
          >
            <LogOut className="w-3.5 h-3.5 text-[#121212]" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
