import React from 'react';
import { useApp } from '../../context/AppContext';
import AuthorityDashboard from './AuthorityDashboard';
import CitizenReportsQueue from './CitizenReportsQueue';
import RoadBlockageManager from './RoadBlockageManager';
import PopulationRiskPanel from './PopulationRiskPanel';
import RiskMonitoring from '../common/RiskMonitoring';
import { 
  LayoutDashboard, FileText, AlertOctagon, Users, Activity 
} from 'lucide-react';

const AuthorityPortal = () => {
  const { authorityActiveTab, setAuthorityActiveTab, t } = useApp();
  const activeTab = authorityActiveTab || 'dashboard';

  return (
    <div className="authority-layout" style={{ paddingBottom: 'calc(var(--bottom-nav-height) + 14px)', width: '100%' }}>
      {/* Main Content Area */}
      <main className="authority-main-content" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
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
          onClick={() => setAuthorityActiveTab('dashboard')}
        >
          <LayoutDashboard size={19} />
          <span>{t.nav?.commandMap || "Command Map"}</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setAuthorityActiveTab('monitoring')}
        >
          <Activity size={19} />
          <span>{t.nav?.monitoring || "Risk Monitoring"}</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setAuthorityActiveTab('reports')}
        >
          <FileText size={19} />
          <span>{t.nav?.residentReports || "Resident Reports"}</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'roads' ? 'active' : ''}`}
          onClick={() => setAuthorityActiveTab('roads')}
        >
          <AlertOctagon size={19} />
          <span>{t.nav?.roadBlockages || "Road Blockages"}</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'population' ? 'active' : ''}`}
          onClick={() => setAuthorityActiveTab('population')}
        >
          <Users size={19} />
          <span>{t.nav?.populationAtRisk || "Population at Risk"}</span>
        </button>
      </nav>
    </div>
  );
};

export default AuthorityPortal;
