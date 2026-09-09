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
        return <AlertOctagon className="h-3.5 w-3.5 text-red-400" />;
      case 'WARNING':
        return <ShieldAlert className="h-3.5 w-3.5 text-[#2F80ED]" />;
      default:
        return <Info className="h-3.5 w-3.5 text-[#6F7B88]" />;
    }
  };

  return (
    <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#1B2735] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[#2F80ED]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide font-sans">
            Project Memory & Audit Trail
          </h2>
        </div>
        <span className="text-xs text-[#6F7B88] font-mono">
          {auditLogs.length} Chronological Records
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1B2735]">
        {auditLogs.map((entry) => (
          <div key={entry.id} className="relative group">
            <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-[#05070A] border border-[#1B2735] flex items-center justify-center shadow-sm z-10">
              {getSeverityIcon(entry.severity)}
            </div>

            <div className="bg-[#05070A] border border-[#1B2735] rounded-xl p-3.5 hover:border-[#1E5A91] transition-all">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{entry.action}</span>
                  <span
                    className={`border px-2 py-0.2 rounded-md text-[10px] font-bold uppercase tracking-wider ${getSeverityBadgeClass(
                      entry.severity
                    )}`}
                  >
                    {entry.severity}
                  </span>
                </div>
                <span className="text-[11px] text-[#6F7B88] font-mono">{entry.timestamp}</span>
              </div>

              <div className="text-[11px] text-[#A7B0BC] flex items-center gap-2 mb-1">
                <span>Actor: <strong className="text-white">{entry.actor}</strong></span>
                <span className="text-[#1B2735]">•</span>
                <span>Role: <strong className="text-[#2F80ED]">{entry.role.replace(/_/g, ' ')}</strong></span>
              </div>

              {entry.details && (
                <p className="text-xs text-[#A7B0BC] bg-[#0A0F16] p-2.5 rounded-lg border border-[#1B2735] mt-1 leading-relaxed">
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
