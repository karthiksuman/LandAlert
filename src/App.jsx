import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/common/Header';
import AuthModal from './components/common/AuthModal';
import SosModal from './components/common/SosModal';
import IntroAnimation from './components/common/IntroAnimation';
import ToastNotifications from './components/common/ToastNotifications';
import Terrain3DModal from './components/gis/Terrain3DModal';

// Connected Portals
import CitizenPortal from './components/citizen/CitizenPortal';
import AuthorityPortal from './components/authority/AuthorityPortal';
import FieldOfficerPortal from './components/fieldOfficer/FieldOfficerPortal';
import AdminPortal from './components/admin/AdminPortal';

// Stylesheets
import './styles/index.css';
import './styles/header.css';
import './styles/intro.css';
import './styles/gis-map.css';
import './styles/citizen.css';
import './styles/authority.css';
import './styles/field-officer.css';
import './styles/admin.css';

const MainAppLayout = () => {
  const { activePortal } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Cinematic 2.5s Intro on first load */}
      <IntroAnimation />

      {/* Global Application Header + Portal Switcher Dropdown */}
      <Header />

      {/* Main Connected Portal View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activePortal === 'citizen' && <CitizenPortal />}
        {activePortal === 'authority' && <AuthorityPortal />}
        {activePortal === 'fieldOfficer' && <FieldOfficerPortal />}
        {activePortal === 'admin' && <AdminPortal />}
      </div>

      {/* Shared Modals & Overlays */}
      <AuthModal />
      <SosModal />
      <Terrain3DModal />
      <ToastNotifications />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}

export default App;
