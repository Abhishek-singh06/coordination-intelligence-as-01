'use client';

import React from 'react';
import { useStore, ProjectSubTab } from '@/lib/store';
import { TaskManagementTable } from '@/components/TaskManagementTable';
import { StakeholderPanel } from '@/components/StakeholderPanel';
import { ApprovalCenterView } from '@/components/ApprovalCenterView';
import { ActionCenterView } from '@/components/ActionCenterView';
import { DependencyGraph } from '@/components/DependencyGraph';
import { Table, GitBranch, Users, CheckSquare } from 'lucide-react';

export const ProjectView: React.FC = () => {
  const { projectSubTab, setProjectSubTab } = useStore();

  const subTabs: { id: ProjectSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'tasks', label: 'Tasks', icon: <Table className="h-4 w-4" /> },
    { id: 'dependencies', label: 'Dependencies', icon: <GitBranch className="h-4 w-4" /> },
    { id: 'stakeholders', label: 'Stakeholders', icon: <Users className="h-4 w-4" /> },
    { id: 'approvals', label: 'Approvals & Actions', icon: <CheckSquare className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Sub Navigation Bar */}
      <div className="bg-[#0A0F16] border border-[#1B2735] rounded-2xl p-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {subTabs.map((st) => (
            <button
              key={st.id}
              onClick={() => setProjectSubTab(st.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                projectSubTab === st.id
                  ? 'bg-[#1E5A91] text-white border border-[#2F80ED]/40 shadow-md'
                  : 'text-[#A7B0BC] hover:text-white hover:bg-[#05070A]'
              }`}
            >
              {st.icon}
              <span>{st.label}</span>
            </button>
          ))}
        </div>
        <div className="text-[11px] font-mono text-[#6F7B88] px-3 hidden sm:block">
          PROJECT REGISTER • APEX RETAIL FIT-OUT
        </div>
      </div>

      {/* Sub Tab Content Views */}
      {projectSubTab === 'tasks' && <TaskManagementTable />}
      {projectSubTab === 'dependencies' && (
        <div className="space-y-6">
          <DependencyGraph />
        </div>
      )}
      {projectSubTab === 'stakeholders' && <StakeholderPanel />}
      {projectSubTab === 'approvals' && (
        <div className="space-y-6">
          <ApprovalCenterView />
          <ActionCenterView />
        </div>
      )}
    </div>
  );
};
