import React from 'react';
import { Navigation, MapPin, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';

const LiveNavigation = ({ task, onArrived }) => {
  if (!task) return null;

  return (
    <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--brand-cyan)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={20} color="#29B6F6" />
          <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Field Tactical Navigation Route</h3>
        </div>
        <span className="badge badge-info">
          SAFE PASSAGE ACTIVE
        </span>
      </div>

      <div style={{ background: 'rgba(7, 21, 34, 0.7)', borderRadius: '8px', padding: '14px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Target Waypoint:</span>
          <strong style={{ color: '#fff' }}>{task.locationName}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Target GPS:</span>
          <strong style={{ color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>
            {task.coordinates[0].toFixed(4)}°N, {task.coordinates[1].toFixed(4)}°E
          </strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Hazard Clearance Advisory:</span>
          <span style={{ color: '#00E676', fontWeight: 700 }}>✓ Detour via Ridge Line (Safe from Active Slip)</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Compass size={16} color="var(--brand-cyan)" />
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
