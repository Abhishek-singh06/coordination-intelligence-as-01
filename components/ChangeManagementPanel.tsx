'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { StakeholderRole, ChangePriority } from '@/lib/types';
import { formatRoleName } from '@/lib/utils';
import { GitPullRequest, Plus, Play, Eye, X } from 'lucide-react';

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
    <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1B2735] pb-4">
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-2 font-sans">
            <GitPullRequest className="h-5 w-5 text-[#2F80ED]" />
            <span>Change Requests & Variance Register ({changeRequests.length})</span>
          </h2>
          <p className="text-xs text-[#6F7B88]">
            Submit, analyze blast radius impact, authorize cost & schedule change orders.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1E5A91] hover:bg-[#2F80ED] text-white text-xs font-bold rounded-xl transition-colors border border-[#2F80ED]/40 shadow-md cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Change Order</span>
        </button>
      </div>

      {/* Change Requests Table */}
      <div className="overflow-x-auto rounded-xl border border-[#1B2735]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#05070A] text-[#6F7B88] border-b border-[#1B2735] font-mono text-[11px] uppercase">
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
          <tbody className="divide-y divide-[#1B2735]/60 text-[#A7B0BC]">
            {changeRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-[#6F7B88] italic">
                  No change requests recorded in variance register.
                </td>
              </tr>
            ) : (
              changeRequests.map((cr) => (
                <tr key={cr.id} className="hover:bg-[#05070A]/50 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-white">{cr.id}</td>
                  <td className="py-2.5 px-3">
                    <span
                      onClick={() => setSelectedChangeId(cr.id)}
                      className="font-bold text-white hover:text-[#2F80ED] cursor-pointer block"
                    >
                      {cr.title}
                    </span>
                    <span className="text-[10px] text-[#6F7B88] line-clamp-1">{cr.reason}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-white font-bold">{cr.targetTaskId}</td>
                  <td className="py-2.5 px-3 text-[#A7B0BC]">{formatRoleName(cr.initiatorRole)}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col text-[11px]">
                      <span className="text-red-400 font-mono font-bold">+{cr.delayDays}d Schedule</span>
                      <span className="text-[#6F7B88] font-mono">${cr.costImpact.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        cr.priority === 'CRITICAL'
                          ? 'bg-[#3A0B0E] text-red-300 border border-red-500/30'
                          : 'bg-[#0B1F3A] text-white border border-[#1E5A91]'
                      }`}
                    >
                      {cr.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        cr.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : cr.status === 'REJECTED'
                          ? 'bg-[#3A0B0E] text-red-300 border border-red-500/30'
                          : cr.status === 'ANALYZED'
                          ? 'bg-[#0B1F3A] text-white border border-[#1E5A91]'
                          : 'bg-[#05070A] text-[#6F7B88] border border-[#1B2735]'
                      }`}
                    >
                      {cr.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => analyzeChangeRequest(cr.id)}
                        className="px-2.5 py-1 bg-[#1E5A91] hover:bg-[#2F80ED] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 border border-[#2F80ED]/40 cursor-pointer"
                        title="Analyze Blast Radius"
                      >
                        <Play className="h-3 w-3 fill-current text-white" />
                        <span>Propagate</span>
                      </button>
                      <button
                        onClick={() => setSelectedChangeId(cr.id)}
                        className="p-1.5 rounded-lg text-[#A7B0BC] hover:text-white hover:bg-[#05070A] border border-transparent hover:border-[#1B2735] cursor-pointer"
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
          <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-white space-y-4">
            <button
              onClick={() => setSelectedChangeId(null)}
              className="absolute top-4 right-4 text-[#A7B0BC] hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-[#05070A] text-white border border-[#1B2735] px-2.5 py-0.5 rounded-md">
                {selectedChange.id}
              </span>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-[#0B1F3A] border border-[#1E5A91] text-white">
                {selectedChange.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{selectedChange.title}</h3>
            <p className="text-xs text-[#A7B0BC] bg-[#05070A] p-3 rounded-xl border border-[#1B2735]">
              {selectedChange.description || selectedChange.reason}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#05070A] p-3 rounded-xl border border-[#1B2735]">
                <span className="text-[#6F7B88] block font-medium">Schedule Impact</span>
                <span className="text-red-400 font-bold font-mono text-base">+{selectedChange.delayDays} Days</span>
              </div>
              <div className="bg-[#05070A] p-3 rounded-xl border border-[#1B2735]">
                <span className="text-[#6F7B88] block font-medium">Cost Impact</span>
                <span className="text-white font-bold font-mono text-base">
                  ${selectedChange.costImpact.toLocaleString()}
                </span>
              </div>
            </div>

            {selectedChange.analyzedResult && (
              <div className="bg-[#3A0B0E] border border-red-500/40 p-3.5 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-red-300 uppercase tracking-wider block font-mono">
                  Blast Radius Traversal Results
                </span>
                <p className="text-red-200">
                  Downstream Blocked Tasks:{' '}
                  <strong className="text-white font-mono">{selectedChange.analyzedResult.blockedTaskIds.join(', ')}</strong>
                </p>
                <p className="text-red-200">
                  Critical Schedule Variance:{' '}
                  <strong className="text-white font-mono">+{selectedChange.analyzedResult.effectiveProjectSlip} Days</strong>
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1B2735]">
              <button
                onClick={() => rejectChangeRequest(selectedChange.id)}
                className="px-4 py-2 bg-[#3A0B0E] hover:bg-red-900 text-red-100 text-xs font-bold rounded-xl border border-red-500/40 cursor-pointer"
              >
                Reject Order
              </button>
              <button
                onClick={() => approveChangeRequest(selectedChange.id)}
                className="px-5 py-2 bg-[#1E5A91] hover:bg-[#2F80ED] text-white text-xs font-bold rounded-xl shadow-md border border-[#2F80ED]/40 cursor-pointer"
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
          <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-base font-bold border-b border-[#1B2735] pb-2">Create New Variance Change Order</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#A7B0BC] uppercase mb-1">Change Order Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Relocate Primary HVAC Chiller by 4m"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#05070A] border border-[#1B2735] focus:border-[#2F80ED] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#A7B0BC] uppercase mb-1">Target Task</label>
                  <select
                    value={targetTaskId}
                    onChange={(e) => setTargetTaskId(e.target.value)}
                    className="w-full bg-[#05070A] border border-[#1B2735] focus:border-[#2F80ED] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                  >
                    {tasks.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#0A0F16]">
                        {t.id}: {t.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#A7B0BC] uppercase mb-1">Initiating Role</label>
                  <select
                    value={initiatorRole}
                    onChange={(e) => setInitiatorRole(e.target.value as StakeholderRole)}
                    className="w-full bg-[#05070A] border border-[#1B2735] focus:border-[#2F80ED] rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r} className="bg-[#0A0F16]">
                        {formatRoleName(r)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#A7B0BC] uppercase mb-1">Schedule Shift (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={delayDays}
                    onChange={(e) => setDelayDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#05070A] border border-[#1B2735] focus:border-[#2F80ED] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#A7B0BC] uppercase mb-1">Cost Impact ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={costImpact}
                    onChange={(e) => setCostImpact(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#05070A] border border-[#1B2735] focus:border-[#2F80ED] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A7B0BC] uppercase mb-1">Reason / Justification *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Expanded mezzanine showroom requires duct rerouting."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#05070A] border border-[#1B2735] focus:border-[#2F80ED] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#1B2735]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 bg-[#05070A] hover:bg-[#0B1F3A] text-[#A7B0BC] rounded-xl border border-[#1B2735] text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1E5A91] hover:bg-[#2F80ED] text-white font-bold rounded-xl text-xs border border-[#2F80ED]/40 shadow-md"
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
