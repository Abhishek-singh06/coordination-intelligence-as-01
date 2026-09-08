'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { StakeholderRole } from '@/lib/types';
import { formatRoleName } from '@/lib/utils';
import { X, Play, Zap, Sliders } from 'lucide-react';

interface ChangeSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeSimulatorModal: React.FC<ChangeSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { getCurrentTasks, injectChangeEvent } = useStore();

  const tasks = getCurrentTasks();

  const [targetTaskId, setTargetTaskId] = useState('T2');
  const [delayDays, setDelayDays] = useState(6);
  const [initiatorRole, setInitiatorRole] = useState<StakeholderRole>('CLIENT');
  const [reason, setReason] = useState('Mezzanine expansion requires duct rerouting.');

  if (!isOpen) return null;

  const handleApplyPreset1 = () => {
    setTargetTaskId('T2');
    setDelayDays(6);
    setInitiatorRole('CLIENT');
    setReason('Mezzanine expansion requires duct rerouting.');
  };

  const handleApplyPreset2 = () => {
    setTargetTaskId('T4');
    setDelayDays(3);
    setInitiatorRole('LEAD_ARCHITECT');
    setReason('Lighting layout update requires ceiling frame revision.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTaskId || delayDays <= 0 || !reason.trim()) return;

    injectChangeEvent(targetTaskId, delayDays, reason, initiatorRole);
    onClose();
  };

  const rolesList: StakeholderRole[] = [
    'CLIENT',
    'LEAD_ARCHITECT',
    'MEP_CONSULTANT',
    'PROJECT_MANAGER',
    'GENERAL_CONTRACTOR',
    'HVAC_VENDOR',
    'FIRE_SAFETY_INSPECTOR',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-aec-card border border-aec-border rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100">
        <div className="flex items-center justify-between border-b border-aec-border pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-aec-burgundy/40 border border-aec-rose/40 flex items-center justify-center text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Simulate Project Change</h2>
              <p className="text-xs text-aec-muted">
                Inject schedule shifts to calculate downstream blast radius & dependencies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-aec-bg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5">
          <label className="text-xs font-bold text-aec-muted uppercase tracking-wider block mb-2">
            Demo Simulation Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={handleApplyPreset1}
              className="border border-aec-rose/40 bg-aec-burgundy/20 hover:bg-aec-burgundy/30 p-3 rounded-xl cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                    Preset 1 (Main Demo)
                  </span>
                  <span className="bg-aec-darkRed/60 text-rose-300 border border-aec-darkRed font-mono text-[11px] px-2 py-0.5 rounded font-bold">
                    +6 Days
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 mb-1">
                  Relocate HVAC Chiller by 4m
                </h4>
                <p className="text-[11px] text-aec-muted leading-tight">
                  Initiator: Client • Target: T2 (Chiller & MEP)
                </p>
              </div>
            </div>

            <div
              onClick={handleApplyPreset2}
              className="border border-aec-border bg-aec-bg/60 hover:bg-aec-bg p-3 rounded-xl cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                    Preset 2
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[11px] px-2 py-0.5 rounded font-bold">
                    +3 Days
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 mb-1">
                  Recessed Lighting Revision
                </h4>
                <p className="text-[11px] text-aec-muted leading-tight">
                  Initiator: Lead Architect • Target: T4 (Ceiling Grid)
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 border-t border-aec-border pt-4">
          <div className="flex items-center gap-1 text-xs font-bold text-aec-muted uppercase tracking-wider mb-1">
            <Sliders className="h-3.5 w-3.5 text-amber-400" /> Custom Parameters
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Task</label>
              <select
                value={targetTaskId}
                onChange={(e) => setTargetTaskId(e.target.value)}
                className="w-full bg-aec-bg border border-aec-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
              >
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id}: {t.title} ({t.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Schedule Shift (Days)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={delayDays}
                onChange={(e) => setDelayDays(parseInt(e.target.value) || 0)}
                className="w-full bg-aec-bg border border-aec-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Initiating Role</label>
              <select
                value={initiatorRole}
                onChange={(e) => setInitiatorRole(e.target.value as StakeholderRole)}
                className="w-full bg-aec-bg border border-aec-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
              >
                {rolesList.map((r) => (
                  <option key={r} value={r}>
                    {formatRoleName(r)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Change Reason</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Mezzanine relocation..."
                className="w-full bg-aec-bg border border-aec-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-aec-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-aec-bg hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-lg border border-aec-border transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-aec-burgundy hover:bg-aec-rose text-slate-100 text-xs font-bold rounded-lg border border-aec-rose/30 shadow-md transition-colors"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Analyze Blast Radius & Propagate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
