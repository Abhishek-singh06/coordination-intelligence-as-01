'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { TaskNode, TaskStatus, StakeholderRole } from '@/lib/types';
import { formatRoleName, getStatusBadgeClass } from '@/lib/utils';
import { Plus, Edit2, Trash2, Shield, Search, Filter, AlertOctagon, CheckCircle2, Clock, Lock } from 'lucide-react';

export const TaskManagementTable: React.FC = () => {
  const { getCurrentTasks, createTask, updateTask, deleteTask, setSelectedTaskId, getCurrentDependencies } = useStore();

  const tasks = getCurrentTasks();
  const dependencies = getCurrentDependencies();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskNode | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [ownerRole, setOwnerRole] = useState<StakeholderRole>('GENERAL_CONTRACTOR');
  const [status, setStatus] = useState<TaskStatus>('NOT_STARTED');
  const [plannedDays, setPlannedDays] = useState(7);
  const [slackDays, setSlackDays] = useState(1);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [approvalRole, setApprovalRole] = useState<StakeholderRole>('LEAD_ARCHITECT');
  const [description, setDescription] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ownerRole.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingTask(null);
    setTitle('');
    setOwnerRole('GENERAL_CONTRACTOR');
    setStatus('NOT_STARTED');
    setPlannedDays(7);
    setSlackDays(1);
    setRequiresApproval(false);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TaskNode) => {
    setEditingTask(t);
    setTitle(t.title);
    setOwnerRole(t.ownerRole);
    setStatus(t.status);
    setPlannedDays(t.plannedDays);
    setSlackDays(t.slackDays);
    setRequiresApproval(!!t.requiresApprovalFrom);
    if (t.requiresApprovalFrom) setApprovalRole(t.requiresApprovalFrom);
    setDescription(t.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        title,
        ownerRole,
        status,
        plannedDays,
        slackDays,
        requiresApprovalFrom: requiresApproval ? approvalRole : undefined,
        description,
      });
    } else {
      createTask({
        title,
        ownerRole,
        status,
        plannedDays,
        slackDays,
        gridCol: tasks.length + 1,
        gridRow: 1,
        requiresApprovalFrom: requiresApproval ? approvalRole : undefined,
        description,
      });
    }

    setIsModalOpen(false);
  };

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
    <div className="bg-aec-card border border-aec-border rounded-xl p-5 shadow-lg space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-aec-border pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
            Project Tasks & Activities Register ({tasks.length})
          </h2>
          <p className="text-xs text-aec-muted">
            Manage activity owners, duration, slack buffers, and approval gates.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-aec-burgundy hover:bg-aec-rose text-slate-100 text-xs font-bold rounded-lg transition-colors border border-aec-rose/30 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-aec-muted" />
          <input
            type="text"
            placeholder="Search by title, ID, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-aec-bg border border-aec-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-3.5 w-3.5 text-aec-muted" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-aec-bg border border-aec-border rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
          >
            <option value="ALL">All Statuses ({tasks.length})</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="BLOCKED">Blocked</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="NOT_STARTED">Not Started</option>
          </select>
        </div>
      </div>

      {/* Dense Enterprise Data Table */}
      <div className="overflow-x-auto rounded-lg border border-aec-border">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-aec-bg/80 text-slate-400 border-b border-aec-border font-mono text-[11px] uppercase">
              <th className="py-2.5 px-3">ID</th>
              <th className="py-2.5 px-3">Task Activity Title</th>
              <th className="py-2.5 px-3">Owner Role</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Duration</th>
              <th className="py-2.5 px-3">Slack</th>
              <th className="py-2.5 px-3">Approval Gate</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-aec-border/60 font-sans">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-aec-muted italic">
                  No task activities match the filter criteria.
                </td>
              </tr>
            ) : (
              filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-aec-bg/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{t.id}</td>
                  <td className="py-2.5 px-3">
                    <span
                      onClick={() => setSelectedTaskId(t.id)}
                      className="font-semibold text-slate-100 hover:text-amber-300 cursor-pointer block"
                    >
                      {t.title}
                    </span>
                    <span className="text-[10px] text-slate-400 line-clamp-1">{t.description}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-medium">{formatRoleName(t.ownerRole)}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeClass(
                        t.status
                      )}`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-300">{t.plannedDays} Days</td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className={t.slackDays > 0 ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                      {t.slackDays} Days
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {t.requiresApprovalFrom ? (
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-medium">
                        {formatRoleName(t.requiresApprovalFrom)}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">—</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-aec-bg border border-transparent hover:border-aec-border"
                        title="Edit Task"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-aec-bg border border-transparent hover:border-aec-border"
                        title="Delete Task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Task Modal (Create / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-aec-card border border-aec-border rounded-xl max-w-lg w-full p-5 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold mb-4 border-b border-aec-border pb-2">
              {editingTask ? `Edit Task [${editingTask.id}]` : 'Create New Activity Task'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Owner Role</label>
                  <select
                    value={ownerRole}
                    onChange={(e) => setOwnerRole(e.target.value as StakeholderRole)}
                    className="w-full bg-aec-bg border border-aec-border rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {formatRoleName(r)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full bg-aec-bg border border-aec-border rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  >
                    <option value="NOT_STARTED">NOT_STARTED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="BLOCKED">BLOCKED</option>
                    <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Planned Days</label>
                  <input
                    type="number"
                    min="1"
                    value={plannedDays}
                    onChange={(e) => setPlannedDays(parseInt(e.target.value) || 1)}
                    className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slack Days</label>
                  <input
                    type="number"
                    min="0"
                    value={slackDays}
                    onChange={(e) => setSlackDays(parseInt(e.target.value) || 0)}
                    className="w-full bg-aec-bg border border-aec-border rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={requiresApproval}
                    onChange={(e) => setRequiresApproval(e.target.checked)}
                    className="rounded border-aec-border bg-aec-bg text-aec-burgundy"
                  />
                  <span>Requires Sign-off Approval Gate</span>
                </label>
              </div>

              {requiresApproval && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Approver Role</label>
                  <select
                    value={approvalRole}
                    onChange={(e) => setApprovalRole(e.target.value as StakeholderRole)}
                    className="w-full bg-aec-bg border border-aec-border rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {formatRoleName(r)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  className="px-4 py-1.5 bg-aec-burgundy hover:bg-aec-rose text-slate-100 font-bold rounded border border-aec-rose/30 text-xs transition-colors"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
