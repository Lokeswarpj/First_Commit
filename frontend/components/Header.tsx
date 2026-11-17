"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-[24px] left-0 right-0 z-50 px-6 sm:px-10 lg:px-14">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left: Geometric SVG Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="2" y="2" width="8" height="8" fill="#0f172a" />
            <rect x="14" y="2" width="8" height="8" fill="#2563eb" />
            <rect x="2" y="14" width="8" height="8" fill="#cbd5e1" />
            <rect x="14" y="14" width="8" height="8" fill="#0f172a" />
          </svg>
          <span className="font-semibold text-[20px] text-[#0f172a] tracking-[-0.5px]">
            CampusLink
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] text-[#475569] font-medium">
          <Link
            href="#metrics"
            className="hover:text-[#2563eb] transition-colors"
          >
            Metrics
          </Link>
          <Link
            href="#event-stream"
            className="hover:text-[#2563eb] transition-colors"
          >
            Telemetry
          </Link>
          <Link
            href="#bento"
            className="hover:text-[#2563eb] transition-colors"
          >
            Features
          </Link>
          <Link
            href="/library"
            className="hover:text-[#2563eb] transition-colors"
          >
            Notes Library
          </Link>
        </nav>

        {/* Right: CTA & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="btn-square px-[16px] py-[8px] text-[14px] bg-[#0f172a] text-white hover:bg-[#1e293b]"
          >
            <span>Launch App</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#0f172a] p-2 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white/98 z-50 flex flex-col justify-center items-center gap-8 md:hidden p-8 backdrop-blur-md">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8 text-[#0f172a] p-2 hover:bg-slate-100"
          >
            <X className="w-8 h-8" />
          </button>

          <Link
            href="#metrics"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-[#0f172a] hover:text-[#2563eb]"
          >
            Metrics
          </Link>
          <Link
            href="#event-stream"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-[#0f172a] hover:text-[#2563eb]"
          >
            Telemetry
          </Link>
          <Link
            href="#bento"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-[#0f172a] hover:text-[#2563eb]"
          >
            Features
          </Link>
          <Link
            href="/library"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-[#0f172a] hover:text-[#2563eb]"
          >
            Notes Library
          </Link>
        </div>
      )}
    </header>
  );
};
