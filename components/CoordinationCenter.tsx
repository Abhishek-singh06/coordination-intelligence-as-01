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
    <div className="bg-[#323522] border border-[#81815D]/40 rounded-xl p-5 shadow-lg flex flex-col h-full space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-[#81815D]/30 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-slate-100" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Coordination Command Center
          </h2>
        </div>
        <span className="text-xs text-slate-300 font-mono">
          {blockedTasks.length} Blocked • {actionItems.filter((a) => a.status === 'PENDING').length} Pending Actions
        </span>
      </div>

      {/* 1. Approval Gates Section */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
          <CheckSquare className="h-4 w-4 text-slate-100" />
          <span>Approval Gates ({approvalGates.length})</span>
        </div>

        {approvalGates.length === 0 ? (
          <div className="bg-[#111506]/50 border border-[#81815D]/30 rounded-xl p-4 text-center text-xs text-slate-400">
            No approval gates required. Baseline schedule is clear.
          </div>
        ) : (
          <div className="space-y-3">
            {approvalGates.map((gate) => (
              <div
                key={gate.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  gate.status === 'RESOLVED'
                    ? 'bg-[#111506]/60 border-emerald-500/30'
                    : 'bg-[#340A0E]/60 border-[#6F2B34] shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200 bg-[#570F1D]/50 px-2 py-0.5 rounded border border-[#81815D]">
                      {formatRoleName(gate.assignedRole)} Approval
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 mt-1">{gate.title}</h4>
                  </div>
                  {gate.status === 'RESOLVED' ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Sign-off Granted
                    </span>
                  ) : (
                    <button
                      onClick={() => resolveAction(gate.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#570F1D] hover:bg-[#6F2B34] text-white text-xs font-bold rounded-lg shadow-sm border border-[#6F2B34] transition-all shrink-0"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-rose-200" />
                      <span>Sign-off & Resolve</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">{gate.impactDescription}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Active Blockers Section */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
          <AlertTriangle className="h-4 w-4 text-rose-300" />
          <span>Active Blockers ({blockedTasks.length})</span>
        </div>

        {blockedTasks.length === 0 ? (
          <div className="bg-[#111506]/50 border border-[#81815D]/30 rounded-xl p-4 text-center text-xs text-slate-400">
            No blocked activities detected.
          </div>
        ) : (
          <div className="space-y-2.5">
            {blockedTasks.map((t) => (
              <div
                key={t.id}
                className="bg-[#340A0E]/70 border border-[#6F2B34] p-3 rounded-xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-300 bg-[#111506] px-1.5 py-0.5 rounded border border-[#6F2B34]">
                      {t.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100">{t.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Owner: <strong>{formatRoleName(t.ownerRole)}</strong>
                  </p>
                </div>
                <span className="text-[11px] font-bold text-rose-300 bg-[#570F1D] px-2 py-1 rounded border border-[#6F2B34] shrink-0">
                  BLOCKED
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. General Action Items Section */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
          <Clock className="h-4 w-4 text-rose-200" />
          <span>Required Actions ({generalActions.length})</span>
        </div>

        {generalActions.length === 0 ? (
          <div className="bg-[#111506]/50 border border-[#81815D]/30 rounded-xl p-4 text-center text-xs text-slate-400">
            No pending action items.
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {generalActions.map((action) => (
              <div
                key={action.id}
                className="bg-[#111506]/60 border border-[#81815D]/30 p-2.5 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h5 className="font-semibold text-slate-100">{action.title}</h5>
                  <p className="text-[11px] text-slate-300">
                    Owner: {formatRoleName(action.assignedRole)}
                  </p>
                </div>
                {action.status === 'RESOLVED' ? (
                  <span className="text-[10px] text-emerald-400 font-bold bg-[#323522] px-2 py-0.5 rounded border border-[#81815D]/40">
                    RESOLVED
                  </span>
                ) : (
                  <button
                    onClick={() => resolveAction(action.id)}
                    className="text-[10px] bg-[#570F1D] hover:bg-[#6F2B34] text-white px-2.5 py-1 rounded border border-[#6F2B34] transition-colors shrink-0 font-bold"
                  >
                    Mark Done
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
