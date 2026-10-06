"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroThreshold = window.innerHeight * 0.35;

      // Always show when near the very top of the page (Hero section)
      if (currentScrollY <= 80) {
        setIsVisible(true);
      } else {
        // Hide when scrolling down into another section
        if (currentScrollY > lastScrollY && currentScrollY > heroThreshold) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY - 8) {
          // Re-appear smoothly when scrolling back up
          setIsVisible(true);
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-[#0a0c10]/80 backdrop-blur-md transition-all duration-300 ease-in-out ${isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex flex-col text-sm font-semibold tracking-tight text-white transition hover:opacity-85"
        >
          <div className="flex items-center gap-1.5 text-base sm:text-lg">
            <span>Karan Malkar</span>
            <span className="text-indigo-400">.</span>
          </div>
          <span className="text-[10px] text-gray-400 font-normal tracking-wider uppercase hidden sm:inline-block">
            UI/UX & Graphic Designer
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-gray-400 md:flex">
          <Link href="/" className="text-white transition hover:text-indigo-400">
            Home
          </Link>
          <Link href="#about" className="transition hover:text-white">
            About
          </Link>
          <Link href="#works" className="transition hover:text-white">
            Works
          </Link>
          <Link href="#skills" className="transition hover:text-white">
            Skills
          </Link>
          <Link href="#contact" className="transition hover:text-white">
            Contact
          </Link>
          <Link href="#projects" className="transition hover:text-white">
            Gallery
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/assets/9e46a5bd-0789-4900-a7dc-8ef7bb383ee6.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-gray-200 transition hover:bg-white/15 hover:text-white hover:border-white/40"
          >
            <span>Resume</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <Link
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/20 hover:text-white"
          >
            <span>Let's Talk</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
