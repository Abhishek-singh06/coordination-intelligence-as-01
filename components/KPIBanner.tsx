'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Clock, ShieldAlert, CheckSquare, Users } from 'lucide-react';

export const KPIBanner: React.FC = () => {
  const {
    getCurrentTasks,
    getCurrentActionItems,
    getCurrentStakeholders,
    getCurrentProjectSlip,
    getCurrentChangeRequests,
  } = useStore();

  const tasks = getCurrentTasks();
  const actionItems = getCurrentActionItems();
  const stakeholders = getCurrentStakeholders();
  const projectSlip = getCurrentProjectSlip();
  const changeRequests = getCurrentChangeRequests();

  const blockedCount = tasks.filter((t) => t.status === 'BLOCKED').length;
  const pendingApprovalsCount = actionItems.filter(
    (a) => a.isApprovalGate && a.status === 'PENDING'
  ).length;

  const affectedRoles = new Set<string>();
  const activeChange = changeRequests.find((c) => c.status === 'ANALYZED' || c.status === 'APPROVED');
  if (activeChange) {
    affectedRoles.add(activeChange.initiatorRole);
    tasks.forEach((t) => {
      if (t.status === 'BLOCKED') {
        affectedRoles.add(t.ownerRole);
      }
    });
  }
  const alertedStakeholdersCount = affectedRoles.size;

  // Compute deterministic Coordination Health Index (0 - 100%)
  const maxPenalty = 100;
  const slipPenalty = Math.min(40, projectSlip * 8);
  const blockerPenalty = Math.min(30, blockedCount * 15);
  const approvalPenalty = Math.min(30, pendingApprovalsCount * 10);
  const coordinationHealthScore = Math.max(0, 100 - (slipPenalty + blockerPenalty + approvalPenalty));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {/* KPI 0: Coordination Health Index */}
      <div className="bg-[#323522] border border-[#81815D]/40 rounded-xl p-3.5 flex items-center justify-between shadow-sm transition-all hover:border-[#81815D]">
        <div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Coordination Health
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-xl font-black ${
                coordinationHealthScore >= 80
                  ? 'text-emerald-400'
                  : coordinationHealthScore >= 50
                  ? 'text-slate-100'
                  : 'text-rose-300'
              }`}
            >
              {coordinationHealthScore}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {coordinationHealthScore >= 80 ? 'Optimal Flow' : coordinationHealthScore >= 50 ? 'Coordination Risk' : 'Critical Action Required'}
          </p>
        </div>
        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center border text-xs font-mono font-bold ${
            coordinationHealthScore >= 80
              ? 'bg-[#111506] text-emerald-400 border-emerald-500/30'
              : coordinationHealthScore >= 50
              ? 'bg-[#570F1D]/40 text-slate-100 border-[#81815D]'
              : 'bg-[#340A0E] text-rose-300 border-[#6F2B34]'
          }`}
        >
          {coordinationHealthScore >= 80 ? 'OK' : 'RISK'}
        </div>
      </div>

      {/* KPI 1: Critical Path Slip */}
      <div className="bg-[#323522] border border-[#81815D]/40 rounded-xl p-3.5 flex items-center justify-between shadow-sm transition-all hover:border-[#81815D]">
        <div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Critical Path Slip
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-xl font-black ${
                projectSlip > 0 ? 'text-rose-300' : 'text-emerald-400'
              }`}
            >
              +{projectSlip} Days
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {projectSlip > 0 ? 'Downstream delay calculated' : 'Baseline schedule intact'}
          </p>
        </div>
        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center border ${
            projectSlip > 0 ? 'bg-[#340A0E] text-rose-300 border-[#6F2B34]' : 'bg-[#111506] text-emerald-400 border-[#81815D]/30'
          }`}
        >
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {/* KPI 2: Blocked Activities */}
      <div className="bg-[#323522] border border-[#81815D]/40 rounded-xl p-3.5 flex items-center justify-between shadow-sm transition-all hover:border-[#81815D]">
        <div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Blocked Activities
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-xl font-black ${
                blockedCount > 0 ? 'text-rose-300' : 'text-slate-100'
              }`}
            >
              {blockedCount}
            </span>
            <span className="text-[10px] text-slate-400">/ {tasks.length} tasks</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {blockedCount > 0 ? 'Activities requiring unblocking' : 'No activities blocked'}
          </p>
        </div>
        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center border ${
            blockedCount > 0 ? 'bg-[#340A0E] text-rose-300 border-[#6F2B34]' : 'bg-[#111506] text-slate-400 border-[#81815D]/30'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
        </div>
      </div>

      {/* KPI 3: Pending Approvals */}
      <div className="bg-[#323522] border border-[#81815D]/40 rounded-xl p-3.5 flex items-center justify-between shadow-sm transition-all hover:border-[#81815D]">
        <div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Pending Approvals
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-xl font-black ${
                pendingApprovalsCount > 0 ? 'text-slate-100' : 'text-slate-100'
              }`}
            >
              {pendingApprovalsCount}
            </span>
            <span className="text-[10px] text-slate-400">gates</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {pendingApprovalsCount > 0 ? 'Sign-off review pending' : 'All gates clear'}
          </p>
        </div>
        <div
          className={`h-9 w-9 rounded-lg flex items-center justify-center border ${
            pendingApprovalsCount > 0 ? 'bg-[#570F1D]/40 text-slate-100 border-[#6F2B34]' : 'bg-[#111506] text-slate-400 border-[#81815D]/30'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
        </div>
      </div>

      {/* KPI 4: Alerted Stakeholders */}
      <div className="bg-[#323522] border border-[#81815D]/40 rounded-xl p-3.5 flex items-center justify-between shadow-sm transition-all hover:border-[#81815D]">
        <div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Alerted Stakeholders
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-black text-rose-200">
              {alertedStakeholdersCount}
            </span>
            <span className="text-[10px] text-slate-400">/ {stakeholders.length} team</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {alertedStakeholdersCount > 0 ? 'Notified of path shift' : 'No active alerts'}
          </p>
        </div>
        <div className="h-9 w-9 rounded-lg bg-[#570F1D] border border-[#6F2B34] text-rose-200 flex items-center justify-center">
          <Users className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
