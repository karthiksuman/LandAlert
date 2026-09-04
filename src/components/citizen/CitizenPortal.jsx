import React from 'react';
import { useApp } from '../../context/AppContext';
import CitizenOnboarding from './CitizenOnboarding';
import CitizenHome from './CitizenHome';
import CitizenAlerts from './CitizenAlerts';
import CitizenReport from './CitizenReport';
import CitizenMore from './CitizenMore';
import SafetyInsights from './SafetyInsights';
import RiskMonitoring from '../common/RiskMonitoring';
import { Home, AlertTriangle, FilePlus2, MoreHorizontal, Activity, ShieldCheck } from 'lucide-react';

const CitizenPortal = () => {
  const { 
    onboardingCompleted, 
    citizenActiveTab, 
    setCitizenActiveTab,
    alerts,
    t
  } = useApp();

  // If user hasn't completed onboarding, show the onboarding flow first
  if (!onboardingCompleted) {
    return <CitizenOnboarding />;
  }

  return (
    <div className="citizen-app-layout">
      {/* Active Tab View */}
      <main style={{ flex: 1 }}>
        {citizenActiveTab === 'home' && <CitizenHome />}
        {citizenActiveTab === 'alerts' && <CitizenAlerts />}
        {citizenActiveTab === 'monitoring' && <RiskMonitoring />}
        {citizenActiveTab === 'safetyInsights' && <SafetyInsights />}
        {citizenActiveTab === 'report' && <CitizenReport />}
        {citizenActiveTab === 'more' && <CitizenMore />}
      </main>

      {/* Fixed Resident Bottom Navigation Bar with Equal Spacing */}
      <nav className="citizen-bottom-nav">
        <button
          className={`bottom-nav-item ${citizenActiveTab === 'home' ? 'active' : ''}`}
          onClick={() => setCitizenActiveTab('home')}
        >
          <Home size={19} />
          <span>{t.nav?.home || "Home"}</span>
        </button>

        <button
          className={`bottom-nav-item ${citizenActiveTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setCitizenActiveTab('alerts')}
          style={{ position: 'relative' }}
        >
          <AlertTriangle size={19} />
          <span>{t.nav?.alerts || "Alerts"}</span>
          {alerts.length > 0 && (
            <span 
              style={{
                position: 'absolute',
                top: '6px',
                right: '20%',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#FF5252'
              }} 
            />
          )}
        </button>

        <button
          className={`bottom-nav-item ${citizenActiveTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setCitizenActiveTab('monitoring')}
        >
          <Activity size={19} />
          <span>{t.nav?.monitoring || "Risk Monitoring"}</span>
        </button>

        <button
          className={`bottom-nav-item ${citizenActiveTab === 'safetyInsights' ? 'active' : ''}`}
          onClick={() => setCitizenActiveTab('safetyInsights')}
        >
          <ShieldCheck size={19} />
          <span>{t.nav?.safetyInsights || "Safety & Insights"}</span>
        </button>

        <button
          className={`bottom-nav-item ${citizenActiveTab === 'report' ? 'active' : ''}`}
          onClick={() => setCitizenActiveTab('report')}
        >
          <FilePlus2 size={19} />
          <span>{t.nav?.report || "Report"}</span>
        </button>

        <button
          className={`bottom-nav-item ${citizenActiveTab === 'more' ? 'active' : ''}`}
          onClick={() => setCitizenActiveTab('more')}
        >
          <MoreHorizontal size={19} />
          <span>{t.nav?.more || "More"}</span>
        </button>
      </nav>
    </div>
  );
};

export default CitizenPortal;
