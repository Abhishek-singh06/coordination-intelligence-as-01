import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  TaskNode,
  Stakeholder,
  DependencyEdge,
  ActionItem,
  AuditLogEntry,
  ChangeEvent,
  StakeholderRole,
  Project,
  UserProfile,
  ChangeRequest,
  NotificationItem,
  ProjectHealthStatus,
  DependencyType,
} from './types';
import {
  DEMO_PROJECT,
  INITIAL_TASKS,
  INITIAL_STAKEHOLDERS,
  INITIAL_DEPENDENCIES,
  INITIAL_AUDIT_LOGS,
} from './initialData';
import { generateBelievableProject } from './dataGenerator';
import { computeBlastRadius, validateAcyclicGraph } from './graphEngine';

export type AppTab =
  | 'dashboard'
  | 'changes'
  | 'project'
  | 'memory'
  | 'settings';

export type ProjectSubTab = 'tasks' | 'dependencies' | 'stakeholders' | 'approvals';

interface AppState {
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  currentUser: UserProfile | null;
  projects: Project[];
  currentProjectId: string;

  // Project-keyed data maps
  tasks: Record<string, TaskNode[]>;
  stakeholders: Record<string, Stakeholder[]>;
  dependencies: Record<string, DependencyEdge[]>;
  actionItems: Record<string, ActionItem[]>;
  changeRequests: Record<string, ChangeRequest[]>;
  auditLogs: Record<string, AuditLogEntry[]>;
  currentChanges: Record<string, ChangeEvent | null>;
  projectSlips: Record<string, number>;

  // Global UI state
  notifications: NotificationItem[];
  selectedTaskId: string | null;
  selectedChangeId: string | null;
  activeTab: AppTab;
  projectSubTab: ProjectSubTab;
  theme: 'dark' | 'light';

  // Getters for current active project
  getCurrentProject: () => Project | undefined;
  getCurrentTasks: () => TaskNode[];
  getCurrentStakeholders: () => Stakeholder[];
  getCurrentDependencies: () => DependencyEdge[];
  getCurrentActionItems: () => ActionItem[];
  getCurrentChangeRequests: () => ChangeRequest[];
  getCurrentAuditLogs: () => AuditLogEntry[];
  getCurrentProjectSlip: () => number;
  getProjectHealth: () => { status: ProjectHealthStatus; reason: string };

  // Actions
  completeOnboarding: (
    user: UserProfile,
    project: Project,
    stakeholders: Stakeholder[],
    tasks?: TaskNode[],
    dependencies?: DependencyEdge[]
  ) => void;
  switchProject: (projectId: string) => void;
  createProject: (
    projectData: Omit<Project, 'id'>,
    stakeholders: Omit<Stakeholder, 'id'>[],
    tasks: Omit<TaskNode, 'id'>[],
    dependencies: Omit<DependencyEdge, 'id'>[]
  ) => string;

  // Auth Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  setCurrentUserRole: (role: StakeholderRole) => void;
  setActiveTab: (tab: AppTab) => void;
  setProjectSubTab: (subTab: ProjectSubTab) => void;
  setTheme: (theme: 'dark' | 'light') => void;

  setSelectedTaskId: (taskId: string | null) => void;
  setSelectedChangeId: (changeId: string | null) => void;

  // Task & Dependency Management
  createTask: (task: Omit<TaskNode, 'id'>) => void;
  updateTask: (task: TaskNode) => void;
  deleteTask: (taskId: string) => void;
  addDependency: (source: string, target: string, type?: DependencyType) => boolean;
  removeDependency: (dependencyId: string) => void;

  // Change Management & Simulation
  injectChangeEvent: (
    targetTaskId: string,
    delayDays: number,
    reason: string,
    initiatorRole: StakeholderRole
  ) => void;

  createChangeRequest: (change: Omit<ChangeRequest, 'id' | 'createdAt' | 'status'>) => void;
  analyzeChangeRequest: (changeId: string) => void;
  approveChangeRequest: (changeId: string) => void;
  rejectChangeRequest: (changeId: string) => void;

  // Approval & Action Resolution
  resolveAction: (actionId: string) => void;
  rejectAction: (actionId: string) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Resets
  resetDemoScenario: () => void;
  resetWorkspace: () => void;
}

// Pre-generated secondary project for immediate multi-project testing
const secondaryProj = generateBelievableProject(
  'Orion Business Center',
  'Commercial Office',
  'Tower 3, Central Business District',
  12,
  '2026-09-01'
);

const DEFAULT_PROJECTS = [DEMO_PROJECT, secondaryProj.project];

const DEFAULT_TASKS_MAP = {
  [DEMO_PROJECT.id]: INITIAL_TASKS,
  [secondaryProj.project.id]: secondaryProj.tasks,
};

const DEFAULT_STAKEHOLDERS_MAP = {
  [DEMO_PROJECT.id]: INITIAL_STAKEHOLDERS,
  [secondaryProj.project.id]: secondaryProj.stakeholders,
};

const DEFAULT_DEPENDENCIES_MAP = {
  [DEMO_PROJECT.id]: INITIAL_DEPENDENCIES,
  [secondaryProj.project.id]: secondaryProj.dependencies,
};

const DEFAULT_AUDIT_MAP = {
  [DEMO_PROJECT.id]: INITIAL_AUDIT_LOGS,
  [secondaryProj.project.id]: [
    {
      id: 'audit-orion-001',
      timestamp: '09:00:00',
      actor: 'System Admin',
      role: 'SYSTEM' as const,
      action: 'Project Baseline Initialized',
      severity: 'INFO' as const,
      details: 'Orion Business Center baseline schedule loaded.',
    },
  ],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: true,
      onboardingCompleted: false,
      currentUser: {
        id: 'usr-1',
        name: 'Elena Rostova',
        organization: 'Prime PMO',
        role: 'PROJECT_MANAGER',
        email: 'elena@primepmo.com',
      },
      projects: DEFAULT_PROJECTS,
      currentProjectId: DEMO_PROJECT.id,

      tasks: DEFAULT_TASKS_MAP,
      stakeholders: DEFAULT_STAKEHOLDERS_MAP,
      dependencies: DEFAULT_DEPENDENCIES_MAP,
      actionItems: { [DEMO_PROJECT.id]: [], [secondaryProj.project.id]: [] },
      changeRequests: { [DEMO_PROJECT.id]: [], [secondaryProj.project.id]: [] },
      auditLogs: DEFAULT_AUDIT_MAP,
      currentChanges: { [DEMO_PROJECT.id]: null, [secondaryProj.project.id]: null },
      projectSlips: { [DEMO_PROJECT.id]: 0, [secondaryProj.project.id]: 0 },

      notifications: [
        {
          id: 'notif-1',
          title: 'System Initialized',
          message: 'Welcome to AEC Coordination Intelligence Command Center.',
          timestamp: '09:00:00',
          read: false,
          type: 'ALERT',
        },
      ],
      selectedTaskId: null,
      selectedChangeId: null,
      activeTab: 'dashboard',
      projectSubTab: 'tasks',
      theme: 'dark',

      // Getters
      getCurrentProject: () => {
        const { projects, currentProjectId } = get();
        return projects.find((p) => p.id === currentProjectId) || projects[0];
      },
      getCurrentTasks: () => get().tasks[get().currentProjectId] || [],
      getCurrentStakeholders: () => get().stakeholders[get().currentProjectId] || [],
      getCurrentDependencies: () => get().dependencies[get().currentProjectId] || [],
      getCurrentActionItems: () => get().actionItems[get().currentProjectId] || [],
      getCurrentChangeRequests: () => get().changeRequests[get().currentProjectId] || [],
      getCurrentAuditLogs: () => get().auditLogs[get().currentProjectId] || [],
      getCurrentProjectSlip: () => get().projectSlips[get().currentProjectId] || 0,

      getProjectHealth: () => {
        const tasks = get().getCurrentTasks();
        const slip = get().getCurrentProjectSlip();
        const actions = get().getCurrentActionItems();
        const pendingApprovals = actions.filter((a) => a.isApprovalGate && a.status === 'PENDING').length;
        const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED').length;

        if (blockedTasks >= 3 || slip >= 5 || pendingApprovals >= 3) {
          return {
            status: 'CRITICAL',
            reason: `${blockedTasks} activities blocked, +${slip}d schedule variance, ${pendingApprovals} critical sign-offs pending.`,
          };
        } else if (blockedTasks > 0 || slip > 0 || pendingApprovals > 0) {
          return {
            status: 'AT_RISK',
            reason: `${blockedTasks} activity blocked downstream, +${slip}d schedule slip calculated.`,
          };
        }
        return {
          status: 'HEALTHY',
          reason: 'All project dependencies and milestones are on schedule. No blockers.',
        };
      },

      // Onboarding & Project Actions
      completeOnboarding: (user, project, stakeholdersList, userTasks, userDeps) => {
        const pid = project.id;
        const projTasks = userTasks && userTasks.length > 0 ? userTasks : INITIAL_TASKS;
        const projDeps = userDeps && userDeps.length > 0 ? userDeps : INITIAL_DEPENDENCIES;

        set((state) => ({
          onboardingCompleted: true,
          currentUser: user,
          projects: state.projects.some((p) => p.id === pid)
            ? state.projects
            : [...state.projects, project],
          currentProjectId: pid,
          tasks: { ...state.tasks, [pid]: projTasks },
          stakeholders: { ...state.stakeholders, [pid]: stakeholdersList },
          dependencies: { ...state.dependencies, [pid]: projDeps },
          actionItems: { ...state.actionItems, [pid]: [] },
          changeRequests: { ...state.changeRequests, [pid]: [] },
          auditLogs: {
            ...state.auditLogs,
            [pid]: [
              {
                id: `audit-onboard-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                actor: user.name,
                role: user.role,
                action: `Workspace Onboarding Completed: ${project.name}`,
                severity: 'INFO',
                details: `User profile ${user.name} (${user.role}) initialized project ${project.name}.`,
              },
              ...(state.auditLogs[pid] || INITIAL_AUDIT_LOGS),
            ],
          },
        }));
      },

      switchProject: (projectId) => set({ currentProjectId: projectId, selectedTaskId: null, selectedChangeId: null }),

      createProject: (projectData, initialStakeholders, initialTasksData, initialDepsData) => {
        const pid = `proj-${Date.now()}`;
        const newProj: Project = { ...projectData, id: pid };

        const newStakeholders: Stakeholder[] = initialStakeholders.map((s, idx) => ({
          ...s,
          id: `stk-${pid}-${idx}`,
          avatar: s.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
        }));

        const newTasks: TaskNode[] = initialTasksData.map((t, idx) => ({
          ...t,
          id: `T${idx + 1}`,
        }));

        const newDeps: DependencyEdge[] = initialDepsData.map((d, idx) => ({
          ...d,
          id: `dep-${pid}-${idx}`,
        }));

        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

        set((state) => ({
          projects: [...state.projects, newProj],
          currentProjectId: pid,
          tasks: { ...state.tasks, [pid]: newTasks },
          stakeholders: { ...state.stakeholders, [pid]: newStakeholders },
          dependencies: { ...state.dependencies, [pid]: newDeps },
          actionItems: { ...state.actionItems, [pid]: [] },
          changeRequests: { ...state.changeRequests, [pid]: [] },
          auditLogs: {
            ...state.auditLogs,
            [pid]: [
              {
                id: `audit-${Date.now()}`,
                timestamp: nowStr,
                actor: state.currentUser ? state.currentUser.name : 'System User',
                role: state.currentUser ? state.currentUser.role : 'PROJECT_MANAGER',
                action: `NEW PROJECT CREATED: ${newProj.name}`,
                severity: 'INFO',
                details: `Project type: ${newProj.type}, Location: ${newProj.location}. Loaded ${newTasks.length} tasks and ${newStakeholders.length} stakeholders.`,
              },
            ],
          },
          projectSlips: { ...state.projectSlips, [pid]: 0 },
        }));

        return pid;
      },

      login: async (email, password) => {
        await new Promise((res) => setTimeout(res, 600));

        const trimmedEmail = email.trim().toLowerCase();
        if (!trimmedEmail || !trimmedEmail.includes('@')) {
          return { success: false, error: 'Please enter a valid email address.' };
        }
        if (!password || password.length < 3) {
          return { success: false, error: 'Password must be at least 3 characters long.' };
        }

        const currentStakeholders = get().getCurrentStakeholders();
        const matchedStakeholder = currentStakeholders.find(
          (s) => s.email.toLowerCase() === trimmedEmail
        );

        const userProfile: UserProfile = matchedStakeholder
          ? {
              id: matchedStakeholder.id,
              name: matchedStakeholder.name,
              organization: matchedStakeholder.organization,
              role: matchedStakeholder.role,
              email: matchedStakeholder.email,
            }
          : {
              id: `usr-1`,
              name: 'Elena Rostova',
              organization: 'Prime PMO',
              role: 'PROJECT_MANAGER',
              email: trimmedEmail,
            };

        set({
          isAuthenticated: true,
          currentUser: userProfile,
        });

        return { success: true };
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
        });
      },

      setCurrentUserRole: (role) => {
        set((state) => (state.currentUser ? { currentUser: { ...state.currentUser, role } } : {}));
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      setProjectSubTab: (subTab) => set({ projectSubTab: subTab }),
      setTheme: (theme) => set({ theme }),

      setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
      setSelectedChangeId: (changeId) => set({ selectedChangeId: changeId }),

      // Task & Dependency Operations
      createTask: (taskData) => {
        const { currentProjectId, tasks, auditLogs, currentUser } = get();
        const projTasks = tasks[currentProjectId] || [];
        const newTaskId = `T${projTasks.length + 1}`;
        const newTask: TaskNode = { ...taskData, id: newTaskId };

        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser ? currentUser.name : 'User',
          role: currentUser ? currentUser.role : 'PROJECT_MANAGER',
          action: `TASK CREATED: ${newTask.id} - ${newTask.title}`,
          severity: 'INFO',
          details: `Duration: ${newTask.plannedDays}d, Owner: ${newTask.ownerRole}.`,
        };

        set((state) => ({
          tasks: { ...state.tasks, [currentProjectId]: [...projTasks, newTask] },
          auditLogs: {
            ...state.auditLogs,
            [currentProjectId]: [auditEntry, ...(state.auditLogs[currentProjectId] || [])],
          },
        }));
      },

      updateTask: (updatedTask) => {
        const { currentProjectId, tasks, auditLogs, currentUser } = get();
        const projTasks = tasks[currentProjectId] || [];
        const nextTasks = projTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));

        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser ? currentUser.name : 'User',
          role: currentUser ? currentUser.role : 'PROJECT_MANAGER',
          action: `TASK UPDATED: ${updatedTask.id} - ${updatedTask.title}`,
          severity: 'INFO',
          details: `Status: ${updatedTask.status}, Duration: ${updatedTask.plannedDays}d.`,
        };

        set((state) => ({
          tasks: { ...state.tasks, [currentProjectId]: nextTasks },
          auditLogs: {
            ...state.auditLogs,
            [currentProjectId]: [auditEntry, ...(state.auditLogs[currentProjectId] || [])],
          },
        }));
      },

      deleteTask: (taskId) => {
        const { currentProjectId, tasks, dependencies, auditLogs, currentUser } = get();
        const projTasks = (tasks[currentProjectId] || []).filter((t) => t.id !== taskId);
        const projDeps = (dependencies[currentProjectId] || []).filter(
          (d) => d.source !== taskId && d.target !== taskId
        );

        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser ? currentUser.name : 'User',
          role: currentUser ? currentUser.role : 'PROJECT_MANAGER',
          action: `TASK DELETED: ${taskId}`,
          severity: 'WARNING',
          details: `Removed task ${taskId} and all associated dependency links.`,
        };

        set((state) => ({
          tasks: { ...state.tasks, [currentProjectId]: projTasks },
          dependencies: { ...state.dependencies, [currentProjectId]: projDeps },
          auditLogs: {
            ...state.auditLogs,
            [currentProjectId]: [auditEntry, ...(state.auditLogs[currentProjectId] || [])],
          },
        }));
      },

      addDependency: (source, target, type = 'FINISH_TO_START') => {
        const { currentProjectId, tasks, dependencies, auditLogs, currentUser } = get();
        const projTasks = tasks[currentProjectId] || [];
        const projDeps = dependencies[currentProjectId] || [];

        const candidateEdge: DependencyEdge = {
          id: `dep-${Date.now()}`,
          source,
          target,
          type,
        };

        const testDeps = [...projDeps, candidateEdge];
        if (!validateAcyclicGraph(projTasks, testDeps)) {
          return false; // Prevent circular dependency cycle
        }

        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser ? currentUser.name : 'User',
          role: currentUser ? currentUser.role : 'PROJECT_MANAGER',
          action: `DEPENDENCY CREATED: ${source} → ${target}`,
          severity: 'INFO',
          details: `Link type: ${type}. Acyclic DAG structure verified.`,
        };

        set((state) => ({
          dependencies: { ...state.dependencies, [currentProjectId]: testDeps },
          auditLogs: {
            ...state.auditLogs,
            [currentProjectId]: [auditEntry, ...(state.auditLogs[currentProjectId] || [])],
          },
        }));

        return true;
      },

      removeDependency: (depId) => {
        const { currentProjectId, dependencies, auditLogs, currentUser } = get();
        const projDeps = (dependencies[currentProjectId] || []).filter((d) => d.id !== depId);

        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser ? currentUser.name : 'User',
          role: currentUser ? currentUser.role : 'PROJECT_MANAGER',
          action: `DEPENDENCY REMOVED: ${depId}`,
          severity: 'INFO',
          details: `Dependency link ${depId} removed from graph.`,
        };

        set((state) => ({
          dependencies: { ...state.dependencies, [currentProjectId]: projDeps },
          auditLogs: {
            ...state.auditLogs,
            [currentProjectId]: [auditEntry, ...(state.auditLogs[currentProjectId] || [])],
          },
        }));
      },

      // Simulation & Blast Radius Engine Execution
      injectChangeEvent: (targetTaskId, delayDays, reason, initiatorRole) => {
        const pid = get().currentProjectId;
        const tasks = get().getCurrentTasks();
        const dependencies = get().getCurrentDependencies();
        const auditLogs = get().getCurrentAuditLogs();

        const changeEvent: ChangeEvent = {
          id: `change-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          initiatorRole,
          targetTaskId,
          delayDays,
          reason,
        };

        const impact = computeBlastRadius(targetTaskId, delayDays, initiatorRole, tasks, dependencies);
        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const targetTask = tasks.find((t) => t.id === targetTaskId);
        const targetTitle = targetTask ? targetTask.title : targetTaskId;

        const updatedTasks: TaskNode[] = tasks.map((t) => {
          if (impact.blockedTaskIds.includes(t.id)) {
            return {
              ...t,
              status: 'BLOCKED',
              blockedReason: `Blocked downstream of +${delayDays}d shift in ${targetTitle}`,
            };
          }
          return t;
        });

        const newActions: ActionItem[] = impact.generatedActionItems.map((item, idx) => ({
          ...item,
          id: `act-${Date.now()}-${idx}`,
          createdAt: nowStr,
        }));

        const newNotifs: NotificationItem[] = [
          {
            id: `notif-${Date.now()}-1`,
            title: 'Coordination Alert: Schedule Shift Injected',
            message: `Task [${targetTaskId}] shifted by +${delayDays}d. ${impact.blockedTaskIds.length} downstream activities blocked.`,
            timestamp: nowStr,
            read: false,
            type: 'ALERT',
          },
          {
            id: `notif-${Date.now()}-2`,
            title: 'Approval Gates Generated',
            message: `${newActions.filter((a) => a.isApprovalGate).length} sign-offs required to resolve path variance.`,
            timestamp: nowStr,
            read: false,
            type: 'APPROVAL',
          },
        ];

        const newAuditEntries: AuditLogEntry[] = [
          {
            id: `audit-${Date.now()}-1`,
            timestamp: nowStr,
            actor: initiatorRole.replace(/_/g, ' '),
            role: initiatorRole,
            action: `CHANGE INJECTED: ${targetTitle} shifted by +${delayDays} days`,
            severity: 'CRITICAL',
            details: `Reason: ${reason}. Downstream blast radius: ${impact.blockedTaskIds.length} tasks blocked. Project critical slip: +${impact.effectiveProjectSlip} days.`,
          },
          {
            id: `audit-${Date.now()}-2`,
            timestamp: nowStr,
            actor: 'Graph Engine',
            role: 'SYSTEM',
            action: `BLAST RADIUS TRAVERSAL COMPLETE`,
            severity: 'WARNING',
            details: `Traversed DAG downstream of ${targetTaskId}. Blocked tasks: ${impact.blockedTaskIds.join(', ')}. Alerted ${impact.affectedRoleSet.length} stakeholder roles.`,
          },
          {
            id: `audit-${Date.now()}-3`,
            timestamp: nowStr,
            actor: 'Coordination Engine',
            role: 'SYSTEM',
            action: `ACTION ITEMS & APPROVAL GATES GENERATED`,
            severity: 'INFO',
            details: `Generated ${newActions.length} coordination action items (${newActions.filter((a) => a.isApprovalGate).length} approval gates).`,
          },
        ];

        set((state) => ({
          tasks: { ...state.tasks, [pid]: updatedTasks },
          actionItems: { ...state.actionItems, [pid]: newActions },
          currentChanges: { ...state.currentChanges, [pid]: changeEvent },
          projectSlips: { ...state.projectSlips, [pid]: impact.effectiveProjectSlip },
          auditLogs: { ...state.auditLogs, [pid]: [...newAuditEntries, ...auditLogs] },
          notifications: [...newNotifs, ...state.notifications],
        }));
      },

      createChangeRequest: (changeData) => {
        const pid = get().currentProjectId;
        const { changeRequests, auditLogs, currentUser } = get();
        const projChanges = changeRequests[pid] || [];
        const cid = `cr-${Date.now()}`;
        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

        const newRequest: ChangeRequest = {
          ...changeData,
          id: cid,
          status: 'SUBMITTED',
          createdAt: nowStr,
        };

        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser ? currentUser.name : 'User',
          role: changeData.initiatorRole,
          action: `CHANGE REQUEST SUBMITTED: ${changeData.title}`,
          severity: 'INFO',
          details: `Target Task: ${changeData.targetTaskId}, Schedule Impact: +${changeData.delayDays}d, Cost Impact: $${changeData.costImpact}.`,
        };

        set((state) => ({
          changeRequests: { ...state.changeRequests, [pid]: [newRequest, ...projChanges] },
          auditLogs: { ...state.auditLogs, [pid]: [auditEntry, ...(state.auditLogs[pid] || [])] },
        }));
      },

      analyzeChangeRequest: (changeId) => {
        const pid = get().currentProjectId;
        const tasks = get().getCurrentTasks();
        const dependencies = get().getCurrentDependencies();
        const changeRequests = get().getCurrentChangeRequests();
        const cr = changeRequests.find((c) => c.id === changeId);
        if (!cr) return;

        const impact = computeBlastRadius(cr.targetTaskId, cr.delayDays, cr.initiatorRole, tasks, dependencies);
        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

        const updatedCR: ChangeRequest = {
          ...cr,
          status: 'ANALYZED',
          analyzedResult: {
            affectedTaskIds: impact.affectedTaskIds,
            blockedTaskIds: impact.blockedTaskIds,
            effectiveProjectSlip: impact.effectiveProjectSlip,
            affectedRoles: impact.affectedRoleSet,
          },
        };

        set((state) => ({
          changeRequests: {
            ...state.changeRequests,
            [pid]: (state.changeRequests[pid] || []).map((c) => (c.id === changeId ? updatedCR : c)),
          },
        }));

        // Execute blast radius injection
        get().injectChangeEvent(cr.targetTaskId, cr.delayDays, cr.reason, cr.initiatorRole);
      },

      approveChangeRequest: (changeId) => {
        const pid = get().currentProjectId;
        const changeRequests = get().getCurrentChangeRequests();
        const auditLogs = get().getCurrentAuditLogs();
        const currentUser = get().currentUser;
        const cr = changeRequests.find((c) => c.id === changeId);
        if (!cr) return;

        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const updatedCR: ChangeRequest = { ...cr, status: 'APPROVED' };

        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser ? currentUser.name : 'Authorized Signer',
          role: currentUser ? currentUser.role : 'PROJECT_MANAGER',
          action: `CHANGE REQUEST APPROVED: ${cr.title}`,
          severity: 'INFO',
          details: `Authorized by ${currentUser?.name || 'Signer'}. Variance incorporated into project register.`,
        };

        set((state) => ({
          changeRequests: {
            ...state.changeRequests,
            [pid]: (state.changeRequests[pid] || []).map((c) => (c.id === changeId ? updatedCR : c)),
          },
          auditLogs: { ...state.auditLogs, [pid]: [auditEntry, ...(state.auditLogs[pid] || [])] },
        }));
      },

      rejectChangeRequest: (changeId) => {
        const pid = get().currentProjectId;
        const changeRequests = get().getCurrentChangeRequests();
        const currentUser = get().currentUser;
        const cr = changeRequests.find((c) => c.id === changeId);
        if (!cr) return;

        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const updatedCR: ChangeRequest = { ...cr, status: 'REJECTED' };

        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: nowStr,
          actor: currentUser ? currentUser.name : 'Authorized Signer',
          role: currentUser ? currentUser.role : 'PROJECT_MANAGER',
          action: `CHANGE REQUEST REJECTED: ${cr.title}`,
          severity: 'WARNING',
          details: `Change order rejected. Baseline schedule maintained.`,
        };

        set((state) => ({
          changeRequests: {
            ...state.changeRequests,
            [pid]: (state.changeRequests[pid] || []).map((c) => (c.id === changeId ? updatedCR : c)),
          },
          auditLogs: { ...state.auditLogs, [pid]: [auditEntry, ...(state.auditLogs[pid] || [])] },
        }));
      },

      resolveAction: (actionId) => {
        const pid = get().currentProjectId;
        const actionItems = get().getCurrentActionItems();
        const tasks = get().getCurrentTasks();
        const auditLogs = get().getCurrentAuditLogs();
        const dependencies = get().getCurrentDependencies();

        const action = actionItems.find((a) => a.id === actionId);
        if (!action) return;

        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

        const updatedActions = actionItems.map((a) =>
          a.id === actionId ? { ...a, status: 'RESOLVED' as const } : a
        );

        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}-res`,
          timestamp: nowStr,
          actor: action.assignedRole.replace(/_/g, ' '),
          role: action.assignedRole,
          action: `RESOLVED: ${action.title}`,
          severity: 'INFO',
          details: action.isApprovalGate
            ? `Approval gate signed off by ${action.assignedRole}.`
            : `Coordination action marked resolved.`,
        };

        let updatedTasks = [...tasks];
        const newUnblockAudits: AuditLogEntry[] = [];

        const canUnblock = (task: TaskNode, currentTasks: TaskNode[], currentActs: ActionItem[]): boolean => {
          if (task.status !== 'BLOCKED') return false;

          const pendingGates = currentActs.filter(
            (a) => a.isApprovalGate && a.unblocksTaskId === task.id && a.status === 'PENDING'
          );
          if (pendingGates.length > 0) return false;

          const upstreamEdges = dependencies.filter((e) => e.target === task.id);
          for (const edge of upstreamEdges) {
            const parent = currentTasks.find((t) => t.id === edge.source);
            if (parent && parent.status === 'BLOCKED') {
              return false;
            }
          }
          return true;
        };

        let changed = true;
        while (changed) {
          changed = false;
          for (let i = 0; i < updatedTasks.length; i++) {
            const t = updatedTasks[i];
            if (t.status === 'BLOCKED' && canUnblock(t, updatedTasks, updatedActions)) {
              const newStatus = t.id === 'T2' ? 'IN_PROGRESS' : 'NOT_STARTED';
              updatedTasks[i] = {
                ...t,
                status: newStatus,
                blockedReason: undefined,
              };
              changed = true;

              newUnblockAudits.push({
                id: `audit-${Date.now()}-unblock-${t.id}`,
                timestamp: nowStr,
                actor: 'Coordination Engine',
                role: 'SYSTEM',
                action: `TASK UNBLOCKED: ${t.title} (${t.id})`,
                severity: 'INFO',
                details: `All upstream blockers and approval gates satisfied. Task status restored to ${newStatus}.`,
              });
            }
          }
        }

        const remainingBlocked = updatedTasks.filter((t) => t.status === 'BLOCKED').length;
        const nextSlip = remainingBlocked === 0 ? 0 : get().getCurrentProjectSlip();

        set((state) => ({
          actionItems: { ...state.actionItems, [pid]: updatedActions },
          tasks: { ...state.tasks, [pid]: updatedTasks },
          projectSlips: { ...state.projectSlips, [pid]: nextSlip },
          auditLogs: { ...state.auditLogs, [pid]: [...newUnblockAudits, auditEntry, ...auditLogs] },
        }));
      },

      rejectAction: (actionId) => {
        const pid = get().currentProjectId;
        const actionItems = get().getCurrentActionItems();
        const action = actionItems.find((a) => a.id === actionId);
        if (!action) return;

        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const updatedActions = actionItems.map((a) =>
          a.id === actionId ? { ...a, status: 'REJECTED' as const } : a
        );

        const auditEntry: AuditLogEntry = {
          id: `audit-${Date.now()}`,
          timestamp: nowStr,
          actor: action.assignedRole.replace(/_/g, ' '),
          role: action.assignedRole,
          action: `ACTION REJECTED: ${action.title}`,
          severity: 'WARNING',
          details: `Sign-off rejected by ${action.assignedRole}. Action flagged for PMO review.`,
        };

        set((state) => ({
          actionItems: { ...state.actionItems, [pid]: updatedActions },
          auditLogs: {
            ...state.auditLogs,
            [pid]: [auditEntry, ...(state.auditLogs[pid] || [])],
          },
        }));
      },

      // Notifications
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },
      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      // Resets
      resetDemoScenario: () => {
        const pid = DEMO_PROJECT.id;
        const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false });

        set((state) => ({
          tasks: { ...state.tasks, [pid]: INITIAL_TASKS },
          stakeholders: { ...state.stakeholders, [pid]: INITIAL_STAKEHOLDERS },
          dependencies: { ...state.dependencies, [pid]: INITIAL_DEPENDENCIES },
          actionItems: { ...state.actionItems, [pid]: [] },
          changeRequests: { ...state.changeRequests, [pid]: [] },
          currentChanges: { ...state.currentChanges, [pid]: null },
          projectSlips: { ...state.projectSlips, [pid]: 0 },
          selectedTaskId: null,
          selectedChangeId: null,
          auditLogs: {
            ...state.auditLogs,
            [pid]: [
              {
                id: `audit-reset-${Date.now()}`,
                timestamp: nowStr,
                actor: 'System User',
                role: 'PROJECT_MANAGER',
                action: 'SCENARIO RESET TO BASELINE',
                severity: 'INFO',
                details: 'All changes, actions, and project slip metrics restored to initial baseline.',
              },
              ...INITIAL_AUDIT_LOGS,
            ],
          },
        }));
      },

      resetWorkspace: () => {
        const pid = DEMO_PROJECT.id;
        set({
          onboardingCompleted: false,
          currentUser: null,
          projects: DEFAULT_PROJECTS,
          currentProjectId: pid,
          tasks: DEFAULT_TASKS_MAP,
          stakeholders: DEFAULT_STAKEHOLDERS_MAP,
          dependencies: DEFAULT_DEPENDENCIES_MAP,
          actionItems: { [pid]: [], [secondaryProj.project.id]: [] },
          changeRequests: { [pid]: [], [secondaryProj.project.id]: [] },
          auditLogs: DEFAULT_AUDIT_MAP,
          currentChanges: { [pid]: null, [secondaryProj.project.id]: null },
          projectSlips: { [pid]: 0, [secondaryProj.project.id]: 0 },
          notifications: [],
          selectedTaskId: null,
          selectedChangeId: null,
          activeTab: 'dashboard',
        });
      },
    }),
    {
      name: 'aec-coordination-store-v2',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        onboardingCompleted: state.onboardingCompleted,
        currentUser: state.currentUser,
        projects: state.projects,
        currentProjectId: state.currentProjectId,
        tasks: state.tasks,
        stakeholders: state.stakeholders,
        dependencies: state.dependencies,
        actionItems: state.actionItems,
        changeRequests: state.changeRequests,
        auditLogs: state.auditLogs,
        projectSlips: state.projectSlips,
        theme: state.theme,
      }),
    }
  )
);
