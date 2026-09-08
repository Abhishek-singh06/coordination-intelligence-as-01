'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import {
  ArrowRight,
  Play,
  Clock,
  ShieldAlert,
  CheckSquare,
  Users,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity,
} from 'lucide-react';

interface HeroSectionProps {
  onWatchDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onWatchDemo }) => {
  const {
    getCurrentProject,
    getCurrentTasks,
    getCurrentActionItems,
    getCurrentStakeholders,
    getCurrentProjectSlip,
    getCurrentAuditLogs,
    selectedTaskId,
    setSelectedTaskId,
  } = useStore();

  const project = getCurrentProject();
  const tasks = getCurrentTasks();
  const actionItems = getCurrentActionItems();
  const stakeholders = getCurrentStakeholders();
  const projectSlip = getCurrentProjectSlip();
  const auditLogs = getCurrentAuditLogs();

  const blockedCount = tasks.filter((t) => t.status === 'BLOCKED').length;
  const pendingApprovalsCount = actionItems.filter(
    (a) => a.isApprovalGate && a.status === 'PENDING'
  ).length;

  return (
    <section className="relative w-full pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden border-b border-white/[0.06]">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-grid-technical pointer-events-none opacity-40"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Headlines & CTAs */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-1">
              <span className="h-4 w-1 bg-emerald-400 rounded-xs"></span>
              <span className="text-xs font-mono font-bold tracking-[0.18em] text-emerald-400 uppercase">
                AEC PROJECT COORDINATION
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-white leading-[1.08] font-sans">
              See the impact
              <br />
              before it becomes
              <br />
              a delay.
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-lg">
              Track project dependencies, detect the ripple effect of changes, and keep every stakeholder aligned — from design to handover.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 w-full sm:w-auto">
              <Link
                href="/command-center"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm tracking-tight transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              >
                <span>Open Command Center</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={onWatchDemo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-md bg-[#0F1622] hover:bg-[#151F30] text-slate-200 border border-white/15 text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
              >
                <div className="w-5 h-5 rounded-full border border-slate-400/60 flex items-center justify-center text-emerald-400">
                  <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08] w-full">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">40%</div>
                <div className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Fewer coordination delays
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">2x</div>
                <div className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Faster decision-making
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">100%</div>
                <div className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Project context in one place
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Realistic Live Product Visualization Container */}
          <div className="lg:col-span-7">
            <div className="relative rounded-xl border border-white/[0.12] bg-[#0A0E17] shadow-2xl shadow-black/80 overflow-hidden cad-mark">
              
              {/* Product Top Header Bar */}
              <div className="bg-[#0D121D] border-b border-white/[0.08] px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                    <span className="text-xs font-bold text-slate-200 tracking-tight">
                      Coordination Intelligence
                    </span>
                  </div>

                  <span className="text-slate-700">/</span>

                  <span className="text-[11px] font-mono text-slate-300 bg-black/40 border border-white/10 px-2 py-0.5 rounded">
                    Apex Retail Flagship
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 border border-white/10 rounded px-2 py-0.5 bg-black/30">
                    <Search className="h-3 w-3 text-slate-500" />
                    <span>Search</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold flex items-center justify-center">
                    AK
                  </div>
                </div>
              </div>

              {/* Sub-header: Project Title & Progress */}
              <div className="px-5 pt-4 pb-3 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0E17]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Apex Retail Flagship Fit-Out
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      On Schedule
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Floor 2 • Mumbai, IN
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">Target Completion</div>
                    <div className="text-xs font-semibold text-slate-300">15 Dec 2026</div>
                  </div>
                  <div className="w-24">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="text-emerald-400 font-bold">68%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full w-[68%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini KPI Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-[#080C14]">
                {/* Critical Path Slip */}
                <div className="bg-[#0F1522] border border-white/[0.08] p-2.5 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Critical Path Slip</span>
                    <Clock className="h-3 w-3 text-rose-400" />
                  </div>
                  <div className={`text-lg font-black font-mono mt-0.5 ${projectSlip > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    +{projectSlip > 0 ? projectSlip : 5} Days
                  </div>
                  <div className="text-[9px] text-slate-500">After slack absorption</div>
                </div>

                {/* Blocked Activities */}
                <div className="bg-[#0F1522] border border-white/[0.08] p-2.5 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Blocked Activities</span>
                    <ShieldAlert className="h-3 w-3 text-rose-400" />
                  </div>
                  <div className="text-lg font-black font-mono text-rose-400 mt-0.5">
                    {blockedCount > 0 ? blockedCount : 5}
                  </div>
                  <div className="text-[9px] text-slate-500">Across 3 workstreams</div>
                </div>

                {/* Pending Approvals */}
                <div className="bg-[#0F1522] border border-white/[0.08] p-2.5 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Pending Approvals</span>
                    <CheckSquare className="h-3 w-3 text-slate-100" />
                  </div>
                  <div className="text-lg font-black font-mono text-slate-100 mt-0.5">
                    {pendingApprovalsCount > 0 ? pendingApprovalsCount : 2}
                  </div>
                  <div className="text-[9px] text-slate-500">Action required</div>
                </div>

                {/* Alerted Stakeholders */}
                <div className="bg-[#0F1522] border border-white/[0.08] p-2.5 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Alerted Stakeholders</span>
                    <Users className="h-3 w-3 text-emerald-400" />
                  </div>
                  <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                    7
                  </div>
                  <div className="text-[9px] text-slate-500">Notified automatically</div>
                </div>
              </div>

              {/* Main Preview Body: Graph + Recent Activity */}
              <div className="grid grid-cols-1 md:grid-cols-12 border-t border-white/[0.08] bg-[#0A0E17]">
                
                {/* Center-Left: Dependency Graph Preview */}
                <div className="md:col-span-8 p-4 border-b md:border-b-0 md:border-r border-white/[0.08] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-emerald-400" />
                      Project Dependency Graph
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">DAG VIEW</span>
                  </div>

                  {/* Visual Node Diagram representing real tasks */}
                  <div className="relative py-4 px-2 min-h-[190px] flex items-center justify-center">
                    {/* SVG Connector Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 460 160">
                      {/* T1 -> T2 */}
                      <path d="M 75 45 L 135 45" stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrow-h)" />
                      {/* T2 -> T3 */}
                      <path d="M 195 45 C 220 45, 230 110, 255 110" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
                      {/* T2 -> T4 */}
                      <path d="M 195 45 C 220 45, 230 110, 255 110" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
                      {/* T3/T4 -> T5 */}
                      <path d="M 315 110 L 335 110" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
                      {/* T5 -> T6 */}
                      <path d="M 375 110 L 395 110" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" />
                      {/* T6 -> T7 */}
                      <path d="M 435 110 C 445 110, 445 45, 450 45" stroke="#475569" strokeWidth="1.5" />
                    </svg>

                    <div className="flex flex-col gap-6 w-full z-10 text-xs">
                      {/* Row 1 */}
                      <div className="flex items-center gap-6 justify-start pl-2">
                        {/* T1 */}
                        <div className="px-2.5 py-1.5 rounded bg-[#101724] border border-emerald-500/40 text-slate-200 flex flex-col shadow-sm">
                          <span className="text-[9px] font-mono text-emerald-400 font-bold">T1</span>
                          <span className="text-[11px] font-semibold">Layout Freeze</span>
                        </div>

                        {/* Arrow */}
                        <span className="text-slate-600 text-xs">?</span>

                        {/* T2 with Alert */}
                        <div className="relative px-2.5 py-1.5 rounded bg-[#1C141D] border border-rose-500/70 text-slate-100 flex flex-col shadow-md animate-pulse-subtle">
                          <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                            !
                          </div>
                          <span className="text-[9px] font-mono text-rose-400 font-bold">T2</span>
                          <span className="text-[11px] font-semibold">Chiller Placement</span>
                        </div>
                      </div>

                      {/* Row 2: Downstream affected */}
                      <div className="flex items-center gap-2 sm:gap-3 justify-center overflow-x-auto py-1">
                        {/* T3 */}
                        <div className="px-2 py-1 rounded bg-[#1A121A] border border-rose-500/50 text-slate-200 text-[10px] shrink-0">
                          <span className="font-mono text-rose-400 font-bold block">T3</span>
                          <span>Duct Fab</span>
                        </div>

                        {/* T4 */}
                        <div className="px-2 py-1 rounded bg-[#1A121A] border border-rose-500/50 text-slate-200 text-[10px] shrink-0">
                          <span className="font-mono text-rose-400 font-bold block">T4</span>
                          <span>Ceiling Frame</span>
                        </div>

                        {/* T5 */}
                        <div className="px-2 py-1 rounded bg-[#1A121A] border border-rose-500/50 text-slate-200 text-[10px] shrink-0">
                          <span className="font-mono text-rose-400 font-bold block">T5</span>
                          <span>Fire Cert</span>
                        </div>

                        {/* T6 */}
                        <div className="px-2 py-1 rounded bg-[#1A121A] border border-rose-500/50 text-slate-200 text-[10px] shrink-0">
                          <span className="font-mono text-rose-400 font-bold block">T6</span>
                          <span>Drywall</span>
                        </div>

                        {/* T7 */}
                        <div className="px-2 py-1 rounded bg-[#111726] border border-slate-700 text-slate-300 text-[10px] shrink-0">
                          <span className="font-mono text-slate-400 font-bold block">T7</span>
                          <span>Handover</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/[0.04]">
                    <span>Graph traversal: BFS acyclic</span>
                    <span className="text-rose-400 font-mono">5 nodes blocked downstream</span>
                  </div>
                </div>

                {/* Right: Recent Activity / Audit Feed */}
                <div className="md:col-span-4 p-4 flex flex-col justify-between bg-[#080C14]">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] font-mono font-bold text-slate-300 uppercase">
                        Recent Activity
                      </span>
                      <Link href="/command-center" className="text-[10px] text-emerald-400 hover:underline">
                        View All
                      </Link>
                    </div>

                    <div className="space-y-2.5">
                      {/* Event 1 */}
                      <div className="text-[11px] border-l-2 border-rose-500 pl-2 py-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">Change detected</span>
                          <span className="text-[9px] font-mono text-slate-500">2m ago</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          Client requested HVAC relocation
                        </p>
                      </div>

                      {/* Event 2 */}
                      <div className="text-[11px] border-l-2 border-rose-500 pl-2 py-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-300">5 activities blocked</span>
                          <span className="text-[9px] font-mono text-slate-500">3m ago</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          Downstream impact identified
                        </p>
                      </div>

                      {/* Event 3 */}
                      <div className="text-[11px] border-l-2 border-slate-700/50 pl-2 py-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100">Approval required</span>
                          <span className="text-[9px] font-mono text-slate-500">5m ago</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          Lead Architect review requested
                        </p>
                      </div>

                      {/* Event 4 */}
                      <div className="text-[11px] border-l-2 border-emerald-500 pl-2 py-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300">Stakeholder notified</span>
                          <span className="text-[9px] font-mono text-slate-500">5m ago</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          HVAC Vendor alerted
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] mt-3">
                    <Link
                      href="/command-center"
                      className="w-full block text-center py-1.5 px-3 rounded text-[11px] font-bold bg-[#131B2A] hover:bg-[#1A253A] text-slate-200 border border-white/10 transition-colors"
                    >
                      Explore Live Graph ?
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
