# AEC Coordination Intelligence System (AS-01)

An enterprise-grade web application for Architecture, Engineering, and Construction (AEC) project coordination. **AS-01** models complex multi-trade activities as a **Directed Acyclic Graph (DAG)**, calculates real-time critical path variance and blast radius schedule shifts, automates sign-off approval gates, and maintains an audit trail for design changes.

---

## 🌟 Key Product Features

- **Directed Acyclic Graph (DAG) Engine**: Visualizes project dependencies across phases (Design, MEP, Fabrication, Compliance, Drywall, Handover) with real-time cycle detection to prevent circular dependency deadlocks.
- **Blast Radius & Shift Calculation**: Injects change order variances (e.g., HVAC chiller relocation, lighting layout updates) and automatically calculates downstream blocked activities and cumulative project slip days.
- **Governance Sign-off & Approval Gates**: Manages role-based sign-offs across Project Managers, Lead Architects, MEP Consultants, General Contractors, HVAC Vendors, Fire Safety Inspectors, and Clients.
- **Critical Path Timeline**: Renders real-time activity schedules, slack day buffers, and duration metrics.
- **Project Memory & Audit Trail**: Chronological immutable log tracking every baseline change, variance calculation, sign-off resolution, and role assignment.
- **First-Time Onboarding & Scenario Simulator**: Interactive setup wizard allowing users to explore baseline demo projects or initialize custom AEC projects with custom DAG structures.

---

## 🎨 AEC Industry Visual Palette

The application uses an AEC drafting theme:

- **Primary Dark Red (`#340A0E`)**: Critical path delays, blocked activities, high-impact alerts.
- **Secondary Burgundy (`#570F1D`)**: Primary action buttons, active navigation tabs.
- **Accent Rose (`#6F2B34`)**: Hover states, focus rings, highlighted borders.
- **Deep Dark Green (`#111506`)**: High-contrast main canvas background with blueprint drafting grid lines.
- **Dark Olive (`#323522`)**: Structural cards, control panels, modal surfaces.
- **Muted Khaki (`#81815D`)**: Secondary text, subtle borders, SVG dependency connector lines.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js (App Router, SSR-safe hydration)
- **Language**: TypeScript (Strict typing across domain models and DAG graph structures)
- **Styling**: Tailwind CSS with custom AEC color palette tokens
- **Icons**: Lucide React
- **State Management**: Zustand with persistent storage middleware

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abhishek-singh06/coordination-intelligence-as-01.git
   cd coordination-intelligence-as-01
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   Navigate to `http://localhost:3000` (or `http://localhost:3002` if port 3000 is occupied).

---

## 📖 Key Workflows

1. **Landing Page & Overview**: Overview of capabilities, interactive demo preview, and project impact breakdown.
2. **Command Center (`/command-center`)**: The core live coordination workspace:
   - **Dashboard**: KPI Banner, Dependency Flow DAG, Coordination Command Center, Stakeholders, and Audit Trail.
   - **Tasks Register**: Dense enterprise activity register with search, filtering, creation, and editing capabilities.
   - **Change Orders**: Variance register for change order submission and blast radius propagation.
   - **Approvals & Actions**: Gatekeeper sign-off resolution.
   - **Timeline**: Critical path schedule breakdown.
   - **Project Memory**: Chronological project audit trail.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
