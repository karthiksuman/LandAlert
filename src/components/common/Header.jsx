import React from 'react';
import { useApp } from '../../context/AppContext';
import PortalSwitcher from './PortalSwitcher';
import VoiceAssistant from './VoiceAssistant';
import { Mountain, AlertTriangle, PhoneCall, ShieldCheck, Wifi, WifiOff, CloudOff } from 'lucide-react';

const Header = () => {
  const { 
    t, 
    activePortal, 
    currentUser, 
    logout, 
    setIsSosOpen,
    networkStatus,
    setNetworkMode,
    offlineReportsQueue
  } = useApp();

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo-icon">
          <Mountain size={22} strokeWidth={2.4} />
        </div>
        <div className="header-brand">
          <div className="header-title">
            <span className="brand-logo-title">
              <span className="brand-logo-large-l">L</span>andAlert
            </span>
            <span className="header-tag">NE-INDIA</span>
          </div>
          <div className="header-subtitle">
            {t.systemTitle || "Landslide Early Warning & Disaster Management"}
          </div>
        </div>
      </div>

      {/* Center Live Operational Beacon & Network Signal Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="header-status-beacon">
          <span className="header-status-dot" />
          <span>SYSTEM OPERATIONAL • 99.96% IoT TELEMETRY</span>
        </div>

        {/* Dynamic Network Status Indicator & Test Toggle */}
        <button
          type="button"
          onClick={() => {
            const nextMode = networkStatus === 'online' ? 'poor' : networkStatus === 'poor' ? 'offline' : 'online';
            setNetworkMode(nextMode);
          }}
          title={`Current Network: ${networkStatus.toUpperCase()}. Click to cycle (Online -> Poor -> Offline) for testing.`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: networkStatus === 'online' ? 'var(--color-blue-50)' : networkStatus === 'poor' ? '#FFF8E1' : '#FFEBEE',
            border: `1px solid ${networkStatus === 'online' ? 'var(--color-blue-200)' : networkStatus === 'poor' ? '#FFE082' : '#FFCDD2'}`,
            color: networkStatus === 'online' ? '#2E7D32' : networkStatus === 'poor' ? '#E65100' : '#C62828',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 10px',
            fontSize: '0.74rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {networkStatus === 'online' ? (
            <>
              <Wifi size={13} />
              <span>ONLINE</span>
            </>
          ) : networkStatus === 'poor' ? (
            <>
              <WifiOff size={13} />
              <span>POOR SIGNAL</span>
            </>
          ) : (
            <>
              <CloudOff size={13} />
              <span>OFFLINE</span>
            </>
          )}

          {offlineReportsQueue.length > 0 && (
            <span style={{
              background: '#D84315',
              color: '#FFF',
              borderRadius: '10px',
              padding: '1px 6px',
              fontSize: '0.68rem',
              fontWeight: 800
            }}>
              {offlineReportsQueue.length} QUEUED
            </span>
          )}
        </button>
      </div>

      <div className="header-right">
        {/* Voice Assistant Readout Button */}
        <VoiceAssistant />

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
            <ShieldCheck size={16} color="var(--color-blue-300)" />
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
