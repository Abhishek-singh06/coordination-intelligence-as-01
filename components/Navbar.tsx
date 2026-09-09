'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, AppTab } from '@/lib/store';
import { StakeholderRole } from '@/lib/types';
import { formatRoleName } from '@/lib/utils';
import {
  Activity,
  Play,
  RotateCcw,
  Bell,
  Search,
  Layers,
  Table,
  GitPullRequest,
  History,
  CheckCircle2,
  AlertTriangle,
  User,
  LogOut,
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
  const router = useRouter();
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
    getCurrentProject,
    getCurrentProjectSlip,
    getProjectHealth,
    logout,
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
    { id: 'changes', label: 'Changes', icon: <GitPullRequest className="h-3.5 w-3.5" /> },
    { id: 'project', label: 'Project', icon: <Table className="h-3.5 w-3.5" /> },
    { id: 'memory', label: 'Memory', icon: <History className="h-3.5 w-3.5" /> },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-[#05070A] border-b border-[#1B2735] sticky top-0 z-30 shadow-xl">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Project Selector */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="h-8 w-8 rounded-lg bg-[#0B1F3A] border border-[#1E5A91] flex items-center justify-center text-[#2F80ED] font-bold shadow-inner">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm font-bold text-white tracking-tight">
                  Coordination Intelligence
                </h1>
                <span className="bg-[#0A0F16] text-[#A7B0BC] border border-[#1B2735] text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                  AS-01
                </span>
              </div>
            </div>
          </div>

          <div className="h-5 w-px bg-[#1B2735] hidden sm:block"></div>

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
              className="bg-[#0A0F16] border border-[#1B2735] rounded-lg px-2.5 py-1 text-xs text-white font-semibold focus:outline-none focus:border-[#2F80ED] max-w-[200px] truncate cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#0A0F16] text-white">
                  {p.name} {p.isDemo ? '(Demo)' : ''}
                </option>
              ))}
              <option value="NEW_PROJECT" className="bg-[#0A0F16] text-[#2F80ED] font-bold">+ Create New Project...</option>
            </select>
          </div>
        </div>

        {/* Center: Global Search & Status */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end flex-wrap">
          {/* Global Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 bg-[#0A0F16] border border-[#1B2735] hover:border-[#1E5A91] text-[#A7B0BC] px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-[#6F7B88]" />
            <span className="hidden sm:inline">Search tasks, changes, actions...</span>
            <kbd className="hidden lg:inline bg-[#05070A] text-[10px] px-1.5 py-0.5 rounded text-[#6F7B88] font-mono border border-[#1B2735]">
              ⌘K
            </kbd>
          </button>

          {/* Project Health Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              health.status === 'CRITICAL'
                ? 'bg-[#3A0B0E] border-red-500/40 text-red-300 animate-pulse'
                : health.status === 'AT_RISK'
                ? 'bg-[#0B1F3A] border-[#1E5A91] text-white'
                : 'bg-[#0A0F16] border-emerald-500/30 text-emerald-400'
            }`}
            title={health.reason}
          >
            {health.status === 'CRITICAL' ? (
              <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            ) : health.status === 'AT_RISK' ? (
              <AlertTriangle className="h-3.5 w-3.5 text-slate-200" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            )}
            <span>{health.status === 'HEALTHY' ? 'ON TRACK' : health.status.replace('_', ' ')}</span>
            {projectSlip > 0 && <span className="font-mono text-[10px] text-red-300">(+{projectSlip}d)</span>}
          </div>

          {/* User Role Switcher */}
          <div className="flex items-center gap-1 bg-[#0A0F16] border border-[#1B2735] rounded-lg px-2 py-1 text-xs">
            <User className="h-3.5 w-3.5 text-[#2F80ED]" />
            <select
              value={currentUser ? currentUser.role : 'PROJECT_MANAGER'}
              onChange={(e) => setCurrentUserRole(e.target.value as StakeholderRole)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r} className="bg-[#0A0F16] text-white">
                  {formatRoleName(r)}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-1.5 rounded-lg bg-[#0A0F16] border border-[#1B2735] text-[#A7B0BC] hover:text-white transition-colors cursor-pointer"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#1E5A91] text-white text-[10px] font-bold border border-[#2F80ED] flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0A0F16] border border-[#1B2735] rounded-xl p-3 shadow-2xl z-50 text-xs">
                <div className="flex items-center justify-between border-b border-[#1B2735] pb-2 mb-2">
                  <span className="font-bold text-white">Notifications ({notifications.length})</span>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[10px] text-[#2F80ED] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-[#6F7B88] text-center py-2">No notifications.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2 rounded border ${
                          n.read ? 'bg-[#05070A]/50 border-[#1B2735]' : 'bg-[#0B1F3A] border-[#1E5A91]'
                        }`}
                      >
                        <h5 className="font-bold text-white">{n.title}</h5>
                        <p className="text-[11px] text-[#A7B0BC]">{n.message}</p>
                        <span className="text-[10px] text-[#6F7B88] font-mono mt-1 block">{n.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Demo Simulation Button */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E5A91] hover:bg-[#2F80ED] text-white text-xs font-bold transition-all shadow-sm border border-[#2F80ED]/40 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-current text-white" />
            <span className="hidden sm:inline">Simulate Change</span>
          </button>

          {/* Reset Scenario */}
          <button
            onClick={resetDemoScenario}
            className="p-1.5 rounded-lg bg-[#0A0F16] hover:bg-[#0B1F3A] text-[#A7B0BC] border border-[#1B2735] transition-colors cursor-pointer"
            title="Reset Demo Scenario baseline"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0A0F16] hover:bg-[#3A0B0E] text-[#A7B0BC] hover:text-red-300 border border-[#1B2735] hover:border-red-500/40 text-xs font-semibold transition-colors cursor-pointer"
            title="Sign out of project workspace"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 border-t border-[#1B2735] flex items-center gap-1 overflow-x-auto py-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#1E5A91] text-white border border-[#2F80ED] shadow-sm'
                : 'text-[#A7B0BC] hover:text-white hover:bg-[#0A0F16]'
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
