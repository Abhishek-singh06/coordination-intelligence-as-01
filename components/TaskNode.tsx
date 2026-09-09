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
        return <Clock className="h-3.5 w-3.5 text-[#2F80ED] animate-spin-slow" />;
      case 'BLOCKED':
        return <AlertOctagon className="h-3.5 w-3.5 text-red-400" />;
      case 'PENDING_APPROVAL':
        return <Lock className="h-3.5 w-3.5 text-slate-200" />;
      case 'NOT_STARTED':
        return <Clock className="h-3.5 w-3.5 text-[#6F7B88]" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl border p-3.5 transition-all duration-200 shadow-md ${
        task.status === 'BLOCKED'
          ? 'bg-[#3A0B0E] border-red-500/40 hover:border-red-400 animate-pulse-subtle'
          : task.status === 'IN_PROGRESS'
          ? 'bg-[#0B1F3A] border-[#1E5A91] hover:border-[#2F80ED]'
          : task.status === 'COMPLETED'
          ? 'bg-[#0A0F16] border-[#1B2735] hover:border-emerald-500/30'
          : 'bg-[#0A0F16] border-[#1B2735] hover:border-[#1E5A91]'
      } ${isSelected ? 'ring-2 ring-[#2F80ED] ring-offset-2 ring-offset-[#05070A]' : ''}`}
    >
      {/* Node Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded-md bg-[#05070A] text-white border border-[#1B2735]">
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
        <div className="text-[11px] font-medium text-[#A7B0BC] flex items-center gap-2 font-mono">
          <span>{task.plannedDays}d</span>
          <span className="text-[#1B2735]">•</span>
          <span className={task.slackDays > 0 ? 'text-emerald-400 font-semibold' : 'text-[#6F7B88]'}>
            Slack: {task.slackDays}d
          </span>
        </div>
      </div>

      {/* Task Title */}
      <h3 className="text-xs font-bold text-white line-clamp-1 mb-1">{task.title}</h3>

      {/* Owner Role */}
      <p className="text-[11px] text-[#A7B0BC] flex items-center justify-between">
        <span className="truncate">{formatRoleName(task.ownerRole)}</span>
        {task.requiresApprovalFrom && (
          <span className="text-[10px] bg-[#0B1F3A] text-white px-1.5 py-0.2 rounded-md border border-[#1E5A91]">
            Approval Gate
          </span>
        )}
      </p>

      {/* Blocked reason banner */}
      {task.status === 'BLOCKED' && task.blockedReason && (
        <div className="mt-2 pt-2 border-t border-red-500/20 text-[10px] text-red-300 flex items-start gap-1 font-medium">
          <ShieldAlert className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{task.blockedReason}</span>
        </div>
      )}
    </div>
  );
};
