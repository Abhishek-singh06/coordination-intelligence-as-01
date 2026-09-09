'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { formatRoleName, getStatusBadgeClass } from '@/lib/utils';
import { X, Shield, ArrowRight, ArrowLeft } from 'lucide-react';

export const TaskDetailModal: React.FC = () => {
  const { getCurrentTasks, getCurrentDependencies, getCurrentStakeholders, selectedTaskId, setSelectedTaskId } = useStore();

  if (!selectedTaskId) return null;

  const tasks = getCurrentTasks();
  const dependencies = getCurrentDependencies();
  const stakeholders = getCurrentStakeholders();

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return null;

  const owner = stakeholders.find((s) => s.role === task.ownerRole);

  const upstreamTaskIds = dependencies
    .filter((e) => e.target === task.id)
    .map((e) => e.source);

  const downstreamTaskIds = dependencies
    .filter((e) => e.source === task.id)
    .map((e) => e.target);

  const upstreamTasks = tasks.filter((t) => upstreamTaskIds.includes(t.id));
  const downstreamTasks = tasks.filter((t) => downstreamTaskIds.includes(t.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-white space-y-4">
        <button
          onClick={() => setSelectedTaskId(null)}
          className="absolute top-4 right-4 text-[#A7B0BC] hover:text-white p-1.5 rounded-lg hover:bg-[#0B1F3A] transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#05070A] text-white border border-[#1B2735]">
            {task.id}
          </span>
          <span
            className={`border px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(
              task.status
            )}`}
          >
            {task.status.replace('_', ' ')}
          </span>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight">{task.title}</h2>
        <p className="text-xs text-[#A7B0BC] bg-[#05070A] p-3 rounded-xl border border-[#1B2735] leading-relaxed">
          {task.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-[#05070A] p-3 rounded-xl border border-[#1B2735]">
            <span className="text-[#6F7B88] block font-semibold mb-1 uppercase text-[10px]">Owner Role</span>
            <div className="font-bold text-white">{formatRoleName(task.ownerRole)}</div>
            {owner && (
              <span className="text-[11px] text-[#A7B0BC]">
                {owner.name} ({owner.organization})
              </span>
            )}
          </div>

          <div className="bg-[#05070A] p-3 rounded-xl border border-[#1B2735]">
            <span className="text-[#6F7B88] block font-semibold mb-1 uppercase text-[10px]">Schedule Metrics</span>
            <div className="flex items-center justify-between">
              <span>Duration: <strong className="text-white">{task.plannedDays} Days</strong></span>
              <span>Slack: <strong className={task.slackDays > 0 ? 'text-emerald-400' : 'text-[#6F7B88]'}>{task.slackDays} Days</strong></span>
            </div>
          </div>
        </div>

        {task.requiresApprovalFrom && (
          <div className="bg-[#0B1F3A] border border-[#1E5A91] p-3 rounded-xl flex items-center gap-2.5 text-xs text-white">
            <Shield className="h-4 w-4 text-[#2F80ED] shrink-0" />
            <div>
              <span className="font-bold">Requires Approval:</span> Sign-off required from{' '}
              <strong>{formatRoleName(task.requiresApprovalFrom)}</strong>.
            </div>
          </div>
        )}

        {/* Dynamic Causality & Impact Explanation */}
        <div className="bg-[#05070A] p-4 rounded-xl border border-[#1B2735] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#2F80ED] uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#2F80ED] animate-ping"></span>
              WHY IS THIS AFFECTED?
            </span>
            <span className="text-[10px] font-mono text-[#6F7B88]">DAG CAUSALITY ENGINE</span>
          </div>

          {task.status === 'BLOCKED' ? (
            <div className="space-y-2 text-[#A7B0BC]">
              <div className="bg-[#3A0B0E] border border-red-500/40 p-3 rounded-xl text-red-200 font-medium leading-relaxed">
                "This activity is affected because it depends on an upstream activity affected by the project change."
              </div>
              {task.blockedReason && (
                <p className="text-[11px] text-red-300 font-mono bg-[#05070A] p-2 rounded-lg border border-[#1B2735]">
                  Impact Reason: {task.blockedReason}
                </p>
              )}
            </div>
          ) : upstreamTasks.length > 0 ? (
            <p className="text-[#A7B0BC]">
              This activity directly succeeds upstream node{upstreamTasks.length > 1 ? 's' : ''}{' '}
              <strong className="text-white font-mono">{upstreamTasks.map(u => `${u.id} (${u.title})`).join(', ')}</strong>. Any schedule shift in these predecessors directly impacts this task's start date.
            </p>
          ) : (
            <p className="text-[#A7B0BC]">
              This is a root activity in the project DAG. Its start date is anchored to project commencement.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-xs font-bold text-[#6F7B88] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5 text-[#2F80ED]" /> Upstream Predecessors ({upstreamTasks.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {upstreamTasks.length === 0 ? (
                <span className="text-xs text-[#6F7B88] italic">None (Root Task)</span>
              ) : (
                upstreamTasks.map((u) => (
                  <span
                    key={u.id}
                    onClick={() => setSelectedTaskId(u.id)}
                    className="text-xs bg-[#05070A] text-[#A7B0BC] border border-[#1B2735] hover:border-[#2F80ED] hover:text-white cursor-pointer px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <strong>{u.id}:</strong> {u.title}
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-[#6F7B88] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <ArrowRight className="h-3.5 w-3.5 text-emerald-400" /> Downstream Dependents ({downstreamTasks.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {downstreamTasks.length === 0 ? (
                <span className="text-xs text-[#6F7B88] italic">None (Terminal Task)</span>
              ) : (
                downstreamTasks.map((d) => (
                  <span
                    key={d.id}
                    onClick={() => setSelectedTaskId(d.id)}
                    className={`text-xs border px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                      d.status === 'BLOCKED'
                        ? 'bg-[#3A0B0E] border-red-500/40 text-red-300 hover:border-red-400'
                        : 'bg-[#05070A] text-[#A7B0BC] border-[#1B2735] hover:border-[#2F80ED] hover:text-white'
                    }`}
                  >
                    <strong>{d.id}:</strong> {d.title}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setSelectedTaskId(null)}
            className="px-4 py-2 bg-[#1E5A91] hover:bg-[#2F80ED] text-white text-xs font-bold rounded-xl border border-[#2F80ED]/40 transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
