'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { formatRoleName, getStatusBadgeClass } from '@/lib/utils';
import { Calendar, Layers, Clock, AlertOctagon } from 'lucide-react';

export const TimelineView: React.FC = () => {
  const { getCurrentTasks, getCurrentDependencies, setSelectedTaskId } = useStore();

  const tasks = getCurrentTasks();
  const dependencies = getCurrentDependencies();

  const totalDays = tasks.reduce((sum, t) => sum + t.plannedDays, 0);

  return (
    <div className="bg-aec-card border border-aec-border rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-aec-border pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-slate-100" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Project Critical Path Schedule Timeline
          </h2>
        </div>
        <span className="text-xs text-aec-muted font-mono">
          Cumulative Duration: {totalDays} Working Days
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {tasks.map((task, idx) => {
          const isBlocked = task.status === 'BLOCKED';
          const isCritical = task.slackDays === 0;

          return (
            <div
              key={task.id}
              onClick={() => setSelectedTaskId(task.id)}
              className="bg-aec-bg/60 border border-aec-border p-3 rounded-xl hover:border-aec-blue/40 cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-100 bg-aec-bg px-1.5 py-0.5 rounded border border-aec-border">
                    {task.id}
                  </span>
                  <h4 className="font-bold text-slate-100">{task.title}</h4>
                  <span className="text-aec-muted">({formatRoleName(task.ownerRole)})</span>
                </div>

                <div className="flex items-center gap-2">
                  {isCritical && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-950/60 text-red-300 px-2 py-0.5 rounded border border-red-800/60">
                      Critical Path
                    </span>
                  )}
                  <span
                    className={`border px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeClass(
                      task.status
                    )}`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Schedule Bar Representation */}
              <div className="w-full bg-aec-bg rounded-full h-3 relative overflow-hidden border border-aec-border">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isBlocked
                      ? 'bg-red-700 animate-pulse'
                      : task.status === 'COMPLETED'
                      ? 'bg-emerald-600'
                      : task.status === 'IN_PROGRESS'
                      ? 'bg-aec-blue'
                      : 'bg-aec-muted/40'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(15, (task.plannedDays / 15) * 100))}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Duration: {task.plannedDays} Days</span>
                <span className={task.slackDays > 0 ? 'text-emerald-400' : 'text-slate-500'}>
                  Slack: {task.slackDays}d
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
