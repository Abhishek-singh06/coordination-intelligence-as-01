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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-aec-card border border-aec-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={() => setSelectedTaskId(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-aec-bg text-amber-400 border border-aec-border">
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

        <h2 className="text-xl font-bold text-slate-100 mb-2">{task.title}</h2>
        <p className="text-xs text-slate-300 mb-4 bg-aec-bg p-3 rounded-lg border border-aec-border leading-relaxed">
          {task.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div className="bg-aec-bg p-2.5 rounded-lg border border-aec-border">
            <span className="text-aec-muted block font-medium mb-1">Owner Role</span>
            <div className="font-semibold text-slate-200">{formatRoleName(task.ownerRole)}</div>
            {owner && (
              <span className="text-[11px] text-aec-muted">
                {owner.name} ({owner.organization})
              </span>
            )}
          </div>

          <div className="bg-aec-bg p-2.5 rounded-lg border border-aec-border">
            <span className="text-aec-muted block font-medium mb-1">Schedule Metrics</span>
            <div className="flex items-center justify-between">
              <span>Duration: <strong className="text-slate-200">{task.plannedDays} Days</strong></span>
              <span>Slack: <strong className={task.slackDays > 0 ? 'text-emerald-400' : 'text-slate-400'}>{task.slackDays} Days</strong></span>
            </div>
          </div>
        </div>

        {task.requiresApprovalFrom && (
          <div className="mb-4 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg flex items-center gap-2 text-xs text-amber-300">
            <Shield className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Requires Approval:</span> Sign-off required from{' '}
              <strong>{formatRoleName(task.requiresApprovalFrom)}</strong>.
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <div>
            <span className="text-xs font-bold text-aec-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5 text-amber-400" /> Upstream Dependencies ({upstreamTasks.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {upstreamTasks.length === 0 ? (
                <span className="text-xs text-aec-muted italic">None (Root Task)</span>
              ) : (
                upstreamTasks.map((u) => (
                  <span
                    key={u.id}
                    className="text-xs bg-aec-bg text-slate-300 border border-aec-border px-2 py-1 rounded flex items-center gap-1"
                  >
                    <strong>{u.id}:</strong> {u.title}
                  </span>
                ))
              )}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-aec-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <ArrowRight className="h-3.5 w-3.5 text-emerald-400" /> Downstream Dependents ({downstreamTasks.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {downstreamTasks.length === 0 ? (
                <span className="text-xs text-aec-muted italic">None (Terminal Task)</span>
              ) : (
                downstreamTasks.map((d) => (
                  <span
                    key={d.id}
                    className={`text-xs border px-2 py-1 rounded flex items-center gap-1 ${
                      d.status === 'BLOCKED'
                        ? 'bg-aec-darkRed/40 border-aec-darkRed text-rose-300'
                        : 'bg-aec-bg text-slate-300 border-aec-border'
                    }`}
                  >
                    <strong>{d.id}:</strong> {d.title}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => setSelectedTaskId(null)}
            className="px-4 py-2 bg-aec-burgundy hover:bg-aec-rose text-slate-100 text-xs font-semibold rounded-lg border border-aec-rose/30 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
