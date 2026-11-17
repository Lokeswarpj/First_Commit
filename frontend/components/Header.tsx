"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute top-[38px] left-0 right-0 z-50 px-6 sm:px-10 lg:px-14">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Left: Geometric SVG Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <rect x="2" y="2" width="8" height="8" fill="#ffffff" />
            <rect x="14" y="2" width="8" height="8" fill="#52a8ff" />
            <rect x="2" y="14" width="8" height="8" fill="rgba(255,255,255,0.4)" />
            <rect x="14" y="14" width="8" height="8" fill="#ffffff" />
          </svg>
          <span className="font-medium text-[20px] text-white tracking-[-0.5px]">
            CampusLink
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-[16px] text-white font-normal">
          <Link
            href="#metrics"
            className="hover:text-[#52a8ff] transition-colors"
          >
            Product
          </Link>
          <Link
            href="#bento"
            className="hover:text-[#52a8ff] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#event-stream"
            className="hover:text-[#52a8ff] transition-colors"
          >
            Docs
          </Link>
          <Link
            href="/login"
            className="hover:text-[#52a8ff] transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right: CTA & Mobile Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="btn-square px-[12px] py-[8px] text-[14px] sm:text-[15px]"
          >
            <span>Book a demo</span>
            <ArrowUpRight className="w-4 h-4 text-[#121212]" />
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10"
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
        <div className="fixed inset-0 bg-[#000000]/95 z-40 flex flex-col justify-center items-center gap-8 md:hidden p-8 backdrop-blur-md">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-8 text-white p-2 hover:bg-white/10"
          >
            <X className="w-8 h-8" />
          </button>

          <Link
            href="#metrics"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-white hover:text-[#52a8ff]"
          >
            Product
          </Link>
          <Link
            href="#bento"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-white hover:text-[#52a8ff]"
          >
            Pricing
          </Link>
          <Link
            href="#event-stream"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-white hover:text-[#52a8ff]"
          >
            Docs
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-white hover:text-[#52a8ff]"
          >
            About
          </Link>
          <Link
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-square text-lg px-6 py-3 mt-4"
          >
            <span>Book a demo</span>
            <ArrowUpRight className="w-5 h-5 text-[#121212]" />
          </Link>
        </div>
      )}
    </header>
  );
};

