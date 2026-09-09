import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { StakeholderRole, TaskStatus, AuditSeverity } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRoleName(role: StakeholderRole): string {
  switch (role) {
    case 'CLIENT':
      return 'Client';
    case 'LEAD_ARCHITECT':
      return 'Lead Architect';
    case 'MEP_CONSULTANT':
      return 'MEP Consultant';
    case 'PROJECT_MANAGER':
      return 'Project Manager';
    case 'GENERAL_CONTRACTOR':
      return 'General Contractor';
    case 'HVAC_VENDOR':
      return 'HVAC Vendor';
    case 'FIRE_SAFETY_INSPECTOR':
      return 'Fire Safety Inspector';
    default:
      return role;
  }
}

export function getStatusBadgeClass(status: TaskStatus): string {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'IN_PROGRESS':
      return 'bg-[#123B66]/60 text-[#2F80ED] border-[#1E5A91]';
    case 'BLOCKED':
      return 'bg-[#3A0B0E] text-red-400 border-red-500/40 animate-pulse-subtle';
    case 'PENDING_APPROVAL':
      return 'bg-[#0B1F3A] text-slate-100 border-[#1B2735]';
    case 'NOT_STARTED':
      return 'bg-[#0A0F16] text-[#A7B0BC] border-[#1B2735]';
  }
}

export function getSeverityBadgeClass(severity: AuditSeverity): string {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-[#3A0B0E] text-red-400 border-red-500/40';
    case 'WARNING':
      return 'bg-[#123B66]/60 text-slate-200 border-[#1E5A91]';
    case 'INFO':
      return 'bg-[#0B1F3A] text-slate-300 border-[#1B2735]';
  }
}
