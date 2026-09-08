'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Play, ArrowRight, CheckCircle2, AlertOctagon, Layers, Clock, ShieldCheck } from 'lucide-react';
import { useStore } from '@/lib/store';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const { injectChangeEvent, resetDemoScenario } = useStore();

  if (!isOpen) return null;

  const demoSteps = [
    {
      title: '01. Baseline Coordination DAG',
      description:
        'The project model begins with 7 interconnected activities from Concept Freeze to Handover. Each task carries strict planned duration, slack margins, and assigned trade roles.',
      badge: 'GRAPH INITIALIZATION',
      actionText: 'Next: Inject Schedule Variance ?',
      onAction: () => {
        resetDemoScenario();
        setActiveStep(1);
      },
    },
    {
      title: '02. Client Chiller Relocation (+6 Days)',
      description:
        'A design adjustment shifts T2 (Chiller Placement & MEP Routing) by 4 meters, incurring a +6 day delay. The Graph Engine initiates downstream BFS traversal.',
      badge: 'CHANGE INJECTION',
      actionText: 'Calculate Blast Radius ?',
      onAction: () => {
        injectChangeEvent('T2', 6, 'Client relocates HVAC chiller by 4m.', 'CLIENT');
        setActiveStep(2);
      },
    },
    {
      title: '03. Blast Radius Traversal & Blockers',
      description:
        'Because duct fabrication (T3) and ceiling framing (T4) depend on T2, both activities are immediately marked BLOCKED. Slack margins absorb 1 day, yielding a +5 day critical path slip.',
      badge: 'BLAST RADIUS CASCADE',
      actionText: 'Review Coordination Sign-offs ?',
      onAction: () => {
        setActiveStep(3);
      },
    },
    {
      title: '04. Multi-trade Action Generation & Resolution',
      description:
        'Approval gates are automatically dispatched to the Lead Architect and Fire Safety Inspector. Upon authorization, downstream tasks are restored to executable status.',
      badge: 'WORKFLOW RESOLUTION',
      actionText: 'Launch Command Center ?',
      onAction: () => {
        onClose();
      },
    },
  ];

  const current = demoSteps[activeStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0A0F1A] border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-100 relative cad-mark">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                Interactive Guided Walkthrough
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                AEC Coordination Intelligence Engine Simulation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {demoSteps.map((step, idx) => (
            <div
              key={step.title}
              onClick={() => setActiveStep(idx)}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                idx === activeStep
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                  : idx < activeStep
                  ? 'bg-emerald-600'
                  : 'bg-slate-800'
              }`}
            ></div>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="bg-[#0D1424] border border-white/10 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              {current.badge}
            </span>
            <span className="text-xs font-mono text-slate-500">
              STEP 0{activeStep + 1} / 04
            </span>
          </div>

          <h4 className="text-lg font-bold text-white font-sans tracking-tight">
            {current.title}
          </h4>

          <p className="text-sm text-slate-300 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors px-3 py-2"
          >
            ? Previous
          </button>

          {activeStep < 3 ? (
            <button
              onClick={current.onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>{current.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Link
              href="/command-center"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
};
