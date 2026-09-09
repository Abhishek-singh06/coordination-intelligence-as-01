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
    <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1B2735] pb-3 mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#2F80ED]" />
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide font-sans">
              Stakeholder Responsibility & Impact Matrix
            </h2>
            <p className="text-xs text-[#6F7B88]">RACI alignment, active blast radius alerts & approval gates</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#A7B0BC] font-mono">
            {affectedRoles.size > 0 ? affectedRoles.size : (tasks.some(t => t.status === 'BLOCKED') ? 7 : 0)} Alerted / {stakeholders.length} Total
          </span>
          <div className="flex items-center bg-[#05070A] p-0.5 rounded-lg border border-[#1B2735] text-xs font-medium">
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'matrix' ? 'bg-[#1E5A91] text-white font-semibold' : 'text-[#A7B0BC] hover:text-white'
              }`}
            >
              Responsibility Matrix
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-[#1E5A91] text-white font-semibold' : 'text-[#A7B0BC] hover:text-white'
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
              <tr className="border-b border-[#1B2735] text-[#6F7B88] uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Activity / Task</th>
                <th className="py-2.5 px-3">Responsible Party</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Approver Gate</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Impact & Required Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1B2735]/60 text-[#A7B0BC]">
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
                        ? 'bg-[#3A0B0E]/40 hover:bg-[#3A0B0E]/60'
                        : isAffected
                        ? 'bg-[#0B1F3A]/40 hover:bg-[#0B1F3A]/60'
                        : 'hover:bg-[#05070A]/50'
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{task.title}</div>
                      <div className="text-[10px] font-mono text-[#6F7B88]">ID: {task.id} • {task.plannedDays} days</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-[#1E5A91] text-[10px] font-bold text-white flex items-center justify-center border border-[#2F80ED]/40">
                          {owner?.avatar || task.ownerRole[0]}
                        </span>
                        <span className="font-semibold text-white">{owner?.name || formatRoleName(task.ownerRole)}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-white font-mono text-[11px] font-semibold">
                      {formatRoleName(task.ownerRole)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#A7B0BC]">
                        <Building2 className="h-3 w-3 text-[#2F80ED]" />
                        {formatRoleName('PROJECT_MANAGER')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : task.status === 'BLOCKED'
                            ? 'bg-[#3A0B0E] text-red-300 border border-red-500/40 animate-pulse'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-[#0B1F3A] text-[#2F80ED] border border-[#1E5A91]'
                            : 'bg-[#05070A] text-[#A7B0BC] border border-[#1B2735]'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      {isBlocked ? (
                        <div className="flex items-center gap-1 text-red-300 text-[11px] font-medium">
                          <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          <span>Predecessor slip blocked execution. Action required: Resolve upstream delay.</span>
                        </div>
                      ) : isPendingApproval ? (
                        <div className="text-white text-[11px]">
                          Pending Project Manager formal sign-off.
                        </div>
                      ) : (
                        <div className="text-[#6F7B88] text-[11px]">On track / regular monitoring</div>
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
            const isAffected = affectedRoles.has(s.role) || tasks.some(t => t.ownerRole === s.role && t.status === 'BLOCKED');
            return (
              <div
                key={s.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isAffected
                    ? 'bg-[#0B1F3A] border-[#1E5A91] shadow-md'
                    : 'bg-[#05070A] border-[#1B2735] opacity-80'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`h-9 w-9 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                      isAffected
                        ? 'bg-[#1E5A91] text-white border border-[#2F80ED]/40 shadow-md'
                        : 'bg-[#05070A] text-[#A7B0BC] border border-[#1B2735]'
                    }`}
                  >
                    {s.avatar}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{s.name}</h4>
                    <p className="text-[11px] text-[#A7B0BC] flex items-center gap-1 truncate">
                      <Building2 className="h-3 w-3 shrink-0 text-[#2F80ED]" />
                      <span>{s.organization}</span>
                    </p>
                  </div>
                </div>

                <div className="text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-[#A7B0BC] font-medium">
                    <span className="text-[#6F7B88]">Role:</span>
                    <span className="text-white font-semibold">{formatRoleName(s.role)}</span>
                  </div>
                  <div className="text-[10px] text-[#6F7B88] flex items-center gap-1 truncate">
                    <Mail className="h-3 w-3 shrink-0 text-[#6F7B88]" />
                    <span className="truncate">{s.email}</span>
                  </div>

                  {isAffected && (
                    <div className="mt-2 pt-2 border-t border-[#1E5A91]/40 text-[10px] text-white flex items-start gap-1">
                      <AlertCircle className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />
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
