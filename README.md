# Landslide Early Warning & Disaster Management System (TerraAlert India)

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An integrated, government-grade **AI + IoT + GIS Disaster Management Platform** engineered specifically for the landslide-prone mountain corridors of **North-Eastern India** (Sikkim, Assam, Meghalaya, Nagaland, Mizoram, and Arunachal Pradesh).

TerraAlert connects four distinct operational portals within a **single unified web application**, sharing a real-time reactive state store, environmental IoT telemetry, machine learning risk engine, and GIS risk mapping pipeline.

---

## 🏛 The Four Connected Portals

TerraAlert organizes disaster mitigation around four role-specific operational questions:

| Portal | Role | Primary Operational Question | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **1. Citizen Portal** | Public / Mobile-First | *"Am I safe?"* | 50% GIS risk map, 100% full-screen mode, 3-step localized onboarding, multi-factor risk panel, route safety warnings & alternative safe detours, photo/video hazard reporting with auto-GPS, illustrated survival guide, and SOS emergency hotline directory. |
| **2. Authority Portal** | EOC / SDMA / NDRF | *"Where is the risk and what action should we take?"* | 70% GIS command map dominance, live citizen incident triage queue (Verify, Reject, Assign Officer), geo-targeted siren broadcast, highway blockage manager with dynamic green detours, and vulnerable population estimator. |
| **3. Field Officer Portal** | Geologists / Response Teams | *"What do I need to inspect and report?"* | Workflow progression stepper (`Assigned` → `Accepted` → `Travelling` → `On Site` → `Inspection` → `Reported` → `Resolved`), live tactical navigation avoiding slip zones, on-site geotechnical telemetry (crack width, slope tilt, rockfall, seepage), and AI computer-vision crack fracture analysis. |
| **4. Admin Portal** | Super Admin / Directorate | *"Is the entire system working and under control?"* | Automated IoT sensor failure notification banner (`S-102 Offline` alert with 1-click field repair dispatch), sensor fleet telemetry table (geophones, extensometers, inclinometers, TDR soil probes), AI multi-factor weight sliders, risk threshold configurator, user RBAC directory, and emergency helpline manager. |

---

## 🔄 Connected System Workflows

1. **AI Landslide Risk Prediction Workflow**:
   - `IoT Telemetry (Rainfall + Soil Moisture + Ground Movement + Slope Angle + Geology)` $\rightarrow$ `AI Prediction Engine` $\rightarrow$ `Weighted Risk Probability % (0–100%)` $\rightarrow$ `Categorical Risk Zone (Green / Yellow / Orange / Red)` $\rightarrow$ `Natural Language Explainability ("Why is risk high?")` $\rightarrow$ `GIS Visual Update` $\rightarrow$ `Geo-targeted Citizen Warnings`.
2. **Citizen Incident Triage & Field Dispatch Workflow**:
   - `Citizen Report + Photo + GPS` $\rightarrow$ `Authority Command Triage Queue` $\rightarrow$ `Authority Verification` $\rightarrow$ `Field Officer Task Dispatch` $\rightarrow$ `Tactical Navigation to Site` $\rightarrow$ `On-Site Inspection & AI Vision` $\rightarrow$ `Report Submitted` $\rightarrow$ `Authority Resolution & GIS Road Closure`.
3. **IoT Sensor Failure & Auto-Alert Workflow**:
   - `Sensor Signal/Battery Drop (e.g. S-102)` $\rightarrow$ `Automated 🔴 SENSOR ALERT Banner in Admin Portal` $\rightarrow$ `Admin Dispatches Field Officer for Repair` $\rightarrow$ `Officer Restores Station` $\rightarrow$ `Sensor Telemetry Back Online`.
4. **Highway Blockage & Safe Detour Routing**:
   - `Active Landslide or High Risk Predicted on Highway (e.g. NH-10 / NH-29)` $\rightarrow$ `Highway Segment Marked Red (Blocked/Unsafe)` $\rightarrow$ `System Automatically Renders Green Safe Alternative Detour Corridor` $\rightarrow$ `Blocked Route Removed from Recommendations`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd SIH

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit **`http://localhost:5173/`** in your browser.

### Building for Production

```bash
npm run build
```

---

## 🔑 Demo Access & Role Authentication

The top-right portal dropdown switcher allows switching between all four portals. Protected portals feature **1-click Demo Auto-Fill** buttons for evaluator testing:

- **Citizen Portal**: No password required (public access).
- **Authority Portal**: Username `authority` / Password `disaster2026`
- **Field Officer Portal**: Username `officer` / Password `field2026`
- **Admin Portal**: Username `admin` / Password `admin2026`

---

## 🛠 Technology Stack

- **Framework**: React 18, Vite
- **Mapping & Spatial Visualization**: Leaflet, OpenStreetMap / CartoDB Dark Matter GIS tiles, SVG Digital Elevation Models
- **Icons**: Lucide Icons
- **Design & Styling**: Custom CSS3 design system with CSS custom properties, glassmorphism, responsive grid/flex layouts, and WCAG-compliant color contrasts
- **State Architecture**: Central reactive React Context (`AppContext`) unifying all data pipelines, telemetry, and cross-portal events

---

## 📄 License
This project is licensed under the MIT License.
