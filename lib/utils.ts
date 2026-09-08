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
      return 'bg-[#323522] text-emerald-400 border-[#81815D]/40';
    case 'IN_PROGRESS':
      return 'bg-[#570F1D]/40 text-rose-200 border-[#6F2B34]';
    case 'BLOCKED':
      return 'bg-[#340A0E] text-rose-300 border-[#6F2B34] animate-pulse-subtle';
    case 'PENDING_APPROVAL':
      return 'bg-[#323522] text-amber-300 border-[#81815D]/50';
    case 'NOT_STARTED':
      return 'bg-[#111506] text-slate-400 border-[#323522]';
  }
}

export function getSeverityBadgeClass(severity: AuditSeverity): string {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-[#340A0E] text-rose-300 border-[#6F2B34]';
    case 'WARNING':
      return 'bg-[#570F1D]/50 text-amber-300 border-[#81815D]';
    case 'INFO':
      return 'bg-[#323522] text-slate-300 border-[#81815D]/40';
  }
}
