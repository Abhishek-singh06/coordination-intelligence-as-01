'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { formatRoleName } from '@/lib/utils';
import { Users, Mail, Building2, AlertCircle } from 'lucide-react';

export const StakeholderPanel: React.FC = () => {
  const { getCurrentStakeholders, getCurrentTasks, getCurrentChangeRequests } = useStore();

  const stakeholders = getCurrentStakeholders();
  const tasks = getCurrentTasks();
  const changeRequests = getCurrentChangeRequests();

  const activeChange = changeRequests.find((c) => c.status === 'ANALYZED' || c.status === 'APPROVED');

  // Find affected roles
  const affectedRoles = new Set<string>();
  if (activeChange) {
    affectedRoles.add(activeChange.initiatorRole);
    tasks.forEach((t) => {
      if (t.status === 'BLOCKED') {
        affectedRoles.add(t.ownerRole);
      }
    });
  }

  const getImpactReason = (role: string) => {
    if (activeChange && role === activeChange.initiatorRole) {
      return `Change Order Initiator (${activeChange.reason})`;
    }
    const blockedTask = tasks.find((t) => t.ownerRole === role && t.status === 'BLOCKED');
    if (blockedTask) {
      return `Activity [${blockedTask.id}] ${blockedTask.title} is blocked downstream`;
    }
    return 'Project team member';
  };

  return (
    <div className="bg-aec-card border border-aec-border rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-aec-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Project Stakeholders & Communication Radius
          </h2>
        </div>
        <span className="text-xs text-aec-muted font-mono">
          {affectedRoles.size} Alerted / {stakeholders.length} Total
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stakeholders.map((s) => {
          const isAffected = affectedRoles.has(s.role);
          return (
            <div
              key={s.id}
              className={`p-3 rounded-xl border transition-all ${
                isAffected
                  ? 'bg-aec-burgundy/30 border-aec-rose/40 shadow-sm'
                  : 'bg-aec-bg/60 border-aec-border opacity-75'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className={`h-9 w-9 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                    isAffected
                      ? 'bg-aec-burgundy text-slate-100 border border-aec-rose/40 shadow-md'
                      : 'bg-aec-bg text-slate-400 border border-aec-border'
                  }`}
                >
                  {s.avatar}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{s.name}</h4>
                  <p className="text-[11px] text-aec-muted flex items-center gap-1 truncate">
                    <Building2 className="h-3 w-3 shrink-0 text-slate-500" />
                    <span>{s.organization}</span>
                  </p>
                </div>
              </div>

              <div className="text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span className="text-aec-muted">Role:</span>
                  <span className="text-amber-400 font-semibold">{formatRoleName(s.role)}</span>
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                  <Mail className="h-3 w-3 shrink-0" />
                  <span className="truncate">{s.email}</span>
                </div>

                {isAffected && (
                  <div className="mt-2 pt-2 border-t border-aec-rose/20 text-[10px] text-amber-300 flex items-start gap-1">
                    <AlertCircle className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{getImpactReason(s.role)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
