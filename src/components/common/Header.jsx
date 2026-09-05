import React from 'react';
import { useApp } from '../../context/AppContext';
import PortalSwitcher from './PortalSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import VoiceAssistant from './VoiceAssistant';
import { AlertTriangle, PhoneCall, ShieldCheck } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Header = () => {
  const { t, activePortal, currentUser, logout, setIsSosOpen } = useApp();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo-icon">
          <img src={logoImg} alt="LandAlert Logo" className="header-logo-img" />
        </div>
        <div className="header-brand">
          <div className="header-title">
            <span className="brand-logo-title">
              <span className="brand-logo-large-l">L</span>andAlert
            </span>
            <span className="header-tag">NE-INDIA</span>
          </div>
          <div className="header-subtitle">
            {t.systemTitle || "Landslide Early Warning & Disaster Management System"}
          </div>
        </div>
      </div>

      {/* Center Live Operational Beacon */}
      <div className="header-status-beacon">
        <span className="header-status-dot" />
        <span>{t.header?.systemOperational || "SYSTEM OPERATIONAL • 99.96% IoT TELEMETRY"}</span>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Universal Language Switcher */}
        <LanguageSwitcher />

        {/* Voice Assistant Readout Button */}
        <VoiceAssistant />

        {/* Visible SOS trigger */}
        <button 
          className="sos-header-btn" 
          onClick={() => setIsSosOpen(true)}
          title="Emergency Help & SOS Contacts"
        >
          <PhoneCall size={16} />
          <span>{t.header?.sosEmergency || "SOS EMERGENCY"}</span>
        </button>

        {/* Portal Switcher Dropdown */}
        <PortalSwitcher />

        {/* If logged in with non-citizen role, show user badge and logout */}
        {currentUser.role !== 'citizen' && (
          <div className="user-profile-badge">
            <ShieldCheck size={16} color="var(--color-blue-300)" />
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentUser.name}
            </span>
            <button className="logout-icon-btn" onClick={logout} title={t.header?.signOut || "Sign Out"}>
              ✕
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
