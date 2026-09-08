'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { ProjectHeader } from '@/components/ProjectHeader';
import { KPIBanner } from '@/components/KPIBanner';
import { DependencyGraph } from '@/components/DependencyGraph';
import { CoordinationCenter } from '@/components/CoordinationCenter';

export const CommandCenterPreviewSection: React.FC = () => {
  return (
    <section id="command-center" className="w-full bg-[#080C14] border-b border-white/[0.08] py-16 lg:py-24 relative overflow-hidden">
      {/* Background CAD grid */}
      <div className="absolute inset-0 bg-grid-technical opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-3.5 w-1 bg-emerald-400 rounded-xs"></span>
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase">
                INTEGRATED COMMAND ENVIRONMENT
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
              YOUR PROJECT.
              <br />
              ONE SOURCE OF TRUTH.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              Interact with the live project below. Every dependency, approval gate, and blast-radius calculation is executing on the live graph engine.
            </p>
          </div>

          <Link
            href="/command-center"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm tracking-tight transition-all duration-200 shadow-lg shadow-emerald-500/20 shrink-0 self-start md:self-end"
          >
            <span>Open Command Center</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Live Functional Container */}
        <div className="relative rounded-2xl border border-white/[0.12] bg-[#0A0F1A] shadow-2xl shadow-black/80 overflow-hidden p-4 sm:p-6 lg:p-8 cad-mark">
          <div className="space-y-6">
            <ProjectHeader />
            <KPIBanner />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 flex flex-col">
                <DependencyGraph />
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <CoordinationCenter />
              </div>
            </div>
          </div>

          {/* Floating Bottom Bar for Full Workspace */}
          <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-mono">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Includes Tasks Register, Change Orders, Timeline, and Audit Trail</span>
            </div>

            <Link
              href="/command-center"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              <span>Launch Full Multi-Tab Workspace</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
