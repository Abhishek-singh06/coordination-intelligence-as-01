'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Terminal } from 'lucide-react';

interface FinalCtaSectionProps {
  onWatchDemo: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onWatchDemo }) => {
  return (
    <section className="w-full bg-[#080C14] border-b border-white/[0.08] py-20 lg:py-28 relative overflow-hidden">
      {/* Background Architectural Grid Lines & Radial glow */}
      <div className="absolute inset-0 bg-grid-technical opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" />
          <span>PRODUCTION READY</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans leading-tight">
          SEE THE RIPPLE
          <br />
          BEFORE IT HITS THE SITE.
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Understand the impact of project changes before they become coordination delays, unbudgeted rework, or project disputes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/command-center"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm tracking-tight transition-all duration-200 shadow-xl shadow-emerald-500/25 active:scale-[0.98]"
          >
            <span>Open Command Center</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={onWatchDemo}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-md bg-[#0D1420] hover:bg-[#141D2E] text-slate-200 border border-white/15 text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
          >
            <Play className="h-3.5 w-3.5 fill-current text-emerald-400" />
            <span>Explore the Demo</span>
          </button>
        </div>

        {/* Tech Footer Mark */}
        <div className="pt-8 text-[11px] font-mono text-slate-600">
          AEC COORDINATION INTELLIGENCE ENGINE • AS-01 ARCHITECTURE
        </div>
      </div>
    </section>
  );
};
