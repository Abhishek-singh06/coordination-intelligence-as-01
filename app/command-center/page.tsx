'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { ProjectHeader } from '@/components/ProjectHeader';
import { KPIBanner } from '@/components/KPIBanner';
import { DependencyGraph } from '@/components/DependencyGraph';
import { CoordinationCenter } from '@/components/CoordinationCenter';
import { StakeholderPanel } from '@/components/StakeholderPanel';
import { ProjectMemoryAudit } from '@/components/ProjectMemoryAudit';
import { ChangeSimulatorModal } from '@/components/ChangeSimulatorModal';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { ChangeManagementPanel } from '@/components/ChangeManagementPanel';
import { ProjectView } from '@/components/ProjectView';
import { SettingsView } from '@/components/SettingsView';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { NewProjectModal } from '@/components/NewProjectModal';
import { ArrowLeft } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function CommandCenterPage() {
  const router = useRouter();
  const { activeTab, onboardingCompleted, isAuthenticated } = useStore();
  const [mounted, setMounted] = useState(false);

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-aec-bg flex items-center justify-center text-slate-400 text-xs">
        <span>Authenticating workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aec-bg flex flex-col font-sans text-slate-100 bg-grid-technical">
      {/* Top Banner with back-to-landing link */}
      <div className="bg-[#05080E] border-b border-aec-border/60 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Overview & Landing Page</span>
          </Link>
          <span className="text-slate-700">|</span>
          <span className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE COMMAND WORKSPACE • AS-01
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-400 text-[11px]">
          <span>AEC Coordination Intelligence Engine</span>
          <span className="font-mono text-slate-500">v1.0.4-prod</span>
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNewProjectModal={() => setIsNewProjectOpen(true)}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Project Header Banner */}
        <ProjectHeader />

        {/* Tab 1: Main Command Center Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <KPIBanner />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 flex flex-col">
                <DependencyGraph />
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <CoordinationCenter />
              </div>
            </div>
            <StakeholderPanel />
            <ProjectMemoryAudit />
          </div>
        )}

        {/* Tab 2: Change Management Register & Simulator */}
        {activeTab === 'changes' && (
          <div className="animate-in fade-in duration-200">
            <ChangeManagementPanel />
          </div>
        )}

        {/* Tab 3: Consolidated Project View (Tasks, Dependencies, Stakeholders, Approvals) */}
        {activeTab === 'project' && <ProjectView />}

        {/* Tab 4: Project Memory & Audit Trail */}
        {activeTab === 'memory' && (
          <div className="animate-in fade-in duration-200">
            <ProjectMemoryAudit />
          </div>
        )}

        {/* Tab 5: Settings */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-200">
            <SettingsView />
          </div>
        )}
      </main>

      {/* Global Modals */}
      {mounted && !onboardingCompleted && <OnboardingModal />}
      <ChangeSimulatorModal isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NewProjectModal isOpen={isNewProjectOpen} onClose={() => setIsNewProjectOpen(false)} />
      <TaskDetailModal />
    </div>
  );
}
