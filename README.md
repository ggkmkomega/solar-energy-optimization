# Helios-Vektor • AI Residential Energy & HVAC Optimization Studio

> Professional B2B SaaS platform for geospatial energy optimization, AI-driven photovoltaic (PV) solar panel placement, multi-split HVAC siting, aerodynamic wind integration, and thermodynamic building simulation.

---

## ⚡ Features & Capabilities

- **Interactive 2D Multi-Layer Workstation**:
  - **Cadastral & Floorplan Layers**: Precision $0.25\text{ m}$ coordinate resolution grid mapping walls, doors, windows, and surrounding obstacles (trees, adjacent structures).
  - **Solar Siting & Irradiance Analysis**: Roof PV modules (20 panels) & ground array (6 panels) yielding an estimated **$17,256\text{ kWh/yr}$**.
  - **HVAC & Heat Pump Siting**: Indoor ceiling multi-splits (`AC1`, `AC2`, `AC3`), outdoor condenser unit, and a **$29\text{ m}$ refrigerant pipe routing network**.
  - **Thermal Efficiency Diffusion**: Magma/Inferno plume mapping convective airflow and cooling/heating propagation within interior rooms.
  - **Environmental & Climate Vectors**: Real-time visualization of dominant wind vectors ($301^\circ$) and seasonal solar azimuth & elevation ($181^\circ / 49^\circ$).
  - **Dynamic Shadow Projection**: Real-time solar trajectory slider ($06:00$ to $20:00$) simulating seasonal solstice and equinox shadow lengths.

- **Design System & Engineering**:
  - Built with **Next.js (App Router)**, **React 19**, **Tailwind CSS v4**, and **TypeScript**.
  - W3C DTCG-compliant Design Tokens (`tokens/tokens.json`) with topo-energy heatmap palette (Emerald/Mint solar, Cyan HVAC, Dark slate GIS base).
  - High-density B2B telemetry HUD with real-time KPI inspection, acoustic noise tolerance sliders, and compliance reports.
  - BIM (IFC 4.0) and technical CAD (DXF/PDF) export readiness.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (Turbopack, App Router)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com) + Custom Design Tokens
- **Icons & Graphics**: Pure SVG Vector Engine (Hardware-accelerated)
- **Language**: TypeScript

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ggkmkomega/solar-energy-optimization.git
cd solar-energy-optimization
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the interactive studio.

---

## 📁 Project Architecture

```
├── app/
│   ├── globals.css         # Tailwind v4 theme, canvas grid styles & design tokens
│   ├── layout.tsx          # Root layout with dark theme & zero-FOUC script
│   └── page.tsx            # Main application mounting EnergyStudioCanvas
├── components/
│   ├── atoms/              # Status badges, GIS coordinate inputs, layer toggles, sliders
│   ├── molecules/          # KPI cards, equipment selectors, navigation toolbars
│   ├── organisms/          # Top navigation bar, telemetry sidebar, CAD/BIM modals
│   └── workstation/        # EnergyStudioCanvas core interactive SVG viewport
├── hooks/
│   └── useEquipmentPlacement.ts  # Magnetic snap, 400mm grid, obstacle collisions
├── tokens/
│   └── tokens.json         # Standard W3C Design Tokens Community Group specification
└── types/
    └── energy.ts           # Domain models, telemetry interfaces & API data contracts
```
