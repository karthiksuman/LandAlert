import React, { useState } from 'react';
import AuthorityDashboard from './AuthorityDashboard';
import CitizenReportsQueue from './CitizenReportsQueue';
import RoadBlockageManager from './RoadBlockageManager';
import PopulationRiskPanel from './PopulationRiskPanel';
import RiskMonitoring from '../common/RiskMonitoring';
import { 
  LayoutDashboard, FileText, AlertOctagon, Users, 
  ChevronLeft, ChevronRight, Radio, Shield, Activity 
} from 'lucide-react';

const AuthorityPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, monitoring, reports, roads, population
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="authority-layout" style={{ paddingBottom: 'calc(var(--bottom-nav-height) + 14px)' }}>
      {/* Collapsible Command Sidebar */}
      <aside className={`portal-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div style={{ padding: '16px 14px', display: 'flex', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
          {!isSidebarCollapsed && (
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-blue-600)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Authority Center
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', padding: '4px' }}
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
              className={`sidebar-nav-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
              onClick={() => setActiveTab('monitoring')}
              title="Risk Monitoring (Time-Series Factor Graphs)"
            >
              <Activity size={18} />
              {!isSidebarCollapsed && <span>Risk Monitoring</span>}
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
              title="Resident Reports Triage"
            >
              <FileText size={18} />
              {!isSidebarCollapsed && <span>Resident Reports</span>}
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
        {activeTab === 'monitoring' && <RiskMonitoring />}
        {activeTab === 'reports' && <CitizenReportsQueue />}
        {activeTab === 'roads' && <RoadBlockageManager />}
        {activeTab === 'population' && <PopulationRiskPanel />}
      </main>

      {/* Fixed Bottom Dashboard Navigation Bar with Equal Spacing */}
      <nav className="citizen-bottom-nav">
        <button
          className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={19} />
          <span>Command Map</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          <Activity size={19} />
          <span>Risk Monitoring</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <FileText size={19} />
          <span>Resident Reports</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'roads' ? 'active' : ''}`}
          onClick={() => setActiveTab('roads')}
        >
          <AlertOctagon size={19} />
          <span>Road Blockages</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'population' ? 'active' : ''}`}
          onClick={() => setActiveTab('population')}
        >
          <Users size={19} />
          <span>Population at Risk</span>
        </button>
      </nav>
    </div>
  );
};

export default AuthorityPortal;
