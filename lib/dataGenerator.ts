import { Project, TaskNode, DependencyEdge, Stakeholder, ProjectType } from './types';

export function generateBelievableProject(
  name: string,
  type: ProjectType,
  location: string,
  floors: number,
  startDateStr: string
): {
  project: Project;
  stakeholders: Stakeholder[];
  tasks: TaskNode[];
  dependencies: DependencyEdge[];
} {
  const projectId = `proj-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const startDate = new Date(startDateStr);
  const targetDate = new Date(startDate);
  targetDate.setDate(targetDate.getDate() + 120);

  const project: Project = {
    id: projectId,
    name,
    type,
    location,
    floors,
    startDate: startDateStr,
    targetCompletionDate: targetDate.toISOString().split('T')[0],
    isDemo: false,
  };

  const stakeholders: Stakeholder[] = [
    {
      id: `${projectId}-s1`,
      name: 'Arthur Vance',
      organization: 'Vance Development',
      role: 'CLIENT',
      email: 'arthur@vance.com',
      avatar: 'AV',
    },
    {
      id: `${projectId}-s2`,
      name: 'Claire Montgomery',
      organization: 'Apex Studio Architecture',
      role: 'LEAD_ARCHITECT',
      email: 'claire@apexstudio.com',
      avatar: 'CM',
    },
    {
      id: `${projectId}-s3`,
      name: 'Dr. Robert Thorne',
      organization: 'Nexus MEP Engineers',
      role: 'MEP_CONSULTANT',
      email: 'robert@nexusmep.com',
      avatar: 'RT',
    },
    {
      id: `${projectId}-s4`,
      name: 'Samantha Reed',
      organization: 'Horizon PMO',
      role: 'PROJECT_MANAGER',
      email: 'samantha@horizonpmo.com',
      avatar: 'SR',
    },
    {
      id: `${projectId}-s5`,
      name: 'Viktor Krum',
      organization: 'Apex Constructors',
      role: 'GENERAL_CONTRACTOR',
      email: 'viktor@apexcon.com',
      avatar: 'VK',
    },
    {
      id: `${projectId}-s6`,
      name: 'Tariq Mansoor',
      organization: 'ThermalAir Solutions',
      role: 'HVAC_VENDOR',
      email: 'tariq@thermalair.com',
      avatar: 'TM',
    },
    {
      id: `${projectId}-s7`,
      name: 'Inspector Gordon',
      organization: 'City Fire & Safety Board',
      role: 'FIRE_SAFETY_INSPECTOR',
      email: 'gordon@cityfire.gov',
      avatar: 'IG',
    },
  ];

  const tasks: TaskNode[] = [
    {
      id: 'P-T1',
      title: 'Design Development & Spatial Freeze',
      ownerRole: 'LEAD_ARCHITECT',
      status: 'COMPLETED',
      plannedDays: 14,
      slackDays: 0,
      gridCol: 1,
      gridRow: 1,
      description: 'Final architectural floorplans, structural grid coordinates, and finish specifications.',
    },
    {
      id: 'P-T2',
      title: 'MEP Primary Routing & Load Calculation',
      ownerRole: 'MEP_CONSULTANT',
      status: 'IN_PROGRESS',
      plannedDays: 10,
      slackDays: 2,
      requiresApprovalFrom: 'LEAD_ARCHITECT',
      gridCol: 2,
      gridRow: 1,
      description: 'Chiller structural load distribution, electrical riser paths, and main duct runs.',
    },
    {
      id: 'P-T3',
      title: 'HVAC Duct & AHU Offsite Fabrication',
      ownerRole: 'HVAC_VENDOR',
      status: 'NOT_STARTED',
      plannedDays: 15,
      slackDays: 1,
      gridCol: 3,
      gridRow: 1,
      description: 'Sheet metal ductwork fabrication and Air Handling Unit (AHU) assembly to CAD specs.',
    },
    {
      id: 'P-T4',
      title: 'Ceiling Grid & Main Suspension Framing',
      ownerRole: 'GENERAL_CONTRACTOR',
      status: 'NOT_STARTED',
      plannedDays: 9,
      slackDays: 1,
      gridCol: 3,
      gridRow: 2,
      description: 'Hanger wire anchors, primary perimeter runners, and main cross-tee suspension.',
    },
    {
      id: 'P-T5',
      title: 'Fire Sprinkler System & Hydraulic Sign-off',
      ownerRole: 'FIRE_SAFETY_INSPECTOR',
      status: 'NOT_STARTED',
      plannedDays: 7,
      slackDays: 0,
      requiresApprovalFrom: 'FIRE_SAFETY_INSPECTOR',
      gridCol: 4,
      gridRow: 2,
      description: 'Branch pipe dropper alignment, pressure testing, and municipal fire clearance sign-off.',
    },
    {
      id: 'P-T6',
      title: 'Drywall Partition & Acoustic Enclosure',
      ownerRole: 'GENERAL_CONTRACTOR',
      status: 'NOT_STARTED',
      plannedDays: 8,
      slackDays: 0,
      gridCol: 5,
      gridRow: 1,
      description: 'Gypsum board installation, mineral wool acoustic insulation, and skim coating.',
    },
    {
      id: 'P-T7',
      title: 'Testing & Commissioning / Occupancy Permit',
      ownerRole: 'PROJECT_MANAGER',
      status: 'NOT_STARTED',
      plannedDays: 5,
      slackDays: 0,
      requiresApprovalFrom: 'CLIENT',
      gridCol: 6,
      gridRow: 1,
      description: 'Final air balancing, fire alarm integration, client walkthrough, and occupancy permit.',
    },
  ];

  const dependencies: DependencyEdge[] = [
    { id: 'pe1-2', source: 'P-T1', target: 'P-T2', type: 'FINISH_TO_START' },
    { id: 'pe2-3', source: 'P-T2', target: 'P-T3', type: 'FINISH_TO_START' },
    { id: 'pe2-4', source: 'P-T2', target: 'P-T4', type: 'FINISH_TO_START' },
    { id: 'pe4-5', source: 'P-T4', target: 'P-T5', type: 'APPROVAL_GATE' },
    { id: 'pe3-6', source: 'P-T3', target: 'P-T6', type: 'FINISH_TO_START' },
    { id: 'pe5-6', source: 'P-T5', target: 'P-T6', type: 'FINISH_TO_START' },
    { id: 'pe6-7', source: 'P-T6', target: 'P-T7', type: 'APPROVAL_GATE' },
  ];

  return { project, stakeholders, tasks, dependencies };
}
