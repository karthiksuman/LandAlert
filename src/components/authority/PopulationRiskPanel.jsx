import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Home, ShieldCheck, MapPin } from 'lucide-react';

const PopulationRiskPanel = () => {
  const { locations } = useApp();

  const totalAtRisk = locations.reduce((sum, loc) => sum + (loc.populationAtRisk || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
          Vulnerable Population & Evacuation Shelters
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Real-time demographic risk modeling and designated relief camp telemetry
        </p>
      </div>

      {/* KPI Card */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--color-blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Users size={28} color="var(--color-risk-critical)" />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Population in Active Critical / High Risk Zones
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-heading)' }}>
            {totalAtRisk.toLocaleString()} Residents
          </div>
        </div>
      </div>

      {/* Breakdown per Zone */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        {locations.map(loc => (
          <div key={loc.id} className="glass-panel" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <h4 style={{ color: 'var(--color-navy)', fontSize: '1.0rem' }}>{loc.name}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {loc.district}, {loc.state}
                </div>
              </div>
              <span className={`badge badge-${loc.riskLevel.toLowerCase()}`}>
                {loc.riskLevel}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Users size={16} color="var(--color-blue-500)" />
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Population at Hazard: <strong style={{ color: 'var(--color-navy)' }}>{(loc.populationAtRisk || 0).toLocaleString()}</strong>
              </span>
            </div>

            {/* Shelters */}
            {loc.shelters && loc.shelters.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Designated Relief Shelters
                </div>
                {loc.shelters.map((sh, idx) => (
                  <div key={idx} style={{ background: 'var(--color-blue-50)', padding: '8px 10px', borderRadius: '6px', marginBottom: '6px', fontSize: '0.78rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{sh.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span>Capacity: {sh.capacity} beds</span>
                      <span style={{ color: 'var(--color-risk-low)' }}>Occupied: {sh.occupied}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopulationRiskPanel;
