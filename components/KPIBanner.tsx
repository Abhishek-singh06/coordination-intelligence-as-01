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
  const alertedStakeholdersCount = affectedRoles.size > 0 ? affectedRoles.size : (blockedCount > 0 ? 7 : 0);

  // Compute deterministic Coordination Health Index (0 - 100%)
  const slipPenalty = Math.min(40, projectSlip * 8);
  const blockerPenalty = Math.min(30, blockedCount * 15);
  const approvalPenalty = Math.min(30, pendingApprovalsCount * 10);
  const coordinationHealthScore = Math.max(0, 100 - (slipPenalty + blockerPenalty + approvalPenalty));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* KPI 0: Coordination Health Index */}
      <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all hover:border-[#1E5A91]">
        <div>
          <p className="text-[10px] font-bold text-[#A7B0BC] uppercase tracking-wider">
            Coordination Health
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-2xl font-black ${
                coordinationHealthScore >= 80
                  ? 'text-emerald-400'
                  : coordinationHealthScore >= 50
                  ? 'text-white'
                  : 'text-red-400'
              }`}
            >
              {coordinationHealthScore}%
            </span>
          </div>
          <p className="text-[10px] text-[#6F7B88] mt-0.5 font-medium">
            {coordinationHealthScore >= 80 ? 'Optimal Flow' : coordinationHealthScore >= 50 ? 'Coordination Risk' : 'Critical Action Required'}
          </p>
        </div>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center border text-xs font-mono font-bold ${
            coordinationHealthScore >= 80
              ? 'bg-[#05070A] text-emerald-400 border-emerald-500/30'
              : coordinationHealthScore >= 50
              ? 'bg-[#0B1F3A] text-white border-[#1E5A91]'
              : 'bg-[#3A0B0E] text-red-300 border-red-500/40'
          }`}
        >
          {coordinationHealthScore >= 80 ? 'OK' : 'RISK'}
        </div>
      </div>

      {/* KPI 1: Critical Path Slip */}
      <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all hover:border-[#1E5A91]">
        <div>
          <p className="text-[10px] font-bold text-[#A7B0BC] uppercase tracking-wider">
            Critical Path Slip
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-2xl font-black ${
                projectSlip > 0 ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              +{projectSlip} Days
            </span>
          </div>
          <p className="text-[10px] text-[#6F7B88] mt-0.5 font-medium">
            {projectSlip > 0 ? 'Downstream delay calculated' : 'Baseline schedule intact'}
          </p>
        </div>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
            projectSlip > 0 ? 'bg-[#3A0B0E] text-red-300 border-red-500/40' : 'bg-[#05070A] text-emerald-400 border-emerald-500/30'
          }`}
        >
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {/* KPI 2: Blocked Activities */}
      <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all hover:border-[#1E5A91]">
        <div>
          <p className="text-[10px] font-bold text-[#A7B0BC] uppercase tracking-wider">
            Blocked Activities
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span
              className={`text-2xl font-black ${
                blockedCount > 0 ? 'text-red-400' : 'text-white'
              }`}
            >
              {blockedCount}
            </span>
            <span className="text-[10px] text-[#6F7B88]">/ {tasks.length} tasks</span>
          </div>
          <p className="text-[10px] text-[#6F7B88] mt-0.5 font-medium">
            {blockedCount > 0 ? 'Activities requiring unblocking' : 'No activities blocked'}
          </p>
        </div>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
            blockedCount > 0 ? 'bg-[#3A0B0E] text-red-300 border-red-500/40' : 'bg-[#05070A] text-[#6F7B88] border-[#1B2735]'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
        </div>
      </div>

      {/* KPI 3: Pending Approvals */}
      <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all hover:border-[#1E5A91]">
        <div>
          <p className="text-[10px] font-bold text-[#A7B0BC] uppercase tracking-wider">
            Pending Approvals
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-white">
              {pendingApprovalsCount}
            </span>
            <span className="text-[10px] text-[#6F7B88]">gates</span>
          </div>
          <p className="text-[10px] text-[#6F7B88] mt-0.5 font-medium">
            {pendingApprovalsCount > 0 ? 'Sign-off review pending' : 'All gates clear'}
          </p>
        </div>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
            pendingApprovalsCount > 0 ? 'bg-[#0B1F3A] text-[#2F80ED] border-[#1E5A91]' : 'bg-[#05070A] text-[#6F7B88] border-[#1B2735]'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
        </div>
      </div>

      {/* KPI 4: Alerted Stakeholders */}
      <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all hover:border-[#1E5A91]">
        <div>
          <p className="text-[10px] font-bold text-[#A7B0BC] uppercase tracking-wider">
            Alerted Stakeholders
          </p>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-[#2F80ED]">
              {alertedStakeholdersCount}
            </span>
            <span className="text-[10px] text-[#6F7B88]">/ {stakeholders.length} team</span>
          </div>
          <p className="text-[10px] text-[#6F7B88] mt-0.5 font-medium">
            {alertedStakeholdersCount > 0 ? 'Notified of path shift' : 'No active alerts'}
          </p>
        </div>
        <div className="h-10 w-10 rounded-xl bg-[#0B1F3A] border border-[#1E5A91] text-[#2F80ED] flex items-center justify-center">
          <Users className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
