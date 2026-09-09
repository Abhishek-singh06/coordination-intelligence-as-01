# Plan: Coordination Intelligence Complete UI/UX Redesign & Authentication System Fix

## Instructions for Ralph Loop

1. Locate the next task `[ ]` in order.
2. Execute the single task, test/verify, mark as `[x]`.
3. Stop or continue until complete.

## Tasks

- [ ] Task 1: Migrate color system in `tailwind.config.ts` and `app/globals.css` to Black (#05070A), Dark Blue (#0A0F16 / #0B1F3A / #123B66 / #1E5A91), Bright Blue (#2F80ED), and White (#FFFFFF). Purge all burgundy/olive/yellow palette occurrences codebase-wide.
- [ ] Task 2: Implement full authentication system in `lib/store.ts` (`isAuthenticated`, `login`, `logout`) and build dedicated Sign-In page in `app/login/page.tsx` with credentials validation, error handling, loading state, and demo login helper. Add route protection to `app/command-center/page.tsx`.
- [ ] Task 3: Redesign primary navigation (`components/Navbar.tsx` & `components/landing/LandingNavbar.tsx`) with dark blue theme, user profile badge, Sign Out button, and 4 primary tabs (Command Center, Changes, Project, Memory).
- [ ] Task 4: Redesign Command Center header and KPI banner (`components/ProjectHeader.tsx` & `components/KPIBanner.tsx`) showcasing Apex Retail Flagship Fit-Out, Floor 2, Project Status, and prominent `[ SIMULATE HVAC CHANGE ]` button.
- [ ] Task 5: Redesign `DependencyGraph.tsx`, `TaskNode.tsx`, and `TaskDetailModal.tsx` with dark blue graph styling, bright blue highlights, restrained red blocked states, and the interactive "WHY IS THIS AFFECTED?" causality inspector.
- [ ] Task 6: Redesign `CoordinationCenter.tsx`, `ApprovalCenterView.tsx`, `ActionCenterView.tsx`, and `StakeholderPanel.tsx` with Next Actions (`[ MARK COMPLETE ]`), Pending Approvals (`[ APPROVE ]` / `[ REJECT ]`), and Responsibility Matrix.
- [ ] Task 7: Redesign `ChangeManagementPanel.tsx` and `ProjectMemoryAudit.tsx` with dark blue enterprise tables and chronological event timeline.
- [ ] Task 8: Redesign Landing Page (`app/page.tsx` and all `components/landing/*` sections) matching the dark blue/black/white visual identity and real hero graph preview.
- [ ] Task 9: Execute full QA, verify zero hydration errors, and run production build (`npm run build`).
