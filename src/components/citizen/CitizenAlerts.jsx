import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Waves, AlertOctagon, Navigation, ShieldCheck, MapPin } from 'lucide-react';

const CitizenAlerts = () => {
  const { alerts, setIsFullScreenMap } = useApp();
  const [filter, setFilter] = useState('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'LANDSLIDE') return a.type === 'CRITICAL_LANDSLIDE';
    if (filter === 'FLOOD') return a.type === 'FLASH_FLOOD';
    if (filter === 'ROAD') return a.type === 'ROAD_BLOCKAGE';
    return true;
  });

  return (
    <div className="citizen-feed-container">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '4px' }}>
          Official Emergency Alerts & Warnings
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Real-time disaster advisories broadcasted by District & State Operations Centers
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
        <button
          className={filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          onClick={() => setFilter('ALL')}
        >
          All Warnings ({alerts.length})
        </button>
        <button
          className={filter === 'LANDSLIDE' ? 'btn-critical' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          onClick={() => setFilter('LANDSLIDE')}
        >
          Landslides
        </button>
        <button
          className={filter === 'FLOOD' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          onClick={() => setFilter('FLOOD')}
        >
          Flash Floods
        </button>
        <button
          className={filter === 'ROAD' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          onClick={() => setFilter('ROAD')}
        >
          Road Blockages
        </button>
      </div>

      {/* Alerts Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredAlerts.map(alert => {
          const isFlood = alert.type === 'FLASH_FLOOD';
          const isBlockage = alert.type === 'ROAD_BLOCKAGE';
          const accentColor = isFlood ? 'var(--color-blue-500)' : isBlockage ? 'var(--color-risk-high)' : 'var(--color-risk-critical)';

          return (
            <div 
              key={alert.id}
              className="card"
              style={{
                padding: '18px 20px',
                borderLeft: `5px solid ${accentColor}`,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isFlood ? <Waves size={20} color="var(--color-blue-500)" /> : isBlockage ? <AlertOctagon size={20} color="var(--color-risk-high)" /> : <AlertTriangle size={20} color="var(--color-risk-critical)" />}
                  <span className={`badge ${isFlood ? 'badge-info' : isBlockage ? 'badge-high' : 'badge-critical'}`} style={{ fontSize: '0.7rem' }}>
                    {alert.level}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    📍 {alert.district}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {alert.issuedAt}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '6px' }}>
                {alert.title}
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
                {alert.message}
              </p>

              {/* Recommended Action */}
              <div 
                style={{ 
                  background: 'var(--color-blue-50)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '8px', 
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  marginBottom: '12px'
                }}
              >
                <ShieldCheck size={18} color="var(--color-risk-low)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-risk-low)', textTransform: 'uppercase' }}>
                    Mandatory Action / Evacuation Advice
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
                    {alert.action}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Issued by: {alert.issuedBy}</span>
                <button 
                  className="btn-outline-cyan" 
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  onClick={() => setIsFullScreenMap(true)}
                >
                  <Navigation size={12} />
                  Locate on Map
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CitizenAlerts;
