'use client';

import React from 'react';
import Link from 'next/link';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#05080E] border-t border-white/[0.08] py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-white/[0.06]">
          
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 5L26 11V21L16 27L6 21V11L16 5Z"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="16" r="3" fill="#10B981" />
              </svg>
              <span className="text-base font-bold text-slate-100 tracking-tight">
                Coordination Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono tracking-wide uppercase">
              FOR A MORE CONNECTED BUILT WORLD
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-medium text-slate-300">
            <a href="#product" className="hover:text-emerald-400 transition-colors">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
              How It Works
            </a>
            <a href="#use-cases" className="hover:text-emerald-400 transition-colors">
              Use Cases
            </a>
            <a href="#command-center" className="hover:text-emerald-400 transition-colors">
              Live Demo
            </a>
            <Link href="/command-center" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">
              Open Command Center ?
            </Link>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Coordination Intelligence System. Built for AEC professionals.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>All systems operational • v1.0 AS-01</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
