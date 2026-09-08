'use client';

import React from 'react';
import { ArrowRight, AlertTriangle, Layers, Users, CheckSquare, Clock } from 'lucide-react';

export const ProblemImpactSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'ONE CHANGE',
      subtitle: 'Design or Scope Revision',
      desc: 'A physical component moves or specification is updated on site.',
      color: 'border-rose-500/70 text-rose-400 bg-rose-500/10',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
    },
    {
      num: '02',
      title: 'MULTIPLE DEPENDENCIES',
      subtitle: 'Downstream DAG Cascade',
      desc: 'MEP routings, frame heights, fabrication tolerances are invalidated.',
      color: 'border-slate-700/50 text-slate-100 bg-slate-800/40',
      icon: <Layers className="w-4 h-4 text-slate-100" />,
    },
    {
      num: '03',
      title: 'MULTIPLE STAKEHOLDERS',
      subtitle: 'Communication Chasm',
      desc: 'Architects, MEP consultants, general contractors, and trade vendors.',
      color: 'border-blue-500/70 text-blue-400 bg-blue-500/10',
      icon: <Users className="w-4 h-4 text-blue-400" />,
    },
    {
      num: '04',
      title: 'APPROVAL GATES',
      subtitle: 'Formal Sign-Offs',
      desc: 'Critical reviews required to unlock downstream fabrication and framing.',
      color: 'border-teal-500/70 text-teal-400 bg-teal-500/10',
      icon: <CheckSquare className="w-4 h-4 text-teal-400" />,
    },
    {
      num: '05',
      title: 'SCHEDULE IMPACT',
      subtitle: 'Critical Path Slip',
      desc: 'Handover date delays, compounding rework costs, and contractual disputes.',
      color: 'border-red-500/70 text-red-400 bg-red-500/10',
      icon: <Clock className="w-4 h-4 text-red-400" />,
    },
  ];

  return (
    <section className="w-full bg-[#080C14] border-b border-white/[0.08] py-16 lg:py-24 relative overflow-hidden">
      {/* Background CAD grid */}
      <div className="absolute inset-0 bg-grid-technical opacity-25 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Architectural Problem Statement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-3 w-1 bg-rose-500 rounded-xs"></span>
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-rose-400 uppercase">
                THE SYSTEMIC CHALLENGE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans leading-tight">
              ONE CHANGE CAN
              <br />
              DISRUPT THE
              <br />
              <span className="text-slate-200">ENTIRE PROJECT.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Construction projects are deeply interconnected. A single design change can impact multiple trades, approvals, fabrication activities, and timelines.
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed border-l border-emerald-500/40 pl-3">
              Without graph-based dependency intelligence, teams discover downstream clashes only when trades physically collide on the job site.
            </p>

            <div className="pt-2">
              <a
                href="#real-scenario"
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors group"
              >
                <span>Explore real scenario</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Architectural CAD Linework Card */}
            <div className="relative mt-6 p-4 rounded-lg bg-[#0C111C] border border-white/[0.08] overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-2 border-b border-white/[0.06] pb-1.5">
                <span>STRUCTURAL INTERFERENCE VECTOR</span>
                <span>SEC // 04-A</span>
              </div>
              <div className="h-28 w-full relative flex items-center justify-center">
                {/* SVG Blueprint Drafting lines */}
                <svg className="w-full h-full" viewBox="0 0 340 100" fill="none">
                  {/* Grid lines */}
                  <line x1="10" y1="20" x2="330" y2="20" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="10" y1="50" x2="330" y2="50" stroke="#1E293B" strokeWidth="0.8" />
                  <line x1="10" y1="80" x2="330" y2="80" stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3 3" />
                  <line x1="80" y1="10" x2="80" y2="90" stroke="#1E293B" strokeWidth="0.8" />
                  <line x1="200" y1="10" x2="200" y2="90" stroke="#1E293B" strokeWidth="0.8" />

                  {/* Beam & Column */}
                  <rect x="75" y="15" width="10" height="70" stroke="#475569" strokeWidth="1.2" fill="#131B2A" />
                  <rect x="20" y="45" width="300" height="10" stroke="#475569" strokeWidth="1.2" fill="#131B2A" />

                  {/* HVAC Chiller offset marker */}
                  <rect x="180" y="30" width="50" height="40" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 2" fill="rgba(239, 68, 68, 0.08)" />
                  <text x="185" y="45" fill="#EF4444" fontSize="8" fontFamily="monospace" fontWeight="bold">CHILLER +4m</text>
                  <line x1="130" y1="50" x2="180" y2="50" stroke="#EF4444" strokeWidth="1.2" markerEnd="url(#arrow-red)" />
                </svg>
              </div>
              <div className="text-[10px] font-mono text-slate-400 text-center">
                Displacement creates clearance violation with false ceiling datum
              </div>
            </div>
          </div>

          {/* Right Column: Cascading Propagation Diagram */}
          <div className="lg:col-span-7">
            <div className="bg-[#0B0F18] border border-white/[0.08] rounded-xl p-6 sm:p-8 relative">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-6">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  BLAST RADIUS CASCADE ARCHITECTURE
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  DAG PROPAGATION
                </span>
              </div>

              {/* Vertical Connected Process */}
              <div className="space-y-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-rose-500 via-slate-400 to-red-500 opacity-40"></div>

                {steps.map((step, idx) => (
                  <div key={step.title} className="relative flex items-start gap-4 group">
                    {/* Node Circle */}
                    <div className={`relative z-10 w-12 h-12 rounded-lg border ${step.color} flex flex-col items-center justify-center shrink-0 shadow-md`}>
                      {step.icon}
                      <span className="text-[8px] font-mono font-bold mt-0.5">{step.num}</span>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 bg-[#0F1422] border border-white/[0.06] rounded-lg p-3 hover:border-white/15 transition-all">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-xs font-bold text-slate-200 tracking-tight font-mono">
                          {step.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {step.subtitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                <span>Outcome: Total awareness of ripple effects</span>
                <span className="text-emerald-400 font-semibold font-mono">0 Surprises On Site</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
