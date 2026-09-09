'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { formatRoleName } from '@/lib/utils';
import { ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck, CheckSquare, Clock } from 'lucide-react';

export const CoordinationCenter: React.FC = () => {
  const { getCurrentTasks, getCurrentActionItems, resolveAction } = useStore();

  const tasks = getCurrentTasks();
  const actionItems = getCurrentActionItems();

  const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED');
  const approvalGates = actionItems.filter((a) => a.isApprovalGate);
  const generalActions = actionItems.filter((a) => !a.isApprovalGate);

  return (
    <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-5 shadow-xl flex flex-col h-full space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[#1B2735] pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-[#2F80ED]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide font-sans">
            Coordination Command Center
          </h2>
        </div>
        <span className="text-xs text-[#A7B0BC] font-mono">
          {blockedTasks.length} Blocked • {actionItems.filter((a) => a.status === 'PENDING').length} Pending Actions
        </span>
      </div>

      {/* 1. Approval Gates Section */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider mb-2.5">
          <CheckSquare className="h-4 w-4 text-[#2F80ED]" />
          <span>Pending Approvals ({approvalGates.length})</span>
        </div>

        {approvalGates.length === 0 ? (
          <div className="bg-[#05070A] border border-[#1B2735] rounded-xl p-4 text-center text-xs text-[#6F7B88]">
            No pending approval gates. Baseline schedule is clear.
          </div>
        ) : (
          <div className="space-y-3">
            {approvalGates.map((gate) => (
              <div
                key={gate.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  gate.status === 'RESOLVED'
                    ? 'bg-[#05070A] border-emerald-500/30'
                    : 'bg-[#0B1F3A] border-[#1E5A91] shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#123B66] px-2 py-0.5 rounded-md border border-[#1E5A91]">
                      {formatRoleName(gate.assignedRole)} Sign-off
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1">{gate.title}</h4>
                  </div>
                  {gate.status === 'RESOLVED' ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => resolveAction(gate.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1E5A91] hover:bg-[#2F80ED] text-white text-xs font-bold rounded-lg shadow-sm border border-[#2F80ED]/40 transition-all shrink-0 cursor-pointer"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-white" />
                      <span>Approve Gate</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#A7B0BC] leading-normal">{gate.impactDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Active Blockers Section */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider mb-2.5">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <span>Active Blockers ({blockedTasks.length})</span>
        </div>

        {blockedTasks.length === 0 ? (
          <div className="bg-[#05070A] border border-[#1B2735] rounded-xl p-4 text-center text-xs text-[#6F7B88]">
            No blocked activities detected.
          </div>
        ) : (
          <div className="space-y-2.5">
            {blockedTasks.map((t) => (
              <div
                key={t.id}
                className="bg-[#3A0B0E] border border-red-500/40 p-3 rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-300 bg-[#05070A] px-1.5 py-0.5 rounded-md border border-red-500/30">
                      {t.id}
                    </span>
                    <h4 className="text-xs font-bold text-white">{t.title}</h4>
                  </div>
                  <p className="text-[11px] text-[#A7B0BC] mt-0.5">
                    Owner: <strong className="text-white">{formatRoleName(t.ownerRole)}</strong>
                  </p>
                </div>
                <span className="text-[11px] font-bold text-red-300 bg-[#05070A] px-2 py-1 rounded-md border border-red-500/30 shrink-0">
                  BLOCKED
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. General Action Items Section */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider mb-2.5">
          <Clock className="h-4 w-4 text-[#2F80ED]" />
          <span>Next Actions ({generalActions.length})</span>
        </div>

        {generalActions.length === 0 ? (
          <div className="bg-[#05070A] border border-[#1B2735] rounded-xl p-4 text-center text-xs text-[#6F7B88]">
            No pending action items.
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {generalActions.map((action) => (
              <div
                key={action.id}
                className="bg-[#05070A] border border-[#1B2735] p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h5 className="font-bold text-white">{action.title}</h5>
                  <p className="text-[11px] text-[#A7B0BC]">
                    Responsible: {formatRoleName(action.assignedRole)}
                  </p>
                </div>
                {action.status === 'RESOLVED' ? (
                  <span className="text-[10px] text-emerald-400 font-bold bg-[#0A0F16] px-2 py-0.5 rounded-md border border-emerald-500/30">
                    RESOLVED
                  </span>
                ) : (
                  <button
                    onClick={() => resolveAction(action.id)}
                    className="text-[10px] bg-[#1E5A91] hover:bg-[#2F80ED] text-white px-3 py-1 rounded-md border border-[#2F80ED]/40 transition-colors shrink-0 font-bold cursor-pointer"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
