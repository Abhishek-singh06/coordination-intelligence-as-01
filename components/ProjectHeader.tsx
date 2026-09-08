'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { Building2, MapPin, Calendar, Activity, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export const ProjectHeader: React.FC = () => {
  const { getCurrentProject, getCurrentProjectSlip, getProjectHealth } = useStore();

  const project = getCurrentProject();
  const slip = getCurrentProjectSlip();
  const health = getProjectHealth();

  if (!project) return null;

  return (
    <div className="bg-[#323522] border border-[#81815D]/40 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left: Project Metadata */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-200 bg-[#570F1D] px-2.5 py-0.5 rounded border border-[#6F2B34]">
            {project.type}
          </span>
          {project.isDemo && (
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 bg-[#323522] px-2 py-0.5 rounded border border-[#81815D]">
              Official Demo
            </span>
          )}
        </div>
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">{project.name}</h2>
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-0.5">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#81815D]" />
            <span>{project.location} ({project.floors} Floors)</span>
          </span>
          <span className="text-[#81815D]">•</span>
          <span className="flex items-center gap-1.5 font-mono">
            <Calendar className="h-3.5 w-3.5 text-[#81815D]" />
            <span>Target Completion: <strong className="text-slate-100">{project.targetCompletionDate}</strong></span>
          </span>
        </div>
      </div>

      {/* Right: Dynamic Project Health Summary */}
      <div className="bg-[#111506]/70 border border-[#81815D]/40 p-3 rounded-xl max-w-sm w-full md:w-auto">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Project Health</span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded border ${
              health.status === 'CRITICAL'
                ? 'bg-[#340A0E] text-rose-300 border-[#6F2B34]'
                : health.status === 'AT_RISK'
                ? 'bg-[#570F1D]/50 text-slate-200 border-[#81815D]'
                : 'bg-[#323522] text-emerald-400 border-[#81815D]/40'
            }`}
          >
            {health.status.replace('_', ' ')}
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-tight">{health.reason}</p>
      </div>
    </div>
  );
};
