'use client';

import React, { useState } from 'react';
import { useStore, AppTab } from '@/lib/store';
import { StakeholderRole } from '@/lib/types';
import { formatRoleName } from '@/lib/utils';
import {
  Activity,
  Play,
  RotateCcw,
  Bell,
  Search,
  Moon,
  Sun,
  Layers,
  Table,
  GitPullRequest,
  CheckSquare,
  Calendar,
  Users,
  History,
  Settings as SettingsIcon,
  CheckCircle2,
  AlertTriangle,
  User,
} from 'lucide-react';

interface NavbarProps {
  onOpenSimulator: () => void;
  onOpenSearch: () => void;
  onOpenNewProjectModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSimulator,
  onOpenSearch,
  onOpenNewProjectModal,
}) => {
  const {
    projects,
    currentProjectId,
    switchProject,
    currentUser,
    setCurrentUserRole,
    activeTab,
    setActiveTab,
    notifications,
    markAllNotificationsRead,
    resetDemoScenario,
    theme,
    setTheme,
    getCurrentProject,
    getCurrentProjectSlip,
    getProjectHealth,
  } = useStore();

  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const currentProject = getCurrentProject();
  const projectSlip = getCurrentProjectSlip();
  const health = getProjectHealth();
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const roleOptions: StakeholderRole[] = [
    'PROJECT_MANAGER',
    'LEAD_ARCHITECT',
    'MEP_CONSULTANT',
    'GENERAL_CONTRACTOR',
    'HVAC_VENDOR',
    'FIRE_SAFETY_INSPECTOR',
    'CLIENT',
  ];

  const tabs: { id: AppTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Command Center', icon: <Layers className="h-3.5 w-3.5" /> },
    { id: 'tasks', label: 'Tasks Register', icon: <Table className="h-3.5 w-3.5" /> },
    { id: 'changes', label: 'Change Orders', icon: <GitPullRequest className="h-3.5 w-3.5" /> },
    { id: 'approvals', label: 'Approvals & Actions', icon: <CheckSquare className="h-3.5 w-3.5" /> },
    { id: 'timeline', label: 'Timeline', icon: <Calendar className="h-3.5 w-3.5" /> },
    { id: 'stakeholders', label: 'Stakeholders', icon: <Users className="h-3.5 w-3.5" /> },
    { id: 'audit', label: 'Project Memory', icon: <History className="h-3.5 w-3.5" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="h-3.5 w-3.5" /> },
  ];

  return (
    <header className="bg-[#111506] border-b border-[#81815D]/30 sticky top-0 z-30 shadow-md">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Project Selector */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="h-8 w-8 rounded-lg bg-[#570F1D] border border-[#6F2B34] flex items-center justify-center text-slate-100 font-bold shadow-inner">
              <Activity className="h-4 w-4 text-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-bold text-slate-100 tracking-tight">
                  Coordination Intelligence
                </h1>
                <span className="bg-[#323522] text-[#81815D] border border-[#81815D]/40 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                  AS-01
                </span>
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-[#323522] hidden sm:block"></div>

          {/* Project Switcher Dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={currentProjectId}
              onChange={(e) => {
                if (e.target.value === 'NEW_PROJECT') {
                  onOpenNewProjectModal();
                } else {
                  switchProject(e.target.value);
                }
              }}
              className="bg-[#323522] border border-[#81815D]/50 rounded-lg px-2.5 py-1 text-xs text-slate-100 font-semibold focus:outline-none focus:border-[#6F2B34] max-w-[200px] truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#323522] text-slate-100">
                  {p.name} {p.isDemo ? '(Demo)' : ''}
                </option>
              ))}
              <option value="NEW_PROJECT" className="bg-[#323522] text-rose-300 font-bold">+ Create New Project...</option>
            </select>
          </div>
        </div>

        {/* Center: Global Search & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Global Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 bg-[#323522] border border-[#81815D]/40 hover:border-[#81815D] text-slate-300 px-3 py-1 rounded-lg text-xs transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-[#81815D]" />
            <span className="hidden sm:inline">Search tasks, changes, actions...</span>
            <kbd className="hidden lg:inline bg-[#111506] text-[10px] px-1.5 py-0.5 rounded text-[#81815D] font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Project Health Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              health.status === 'CRITICAL'
                ? 'bg-[#340A0E] border-[#6F2B34] text-rose-300 animate-pulse'
                : health.status === 'AT_RISK'
                ? 'bg-[#570F1D]/40 border-[#81815D] text-slate-100'
                : 'bg-[#323522] border-[#81815D]/40 text-emerald-400'
            }`}
            title={health.reason}
          >
            {health.status === 'CRITICAL' ? (
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
            ) : health.status === 'AT_RISK' ? (
              <AlertTriangle className="h-3.5 w-3.5 text-slate-200" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            )}
            <span>{health.status.replace('_', ' ')}</span>
            {projectSlip > 0 && <span className="font-mono text-[10px] text-rose-300">(+{projectSlip}d)</span>}
          </div>

          {/* User Role Switcher */}
          <div className="flex items-center gap-1 bg-[#323522] border border-[#81815D]/40 rounded-lg px-2 py-1 text-xs">
            <User className="h-3.5 w-3.5 text-[#81815D]" />
            <select
              value={currentUser ? currentUser.role : 'PROJECT_MANAGER'}
              onChange={(e) => setCurrentUserRole(e.target.value as StakeholderRole)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r} className="bg-[#323522] text-slate-200">
                  {formatRoleName(r)}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-1.5 rounded-lg bg-[#323522] border border-[#81815D]/40 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#570F1D] text-white text-[10px] font-bold border border-[#6F2B34] flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-[#323522] border border-[#81815D] rounded-xl p-3 shadow-2xl z-50 text-xs">
                <div className="flex items-center justify-between border-b border-[#81815D]/40 pb-2 mb-2">
                  <span className="font-bold text-slate-200">Notifications ({notifications.length})</span>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-rose-300 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-[#81815D] text-center py-2">No notifications.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded border ${
                          n.read ? 'bg-[#111506]/40 border-[#81815D]/20' : 'bg-[#570F1D]/30 border-[#6F2B34]'
                        }`}
                      >
                        <h5 className="font-bold text-slate-100">{n.title}</h5>
                        <p className="text-[11px] text-slate-300">{n.message}</p>
                        <span className="text-[10px] text-[#81815D] font-mono mt-1 block">{n.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#570F1D] hover:bg-[#6F2B34] text-white text-xs font-bold transition-colors shadow-sm focus:outline-none border border-[#6F2B34]"
          >
            <Play className="h-3.5 w-3.5 fill-current text-rose-200" />
            <span className="hidden sm:inline">Simulate Change</span>
          </button>

          <button
            onClick={resetDemoScenario}
            className="p-1.5 rounded-lg bg-[#323522] hover:bg-[#323522]/80 text-slate-300 border border-[#81815D]/40 transition-colors"
            title="Reset Demo Scenario baseline"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tab Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 border-t border-[#81815D]/30 flex items-center gap-1 overflow-x-auto py-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? 'bg-[#570F1D] text-slate-100 border border-[#6F2B34]'
                : 'text-slate-300 hover:text-white hover:bg-[#323522]'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
};
