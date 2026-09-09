'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { MapPin, Calendar, Activity } from 'lucide-react';

export const ProjectHeader: React.FC = () => {
  const { getCurrentProject, getProjectHealth } = useStore();

  const project = getCurrentProject();
  const health = getProjectHealth();

  if (!project) return null;

  return (
    <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left: Project Metadata */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#0B1F3A] px-2.5 py-0.5 rounded-md border border-[#1E5A91]">
            {project.type}
          </span>
          {project.isDemo && (
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#A7B0BC] bg-[#05070A] px-2 py-0.5 rounded-md border border-[#1B2735]">
              Official Demo
            </span>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{project.name}</h2>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#A7B0BC] pt-0.5">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#2F80ED]" />
            <span>{project.location} ({project.floors} Floors)</span>
          </span>
          <span className="text-[#1B2735]">•</span>
          <span className="flex items-center gap-1.5 font-mono">
            <Calendar className="h-3.5 w-3.5 text-[#2F80ED]" />
            <span>Target Completion: <strong className="text-white">{project.targetCompletionDate}</strong></span>
          </span>
        </div>
      </div>

      {/* Right: Dynamic Project Health Summary & Action Buttons */}
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <div className="bg-[#05070A] border border-[#1B2735] p-3 rounded-xl max-w-sm w-full">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold text-[#A7B0BC] uppercase tracking-wider">Project Status</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                health.status === 'CRITICAL'
                  ? 'bg-[#3A0B0E] text-red-300 border-red-500/40 animate-pulse'
                  : health.status === 'AT_RISK'
                  ? 'bg-[#0B1F3A] text-white border-[#1E5A91]'
                  : 'bg-[#0A0F16] text-emerald-400 border-emerald-500/30'
              }`}
            >
              {health.status === 'HEALTHY' ? 'ON TRACK' : health.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-[11px] text-[#A7B0BC] leading-tight">{health.reason}</p>
        </div>

        {/* Big Visible Demo Button */}
        <div className="flex items-center gap-2">
          {health.status === 'HEALTHY' ? (
            <button
              onClick={() => {
                useStore.getState().injectChangeEvent(
                  'T2',
                  6,
                  'Client requests relocation of the primary HVAC chiller by 4 meters to accommodate an expanded mezzanine showroom.',
                  'CLIENT'
                );
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E5A91] hover:bg-[#2F80ED] text-white font-bold text-xs tracking-wider uppercase border border-[#2F80ED]/50 shadow-lg shadow-[#2F80ED]/20 transition-all active:scale-95 cursor-pointer"
            >
              <Activity className="h-4 w-4 text-white animate-pulse" />
              <span>SIMULATE HVAC CHANGE</span>
            </button>
          ) : (
            <button
              onClick={() => useStore.getState().resetDemoScenario()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B1F3A] hover:bg-[#123B66] text-white font-bold text-xs tracking-wider uppercase border border-[#1E5A91] transition-all active:scale-95 cursor-pointer"
            >
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>RESET DEMO SCENARIO</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
