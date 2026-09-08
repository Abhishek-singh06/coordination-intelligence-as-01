'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import { StakeholderRole } from '@/lib/types';
import { formatRoleName } from '@/lib/utils';
import { Settings as SettingsIcon, User, Moon, Sun, RotateCcw, Trash2, Shield, Activity } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    currentUser,
    setCurrentUserRole,
    resetDemoScenario,
    resetWorkspace,
    theme,
    setTheme,
    projects,
  } = useStore();

  const roleOptions: StakeholderRole[] = [
    'PROJECT_MANAGER',
    'LEAD_ARCHITECT',
    'MEP_CONSULTANT',
    'GENERAL_CONTRACTOR',
    'HVAC_VENDOR',
    'FIRE_SAFETY_INSPECTOR',
    'CLIENT',
  ];

  return (
    <div className="bg-aec-card border border-aec-border rounded-xl p-5 shadow-lg space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 border-b border-aec-border pb-3">
        <SettingsIcon className="h-5 w-5 text-amber-400" />
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
          Workspace Settings & Preferences
        </h2>
      </div>

      {/* User Profile & Role Switcher */}
      <div className="bg-aec-bg/60 border border-aec-border p-4 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <User className="h-4 w-4 text-amber-400" /> Active User Profile
        </div>

        {currentUser && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-aec-muted block font-medium">Full Name</span>
              <span className="text-slate-100 font-semibold">{currentUser.name}</span>
            </div>
            <div>
              <span className="text-aec-muted block font-medium">Organization</span>
              <span className="text-slate-100 font-semibold">{currentUser.organization}</span>
            </div>
            <div>
              <span className="text-aec-muted block font-medium">Work Email</span>
              <span className="text-slate-100 font-mono">{currentUser.email}</span>
            </div>
            <div>
              <span className="text-aec-muted block font-medium mb-1">Active Role</span>
              <select
                value={currentUser.role}
                onChange={(e) => setCurrentUserRole(e.target.value as StakeholderRole)}
                className="bg-aec-bg border border-aec-border rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {formatRoleName(r)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Theme Preference */}
      <div className="bg-aec-bg/60 border border-aec-border p-4 rounded-xl flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-200">Appearance Theme</h4>
          <p className="text-[11px] text-aec-muted">Toggle dark / light application styling mode.</p>
        </div>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-2 px-3 py-1.5 bg-aec-burgundy hover:bg-aec-rose text-slate-100 rounded border border-aec-rose/30 text-xs font-semibold"
        >
          {theme === 'dark' ? <Moon className="h-4 w-4 text-amber-400" /> : <Sun className="h-4 w-4 text-amber-400" />}
          <span>{theme === 'dark' ? 'Dark Command Center' : 'Light Mode'}</span>
        </button>
      </div>

      {/* Demo & Workspace Resets */}
      <div className="bg-aec-bg/60 border border-aec-border p-4 rounded-xl space-y-4">
        <h4 className="text-xs font-bold text-slate-200 border-b border-aec-border pb-2">
          Reset Options & Data Hygiene
        </h4>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h5 className="text-xs font-bold text-slate-300">Reset Demo Scenario</h5>
            <p className="text-[11px] text-aec-muted">
              Restores the Apex Retail Flagship Fit-Out demo to baseline (+0d slip, no blocked tasks).
            </p>
          </div>
          <button
            onClick={resetDemoScenario}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-aec-burgundy hover:bg-aec-rose text-slate-100 text-xs font-bold rounded border border-aec-rose/30 shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-aec-border">
          <div>
            <h5 className="text-xs font-bold text-rose-300">Reset Entire Workspace</h5>
            <p className="text-[11px] text-aec-muted">
              Clears user profile, custom projects, and onboarding state to start completely fresh.
            </p>
          </div>
          <button
            onClick={resetWorkspace}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-aec-darkRed/80 hover:bg-aec-darkRed text-rose-200 text-xs font-bold rounded border border-aec-rose/40 shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Reset Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
};
