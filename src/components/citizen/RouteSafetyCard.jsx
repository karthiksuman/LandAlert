import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, CheckCircle2, Navigation, AlertTriangle, ArrowRight } from 'lucide-react';

const RouteSafetyCard = () => {
  const { roads, setIsFullScreenMap } = useApp();

  const highRiskRoad = roads.find(r => r.status === 'BLOCKED' || r.status === 'UNSAFE') || roads[0];
  const alt = highRiskRoad.alternativeRoute;

  return (
    <div className="route-safety-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={20} color="#FF5252" />
          <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Route Safety & Detour Advisory</h3>
        </div>
        <span className="badge badge-critical" style={{ fontSize: '0.72rem' }}>
          {highRiskRoad.status}
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
        AI slope hazard models and ground displacement telemetry predict hazardous travel on primary mountain highways.
      </p>

      <div className="route-comparison-grid">
        {/* Unsafe / Blocked Primary Highway */}
        <div className="route-option-box blocked">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FF5252', textTransform: 'uppercase' }}>
              ❌ NOT RECOMMENDED
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF8A80' }}>
              Risk: {highRiskRoad.riskPercentage}%
            </span>
          </div>
          <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '4px' }}>
            {highRiskRoad.name}
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            {highRiskRoad.reason}
          </p>
        </div>

        {/* Recommended Safe Green Detour */}
        {alt && (
          <div className="route-option-box recommended">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00E676', textTransform: 'uppercase' }}>
                ✓ RECOMMENDED SAFE DETOUR
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B9F6CA' }}>
                Risk: {alt.riskPercentage}% (Safe)
              </span>
            </div>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '4px' }}>
              {alt.name}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Geologically stable ridgeline bypass route actively monitored by BRO clearance patrol units.
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
        <button 
          className="btn-outline-cyan" 
          style={{ fontSize: '0.85rem', padding: '8px 14px' }}
          onClick={() => setIsFullScreenMap(true)}
        >
          <Navigation size={14} />
          View Both Routes on GIS Map
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default RouteSafetyCard;
