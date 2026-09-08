'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRoleName } from '@/lib/utils';
import { Clock, CheckCircle2, AlertTriangle, ShieldCheck, Filter, Search } from 'lucide-react';

export const ActionCenterView: React.FC = () => {
  const { getCurrentActionItems, resolveAction } = useStore();

  const actionItems = getCurrentActionItems();
  const generalActions = actionItems.filter((a) => !a.isApprovalGate);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = generalActions.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="bg-aec-card border border-aec-border rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-aec-border pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-100" />
            <span>Coordination Action Register ({generalActions.length})</span>
          </h2>
          <p className="text-xs text-aec-muted">
            Assigned subcontractor actions, impact assessments, and drawing updates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-3.5 w-3.5 text-aec-muted" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-aec-bg border border-aec-border rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
          >
            <option value="ALL">All Actions ({generalActions.length})</option>
            <option value="PENDING">Pending ({generalActions.filter((a) => a.status === 'PENDING').length})</option>
            <option value="RESOLVED">Resolved ({generalActions.filter((a) => a.status === 'RESOLVED').length})</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-aec-bg/60 border border-aec-border rounded-xl p-8 text-center text-xs text-aec-muted">
            No coordination action items detected.
          </div>
        ) : (
          filtered.map((act) => (
            <div
              key={act.id}
              className={`p-4 rounded-xl border transition-all ${
                act.status === 'RESOLVED'
                  ? 'bg-aec-bg/50 border-aec-border opacity-75'
                  : 'bg-aec-burgundy/20 border-aec-rose/40 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-100 bg-slate-800/40 px-2 py-0.5 rounded border border-slate-700/50">
                    Assigned to: {formatRoleName(act.assignedRole)}
                  </span>
                  <h4 className="text-xs font-bold text-slate-100 mt-1">{act.title}</h4>
                </div>

                {act.status === 'RESOLVED' ? (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                  </span>
                ) : (
                  <button
                    onClick={() => resolveAction(act.id)}
                    className="px-3 py-1.5 bg-aec-burgundy hover:bg-aec-rose text-slate-100 text-xs font-semibold rounded border border-aec-rose/30 transition-colors"
                  >
                    Mark Done & Resolve
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-300">{act.impactDescription}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
