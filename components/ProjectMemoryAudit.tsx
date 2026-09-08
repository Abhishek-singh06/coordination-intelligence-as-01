'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { getSeverityBadgeClass } from '@/lib/utils';
import { History, ShieldAlert, AlertOctagon, Info } from 'lucide-react';

export const ProjectMemoryAudit: React.FC = () => {
  const { getCurrentAuditLogs } = useStore();

  const auditLogs = getCurrentAuditLogs();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertOctagon className="h-4 w-4 text-rose-400" />;
      case 'WARNING':
        return <ShieldAlert className="h-4 w-4 text-amber-400" />;
      default:
        return <Info className="h-4 w-4 text-amber-300" />;
    }
  };

  return (
    <div className="bg-aec-card border border-aec-border rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-aec-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Project Memory & Audit Trail
          </h2>
        </div>
        <span className="text-xs text-aec-muted font-mono">
          {auditLogs.length} Chronological Records
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-aec-border">
        {auditLogs.map((entry) => (
          <div key={entry.id} className="relative group">
            <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-aec-bg border border-aec-border flex items-center justify-center shadow-sm z-10">
              {getSeverityIcon(entry.severity)}
            </div>

            <div className="bg-aec-bg/60 border border-aec-border rounded-xl p-3.5 hover:border-aec-rose/40 transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-200">{entry.action}</span>
                  <span
                    className={`border px-2 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${getSeverityBadgeClass(
                      entry.severity
                    )}`}
                  >
                    {entry.severity}
                  </span>
                </div>
                <span className="text-[11px] text-aec-muted font-mono">{entry.timestamp}</span>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-2 mb-1">
                <span>Actor: <strong className="text-slate-300">{entry.actor}</strong></span>
                <span className="text-slate-600">•</span>
                <span>Role: <strong className="text-amber-400">{entry.role.replace(/_/g, ' ')}</strong></span>
              </div>

              {entry.details && (
                <p className="text-xs text-slate-300 bg-aec-bg p-2 rounded-lg border border-aec-border mt-1 leading-relaxed">
                  {entry.details}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
