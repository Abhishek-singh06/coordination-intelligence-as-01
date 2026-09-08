'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { getSeverityBadgeClass } from '@/lib/utils';
import { History, ShieldAlert, AlertOctagon, Info, FileCheck, CheckCircle2 } from 'lucide-react';

export const ProjectMemorySection: React.FC = () => {
  const { getCurrentAuditLogs } = useStore();
  const auditLogs = getCurrentAuditLogs();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />;
      case 'WARNING':
        return <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <Info className="h-3.5 w-3.5 text-emerald-400" />;
    }
  };

  return (
    <section className="w-full bg-[#060910] border-b border-white/[0.08] py-16 lg:py-24 relative overflow-hidden">
      {/* Background CAD grid */}
      <div className="absolute inset-0 bg-grid-technical opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="h-3.5 w-1 bg-emerald-400 rounded-xs"></span>
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-emerald-400 uppercase">
                PROJECT REPLAY & AUDIT TRAIL
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
              EVERY CHANGE
              <br />
              LEAVES A TRACE.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              An unalterable, chronological log of scope adjustments, blast-radius analyses, stakeholder alerts, and sign-offs.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-500 block">RECORD COUNT</span>
            <span className="text-2xl font-black font-mono text-emerald-400">{auditLogs.length} Records</span>
          </div>
        </div>

        {/* Technical Timeline */}
        <div className="bg-[#0A0E17] border border-white/[0.08] rounded-2xl p-6 sm:p-8 cad-mark">
          <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.08]">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="relative group">
                
                {/* Timeline Point */}
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-[#0E1524] border border-white/20 flex items-center justify-center z-10 shadow-sm">
                  {getSeverityIcon(log.severity)}
                </div>

                {/* Log Entry Card */}
                <div className="bg-[#0D1322] border border-white/[0.06] rounded-xl p-4 hover:border-white/15 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100 font-mono">
                        {log.action}
                      </span>
                      <span className={`border px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${getSeverityBadgeClass(log.severity)}`}>
                        {log.severity}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {log.timestamp}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2 mb-1.5">
                    <span>Actor: <strong className="text-slate-200 font-medium">{log.actor}</strong></span>
                    <span className="text-slate-600">•</span>
                    <span>Role: <strong className="text-emerald-400 font-mono">{log.role.replace(/_/g, ' ')}</strong></span>
                  </div>

                  {log.details && (
                    <p className="text-xs text-slate-300 bg-black/30 p-2.5 rounded-lg border border-white/[0.04] leading-relaxed font-sans">
                      {log.details}
                    </p>
                  )}
                </div>

              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Deterministic project memory initialized</span>
            <span>Immutable coordination ledger</span>
          </div>
        </div>

      </div>
    </section>
  );
};
