export type StakeholderRole =
  | 'CLIENT'
  | 'LEAD_ARCHITECT'
  | 'MEP_CONSULTANT'
  | 'PROJECT_MANAGER'
  | 'GENERAL_CONTRACTOR'
  | 'HVAC_VENDOR'
  | 'FIRE_SAFETY_INSPECTOR';

export interface UserProfile {
  id: string;
  name: string;
  organization: string;
  role: StakeholderRole;
  email: string;
}

export type ProjectType =
  | 'Retail Fit-Out'
  | 'Commercial Office'
  | 'Residential'
  | 'Hospitality'
  | 'Healthcare'
  | 'Industrial';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  location: string;
  floors: number;
  startDate: string;
  targetCompletionDate: string;
  isDemo?: boolean;
}

export interface Stakeholder {
  id: string;
  name: string;
  organization: string;
  role: StakeholderRole;
  email: string;
  avatar: string;
}

export type TaskStatus =
  | 'COMPLETED'
  | 'IN_PROGRESS'
  | 'BLOCKED'
  | 'PENDING_APPROVAL'
  | 'NOT_STARTED';

export interface TaskNode {
  id: string;
  title: string;
  ownerRole: StakeholderRole;
  status: TaskStatus;
  plannedDays: number;
  slackDays: number;
  gridCol: number;
  gridRow: number;
  startDate?: string;
  endDate?: string;
  requiresApprovalFrom?: StakeholderRole;
  description: string;
  effectiveDelay?: number;
  blockedReason?: string;
}

export type DependencyType = 'FINISH_TO_START' | 'START_TO_START' | 'APPROVAL_GATE';

export interface DependencyEdge {
  id: string;
  source: string;
  target: string;
  type?: DependencyType;
}

export type ActionStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';
export type ActionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ActionItem {
  id: string;
  title: string;
  assignedRole: StakeholderRole;
  isApprovalGate: boolean;
  unblocksTaskId?: string;
  relatedChangeId?: string;
  priority?: ActionPriority;
  status: ActionStatus;
  impactDescription: string;
  dueDate?: string;
  createdAt: string;
}

export type AuditSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: StakeholderRole | 'SYSTEM';
  action: string;
  severity: AuditSeverity;
  details?: string;
}

export interface ChangeEvent {
  id: string;
  timestamp: string;
  initiatorRole: StakeholderRole;
  targetTaskId: string;
  delayDays: number;
  reason: string;
}

export type ChangePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ChangeStatus =
  | 'SUBMITTED'
  | 'ANALYZED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'IMPLEMENTED';

export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  targetTaskId: string;
  initiatorRole: StakeholderRole;
  delayDays: number;
  costImpact: number;
  priority: ChangePriority;
  reason: string;
  status: ChangeStatus;
  createdAt: string;
  analyzedResult?: {
    affectedTaskIds: string[];
    blockedTaskIds: string[];
    effectiveProjectSlip: number;
    affectedRoles: StakeholderRole[];
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ALERT' | 'APPROVAL' | 'TASK' | 'CHANGE';
}

export type ProjectHealthStatus = 'HEALTHY' | 'AT_RISK' | 'CRITICAL';

export interface ImpactAnalysisResult {
  affectedTaskIds: string[];
  blockedTaskIds: string[];
  effectiveProjectSlip: number;
  affectedRoleSet: StakeholderRole[];
  generatedActionItems: Omit<ActionItem, 'id' | 'createdAt'>[];
}
