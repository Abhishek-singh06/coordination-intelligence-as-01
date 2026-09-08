'use client';

import React from 'react';
import { TaskNode as TaskNodeType } from '@/lib/types';
import { formatRoleName, getStatusBadgeClass } from '@/lib/utils';
import { CheckCircle2, Clock, AlertOctagon, Lock, ShieldAlert } from 'lucide-react';

interface TaskNodeProps {
  task: TaskNodeType;
  isSelected: boolean;
  onClick: () => void;
}

export const TaskNode: React.FC<TaskNodeProps> = ({ task, isSelected, onClick }) => {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />;
      case 'IN_PROGRESS':
        return <Clock className="h-3.5 w-3.5 text-rose-200 animate-spin-slow" />;
      case 'BLOCKED':
        return <AlertOctagon className="h-3.5 w-3.5 text-rose-300" />;
      case 'PENDING_APPROVAL':
        return <Lock className="h-3.5 w-3.5 text-amber-300" />;
      case 'NOT_STARTED':
        return <Clock className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl border p-3.5 transition-all duration-200 shadow-md ${
        task.status === 'BLOCKED'
          ? 'bg-[#340A0E] border-[#6F2B34] hover:border-rose-400 animate-pulse-subtle'
          : task.status === 'IN_PROGRESS'
          ? 'bg-[#570F1D]/40 border-[#6F2B34] hover:border-rose-300'
          : task.status === 'COMPLETED'
          ? 'bg-[#323522] border-[#81815D]/40 hover:border-[#81815D]'
          : 'bg-[#323522] border-[#81815D]/30 hover:border-[#81815D]'
      } ${isSelected ? 'ring-2 ring-[#6F2B34] ring-offset-2 ring-offset-[#111506]' : ''}`}
    >
      {/* Node Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-[#111506] text-slate-200 border border-[#81815D]/40">
            {task.id}
          </span>
          <span
            className={`flex items-center gap-1 border px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(
              task.status
            )}`}
          >
            {getStatusIcon()}
            <span>{task.status.replace('_', ' ')}</span>
          </span>
        </div>
        <div className="text-[11px] font-medium text-slate-300 flex items-center gap-2 font-mono">
          <span>{task.plannedDays}d</span>
          <span className="text-[#81815D]">•</span>
          <span className={task.slackDays > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
            Slack: {task.slackDays}d
          </span>
        </div>
      </div>

      {/* Task Title */}
      <h3 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">{task.title}</h3>

      {/* Owner Role */}
      <p className="text-[11px] text-slate-300 flex items-center justify-between">
        <span className="truncate">{formatRoleName(task.ownerRole)}</span>
        {task.requiresApprovalFrom && (
          <span className="text-[10px] bg-[#570F1D]/50 text-amber-300 px-1.5 py-0.2 rounded border border-[#81815D]">
            Approval Gate
          </span>
        )}
      </p>

      {/* Blocked reason banner */}
      {task.status === 'BLOCKED' && task.blockedReason && (
        <div className="mt-2 pt-2 border-t border-[#6F2B34]/40 text-[10px] text-rose-300 flex items-start gap-1 font-medium">
          <ShieldAlert className="h-3 w-3 text-rose-300 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{task.blockedReason}</span>
        </div>
      )}
    </div>
  );
};
