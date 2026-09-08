'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import {
  Calendar,
  GitBranch,
  Users,
  CheckCircle2,
  ListChecks,
  Play,
  RotateCcw,
  Check,
  AlertOctagon,
} from 'lucide-react';

export const RealScenarioSection: React.FC = () => {
  const {
    getCurrentTasks,
    getCurrentActionItems,
    getCurrentStakeholders,
    getCurrentProjectSlip,
    injectChangeEvent,
    resetDemoScenario,
  } = useStore();

  const tasks = getCurrentTasks();
  const actionItems = getCurrentActionItems();
  const stakeholders = getCurrentStakeholders();
  const projectSlip = getCurrentProjectSlip();

  const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED');
  const pendingApprovals = actionItems.filter((a) => a.isApprovalGate && a.status === 'PENDING');
  const totalActions = actionItems.length;

  const isSimulated = projectSlip > 0 || blockedTasks.length > 0;

  // Real downstream impacted work list mapped to tasks
  const impactedWork = [
    { name: 'MEP Routing', taskId: 'T2' },
    { name: 'Duct Fabrication', taskId: 'T3' },
    { name: 'Ceiling Framing', taskId: 'T4' },
    { name: 'Fire Certification', taskId: 'T5' },
    { name: 'Drywall & Skim', taskId: 'T6' },
    { name: 'Handover', taskId: 'T7' },
  ];

  const handleSimulate = () => {
    injectChangeEvent(
      'T2',
      6,
      'Client relocates HVAC chiller by 4 meters for retail mezzanine expansion.',
      'CLIENT'
    );
  };

  return (
    <section id="use-cases" className="w-full bg-[#060910] border-b border-white/[0.08] py-16 lg:py-24 relative overflow-hidden">
      {/* CAD floorplan subtle background linework */}
      <div className="absolute inset-0 bg-grid-technical opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-3.5 w-1 bg-emerald-400 rounded-xs"></span>
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase">
                REAL SCENARIO IN ACTION
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-sans">
              Client relocates HVAC chiller by 4 meters.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-1 font-mono">
              A simple spatial adjustment. A massive multi-trade ripple effect.
            </p>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulate}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all shadow-md ${
                isSimulated
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimulated ? 'Re-run Scenario (+6d)' : 'Trigger Scenario (+6d)'}</span>
            </button>

            <button
              onClick={resetDemoScenario}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#101724] hover:bg-[#172236] text-slate-300 border border-white/10 text-xs font-medium transition-colors"
              title="Reset to Baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Two-Column Scenario Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left / Middle: Real dynamic stats */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-[#0B101A] border border-white/[0.08] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                  ACTIVE IMPACT TELEMETRY
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  isSimulated ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {isSimulated ? 'BLAST RADIUS ACTIVE' : 'BASELINE STABLE'}
                </span>
              </div>

              {/* 5 Real Stats Items */}
              <div className="space-y-3">
                {/* 1. Schedule Impact */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F1624] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-rose-500/10 text-rose-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Schedule impact</div>
                      <div className="text-[10px] text-slate-400">After slack absorption</div>
                    </div>
                  </div>
                  <span className={`text-base font-black font-mono ${projectSlip > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    +{projectSlip > 0 ? projectSlip : 6} Days
                  </span>
                </div>

                {/* 2. Activities Affected */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F1624] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-amber-500/10 text-amber-400">
                      <GitBranch className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Activities affected</div>
                      <div className="text-[10px] text-slate-400">Downstream critical path</div>
                    </div>
                  </div>
                  <span className="text-base font-black font-mono text-amber-400">
                    {blockedTasks.length > 0 ? blockedTasks.length : 5}
                  </span>
                </div>

                {/* 3. Stakeholders Identified */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F1624] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Stakeholders identified</div>
                      <div className="text-[10px] text-slate-400">In communication radius</div>
                    </div>
                  </div>
                  <span className="text-base font-black font-mono text-blue-400">
                    {stakeholders.length > 0 ? stakeholders.length : 7}
                  </span>
                </div>

                {/* 4. Approvals Required */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F1624] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-teal-500/10 text-teal-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Approvals required</div>
                      <div className="text-[10px] text-slate-400">Architect & Fire Inspector</div>
                    </div>
                  </div>
                  <span className="text-base font-black font-mono text-teal-400">
                    {pendingApprovals.length > 0 ? pendingApprovals.length : 2}
                  </span>
                </div>

                {/* 5. Coordination Actions */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F1624] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                      <ListChecks className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">Coordination actions</div>
                      <div className="text-[10px] text-slate-400">Auto-dispatched to trades</div>
                    </div>
                  </div>
                  <span className="text-base font-black font-mono text-emerald-400">
                    {totalActions > 0 ? totalActions : 6}
                  </span>
                </div>
              </div>
            </div>

            {/* Architecture Quote */}
            <div className="p-4 rounded-xl bg-[#090D15] border border-white/[0.06] italic text-xs text-slate-400">
              “The best projects aren’t just built — they’re well coordinated.”
            </div>
          </div>

          {/* Right: Architectural Floor Plan Blueprint Schematic */}
          <div className="lg:col-span-7 bg-[#080E18] border border-white/[0.08] rounded-xl p-5 sm:p-6 flex flex-col justify-between relative cad-mark">
            
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">
                FLOOR PLAN SCHEMATIC — LEVEL 02
              </span>
              <span className="text-[10px] font-mono text-slate-500">SCALE: 1:100 • REV-04</span>
            </div>

            {/* CAD Drawing Simulation */}
            <div className="relative w-full h-[280px] sm:h-[320px] bg-[#050A12] border border-white/[0.06] rounded-lg overflow-hidden flex items-center justify-center p-4">
              
              {/* CAD Grid lines */}
              <div className="absolute inset-0 bg-grid-technical opacity-40"></div>

              {/* Architectural Layout SVG */}
              <svg className="w-full h-full" viewBox="0 0 500 280" fill="none">
                {/* Structural perimeter walls */}
                <rect x="20" y="20" width="460" height="240" stroke="#334155" strokeWidth="2" fill="none" />
                <rect x="25" y="25" width="450" height="230" stroke="#1E293B" strokeWidth="1" strokeDasharray="6 4" fill="none" />

                {/* Internal partition zones */}
                <line x1="160" y1="20" x2="160" y2="180" stroke="#334155" strokeWidth="1.5" />
                <line x1="160" y1="180" x2="340" y2="180" stroke="#334155" strokeWidth="1.5" />
                <line x1="340" y1="20" x2="340" y2="260" stroke="#334155" strokeWidth="1.5" />

                {/* Structural columns */}
                <rect x="155" y="60" width="10" height="10" fill="#475569" />
                <rect x="155" y="140" width="10" height="10" fill="#475569" />
                <rect x="335" y="80" width="10" height="10" fill="#475569" />
                <rect x="335" y="180" width="10" height="10" fill="#475569" />

                {/* Elevator/Core shaft */}
                <rect x="40" y="40" width="80" height="80" stroke="#475569" strokeWidth="1.2" fill="#0C1422" />
                <line x1="40" y1="40" x2="120" y2="120" stroke="#334155" strokeWidth="0.8" />
                <line x1="40" y1="120" x2="120" y2="40" stroke="#334155" strokeWidth="0.8" />
                <text x="55" y="85" fill="#64748B" fontSize="9" fontFamily="monospace">CORE SHAFT</text>

                {/* Original Chiller Position (ghost) */}
                <rect x="190" y="80" width="45" height="60" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" fill="none" />
                <text x="193" y="115" fill="#64748B" fontSize="8" fontFamily="monospace">ORIGINAL</text>

                {/* Displacement Vector & 4m label */}
                <line x1="235" y1="110" x2="285" y2="110" stroke="#EF4444" strokeWidth="1.5" markerEnd="url(#arrow-red)" />
                <line x1="235" y1="105" x2="235" y2="115" stroke="#EF4444" strokeWidth="1" />
                <line x1="285" y1="105" x2="285" y2="115" stroke="#EF4444" strokeWidth="1" />
                <text x="250" y="102" fill="#EF4444" fontSize="10" fontFamily="monospace" fontWeight="bold">4m</text>

                {/* Relocated HVAC Chiller in RED glowing bounding box */}
                <g className="animate-pulse-subtle">
                  <rect x="285" y="70" width="55" height="80" stroke="#EF4444" strokeWidth="2" fill="rgba(239, 68, 68, 0.15)" rx="2" />
                  <rect x="290" y="75" width="45" height="70" stroke="#EF4444" strokeWidth="0.8" strokeDasharray="2 2" fill="none" />
                  <text x="293" y="105" fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold">HVAC CHILLER</text>
                  <text x="297" y="118" fill="#FCA5A5" fontSize="8" fontFamily="monospace">(RELOCATED)</text>
                </g>

                {/* MEP Duct Line affected */}
                <path d="M 340 110 L 420 110 L 420 200" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
                <text x="350" y="105" fill="#EF4444" fontSize="8" fontFamily="monospace">CLASH DETECTED</text>
              </svg>

              {/* Floating Impacted Work List matching reference */}
              <div className="absolute top-4 right-4 bg-[#0A101C]/90 border border-white/15 rounded-lg p-3 backdrop-blur-xs shadow-xl min-w-[150px]">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-white/10 pb-1">
                  IMPACTED WORK
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {impactedWork.map((item) => {
                    const task = tasks.find((t) => t.id === item.taskId);
                    const isBlocked = task?.status === 'BLOCKED' || isSimulated;
                    return (
                      <div key={item.name} className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold ${
                          isBlocked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                        <span className={`font-medium ${isBlocked ? 'text-rose-200' : 'text-slate-300'}`}>
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono text-emerald-400">Dynamic graph recalculation</span>
              <span>All 6 trades notified synchronously</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
