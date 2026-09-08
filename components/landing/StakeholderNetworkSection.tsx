'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { formatRoleName } from '@/lib/utils';
import { Users, Shield, Building2, AlertCircle, CheckCircle2, Network } from 'lucide-react';

export const StakeholderNetworkSection: React.FC = () => {
  const { getCurrentStakeholders, getCurrentTasks, getCurrentChangeRequests } = useStore();

  const stakeholders = getCurrentStakeholders();
  const tasks = getCurrentTasks();
  const changeRequests = getCurrentChangeRequests();

  const activeChange = changeRequests.find((c) => c.status === 'ANALYZED' || c.status === 'APPROVED');

  const affectedRoles = new Set<string>();
  if (activeChange) {
    affectedRoles.add(activeChange.initiatorRole);
    tasks.forEach((t) => {
      if (t.status === 'BLOCKED') {
        affectedRoles.add(t.ownerRole);
      }
    });
  }

  return (
    <section className="w-full bg-[#070B12] border-b border-white/[0.08] py-16 lg:py-24 relative overflow-hidden">
      {/* Background linework */}
      <div className="absolute inset-0 bg-cad-dots opacity-15 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold tracking-wider uppercase">
            <span>COORDINATION NETWORK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
            EVERY DECISION.
            <br />
            TO THE RIGHT PERSON.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Multi-disciplinary trades operating from a synchronized topological model. When a change occurs, only the necessary stakeholders are engaged.
          </p>
        </div>

        {/* Central Coordination Hub Visualization */}
        <div className="bg-[#0B101B] border border-white/[0.08] rounded-2xl p-6 sm:p-8 relative cad-mark">
          
          {/* Central Node Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold shadow-lg shadow-emerald-950/40">
              <Network className="w-4 h-4 text-emerald-400" />
              <span>CENTRAL DAG DISPATCH ENGINE</span>
            </div>
          </div>

          {/* Stakeholders Network Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stakeholders.map((stk) => {
              const isAlerted = affectedRoles.has(stk.role);
              return (
                <div
                  key={stk.id}
                  className={`p-4 rounded-xl border transition-all duration-200 relative flex flex-col justify-between ${
                    isAlerted
                      ? 'bg-rose-950/20 border-rose-500/50 shadow-md shadow-rose-950/30'
                      : 'bg-[#0E1524] border-white/[0.06] hover:border-white/15'
                  }`}
                >
                  <div>
                    {/* Top Row: Avatar + Role Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg font-mono text-xs font-bold flex items-center justify-center ${
                          isAlerted
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-[#152033] text-slate-300 border border-white/10'
                        }`}>
                          {stk.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-100">{stk.name}</div>
                          <div className="text-[10px] text-slate-400">{stk.organization}</div>
                        </div>
                      </div>

                      {isAlerted ? (
                        <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                          ALERTED
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          SYNCED
                        </span>
                      )}
                    </div>

                    {/* Role Title */}
                    <div className="text-[11px] font-mono text-emerald-400 font-semibold mb-1">
                      {formatRoleName(stk.role)}
                    </div>
                  </div>

                  {/* Communication Node Status */}
                  <div className="pt-2.5 border-t border-white/[0.06] mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate">{stk.email}</span>
                    <span className="font-mono text-slate-500">NODE {stk.id.toUpperCase()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Active Link</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>In Blast Radius</span>
              </span>
            </div>
            <span>Protocol: Deterministic Event Dispatch</span>
          </div>

        </div>

      </div>
    </section>
  );
};
