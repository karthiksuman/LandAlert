import React, { useState } from 'react';
import SystemHealth from './SystemHealth';
import SensorManagement from './SensorManagement';
import AiModelConfig from './AiModelConfig';
import UserManagement from './UserManagement';
import EmergencyHelplines from './EmergencyHelplines';
import { 
  Activity, Radio, Cpu, Users, PhoneCall 
} from 'lucide-react';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('sensors'); // sensors, health, ai, users, helplines

  return (
    <div className="admin-layout" style={{ paddingBottom: 'calc(var(--bottom-nav-height) + 14px)', width: '100%' }}>
      {/* Main Admin Content */}
      <main className="admin-content" style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        {activeTab === 'sensors' && <SensorManagement />}
        {activeTab === 'health' && <SystemHealth />}
        {activeTab === 'ai' && <AiModelConfig />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'helplines' && <EmergencyHelplines />}
      </main>

      {/* Fixed Bottom Dashboard Navigation Bar with Equal Spacing */}
      <nav className="citizen-bottom-nav">
        <button
          className={`bottom-nav-item ${activeTab === 'sensors' ? 'active' : ''}`}
          onClick={() => setActiveTab('sensors')}
        >
          <Radio size={19} />
          <span>Sensors</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          <Activity size={19} />
          <span>Telemetry</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'ai' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Cpu size={19} />
          <span>Landslide Probability</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={19} />
          <span>Users</span>
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'helplines' ? 'active' : ''}`}
          onClick={() => setActiveTab('helplines')}
        >
          <PhoneCall size={19} />
          <span>Helplines</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminPortal;
