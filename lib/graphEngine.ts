import { TaskNode, DependencyEdge, StakeholderRole, ActionItem, ImpactAnalysisResult } from './types';

/**
 * Validates that the directed graph formed by tasks and edges is acyclic (DAG).
 */
export function validateAcyclicGraph(tasks: TaskNode[], edges: DependencyEdge[]): boolean {
  const adj = new Map<string, string[]>();
  tasks.forEach((t) => adj.set(t.id, []));
  edges.forEach((e) => {
    if (adj.has(e.source)) {
      adj.get(e.source)!.push(e.target);
    }
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycle(nodeId: string): boolean {
    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      recStack.add(nodeId);

      const neighbors = adj.get(nodeId) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && hasCycle(neighbor)) {
          return true;
        } else if (recStack.has(neighbor)) {
          return true;
        }
      }
    }
    recStack.delete(nodeId);
    return false;
  }

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      if (hasCycle(task.id)) return false;
    }
  }

  return true;
}

/**
 * Computes downstream blast radius using dynamic graph traversal (BFS with slack propagation).
 */
export function computeBlastRadius(
  rootTaskId: string,
  scheduleShiftDays: number,
  initiatorRole: StakeholderRole,
  tasks: TaskNode[],
  edges: DependencyEdge[]
): ImpactAnalysisResult {
  const taskMap = new Map<string, TaskNode>();
  tasks.forEach((t) => taskMap.set(t.id, t));

  const rootTask = taskMap.get(rootTaskId);
  if (!rootTask) {
    throw new Error(`Task with id ${rootTaskId} not found.`);
  }

  // Build adjacency maps
  const outgoingEdges = new Map<string, string[]>();
  const incomingEdges = new Map<string, string[]>();
  tasks.forEach((t) => {
    outgoingEdges.set(t.id, []);
    incomingEdges.set(t.id, []);
  });
  edges.forEach((e) => {
    if (outgoingEdges.has(e.source)) outgoingEdges.get(e.source)!.push(e.target);
    if (incomingEdges.has(e.target)) incomingEdges.get(e.target)!.push(e.source);
  });

  // Calculate effective delay propagation
  const maxDelayMap = new Map<string, number>();
  // Initial delay out of root task accounting for root task slack
  const rootNetDelay = Math.max(0, scheduleShiftDays - rootTask.slackDays);
  maxDelayMap.set(rootTaskId, rootNetDelay);

  // Queue for BFS traversal
  const queue: string[] = [rootTaskId];
  const affectedTaskSet = new Set<string>();
  const blockedTaskSet = new Set<string>();

  affectedTaskSet.add(rootTaskId);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentDelay = maxDelayMap.get(currentId) || 0;
    const children = outgoingEdges.get(currentId) || [];

    for (const childId of children) {
      const childTask = taskMap.get(childId);
      if (!childTask) continue;

      // Effective delay entering child minus child's slack
      const netChildDelay = Math.max(0, currentDelay - childTask.slackDays);
      const existingChildDelay = maxDelayMap.get(childId) || 0;

      // Update max incoming delay to child
      if (netChildDelay > existingChildDelay || !maxDelayMap.has(childId)) {
        maxDelayMap.set(childId, netChildDelay);
      }

      affectedTaskSet.add(childId);
      blockedTaskSet.add(childId);

      if (!queue.includes(childId)) {
        queue.push(childId);
      }
    }
  }

  // Calculate maximum project slip (terminal nodes delay)
  let effectiveProjectSlip = 0;
  maxDelayMap.forEach((delay, taskId) => {
    // If task is terminal (no outgoing edges) or has max slip
    const children = outgoingEdges.get(taskId) || [];
    if (children.length === 0 || delay > effectiveProjectSlip) {
      if (delay > effectiveProjectSlip) {
        effectiveProjectSlip = delay;
      }
    }
  });

  // Identify affected roles
  const affectedRoleSet = new Set<StakeholderRole>();
  affectedRoleSet.add(initiatorRole);
  affectedTaskSet.forEach((id) => {
    const t = taskMap.get(id);
    if (t) affectedRoleSet.add(t.ownerRole);
  });

  // Generate action items and approval gates
  const generatedActionItems: Omit<ActionItem, 'id' | 'createdAt'>[] = [];

  // 1. Blocked task action items
  blockedTaskSet.forEach((taskId) => {
    const task = taskMap.get(taskId);
    if (task) {
      const delay = maxDelayMap.get(taskId) || 0;
      generatedActionItems.push({
        title: `Assess Impact on: ${task.title}`,
        assignedRole: task.ownerRole,
        isApprovalGate: false,
        unblocksTaskId: task.id,
        status: 'PENDING',
        impactDescription: `Downstream activity blocked due to +${scheduleShiftDays}d shift from ${rootTask.title}. Net impact: +${delay}d delay.`,
      });
    }
  });

  // 2. Approval gates for affected tasks that require approval
  const approvalRolesNeeded = new Set<StakeholderRole>();

  affectedTaskSet.forEach((taskId) => {
    const task = taskMap.get(taskId);
    if (task && task.requiresApprovalFrom) {
      approvalRolesNeeded.add(task.requiresApprovalFrom);
    }
  });

  // Also if root task itself triggered specific approvals
  if (rootTask.requiresApprovalFrom) {
    approvalRolesNeeded.add(rootTask.requiresApprovalFrom);
  }

  if (approvalRolesNeeded.has('LEAD_ARCHITECT')) {
    generatedActionItems.push({
      title: 'Lead Architect Sign-off: Review Chiller Relocation & Ceiling Clearances',
      assignedRole: 'LEAD_ARCHITECT',
      isApprovalGate: true,
      unblocksTaskId: rootTaskId,
      status: 'PENDING',
      impactDescription: `Verify 4m chiller offset against architectural load limits, riser clearances, and false-ceiling datum.`,
    });
  }

  if (approvalRolesNeeded.has('FIRE_SAFETY_INSPECTOR')) {
    generatedActionItems.push({
      title: 'Fire Safety Sign-off: Hydraulic Flow & Sprinkler Certification',
      assignedRole: 'FIRE_SAFETY_INSPECTOR',
      isApprovalGate: true,
      unblocksTaskId: 'T5',
      status: 'PENDING',
      impactDescription: `Re-certify hydraulic head pressure and dropper pipe alignment following main riser repositioning.`,
    });
  }

  if (approvalRolesNeeded.has('CLIENT')) {
    generatedActionItems.push({
      title: 'Client Sign-off: Handover Schedule & Variance Authorization',
      assignedRole: 'CLIENT',
      isApprovalGate: true,
      unblocksTaskId: 'T7',
      status: 'PENDING',
      impactDescription: `Authorize +${effectiveProjectSlip} day shift to overall occupancy milestone and fit-out completion.`,
    });
  }

  return {
    affectedTaskIds: Array.from(affectedTaskSet),
    blockedTaskIds: Array.from(blockedTaskSet),
    effectiveProjectSlip,
    affectedRoleSet: Array.from(affectedRoleSet),
    generatedActionItems,
  };
}
