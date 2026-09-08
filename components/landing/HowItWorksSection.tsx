'use client';

import React from 'react';
import { Database, Zap, Cpu, Network, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'MODEL',
      subtitle: 'Graph Foundation',
      desc: 'Map tasks, dependencies, stakeholders, slack margins, and approval requirements in a strict DAG.',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
      badge: 'TASK DAG',
    },
    {
      num: '02',
      title: 'DETECT',
      subtitle: 'Variance Ingestion',
      desc: 'Capture project change requests, site schedule delays, or contractor specification deviations immediately.',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      badge: 'CHANGE EVENT',
    },
    {
      num: '03',
      title: 'ANALYZE',
      subtitle: 'Blast Radius Traversal',
      desc: 'Traverse the dependency graph with slack absorption to compute net project slip and blocked activities.',
      icon: <Cpu className="w-4 h-4 text-rose-400" />,
      badge: 'BFS PROPAGATION',
    },
    {
      num: '04',
      title: 'COORDINATE',
      subtitle: 'Stakeholder Dispatch',
      desc: 'Generate targeted action items and enforce mandatory approval sign-off gates for affected roles.',
      icon: <Network className="w-4 h-4 text-teal-400" />,
      badge: 'TARGETED ALERT',
    },
    {
      num: '05',
      title: 'RESOLVE',
      subtitle: 'Downstream Recovery',
      desc: 'Track authorizer approvals in real time. Automatically unblock downstream work when gates are satisfied.',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      badge: 'UNBLOCK AUDIT',
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#070B12] border-b border-white/[0.08] py-16 lg:py-24 relative overflow-hidden">
      {/* Background blueprint dots */}
      <div className="absolute inset-0 bg-cad-dots opacity-15 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
            <span>WORKFLOW ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
            FROM CHANGE
            <br />
            TO COORDINATED ACTION.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            A deterministic 5-stage coordination engine replacing manual phone trees and disjointed email threads.
          </p>
        </div>

        {/* 5 Stages Grid with Connecting Technical Line */}
        <div className="relative">
          {/* Horizontal Desktop Line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-emerald-500/40 via-amber-500/40 to-emerald-500/40 -translate-y-12 z-0"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((s, idx) => (
              <div
                key={s.title}
                className="bg-[#0B101A] border border-white/[0.08] rounded-xl p-5 hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Top Row: Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-black font-mono text-emerald-400">
                      {s.num}
                    </span>
                    <div className="p-2 rounded-lg bg-[#111827] border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                      {s.icon}
                    </div>
                  </div>

                  {/* Stage Name */}
                  <div className="space-y-1 mb-3">
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-bold">
                      STAGE {s.num}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 tracking-tight font-sans">
                      {s.title}
                    </h3>
                    <div className="text-[11px] text-emerald-400/80 font-mono font-semibold">
                      {s.subtitle}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {/* Bottom Badge */}
                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    {s.badge}
                  </span>
                  <span className="text-[10px] font-mono text-slate-600">? STEP 0{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
