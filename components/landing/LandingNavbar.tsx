'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X, Activity } from 'lucide-react';
import { useStore } from '@/lib/store';

interface LandingNavbarProps {
  onOpenSignIn?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenSignIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useStore();

  const navLinks = [
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Real Scenario', href: '#real-scenario' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#05070A]/90 backdrop-blur-md border-b border-[#1B2735] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-[#0B1F3A] border border-[#1E5A91] flex items-center justify-center text-[#2F80ED] font-bold shadow-inner">
            <Activity className="h-4 w-4" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5 font-sans">
              Coordination Intelligence
            </span>
            <span className="text-[9px] font-mono tracking-[0.18em] text-[#A7B0BC] uppercase font-semibold">
              FOR A MORE CONNECTED BUILT WORLD
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#A7B0BC]">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#2F80ED] transition-colors py-1 relative group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2F80ED] transition-all duration-200 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href={isAuthenticated ? "/command-center" : "/login"}
            className="text-xs font-medium text-[#A7B0BC] hover:text-white transition-colors px-2 py-1.5"
          >
            Sign In
          </Link>

          <Link
            href="/command-center"
            className="group flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-[#1E5A91] border border-[#2F80ED]/40 text-white hover:bg-[#2F80ED] transition-all duration-200 shadow-md"
          >
            <span>Open Command Center</span>
            <ArrowRight className="h-3.5 w-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/command-center"
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#2F80ED] text-white"
          >
            Launch
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#A7B0BC] hover:text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#1B2735] bg-[#05070A] px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-medium text-[#A7B0BC] hover:text-[#2F80ED] py-1.5"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[#1B2735] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-bold py-2 rounded-lg bg-[#0A0F16] border border-[#1B2735] text-white"
            >
              Sign In
            </Link>
            <Link
              href="/command-center"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-xs font-bold py-2 rounded-lg bg-[#2F80ED] text-white"
            >
              Open Command Center →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
