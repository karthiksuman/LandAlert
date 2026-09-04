import React, { useState } from 'react';
import SystemHealth from './SystemHealth';
import SensorManagement from './SensorManagement';
import AiModelConfig from './AiModelConfig';
import UserManagement from './UserManagement';
import EmergencyHelplines from './EmergencyHelplines';
import { 
  Activity, Radio, Cpu, Users, PhoneCall, 
  ChevronLeft, ChevronRight, Settings, ShieldCheck 
} from 'lucide-react';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('sensors'); // sensors, health, ai, users, helplines
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className={`portal-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div style={{ padding: '16px 14px', display: 'flex', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
          {!isSidebarCollapsed && (
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#66BB6A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Super Admin Console
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <ul className="sidebar-nav-list">
          <li>
            <button
              className={`sidebar-nav-btn ${activeTab === 'sensors' ? 'active' : ''}`}
              onClick={() => setActiveTab('sensors')}
              title="IoT Sensors & Automated Failure Alerts"
            >
              <Radio size={18} />
              {!isSidebarCollapsed && <span>IoT Sensors & Alerts</span>}
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-btn ${activeTab === 'health' ? 'active' : ''}`}
              onClick={() => setActiveTab('health')}
              title="Core System Health Telemetry"
            >
              <Activity size={18} />
              {!isSidebarCollapsed && <span>System Telemetry</span>}
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-btn ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
              title="AI Prediction Ensemble Weights"
            >
              <Cpu size={18} />
              {!isSidebarCollapsed && <span>AI Model Weights</span>}
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
              title="Users & Role Authorization"
            >
              <Users size={18} />
              {!isSidebarCollapsed && <span>User Directory</span>}
            </button>
          </li>

          <li>
            <button
              className={`sidebar-nav-btn ${activeTab === 'helplines' ? 'active' : ''}`}
              onClick={() => setActiveTab('helplines')}
              title="Emergency Helplines Configuration"
            >
              <PhoneCall size={18} />
              {!isSidebarCollapsed && <span>Emergency Helplines</span>}
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Admin Content */}
      <main className="admin-content">
        {activeTab === 'sensors' && <SensorManagement />}
        {activeTab === 'health' && <SystemHealth />}
        {activeTab === 'ai' && <AiModelConfig />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'helplines' && <EmergencyHelplines />}
      </main>
    </div>
  );
};

export default AdminPortal;
