'use client';

import React from 'react';
import {
  GitFork,
  Target,
  Users,
  FileCheck,
  History,
  Building2,
  HardHat,
} from 'lucide-react';

export const CapabilitiesStrip: React.FC = () => {
  const capabilities = [
    {
      title: 'Dependency Intelligence',
      description: 'Model relationships across design, MEP, fabrication and site.',
      icon: (
        <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="5" cy="6" r="3" />
          <circle cx="19" cy="6" r="3" />
          <circle cx="12" cy="18" r="3" />
          <path d="M5 9v3a2 2 0 002 2h5M19 9v3a2 2 0 01-2 2h-5" />
        </svg>
      ),
    },
    {
      title: 'Impact Analysis',
      description: 'Instantly calculate the blast radius of any change.',
      icon: <Target className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Stakeholder Coordination',
      description: 'Identify and notify everyone who needs to act.',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Approval Workflows',
      description: 'Track sign-offs and prevent uncoordinated work.',
      icon: <FileCheck className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Project Memory',
      description: 'Maintain a complete audit trail of changes and decisions.',
      icon: <History className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Built for AEC',
      description: 'Designed for real-world construction projects.',
      icon: <Building2 className="w-5 h-5 text-emerald-400" />,
    },
  ];

  const partners = [
    { name: 'Turner', fontClass: 'font-black tracking-tight text-slate-300 text-base' },
    { name: 'AECOM', fontClass: 'font-extrabold tracking-wider text-slate-200 text-base' },
    { name: 'SOM', fontClass: 'font-light tracking-[0.25em] text-slate-300 text-base' },
    { name: 'Gensler', fontClass: 'font-serif font-bold text-slate-300 text-base' },
    { name: 'Stantec', fontClass: 'font-medium tracking-tight text-slate-300 text-base flex items-center gap-1' },
    { name: 'L&T Construction', fontClass: 'font-bold tracking-tight text-slate-300 text-xs sm:text-sm' },
    { name: 'Shapoorji Pallonji', fontClass: 'font-semibold tracking-wide text-slate-300 text-xs sm:text-sm' },
    { name: 'Godrej', fontClass: 'font-serif italic font-semibold text-slate-300 text-base' },
  ];

  return (
    <section id="product" className="w-full bg-[#080C14] border-b border-white/[0.08]">
      {/* 6 Capabilities Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] py-6 sm:py-8">
          {capabilities.map((cap, index) => (
            <div
              key={cap.title}
              className={`p-4 flex flex-col justify-between group hover:bg-[#0E1522]/40 transition-colors rounded-xs ${
                index === 0 ? 'sm:pl-0' : ''
              } ${index === capabilities.length - 1 ? 'lg:pr-0' : ''}`}
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                  {cap.icon}
                </div>
                <h3 className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors leading-snug">
                  {cap.title}
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Logos Strip */}
      <div className="border-t border-white/[0.06] bg-[#060910] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">
          <span className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase font-semibold whitespace-nowrap">
            TRUSTED BY FORWARD-THINKING CONSTRUCTION TEAMS
          </span>

          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-6 sm:gap-10 opacity-70 hover:opacity-95 transition-opacity">
            {partners.map((partner) => (
              <span
                key={partner.name}
                className={`${partner.fontClass} select-none transition-colors hover:text-white cursor-default`}
              >
                {partner.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
