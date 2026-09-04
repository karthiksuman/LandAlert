import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, CheckCircle2, ShieldCheck, Navigation, ArrowRight } from 'lucide-react';

const RoadBlockageManager = () => {
  const { roads, toggleRoadBlockage, setIsFullScreenMap } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
            Highway Blockage & Safe Detour Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Control road clearance statuses and dynamically broadcast green detour corridors
          </p>
        </div>
        <button className="btn-secondary" onClick={() => setIsFullScreenMap(true)}>
          <Navigation size={15} />
          View All Routes on GIS Map
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {roads.map(road => {
          const isBlocked = road.status === 'BLOCKED' || road.status === 'UNSAFE';
          const alt = road.alternativeRoute;

          return (
            <div key={road.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)' }}>{road.name}</h3>
                    <span className={`badge ${isBlocked ? 'badge-critical' : 'badge-low'}`}>
                      {road.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {road.reason}
                  </p>
                </div>

                <button
                  className={isBlocked ? "btn-secondary" : "btn-critical"}
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                  onClick={() => toggleRoadBlockage(road.id)}
                >
                  {isBlocked ? "Mark Road Cleared & OPEN" : "Mark Road BLOCKED"}
                </button>
              </div>

              {/* Detour Routing Visual Box */}
              {alt && (
                <div 
                  style={{ 
                    background: 'var(--color-blue-50)', 
                    border: '1px solid var(--color-blue-200)', 
                    borderRadius: '8px', 
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-risk-low)', textTransform: 'uppercase', marginBottom: '2px' }}>
                      Active Alternative Safe Bypass Detour
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-navy)' }}>
                      {alt.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Risk Level: {alt.riskPercentage}% (Safe) • Clearance: Patrol Unit 4 Active
                    </div>
                  </div>

                  <span className="badge badge-low" style={{ fontSize: '0.75rem' }}>
                    ✓ Recommended to Citizens
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadBlockageManager;
