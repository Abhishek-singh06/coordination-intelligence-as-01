'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRoleName } from '@/lib/utils';
import { CheckSquare, ShieldCheck, XCircle, CheckCircle2, AlertTriangle, Shield, Clock } from 'lucide-react';

export const ApprovalCenterView: React.FC = () => {
  const { getCurrentActionItems, resolveAction, rejectAction } = useStore();

  const actionItems = getCurrentActionItems();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED' | 'REJECTED'>('PENDING');

  const approvalGates = actionItems.filter((a) => a.isApprovalGate);
  const filteredGates = approvalGates.filter((g) => g.status === activeTab);

  return (
    <div className="bg-aec-card border border-aec-border rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-aec-border pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-slate-100" />
            <span>Approval Center & Governance Sign-offs ({approvalGates.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            Review architectural, engineering, municipal, and client approval gates.
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-aec-bg border border-aec-border p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1 rounded font-bold transition-colors ${
              activeTab === 'PENDING' ? 'bg-aec-burgundy text-slate-100 shadow-xs border border-aec-rose/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pending ({approvalGates.filter((g) => g.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-3 py-1 rounded font-bold transition-colors ${
              activeTab === 'RESOLVED' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Approved ({approvalGates.filter((g) => g.status === 'RESOLVED').length})
          </button>
          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3 py-1 rounded font-bold transition-colors ${
              activeTab === 'REJECTED' ? 'bg-aec-darkRed text-rose-200 shadow-xs border border-aec-rose/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rejected ({approvalGates.filter((g) => g.status === 'REJECTED').length})
          </button>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {filteredGates.length === 0 ? (
          <div className="bg-aec-bg/60 border border-aec-border rounded-xl p-8 text-center text-xs text-aec-muted">
            No approval gates matching status "{activeTab}".
          </div>
        ) : (
          filteredGates.map((gate) => (
            <div
              key={gate.id}
              className={`p-4 rounded-xl border transition-all ${
                gate.status === 'PENDING'
                  ? 'bg-aec-burgundy/20 border-aec-rose/40 shadow-md'
                  : gate.status === 'RESOLVED'
                  ? 'bg-aec-bg/60 border-emerald-500/30'
                  : 'bg-aec-darkRed/30 border-aec-darkRed/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-100 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700/50">
                      {formatRoleName(gate.assignedRole)} Sign-off
                    </span>
                    {gate.unblocksTaskId && (
                      <span className="text-[10px] font-mono text-slate-100 bg-aec-burgundy/30 px-2 py-0.5 rounded border border-aec-rose/30">
                        Unblocks Task [{gate.unblocksTaskId}]
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 mt-1">{gate.title}</h4>
                </div>

                {gate.status === 'PENDING' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => rejectAction(gate.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-aec-darkRed/80 hover:bg-aec-darkRed text-rose-200 text-xs font-bold rounded-lg border border-aec-rose/40 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => resolveAction(gate.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-aec-burgundy hover:bg-aec-rose text-slate-100 text-xs font-bold rounded-lg shadow-sm border border-aec-rose/40 transition-all focus:outline-none"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Sign-off & Resolve</span>
                    </button>
                  </div>
                ) : gate.status === 'RESOLVED' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4" /> Approved
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-rose-300 bg-aec-darkRed/40 px-3 py-1 rounded-full border border-aec-darkRed">
                    <XCircle className="h-4 w-4" /> Rejected
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 bg-aec-bg p-3 rounded-lg border border-aec-border leading-relaxed">
                {gate.impactDescription}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
