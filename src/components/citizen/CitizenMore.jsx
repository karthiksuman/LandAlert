import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import SurvivalGuide from './SurvivalGuide';
import { 
  BookOpen, PhoneCall, Globe, Bell, MapPin, Shield, Info, 
  RotateCcw, ChevronRight, ChevronDown, HeartPulse, Building 
} from 'lucide-react';

const CitizenMore = () => {
  const { 
    helplines, 
    selectedLanguage, 
    changeLanguage, 
    setOnboardingCompleted, 
    setIsSosOpen,
    notificationsGranted,
    locationGranted,
    t
  } = useApp();

  const [activeSection, setActiveSection] = useState('guide'); // guide, helplines, settings, about

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'as', label: 'অসমীয়া (Assamese)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'mn', label: 'মৈতৈলোন্ (Meitei)' },
    { code: 'ne', label: 'नेपाली (Nepali)' }
  ];

  const m = t.moreSection || {};

  return (
    <div className="citizen-feed-container">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '4px' }}>
          {m.title || "Safety Information & Settings"}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          {m.subtitle || "Disaster preparedness guides, emergency directory, and language configuration"}
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
        <button
          className={activeSection === 'guide' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          onClick={() => setActiveSection('guide')}
        >
          <BookOpen size={15} />
          {m.tabGuide || "Survival Guide"}
        </button>

        <button
          className={activeSection === 'helplines' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          onClick={() => setActiveSection('helplines')}
        >
          <PhoneCall size={15} />
          {m.tabHelplines || "Helpline Numbers"}
        </button>

        <button
          className={activeSection === 'settings' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          onClick={() => setActiveSection('settings')}
        >
          <Globe size={15} />
          {m.tabSettings || "Language & Settings"}
        </button>

        <button
          className={activeSection === 'about' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '8px 16px' }}
          onClick={() => setActiveSection('about')}
        >
          <Info size={15} />
          {m.tabAbout || "About System"}
        </button>
      </div>

      {/* SECTION 1: SURVIVAL GUIDE */}
      {activeSection === 'guide' && <SurvivalGuide />}

      {/* SECTION 2: HELPLINES DIRECTORY */}
      {activeSection === 'helplines' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {m.helplineSub || "Verified 24x7 National & State Emergency Hotlines"}
            </span>
            <button className="btn-critical" style={{ fontSize: '0.78rem', padding: '6px 12px' }} onClick={() => setIsSosOpen(true)}>
              <PhoneCall size={14} />
              {m.openSos || "Open Quick SOS"}
            </button>
          </div>

          {helplines.map(hl => (
            <div key={hl.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-critical" style={{ fontSize: '0.68rem', marginBottom: '4px' }}>
                  {hl.category}
                </span>
                <h4 style={{ color: 'var(--color-navy)', fontSize: '0.98rem', fontWeight: 700 }}>{hl.name}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>{hl.description}</p>
              </div>
              <a href={`tel:${hl.number.split('/')[0].trim()}`} className="btn-primary" style={{ flexShrink: 0, padding: '8px 16px' }}>
                <PhoneCall size={14} />
                {hl.number}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 3: SETTINGS & LANGUAGE */}
      {activeSection === 'settings' && (
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Language Selector */}
          <div>
            <h4 style={{ color: 'var(--color-navy)', fontSize: '1.0rem', fontWeight: 700, marginBottom: '8px' }}>
              {m.interfaceLanguage || "Interface Language"}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className={selectedLanguage === lang.code ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.85rem', padding: '8px' }}
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions Status */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <h4 style={{ color: 'var(--color-navy)', fontSize: '1.0rem', fontWeight: 700, marginBottom: '8px' }}>
              {m.systemPermissions || "System Permissions"}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                  <MapPin size={16} color="var(--color-blue-500)" />
                  <span>{m.locationAccess || "Location Access"}</span>
                </div>
                <span className="badge badge-low">{locationGranted ? (m.active || "Active") : (m.simulated || "Simulated Regional")}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                  <Bell size={16} color="var(--color-blue-500)" />
                  <span>{m.sirenNotify || "Siren Emergency Notifications"}</span>
                </div>
                <span className="badge badge-low">{notificationsGranted ? (m.active || "Active") : (m.active || "Active")}</span>
              </div>
            </div>
          </div>

          {/* Reset Onboarding Option */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <button
              className="btn-secondary"
              style={{ fontSize: '0.85rem' }}
              onClick={() => {
                localStorage.removeItem('terra_onboarding_completed');
                setOnboardingCompleted(false);
              }}
            >
              <RotateCcw size={14} />
              {m.relaunchOnboarding || "Re-launch Resident Onboarding Setup"}
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: ABOUT SYSTEM */}
      {activeSection === 'about' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-navy)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            {m.aboutTitle || "About LandAlert India (LEWDMS)"}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            {m.aboutDesc || "LandAlert is an advanced Landslide Early Warning and Disaster Management System engineered for high-altitude landslide corridors across North-Eastern India."}
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginTop: '10px' }}>
            The platform synthesizes telemetry from real-time geotechnical IoT ground sensors (geophones, borehole extensometers, biaxial inclinometers, TDR soil-moisture probes) with satellite precipitation data and machine-learning stability models to generate geo-fenced early warnings up to 6 hours before catastrophic failure.
          </p>
          <div style={{ marginTop: '18px', padding: '12px', background: 'var(--color-blue-50)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            System Version: <strong>4.3.0-prod (LandAlert Official)</strong> • AI Engine: <strong>GeoEnsemble-V4.3</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenMore;
