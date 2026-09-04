import React, { useState } from 'react';
import AuthorityDashboard from './AuthorityDashboard';
import CitizenReportsQueue from './CitizenReportsQueue';
import RoadBlockageManager from './RoadBlockageManager';
import PopulationRiskPanel from './PopulationRiskPanel';
import { 
  LayoutDashboard, FileText, AlertOctagon, Users, 
  ChevronLeft, ChevronRight, Radio, Shield 
} from 'lucide-react';

const AuthorityPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, reports, roads, population
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="authority-layout">
      {/* Collapsible Command Sidebar */}
      <aside className={`portal-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div style={{ padding: '16px 14px', display: 'flex', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
          {!isSidebarCollapsed && (
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--brand-cyan)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Authority Center
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <ul className="sidebar-nav-list">
          <li>
            <button
              className={`sidebar-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
              title="Command Dashboard (70% Map)"
            >
              <LayoutDashboard size={18} />
              {!isSidebarCollapsed && <span>Command Map</span>}
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
              title="Citizen Reports Triage"
            >
              <FileText size={18} />
              {!isSidebarCollapsed && <span>Citizen Reports</span>}
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-btn ${activeTab === 'roads' ? 'active' : ''}`}
              onClick={() => setActiveTab('roads')}
              title="Road Blockages & Safe Detours"
            >
              <AlertOctagon size={18} />
              {!isSidebarCollapsed && <span>Road Blockages</span>}
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-btn ${activeTab === 'population' ? 'active' : ''}`}
              onClick={() => setActiveTab('population')}
              title="Vulnerable Population & Shelters"
            >
              <Users size={18} />
              {!isSidebarCollapsed && <span>Population at Risk</span>}
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="authority-main-content">
        {activeTab === 'dashboard' && <AuthorityDashboard />}
        {activeTab === 'reports' && <CitizenReportsQueue />}
        {activeTab === 'roads' && <RoadBlockageManager />}
        {activeTab === 'population' && <PopulationRiskPanel />}
      </main>
    </div>
  );
};

export default AuthorityPortal;
