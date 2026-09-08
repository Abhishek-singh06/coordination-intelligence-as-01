'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { ChangeRequest, StakeholderRole, ChangePriority } from '@/lib/types';
import { formatRoleName } from '@/lib/utils';
import { GitPullRequest, Plus, Play, CheckCircle2, XCircle, AlertCircle, DollarSign, Clock, Shield, Eye, X } from 'lucide-react';

export const ChangeManagementPanel: React.FC = () => {
  const {
    getCurrentChangeRequests,
    getCurrentTasks,
    createChangeRequest,
    analyzeChangeRequest,
    approveChangeRequest,
    rejectChangeRequest,
    selectedChangeId,
    setSelectedChangeId,
    currentUser,
  } = useStore();

  const changeRequests = getCurrentChangeRequests();
  const tasks = getCurrentTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetTaskId, setTargetTaskId] = useState(tasks[0]?.id || 'T2');
  const [initiatorRole, setInitiatorRole] = useState<StakeholderRole>('CLIENT');
  const [delayDays, setDelayDays] = useState(6);
  const [costImpact, setCostImpact] = useState(45000);
  const [priority, setPriority] = useState<ChangePriority>('HIGH');
  const [reason, setReason] = useState('');

  const selectedChange = changeRequests.find((c) => c.id === selectedChangeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reason.trim()) return;

    createChangeRequest({
      title,
      description,
      targetTaskId,
      initiatorRole,
      delayDays,
      costImpact,
      priority,
      reason,
    });

    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setReason('');
  };

  const roleOptions: StakeholderRole[] = [
    'CLIENT',
    'LEAD_ARCHITECT',
    'MEP_CONSULTANT',
    'PROJECT_MANAGER',
    'GENERAL_CONTRACTOR',
    'HVAC_VENDOR',
    'FIRE_SAFETY_INSPECTOR',
  ];

  return (
    <div className="bg-aec-card border border-aec-border rounded-xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-aec-border pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
            <GitPullRequest className="h-5 w-5 text-slate-100" />
            <span>Change Requests & Variance Register ({changeRequests.length})</span>
          </h2>
          <p className="text-xs text-slate-400">
            Submit, analyze blast radius impact, authorize cost & schedule change orders.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-aec-burgundy hover:bg-aec-rose text-slate-100 text-xs font-bold rounded-lg transition-colors border border-aec-rose/30 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Change Order</span>
        </button>
      </div>

      {/* Change Requests Table */}
      <div className="overflow-x-auto rounded-lg border border-aec-border">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-aec-bg/80 text-slate-400 border-b border-aec-border font-mono text-[11px] uppercase">
              <th className="py-2.5 px-3">CR ID</th>
              <th className="py-2.5 px-3">Title & Description</th>
              <th className="py-2.5 px-3">Target Task</th>
              <th className="py-2.5 px-3">Initiator</th>
              <th className="py-2.5 px-3">Impact</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aec-border/60 font-sans">
            {changeRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-aec-muted italic">
                  No change requests recorded in variance register.
                </td>
              </tr>
            ) : (
              changeRequests.map((cr) => (
                <tr key={cr.id} className="hover:bg-aec-bg/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-100">{cr.id}</td>
                  <td className="py-2.5 px-3">
                    <span
                      onClick={() => setSelectedChangeId(cr.id)}
                      className="font-bold text-slate-100 hover:text-slate-100 cursor-pointer block"
                    >
                      {cr.title}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{cr.reason}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-100 font-bold">{cr.targetTaskId}</td>
                  <td className="py-2.5 px-3 text-slate-300">{formatRoleName(cr.initiatorRole)}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col text-[11px]">
                      <span className="text-rose-400 font-mono font-bold">+{cr.delayDays}d Schedule</span>
                      <span className="text-slate-400 font-mono">${cr.costImpact.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        cr.priority === 'CRITICAL'
                          ? 'bg-aec-darkRed/60 text-rose-300 border border-aec-darkRed'
                          : 'bg-slate-800/40 text-slate-100 border border-slate-700/50'
                      }`}
                    >
                      {cr.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        cr.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : cr.status === 'REJECTED'
                          ? 'bg-aec-darkRed/60 text-rose-300 border border-aec-darkRed'
                          : cr.status === 'ANALYZED'
                          ? 'bg-aec-burgundy/50 text-slate-200 border border-aec-rose/40'
                          : 'bg-aec-bg text-slate-400 border border-aec-border'
                      }`}
                    >
                      {cr.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => analyzeChangeRequest(cr.id)}
                        className="px-2 py-1 bg-aec-burgundy hover:bg-aec-rose text-slate-100 rounded text-[11px] font-bold flex items-center gap-1 border border-aec-rose/30"
                        title="Analyze Blast Radius"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Propagate</span>
                      </button>
                      <button
                        onClick={() => setSelectedChangeId(cr.id)}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-aec-bg border border-transparent hover:border-aec-border"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Change Detail Inspector Drawer/Modal */}
      {selectedChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-aec-card border border-aec-border rounded-xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100 space-y-4">
            <button
              onClick={() => setSelectedChangeId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-slate-800/40 text-slate-100 border border-slate-700/50 px-2.5 py-0.5 rounded">
                {selectedChange.id}
              </span>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-aec-bg border border-aec-border text-slate-300">
                {selectedChange.status}
              </span>
            </div>

            <h3 className="text-lg font-bold">{selectedChange.title}</h3>
            <p className="text-xs text-slate-300 bg-aec-bg p-3 rounded-lg border border-aec-border">
              {selectedChange.description || selectedChange.reason}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-aec-bg p-3 rounded-lg border border-aec-border">
                <span className="text-slate-400 block font-medium">Schedule Impact</span>
                <span className="text-rose-400 font-bold font-mono text-base">+{selectedChange.delayDays} Days</span>
              </div>
              <div className="bg-aec-bg p-3 rounded-lg border border-aec-border">
                <span className="text-slate-400 block font-medium">Cost Impact</span>
                <span className="text-slate-100 font-bold font-mono text-base">
                  ${selectedChange.costImpact.toLocaleString()}
                </span>
              </div>
            </div>

            {selectedChange.analyzedResult && (
              <div className="bg-aec-darkRed/30 border border-aec-darkRed/60 p-3.5 rounded-lg space-y-2 text-xs">
                <span className="font-bold text-rose-300 uppercase tracking-wider block">
                  Blast Radius Traversal Results
                </span>
                <p className="text-slate-300">
                  Downstream Blocked Tasks:{' '}
                  <strong className="text-rose-300 font-mono">{selectedChange.analyzedResult.blockedTaskIds.join(', ')}</strong>
                </p>
                <p className="text-slate-300">
                  Critical Schedule Variance:{' '}
                  <strong className="text-rose-300 font-mono">+{selectedChange.analyzedResult.effectiveProjectSlip} Days</strong>
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-aec-border">
              <button
                onClick={() => rejectChangeRequest(selectedChange.id)}
                className="px-4 py-2 bg-aec-darkRed/80 hover:bg-aec-darkRed text-rose-100 text-xs font-bold rounded-lg border border-aec-rose/40"
              >
                Reject Order
              </button>
              <button
                onClick={() => approveChangeRequest(selectedChange.id)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Authorize Change Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Change Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-aec-card border border-aec-border rounded-xl max-w-lg w-full p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold mb-4 border-b border-aec-border pb-2">Create New Variance Change Order</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Change Order Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Relocate Primary HVAC Chiller by 4m"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Task</label>
                  <select
                    value={targetTaskId}
                    onChange={(e) => setTargetTaskId(e.target.value)}
                    className="w-full bg-aec-bg border border-aec-border rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  >
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.id}: {t.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initiating Role</label>
                  <select
                    value={initiatorRole}
                    onChange={(e) => setInitiatorRole(e.target.value as StakeholderRole)}
                    className="w-full bg-aec-bg border border-aec-border rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {formatRoleName(r)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Schedule Shift (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={delayDays}
                    onChange={(e) => setDelayDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cost Impact ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={costImpact}
                    onChange={(e) => setCostImpact(parseInt(e.target.value) || 0)}
                    className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason / Justification *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Expanded mezzanine showroom requires duct rerouting."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-aec-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-aec-bg hover:bg-slate-800 text-slate-300 rounded border border-aec-border text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-aec-burgundy hover:bg-aec-rose text-slate-100 font-bold rounded text-xs border border-aec-rose/30"
                >
                  Submit Change Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
