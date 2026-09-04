import React from 'react';
import { useApp } from '../../context/AppContext';
import CitizenOnboarding from './CitizenOnboarding';
import CitizenHome from './CitizenHome';
import CitizenAlerts from './CitizenAlerts';
import CitizenReport from './CitizenReport';
import CitizenMore from './CitizenMore';
import { Home, AlertTriangle, FilePlus2, MoreHorizontal } from 'lucide-react';

const CitizenPortal = () => {
  const { 
    onboardingCompleted, 
    citizenActiveTab, 
    setCitizenActiveTab,
    alerts
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
        {citizenActiveTab === 'report' && <CitizenReport />}
        {citizenActiveTab === 'more' && <CitizenMore />}
      </main>

      {/* Fixed Citizen Bottom Navigation Bar */}
      <nav className="citizen-bottom-nav">
        <button
          className={`bottom-nav-item ${citizenActiveTab === 'home' ? 'active' : ''}`}
          onClick={() => setCitizenActiveTab('home')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          className={`bottom-nav-item ${citizenActiveTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setCitizenActiveTab('alerts')}
          style={{ position: 'relative' }}
        >
          <AlertTriangle size={20} />
          <span>Alerts</span>
          {alerts.length > 0 && (
            <span 
              style={{
                position: 'absolute',
                top: '6px',
                right: '24%',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#FF5252'
              }} 
            />
          )}
        </button>

        <button
          className={`bottom-nav-item ${citizenActiveTab === 'report' ? 'active' : ''}`}
          onClick={() => setCitizenActiveTab('report')}
        >
          <FilePlus2 size={20} />
          <span>Report</span>
        </button>

        <button
          className={`bottom-nav-item ${citizenActiveTab === 'more' ? 'active' : ''}`}
          onClick={() => setCitizenActiveTab('more')}
        >
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
};

export default CitizenPortal;
