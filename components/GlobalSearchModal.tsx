'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatRoleName } from '@/lib/utils';
import { Search, X, Table, GitPullRequest, CheckSquare, Users, History } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const {
    getCurrentTasks,
    getCurrentStakeholders,
    getCurrentChangeRequests,
    getCurrentActionItems,
    getCurrentAuditLogs,
    setSelectedTaskId,
    setSelectedChangeId,
    setActiveTab,
  } = useStore();

  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const tasks = getCurrentTasks();
  const stakeholders = getCurrentStakeholders();
  const changeRequests = getCurrentChangeRequests();
  const actionItems = getCurrentActionItems();
  const auditLogs = getCurrentAuditLogs();

  const q = query.toLowerCase().trim();

  const matchingTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.ownerRole.toLowerCase().includes(q)) : [];
  const matchingStakeholders = q ? stakeholders.filter((s) => s.name.toLowerCase().includes(q) || s.organization.toLowerCase().includes(q) || s.role.toLowerCase().includes(q)) : [];
  const matchingChanges = q ? changeRequests.filter((c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.reason.toLowerCase().includes(q)) : [];
  const matchingActions = q ? actionItems.filter((a) => a.title.toLowerCase().includes(q) || a.assignedRole.toLowerCase().includes(q)) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-aec-card border border-aec-border rounded-xl max-w-2xl w-full p-4 shadow-2xl relative text-slate-100 space-y-4">
        <div className="flex items-center gap-2 border-b border-aec-border pb-3">
          <Search className="h-5 w-5 text-slate-100" />
          <input
            type="text"
            autoFocus
            placeholder="Global search across tasks, stakeholders, changes, actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!q ? (
          <div className="py-8 text-center text-xs text-aec-muted">
            Type a search term like "HVAC", "Chiller", "Architect", or "Fire".
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
            {/* Matching Tasks */}
            {matchingTasks.length > 0 && (
              <div>
                <span className="font-bold text-aec-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Table className="h-3.5 w-3.5 text-slate-100" /> Tasks ({matchingTasks.length})
                </span>
                <div className="space-y-1">
                  {matchingTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTaskId(t.id);
                        setActiveTab('tasks');
                        onClose();
                      }}
                      className="p-2 bg-aec-bg/60 border border-aec-border hover:border-aec-rose rounded cursor-pointer flex items-center justify-between"
                    >
                      <span>
                        <strong className="text-slate-100 font-mono">{t.id}:</strong> {t.title}
                      </span>
                      <span className="text-slate-400">{formatRoleName(t.ownerRole)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Changes */}
            {matchingChanges.length > 0 && (
              <div>
                <span className="font-bold text-aec-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <GitPullRequest className="h-3.5 w-3.5 text-slate-100" /> Change Orders ({matchingChanges.length})
                </span>
                <div className="space-y-1">
                  {matchingChanges.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedChangeId(c.id);
                        setActiveTab('changes');
                        onClose();
                      }}
                      className="p-2 bg-aec-bg/60 border border-aec-border hover:border-aec-rose rounded cursor-pointer flex items-center justify-between"
                    >
                      <span>
                        <strong className="text-slate-100 font-mono">{c.id}:</strong> {c.title}
                      </span>
                      <span className="text-slate-400">+{c.delayDays}d</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Actions */}
            {matchingActions.length > 0 && (
              <div>
                <span className="font-bold text-aec-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <CheckSquare className="h-3.5 w-3.5 text-emerald-400" /> Actions ({matchingActions.length})
                </span>
                <div className="space-y-1">
                  {matchingActions.map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setActiveTab('approvals');
                        onClose();
                      }}
                      className="p-2 bg-aec-bg/60 border border-aec-border hover:border-emerald-500 rounded cursor-pointer flex items-center justify-between"
                    >
                      <span>{a.title}</span>
                      <span className="text-slate-400">{formatRoleName(a.assignedRole)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Stakeholders */}
            {matchingStakeholders.length > 0 && (
              <div>
                <span className="font-bold text-aec-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-slate-100" /> Stakeholders ({matchingStakeholders.length})
                </span>
                <div className="space-y-1">
                  {matchingStakeholders.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setActiveTab('stakeholders');
                        onClose();
                      }}
                      className="p-2 bg-aec-bg/60 border border-aec-border hover:border-aec-rose rounded cursor-pointer flex items-center justify-between"
                    >
                      <span>{s.name} ({s.organization})</span>
                      <span className="text-slate-100 font-semibold">{formatRoleName(s.role)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matchingTasks.length === 0 &&
              matchingChanges.length === 0 &&
              matchingActions.length === 0 &&
              matchingStakeholders.length === 0 && (
                <div className="py-6 text-center text-aec-muted">No matching records found for "{query}".</div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};
