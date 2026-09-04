import React from 'react';
import { useApp } from '../../context/AppContext';
import PortalSwitcher from './PortalSwitcher';
import { Mountain, AlertTriangle, PhoneCall, ShieldCheck } from 'lucide-react';

const Header = () => {
  const { t, activePortal, currentUser, logout, setIsSosOpen } = useApp();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo-icon">
          <Mountain size={22} strokeWidth={2.4} />
        </div>
        <div className="header-brand">
          <div className="header-title">
            <span>TerraAlert</span>
            <span className="header-tag">NE-INDIA</span>
          </div>
          <div className="header-subtitle">
            {t.systemTitle || "Landslide Early Warning & Disaster Management"}
          </div>
        </div>
      </div>

      {/* Center Live Operational Beacon */}
      <div className="header-status-beacon">
        <span className="header-status-dot" />
        <span>SYSTEM OPERATIONAL • 99.96% IoT TELEMETRY</span>
      </div>

      <div className="header-right">
        {/* Visible SOS trigger */}
        <button 
          className="sos-header-btn" 
          onClick={() => setIsSosOpen(true)}
          title="Emergency Help & SOS Contacts"
        >
          <PhoneCall size={16} />
          <span>SOS EMERGENCY</span>
        </button>

        {/* Portal Switcher Dropdown */}
        <PortalSwitcher />

        {/* If logged in with non-citizen role, show user badge and logout */}
        {currentUser.role !== 'citizen' && (
          <div className="user-profile-badge">
            <ShieldCheck size={16} color="#29B6F6" />
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser.name}
            </span>
            <button className="logout-icon-btn" onClick={logout} title="Sign Out">
              ✕
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
