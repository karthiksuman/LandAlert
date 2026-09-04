import React from 'react';
import { Navigation, MapPin, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';

const LiveNavigation = ({ task, onArrived }) => {
  if (!task) return null;

  return (
    <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--color-blue-500)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={20} color="var(--color-blue-500)" />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)' }}>Field Tactical Navigation Route</h3>
        </div>
        <span className="badge badge-info">
          SAFE PASSAGE ACTIVE
        </span>
      </div>

      <div style={{ background: 'var(--color-blue-50)', border: '1px solid var(--color-blue-100)', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Target Waypoint:</span>
          <strong style={{ color: 'var(--color-navy)' }}>{task.locationName}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Target GPS:</span>
          <strong style={{ color: 'var(--color-blue-600)', fontFamily: 'var(--font-mono)' }}>
            {task.coordinates[0].toFixed(4)}°N, {task.coordinates[1].toFixed(4)}°E
          </strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Hazard Clearance Advisory:</span>
          <span style={{ color: 'var(--color-risk-low)', fontWeight: 700 }}>✓ Detour via Ridge Line (Safe from Active Slip)</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Compass size={16} color="var(--color-blue-500)" />
          <span>Bearing: 042° NE • Estimated Distance: 1.8 km</span>
        </div>

        {onArrived && (
          <button className="btn-primary" onClick={onArrived} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <MapPin size={14} />
            Confirm Arrival: ON SITE
          </button>
        )}
      </div>
    </div>
  );
};

export default LiveNavigation;
