'use client';

import React, { useState } from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { CapabilitiesStrip } from '@/components/landing/CapabilitiesStrip';
import { ProblemImpactSection } from '@/components/landing/ProblemImpactSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { RealScenarioSection } from '@/components/landing/RealScenarioSection';
import { CommandCenterPreviewSection } from '@/components/landing/CommandCenterPreviewSection';
import { StakeholderNetworkSection } from '@/components/landing/StakeholderNetworkSection';
import { ProjectMemorySection } from '@/components/landing/ProjectMemorySection';
import { FinalCtaSection } from '@/components/landing/FinalCtaSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { DemoVideoModal } from '@/components/landing/DemoVideoModal';

// Existing Interactive Modals
import { ChangeSimulatorModal } from '@/components/ChangeSimulatorModal';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { NewProjectModal } from '@/components/NewProjectModal';
import { TaskDetailModal } from '@/components/TaskDetailModal';

export default function Home() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. NAVBAR */}
      <LandingNavbar onOpenSignIn={() => setIsDemoModalOpen(true)} />

      <main className="flex-1 w-full flex flex-col">
        {/* 2. HERO */}
        <HeroSection onWatchDemo={() => setIsDemoModalOpen(true)} />

        {/* 3. PRODUCT CAPABILITIES + PARTNER LOGOS */}
        <CapabilitiesStrip />

        {/* 4. PROBLEM / IMPACT SECTION */}
        <ProblemImpactSection />

        {/* 5. HOW IT WORKS */}
        <HowItWorksSection />

        {/* 6. REAL PROJECT SCENARIO */}
        <div id="real-scenario">
          <RealScenarioSection />
        </div>

        {/* 7. COMMAND CENTER PREVIEW */}
        <CommandCenterPreviewSection />

        {/* 8. STAKEHOLDER / ROLE SECTION */}
        <StakeholderNetworkSection />

        {/* 9. PROJECT MEMORY */}
        <ProjectMemorySection />

        {/* 10. FINAL CTA */}
        <FinalCtaSection onWatchDemo={() => setIsDemoModalOpen(true)} />
      </main>

      {/* 11. FOOTER */}
      <LandingFooter />

      {/* Interactive Global Modals */}
      <DemoVideoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
      <ChangeSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
      />
      <TaskDetailModal />
    </div>
  );
}
