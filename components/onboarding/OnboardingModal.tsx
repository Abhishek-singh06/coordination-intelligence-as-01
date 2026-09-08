'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { StakeholderRole, ProjectType, UserProfile, Project, Stakeholder, TaskNode, DependencyEdge } from '@/lib/types';
import { DEMO_PROJECT, INITIAL_STAKEHOLDERS, INITIAL_TASKS, INITIAL_DEPENDENCIES } from '@/lib/initialData';
import { validateAcyclicGraph } from '@/lib/graphEngine';
import { formatRoleName } from '@/lib/utils';
import { Activity, ArrowRight, CheckCircle2, Plus, Trash2, Shield, User, Building, MapPin, Calendar, Layers } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { onboardingCompleted, completeOnboarding } = useStore();

  const [step, setStep] = useState(1);
  const [isDemoChosen, setIsDemoChosen] = useState(false);

  // Step 2 state: User Profile
  const [userName, setUserName] = useState('');
  const [userOrg, setUserOrg] = useState('');
  const [userRole, setUserRole] = useState<StakeholderRole>('PROJECT_MANAGER');
  const [userEmail, setUserEmail] = useState('');
  const [profileError, setProfileError] = useState('');

  // Step 3 state: Project Details (if custom)
  const [projName, setProjName] = useState('');
  const [projType, setProjType] = useState<ProjectType>('Commercial Office');
  const [location, setLocation] = useState('Central Business District');
  const [floors, setFloors] = useState(5);
  const [startDate, setStartDate] = useState('2026-09-01');
  const [completionDate, setCompletionDate] = useState('2026-12-31');
  const [projError, setProjError] = useState('');

  // Step 4 state: Stakeholders (if custom)
  const [stakeholdersList, setStakeholdersList] = useState<Omit<Stakeholder, 'id'>[]>([]);
  const [stkName, setStkName] = useState('');
  const [stkOrg, setStkOrg] = useState('');
  const [stkRole, setStkRole] = useState<StakeholderRole>('LEAD_ARCHITECT');
  const [stkEmail, setStkEmail] = useState('');

  // Step 5 state: Tasks & Dependencies (if custom)
  const [customTasks, setCustomTasks] = useState<Omit<TaskNode, 'id'>[]>([]);
  const [customDeps, setCustomDeps] = useState<Omit<DependencyEdge, 'id'>[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskOwner, setTaskOwner] = useState<StakeholderRole>('GENERAL_CONTRACTOR');
  const [taskDuration, setTaskDuration] = useState(7);
  const [depSource, setDepSource] = useState('');
  const [depTarget, setDepTarget] = useState('');
  const [graphError, setGraphError] = useState('');

  if (onboardingCompleted) return null;

  // Handle Demo Mode quick select
  const handleExploreDemo = () => {
    const demoUser: UserProfile = {
      id: 'usr-demo',
      name: 'Elena Rostova',
      organization: 'Prime PMO',
      role: 'PROJECT_MANAGER',
      email: 'elena@primepmo.com',
    };
    completeOnboarding(demoUser, DEMO_PROJECT, INITIAL_STAKEHOLDERS, INITIAL_TASKS, INITIAL_DEPENDENCIES);
  };

  // Step 2 submission
  const handleNextProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userOrg.trim() || !userEmail.trim()) {
      setProfileError('Please fill out all required profile fields.');
      return;
    }
    setProfileError('');
    setStep(3);
  };

  // Step 3 submission
  const handleNextProject = (choice: 'demo' | 'custom') => {
    if (choice === 'demo') {
      setIsDemoChosen(true);
      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        name: userName,
        organization: userOrg,
        role: userRole,
        email: userEmail,
      };
      completeOnboarding(user, DEMO_PROJECT, INITIAL_STAKEHOLDERS, INITIAL_TASKS, INITIAL_DEPENDENCIES);
    } else {
      if (!projName.trim()) {
        setProjError('Project Name is required.');
        return;
      }
      setIsDemoChosen(false);
      setStep(4);
    }
  };

  // Add custom stakeholder
  const handleAddStakeholder = () => {
    if (!stkName.trim() || !stkOrg.trim() || !stkEmail.trim()) return;
    setStakeholdersList((prev) => [
      ...prev,
      {
        name: stkName,
        organization: stkOrg,
        role: stkRole,
        email: stkEmail,
        avatar: stkName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      },
    ]);
    setStkName('');
    setStkOrg('');
    setStkEmail('');
  };

  const handleRemoveStakeholder = (idx: number) => {
    setStakeholdersList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Add custom task
  const handleAddTask = () => {
    if (!taskTitle.trim()) return;
    const newTask: Omit<TaskNode, 'id'> = {
      title: taskTitle,
      ownerRole: taskOwner,
      status: 'NOT_STARTED',
      plannedDays: taskDuration,
      slackDays: 1,
      gridCol: customTasks.length + 1,
      gridRow: 1,
      description: `${taskTitle} activity for ${projName}`,
    };
    setCustomTasks((prev) => [...prev, newTask]);
    setTaskTitle('');
  };

  // Add custom dependency with DAG validation
  const handleAddDependency = () => {
    if (!depSource || !depTarget || depSource === depTarget) {
      setGraphError('Source and Target tasks must be different.');
      return;
    }

    const dummyTasks: TaskNode[] = customTasks.map((t, i) => ({ ...t, id: `T${i + 1}` }));
    const candidateDeps: DependencyEdge[] = [
      ...customDeps.map((d, i) => ({ ...d, id: `dep-${i}` })),
      { id: 'candidate', source: depSource, target: depTarget, type: 'FINISH_TO_START' },
    ];

    if (!validateAcyclicGraph(dummyTasks, candidateDeps)) {
      setGraphError('Circular dependency detected! Graphs must be acyclic (A → B → C → A is invalid).');
      return;
    }

    setGraphError('');
    setCustomDeps((prev) => [...prev, { source: depSource, target: depTarget, type: 'FINISH_TO_START' }]);
    setDepSource('');
    setDepTarget('');
  };

  // Step 5 Finish Custom Setup
  const handleFinishCustomOnboarding = () => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: userName,
      organization: userOrg,
      role: userRole,
      email: userEmail,
    };

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projName,
      type: projType,
      location,
      floors,
      startDate,
      targetCompletionDate: completionDate,
      isDemo: false,
    };

    const formattedStakeholders: Stakeholder[] = [
      {
        id: `stk-user`,
        name: userName,
        organization: userOrg,
        role: userRole,
        email: userEmail,
        avatar: userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      },
      ...stakeholdersList.map((s, idx) => ({ ...s, id: `stk-cust-${idx}` })),
    ];

    const formattedTasks: TaskNode[] = customTasks.map((t, idx) => ({ ...t, id: `T${idx + 1}` }));
    const formattedDeps: DependencyEdge[] = customDeps.map((d, idx) => ({ ...d, id: `dep-${idx}` }));

    setStep(6);

    setTimeout(() => {
      completeOnboarding(user, newProject, formattedStakeholders, formattedTasks, formattedDeps);
    }, 1500);
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

  const projTypeOptions: ProjectType[] = [
    'Retail Fit-Out',
    'Commercial Office',
    'Residential',
    'Hospitality',
    'Healthcare',
    'Industrial',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-aec-card border border-aec-border rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 overflow-y-auto max-h-[90vh]">
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-aec-border">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-aec-burgundy/40 border border-aec-rose/40 flex items-center justify-center text-slate-100 font-bold">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Coordination Intelligence</h2>
              <p className="text-xs text-aec-muted">Workspace Onboarding Wizard</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-100 bg-aec-burgundy/30 px-3 py-1 rounded-full border border-aec-rose/30">
            Step {step} of 6
          </span>
        </div>

        {/* STEP 1 — WELCOME */}
        {step === 1 && (
          <div className="space-y-6 text-center py-4">
            <div className="h-16 w-16 bg-aec-burgundy/30 border border-aec-rose/40 rounded-2xl flex items-center justify-center mx-auto text-slate-100 shadow-inner">
              <Activity className="h-8 w-8" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight mb-2">
                Turn project changes into coordinated action.
              </h1>
              <p className="text-xs text-aec-muted max-w-md mx-auto leading-relaxed">
                Coordination Intelligence (AS-01) models complex AEC activities as a Directed Acyclic Graph (DAG), calculates schedule blast radius, identifies blocked activities, and coordinates sign-off approvals across stakeholders.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setStep(2)}
                className="w-full sm:w-auto px-6 py-3 bg-aec-burgundy hover:bg-aec-rose text-slate-100 text-xs font-bold rounded-xl shadow-lg border border-aec-rose/40 transition-all flex items-center justify-center gap-2 focus:outline-none"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleExploreDemo}
                className="w-full sm:w-auto px-6 py-3 bg-aec-bg hover:bg-slate-800 text-slate-300 border border-aec-border text-xs font-bold rounded-xl transition-colors"
              >
                Explore Demo Project (Apex Fit-Out)
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — USER PROFILE */}
        {step === 2 && (
          <form onSubmit={handleNextProfile} className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">Create User Profile</h3>
              <p className="text-xs text-aec-muted">Specify your role and organization context.</p>
            </div>

            {profileError && (
              <div className="p-3 rounded-lg bg-aec-darkRed/40 border border-aec-darkRed text-rose-300 text-xs font-medium">
                {profileError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="h-4 w-4 absolute left-3 top-2.5 text-aec-muted" />
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full bg-aec-bg border border-aec-border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Organization *</label>
                <div className="relative">
                  <Building className="h-4 w-4 absolute left-3 top-2.5 text-aec-muted" />
                  <input
                    type="text"
                    required
                    value={userOrg}
                    onChange={(e) => setUserOrg(e.target.value)}
                    placeholder="e.g. Studio Forma"
                    className="w-full bg-aec-bg border border-aec-border rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Role *</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as StakeholderRole)}
                  className="w-full bg-aec-bg border border-aec-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {formatRoleName(r)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. marcus@forma.com"
                  className="w-full bg-aec-bg border border-aec-border rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-aec-rose"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-aec-border">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-aec-bg text-slate-400 hover:text-slate-200 border border-aec-border text-xs font-medium rounded-lg"
              >
                Back
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-aec-burgundy hover:bg-aec-rose text-slate-100 text-xs font-bold rounded-lg border border-aec-rose/30 transition-colors"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 — CREATE OR SELECT PROJECT */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">Project Setup Option</h3>
              <p className="text-xs text-aec-muted">Choose between pre-configured demo project or create a new workspace.</p>
            </div>

            {projError && (
              <div className="p-3 rounded-lg bg-aec-darkRed/40 border border-aec-darkRed text-rose-300 text-xs font-medium">
                {projError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => handleNextProject('demo')}
                className="border border-aec-rose/40 bg-aec-burgundy/20 hover:bg-aec-burgundy/30 p-4 rounded-xl cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-100 uppercase tracking-wider bg-aec-burgundy/40 px-2 py-0.5 rounded border border-aec-rose/30">
                    Recommended Hackathon Demo
                  </span>
                  <h4 className="text-sm font-bold text-slate-100 mt-2 mb-1">
                    Apex Retail Flagship Fit-Out
                  </h4>
                  <p className="text-xs text-aec-muted">
                    Preloaded 7-task DAG schedule, 7 stakeholders, and chiller relocation scenario (+6 days shift).
                  </p>
                </div>
                <div className="mt-4 text-xs font-bold text-slate-100 flex items-center gap-1">
                  <span>Load Demo Project</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="border border-slate-700 bg-slate-900/40 p-4 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  Custom Project
                </span>
                <h4 className="text-sm font-bold text-slate-100">Create New AEC Project</h4>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    placeholder="e.g. Orion Business Center"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Type</label>
                    <select
                      value={projType}
                      onChange={(e) => setProjType(e.target.value as ProjectType)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
                    >
                      {projTypeOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Floors</label>
                    <input
                      type="number"
                      min="1"
                      value={floors}
                      onChange={(e) => setFloors(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleNextProject('custom')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded border border-slate-700 transition-colors"
                >
                  Configure Custom Tasks & Stakeholders →
                </button>
              </div>
            </div>

            <div className="flex items-center justify-start pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — CUSTOM STAKEHOLDERS */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">Project Stakeholders</h3>
              <p className="text-xs text-slate-400">Add project team members, vendors, and inspectors.</p>
            </div>

            {/* Added stakeholders pill list */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Configured Stakeholders ({stakeholdersList.length + 1})
              </label>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-blue-600/20 border border-blue-500/40 text-blue-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-semibold">
                  <Shield className="h-3 w-3 text-blue-400" />
                  {userName} ({formatRoleName(userRole)}) - You
                </span>
                {stakeholdersList.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-full flex items-center gap-1.5"
                  >
                    <span>{s.name} ({formatRoleName(s.role)})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStakeholder(idx)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add Stakeholder Form */}
            <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Add Team Member
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Name (e.g. Marcus Vance)"
                  value={stkName}
                  onChange={(e) => setStkName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                />
                <input
                  type="text"
                  placeholder="Organization (e.g. Studio Forma)"
                  value={stkOrg}
                  onChange={(e) => setStkOrg(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={stkRole}
                  onChange={(e) => setStkRole(e.target.value as StakeholderRole)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {formatRoleName(r)}
                    </option>
                  ))}
                </select>
                <input
                  type="email"
                  placeholder="Email"
                  value={stkEmail}
                  onChange={(e) => setStkEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>

              <button
                type="button"
                onClick={handleAddStakeholder}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Stakeholder</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-aec-border">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg"
              >
                Continue to Task Graph →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5 — CUSTOM TASKS & DEPENDENCIES */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">Tasks & Dependency Graph</h3>
              <p className="text-xs text-slate-400">Build the initial DAG schedule and verify acyclic logic.</p>
            </div>

            {graphError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {graphError}
              </div>
            )}

            {/* Task Creation Box */}
            <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Add Task Activity ({customTasks.length} Created)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Task Title (e.g. Structural Framing)"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 sm:col-span-2"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Planned Days"
                  value={taskDuration}
                  onChange={(e) => setTaskDuration(parseInt(e.target.value) || 1)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <select
                  value={taskOwner}
                  onChange={(e) => setTaskOwner(e.target.value as StakeholderRole)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 flex-1"
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      Owner: {formatRoleName(r)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Task</span>
                </button>
              </div>

              {customTasks.length > 0 && (
                <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-2">
                  {customTasks.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono"
                    >
                      T{idx + 1}: {t.title} ({t.plannedDays}d)
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Dependency Connector Box */}
            {customTasks.length >= 2 && (
              <div className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Connect Dependencies (DAG Link)
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={depSource}
                    onChange={(e) => setDepSource(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200 flex-1"
                  >
                    <option value="">Predecessor Task...</option>
                    {customTasks.map((t, i) => (
                      <option key={i} value={`T${i + 1}`}>
                        T{i + 1}: {t.title}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-500 font-bold">→</span>
                  <select
                    value={depTarget}
                    onChange={(e) => setDepTarget(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200 flex-1"
                  >
                    <option value="">Successor Task...</option>
                    {customTasks.map((t, i) => (
                      <option key={i} value={`T${i + 1}`}>
                        T{i + 1}: {t.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddDependency}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded"
                  >
                    Link
                  </button>
                </div>

                {customDeps.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {customDeps.map((d, i) => (
                      <span key={i} className="text-xs bg-blue-950/40 border border-blue-500/30 text-blue-300 px-2 py-0.5 rounded font-mono">
                        {d.source} → {d.target}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-aec-border">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-4 py-2 bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium rounded-lg"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleFinishCustomOnboarding}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md"
              >
                Complete Workspace Setup →
              </button>
            </div>
          </div>
        )}

        {/* STEP 6 — ONBOARDING COMPLETE */}
        {step === 6 && (
          <div className="space-y-6 text-center py-6">
            <div className="h-16 w-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-100 mb-1">
                Your coordination workspace is ready.
              </h2>
              <p className="text-xs text-slate-400">
                Setup completed successfully. Redirecting to project command center...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
