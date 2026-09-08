'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X, Shield, Activity } from 'lucide-react';
import { useStore } from '@/lib/store';

interface LandingNavbarProps {
  onOpenSignIn?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenSignIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentProjectId } = useStore();

  const navLinks = [
    { label: 'Product', href: '#product' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Resources', href: '#resources' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080C14]/90 backdrop-blur-md border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center">
            {/* Architectural Hexagonal / Isometric Node Icon matching reference */}
            <svg
              className="w-8 h-8 text-emerald-400 transition-transform group-hover:scale-105 duration-200"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="14" stroke="#10B981" strokeWidth="2" strokeDasharray="3 2" className="opacity-40" />
              <path
                d="M16 5L26 11V21L16 27L6 21V11L16 5Z"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M16 5V27M6 11L26 21M6 21L26 11"
                stroke="#10B981"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />
              <circle cx="16" cy="16" r="3.5" fill="#10B981" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-slate-100 tracking-tight flex items-center gap-1.5 font-sans">
              Coordination Intelligence
            </span>
            <span className="text-[9px] font-mono tracking-[0.18em] text-slate-400 uppercase font-semibold">
              FOR A MORE CONNECTED BUILT WORLD
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-emerald-400 transition-colors py-1 relative group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={onOpenSignIn}
            className="text-xs font-medium text-slate-300 hover:text-white transition-colors px-2 py-1.5"
          >
            Sign In
          </button>

          <Link
            href="/command-center"
            className="group flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-md bg-transparent border border-white/20 text-slate-100 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all duration-200 shadow-sm"
          >
            <span>Open Command Center</span>
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/command-center"
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded bg-emerald-500 text-black"
          >
            Launch
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-200"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-white/[0.08] bg-[#080C14] px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-medium text-slate-300 hover:text-emerald-400 py-1.5"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/command-center"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-bold py-2 rounded bg-emerald-500 text-black hover:bg-emerald-400 transition-colors"
            >
              Open Command Center ?
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
