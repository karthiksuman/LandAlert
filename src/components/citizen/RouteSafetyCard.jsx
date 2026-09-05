import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertOctagon, CheckCircle2, Navigation, AlertTriangle, ArrowRight } from 'lucide-react';

const RouteSafetyCard = () => {
  const { roads, viewBothRoutesOnMap, t } = useApp();

  const highRiskRoad = roads.find(r => r.status === 'BLOCKED' || r.status === 'UNSAFE') || roads[0];
  const alt = highRiskRoad.alternativeRoute;

  return (
    <div className="route-safety-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertOctagon size={20} color="var(--color-risk-critical)" />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700 }}>
            {t.routes?.title || "Route Safety & Detour Advisory"}
          </h3>
        </div>
        <span className="badge badge-critical" style={{ fontSize: '0.72rem' }}>
          {highRiskRoad.status}
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
        {t.routes?.subtitle || "AI slope hazard models and ground displacement telemetry predict hazardous travel on primary mountain highways."}
      </p>

      <div className="route-comparison-grid">
        {/* Unsafe / Blocked Primary Highway */}
        <div className="route-option-box blocked">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-risk-critical)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              {t.routes?.highRiskNotRec || "HIGH RISK / NOT RECOMMENDED"}
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-risk-critical)' }}>
              Risk: {highRiskRoad.riskPercentage}%
            </span>
          </div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '4px' }}>
            {highRiskRoad.name}
          </h4>
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0 }}>
            {highRiskRoad.reason}
          </p>
        </div>

        {/* Recommended Safe Green Detour */}
        {alt && (
          <div className="route-option-box recommended">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-risk-low)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {t.routes?.recSafeDetour || "RECOMMENDED SAFE DETOUR"}
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-risk-low)' }}>
                Risk: {alt.riskPercentage}% (Safe)
              </span>
            </div>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '4px' }}>
              {alt.name}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0 }}>
              Geologically stable ridgeline bypass route actively monitored by BRO clearance patrol units.
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
        <button 
          className="btn-outline-cyan" 
          style={{ fontSize: '0.85rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          onClick={viewBothRoutesOnMap}
        >
          <Navigation size={14} />
          {t.routes?.viewBothRoutes || "View Both Routes on GIS Map"}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default RouteSafetyCard;
