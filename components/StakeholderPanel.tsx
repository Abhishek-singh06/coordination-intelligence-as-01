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

  const [viewMode, setViewMode] = React.useState<'cards' | 'matrix'>('matrix');

  return (
    <div className="bg-aec-card border border-aec-border rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-aec-border pb-3 mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-slate-100" />
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
              Stakeholder Responsibility & Impact Matrix
            </h2>
            <p className="text-xs text-aec-muted">RACI alignment, active blast radius alerts & approval gates</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-aec-muted font-mono">
            {affectedRoles.size} Alerted / {stakeholders.length} Total
          </span>
          <div className="flex items-center bg-aec-bg p-0.5 rounded-lg border border-aec-border text-xs font-medium">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'matrix' ? 'bg-aec-burgundy text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Responsibility Matrix
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'cards' ? 'bg-aec-burgundy text-slate-100 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Team Cards
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'matrix' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-aec-border text-aec-muted uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Activity / Task</th>
                <th className="py-2.5 px-3">Responsible Party</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Approver Gate</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Impact & Required Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aec-border/50 text-slate-300">
              {tasks.map((task) => {
                const owner = stakeholders.find((s) => s.role === task.ownerRole);
                const isBlocked = task.status === 'BLOCKED';
                const isPendingApproval = task.status === 'PENDING_APPROVAL';
                const isAffected = affectedRoles.has(task.ownerRole) || isBlocked;

                return (
                  <tr
                    key={task.id}
                    className={`transition-colors ${
                      isBlocked
                        ? 'bg-aec-darkred/20 hover:bg-aec-darkred/30'
                        : isAffected
                        ? 'bg-aec-burgundy/10 hover:bg-aec-burgundy/20'
                        : 'hover:bg-aec-bg/40'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-100">{task.title}</div>
                      <div className="text-[10px] font-mono text-slate-500">ID: {task.id} • {task.plannedDays} days</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-aec-burgundy text-[10px] font-bold text-slate-200 flex items-center justify-center border border-aec-rose/30">
                          {owner?.avatar || task.ownerRole[0]}
                        </span>
                        <span className="font-medium text-slate-200">{owner?.name || formatRoleName(task.ownerRole)}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-100 font-mono text-[11px] font-semibold">
                      {formatRoleName(task.ownerRole)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-300">
                        <Building2 className="h-3 w-3 text-slate-500" />
                        {formatRoleName('PROJECT_MANAGER')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                            : task.status === 'BLOCKED'
                            ? 'bg-aec-darkred text-rose-200 border border-aec-rose/50 animate-pulse'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-rose-950/80 text-rose-200 border border-rose-800/40'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      {isBlocked ? (
                        <div className="flex items-center gap-1 text-rose-300 text-[11px] font-medium">
                          <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                          <span>Predecessor slip blocked execution. Action required: Resolve upstream delay.</span>
                        </div>
                      ) : isPendingApproval ? (
                        <div className="text-slate-200 text-[11px]">
                          Pending Project Manager formal sign-off.
                        </div>
                      ) : (
                        <div className="text-slate-400 text-[11px]">On track / regular monitoring</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
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
                    <span className="text-slate-100 font-semibold">{formatRoleName(s.role)}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{s.email}</span>
                  </div>

                  {isAffected && (
                    <div className="mt-2 pt-2 border-t border-aec-rose/20 text-[10px] text-slate-200 flex items-start gap-1">
                      <AlertCircle className="h-3 w-3 text-slate-200 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{getImpactReason(s.role)}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

