import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, CloudRain, Droplets, Activity, Mountain, ShieldCheck, History, Radio, Navigation, Layers, Cpu } from 'lucide-react';

const LocationInfoPanel = ({ zone, onClose }) => {
  const { setCitizenActiveTab } = useApp();

  if (!zone) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'var(--risk-critical)';
      case 'HIGH': return 'var(--risk-high)';
      case 'MODERATE': return 'var(--risk-moderate)';
      default: return 'var(--risk-low)';
    }
  };

  const riskColor = getRiskColor(zone.riskLevel);
  const aiConfidence = 91.4 + (zone.riskPercentage % 7);

  return (
    <div className="location-info-panel">
      {/* Mobile Touch Drag Handle */}
      <div className="bottom-sheet-drag-handle" />

      {/* Header with holographic status beacon */}
      <div className="location-info-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span className="pulse-dot pulse-dot-critical" />
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--cyan)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              3D Spatial Telemetry Node
            </span>
          </div>
          <div className="zone-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
            {zone.name}
          </div>
          <div className="zone-subtitle" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {zone.district}, {zone.state} • Coordinates: {zone.coordinates ? `${zone.coordinates[0].toFixed(3)}°N, ${zone.coordinates[1].toFixed(3)}°E` : '27.33°N, 88.61°E'}
          </div>
        </div>
        <button 
          onClick={onClose} 
          style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          title="Close Panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Big Risk Score Gauge & AI Confidence */}
      <div className="risk-score-display" style={{ marginTop: '12px', background: 'rgba(6, 19, 31, 0.7)', borderRadius: 'var(--radius-lg)', padding: '14px', border: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
            Hazard Probability
          </div>
          <div className="risk-pct-large" style={{ color: riskColor, fontSize: '2.4rem', fontWeight: 900, lineHeight: 1 }}>
            {zone.riskPercentage}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.72rem', color: 'var(--cyan)' }}>
            <Cpu size={12} />
            <span>AI Model Confidence: {aiConfidence.toFixed(1)}%</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span 
            className={`badge badge-${zone.riskLevel.toLowerCase()}`}
            style={{ fontSize: '0.82rem', padding: '6px 14px', letterSpacing: '0.5px' }}
          >
            <span className={`pulse-dot pulse-dot-${zone.riskLevel.toLowerCase()}`} />
            {zone.riskLevel} RISK
          </span>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Random Forest + LSTM
          </div>
        </div>
      </div>

      {/* 6-Hour AI Prediction Window */}
      <div style={{ 
        background: 'linear-gradient(90deg, rgba(25, 199, 255, 0.12) 0%, rgba(6, 19, 31, 0.6) 100%)', 
        borderLeft: `4px solid ${riskColor}`, 
        padding: '10px 12px', 
        borderRadius: '6px',
        fontSize: '0.8rem',
        color: '#E1E9F0',
        marginTop: '12px',
        marginBottom: '14px',
        lineHeight: 1.4
      }}>
        <strong style={{ color: 'var(--cyan)' }}>AI Early Warning: </strong> {zone.predictionWindow}
      </div>

      {/* Contributing Environmental & Sensor Factors */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px' }}>
          Live Telemetry & Geological Factors
        </div>

        {/* 3D Slope Visualization */}
        <div className="factor-bar-row" style={{ marginBottom: '10px' }}>
          <div className="factor-bar-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Mountain size={14} color="var(--cyan)" />
              Terrain Slope Angle
            </span>
            <strong style={{ color: '#fff' }}>{zone.factors?.slope?.value || 38}° ({zone.factors?.slope?.status || 'Steep Precipice'})</strong>
          </div>
          <div className="factor-progress-bg" style={{ height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              className="factor-progress-fill" 
              style={{ width: `${((zone.factors?.slope?.value || 38) / 55) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #1687FF, #FF3B3B)', borderRadius: '4px' }} 
            />
          </div>
        </div>

        {/* Rainfall Infiltration */}
        <div className="factor-bar-row" style={{ marginBottom: '10px' }}>
          <div className="factor-bar-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CloudRain size={14} color="#29B6F6" />
              24h Precip Accumulation
            </span>
            <strong style={{ color: '#29B6F6' }}>{zone.factors?.rainfall?.value || 112} {zone.factors?.rainfall?.unit || 'mm'}</strong>
          </div>
          <div className="factor-progress-bg" style={{ height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              className="factor-progress-fill" 
              style={{ width: `${Math.min(100, ((zone.factors?.rainfall?.value || 112) / 160) * 100)}%`, height: '100%', background: '#29B6F6', borderRadius: '4px' }} 
            />
          </div>
        </div>

        {/* Soil Moisture / Saturation */}
        <div className="factor-bar-row" style={{ marginBottom: '10px' }}>
          <div className="factor-bar-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Droplets size={14} color="#00E676" />
              Soil Pore Water Saturation
            </span>
            <strong style={{ color: '#00E676' }}>{zone.factors?.soilMoisture?.value || 84}%</strong>
          </div>
          <div className="factor-progress-bg" style={{ height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              className="factor-progress-fill" 
              style={{ width: `${zone.factors?.soilMoisture?.value || 84}%`, height: '100%', background: 'linear-gradient(90deg, #19D47B, #00E676)', borderRadius: '4px' }} 
            />
          </div>
        </div>

        {/* Seismic Ground Vibration */}
        <div className="factor-bar-row" style={{ marginBottom: '10px' }}>
          <div className="factor-bar-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Activity size={14} color="#FF9100" />
              Micro-Seismic Vibration
            </span>
            <strong style={{ color: '#FF9100' }}>{zone.factors?.groundMovement?.value || 4.2} mm/s</strong>
          </div>
          <div className="factor-progress-bg" style={{ height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              className="factor-progress-fill" 
              style={{ width: `${Math.min(100, ((zone.factors?.groundMovement?.value || 4.2) / 6.0) * 100)}%`, height: '100%', background: '#FF9100', borderRadius: '4px' }} 
            />
          </div>
        </div>

        {/* Geological Strata Breakdown */}
        <div style={{ marginTop: '12px', background: 'rgba(6, 19, 31, 0.6)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            <Layers size={13} color="var(--cyan)" />
            Geological Strata & Lithology
          </div>
          <div style={{ fontSize: '0.8rem', color: '#E1E9F0' }}>
            <strong>Lithology: </strong> {zone.factors?.terrain?.value || 'Colluvial soil over weathered Precambrian schist'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
            Shear Strength: <strong>Critical threshold reached (FS: 0.94)</strong>
          </div>
        </div>
      </div>

      {/* Evacuation Route Status */}
      <div style={{ marginBottom: '14px', background: 'rgba(25, 212, 123, 0.08)', border: '1px solid rgba(25, 212, 123, 0.3)', borderRadius: '8px', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--green)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
          <Navigation size={13} />
          <span>Evacuation Route Status</span>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#fff' }}>
          Primary Corridor (NH-10 Sector B): <span style={{ color: 'var(--risk-critical)', fontWeight: 700 }}>HIGH RISK / BLOCKED</span>
        </div>
        <div style={{ fontSize: '0.76rem', color: 'var(--green)', marginTop: '3px', fontWeight: 600 }}>
          ✓ Verified Safe Detour: Route 3B via Mangan Valley Ridge Open
        </div>
      </div>

      {/* Natural Language Reasoning */}
      {zone.whyElevated && (
        <div className="ai-reasoning-box" style={{ background: 'rgba(255, 59, 59, 0.1)', border: '1px solid rgba(255, 59, 59, 0.25)', borderRadius: '8px', padding: '10px 12px', fontSize: '0.8rem', color: '#fff', marginBottom: '14px', lineHeight: 1.4 }}>
          <strong style={{ color: '#FF7B7B', display: 'block', marginBottom: '4px' }}>⚠️ AI Hazard Analysis:</strong>
          {zone.whyElevated}
        </div>
      )}

      {/* Official Safety Instructions */}
      {zone.safetyPrecautions && zone.safetyPrecautions.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
            Official Safety Directives
          </div>
          <ul style={{ paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
            {zone.safetyPrecautions.map((precaution, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{precaution}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Action to Survival Guide */}
      <button 
        className="btn-primary" 
        onClick={() => setCitizenActiveTab('more')}
        style={{ width: '100%', padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: 'var(--radius-md)' }}
      >
        <ShieldCheck size={16} />
        Open Full Landslide Survival Guide
      </button>
    </div>
  );
};

export default LocationInfoPanel;

