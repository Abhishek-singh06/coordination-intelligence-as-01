'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRoleName } from '@/lib/utils';
import { CheckSquare, ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';

export const ApprovalCenterView: React.FC = () => {
  const { getCurrentActionItems, resolveAction, rejectAction } = useStore();

  const actionItems = getCurrentActionItems();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED' | 'REJECTED'>('PENDING');

  const approvalGates = actionItems.filter((a) => a.isApprovalGate);
  const filteredGates = approvalGates.filter((g) => g.status === activeTab);

  return (
    <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1B2735] pb-4">
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-2 font-sans">
            <CheckSquare className="h-5 w-5 text-[#2F80ED]" />
            <span>Approval Center & Governance Sign-offs ({approvalGates.length})</span>
          </h2>
          <p className="text-xs text-[#6F7B88]">
            Review architectural, engineering, municipal, and client approval gates.
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-[#05070A] border border-[#1B2735] p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'PENDING' ? 'bg-[#1E5A91] text-white border border-[#2F80ED]/40' : 'text-[#A7B0BC] hover:text-white'
            }`}
          >
            Pending ({approvalGates.filter((g) => g.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-[#A7B0BC] hover:text-white'
            }`}
          >
            Approved ({approvalGates.filter((g) => g.status === 'RESOLVED').length})
          </button>
          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'REJECTED' ? 'bg-[#3A0B0E] text-red-300 border border-red-500/40' : 'text-[#A7B0BC] hover:text-white'
            }`}
          >
            Rejected ({approvalGates.filter((g) => g.status === 'REJECTED').length})
          </button>
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-3">
        {filteredGates.length === 0 ? (
          <div className="bg-[#05070A] border border-[#1B2735] rounded-xl p-8 text-center text-xs text-[#6F7B88]">
            No approval gates matching status "{activeTab}".
          </div>
        ) : (
          filteredGates.map((gate) => (
            <div
              key={gate.id}
              className={`p-4 rounded-xl border transition-all ${
                gate.status === 'PENDING'
                  ? 'bg-[#0B1F3A] border-[#1E5A91] shadow-md'
                  : gate.status === 'RESOLVED'
                  ? 'bg-[#05070A] border-emerald-500/30'
                  : 'bg-[#3A0B0E]/40 border-red-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#05070A] px-2 py-0.5 rounded-md border border-[#1B2735]">
                      {formatRoleName(gate.assignedRole)} Sign-off
                    </span>
                    {gate.unblocksTaskId && (
                      <span className="text-[10px] font-mono text-white bg-[#123B66] px-2 py-0.5 rounded-md border border-[#1E5A91]">
                        Unblocks Task [{gate.unblocksTaskId}]
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{gate.title}</h4>
                </div>

                {gate.status === 'PENDING' ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => rejectAction(gate.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#3A0B0E] hover:bg-red-900 text-red-200 text-xs font-bold rounded-xl border border-red-500/40 transition-colors cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => resolveAction(gate.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1E5A91] hover:bg-[#2F80ED] text-white text-xs font-bold rounded-xl shadow-md border border-[#2F80ED]/40 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Approve Gate</span>
                    </button>
                  </div>
                ) : gate.status === 'RESOLVED' ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4" /> Approved
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-red-300 bg-[#3A0B0E] px-3 py-1 rounded-full border border-red-500/40">
                    <XCircle className="h-4 w-4" /> Rejected
                  </span>
                )}
              </div>

              <p className="text-xs text-[#A7B0BC] bg-[#05070A] p-3 rounded-xl border border-[#1B2735] leading-relaxed">
                {gate.impactDescription}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
