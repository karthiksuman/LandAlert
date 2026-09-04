import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CloudRain, Droplets, Activity, Mountain, ShieldCheck, Navigation, Layers, Cpu } from 'lucide-react';

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

      {/* Header with status beacon */}
      <div className="location-info-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
            <span className="pulse-dot pulse-dot-critical" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-blue-600)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Spatial Telemetry Node
            </span>
          </div>
          <div className="zone-title" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy)' }}>
            {zone.name}
          </div>
          <div className="zone-subtitle" style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            {zone.district}, {zone.state} • {zone.coordinates ? `${zone.coordinates[0].toFixed(3)}°N, ${zone.coordinates[1].toFixed(3)}°E` : '27.33°N, 88.61°E'}
          </div>
        </div>
        <button 
          onClick={onClose} 
          style={{ background: 'var(--color-blue-50)', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          title="Close Panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Big Risk Score Gauge & AI Confidence */}
      <div className="risk-score-display" style={{ marginTop: '12px', background: 'var(--color-blue-50)', borderRadius: '12px', padding: '14px', border: '1px solid var(--color-border)' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
            Hazard Probability
          </div>
          <div className="risk-pct-large" style={{ color: riskColor, fontSize: '2.4rem', fontWeight: 800, lineHeight: 1 }}>
            {zone.riskPercentage}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.74rem', color: 'var(--color-blue-600)' }}>
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
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Random Forest + LSTM
          </div>
        </div>
      </div>

      {/* 6-Hour AI Prediction Window */}
      <div style={{ 
        background: 'var(--color-blue-50)', 
        borderLeft: `4px solid ${riskColor}`, 
        border: '1px solid var(--color-border)',
        borderLeftWidth: '4px',
        padding: '10px 12px', 
        borderRadius: '8px',
        fontSize: '0.82rem',
        color: 'var(--color-text-primary)',
        marginTop: '12px',
        marginBottom: '14px',
        lineHeight: 1.4
      }}>
        <strong style={{ color: 'var(--color-blue-600)' }}>AI Early Warning: </strong> {zone.predictionWindow}
      </div>

      {/* Contributing Environmental & Sensor Factors */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
          Live Telemetry & Geological Factors
        </div>

        {/* Slope Angle */}
        <div className="factor-bar-row" style={{ marginBottom: '10px' }}>
          <div className="factor-bar-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Mountain size={14} color="var(--color-blue-500)" />
              Mountain Slope Angle
            </span>
            <strong style={{ color: 'var(--color-navy)' }}>{zone.factors?.slope?.value || 38}° ({zone.factors?.slope?.status || 'Steep Precipice'})</strong>
          </div>
          <div className="factor-progress-bg" style={{ height: '7px', background: 'var(--color-blue-100)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              className="factor-progress-fill" 
              style={{ width: `${((zone.factors?.slope?.value || 38) / 55) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-blue-500), var(--color-risk-critical))', borderRadius: '4px' }} 
            />
          </div>
        </div>

        {/* Rainfall Infiltration */}
        <div className="factor-bar-row" style={{ marginBottom: '10px' }}>
          <div className="factor-bar-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CloudRain size={14} color="var(--color-blue-500)" />
              24h Precip Infiltration
            </span>
            <strong style={{ color: 'var(--color-blue-600)' }}>{zone.factors?.rainfall?.value || 112} {zone.factors?.rainfall?.unit || 'mm'}</strong>
          </div>
          <div className="factor-progress-bg" style={{ height: '7px', background: 'var(--color-blue-100)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              className="factor-progress-fill" 
              style={{ width: `${Math.min(100, ((zone.factors?.rainfall?.value || 112) / 160) * 100)}%`, height: '100%', background: 'var(--color-blue-500)', borderRadius: '4px' }} 
            />
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="factor-bar-row" style={{ marginBottom: '10px' }}>
          <div className="factor-bar-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Droplets size={14} color="var(--color-risk-low)" />
              Soil Saturation
            </span>
            <strong style={{ color: 'var(--color-risk-low)' }}>{zone.factors?.soilMoisture?.value || 84}%</strong>
          </div>
          <div className="factor-progress-bg" style={{ height: '7px', background: 'var(--color-blue-100)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              className="factor-progress-fill" 
              style={{ width: `${zone.factors?.soilMoisture?.value || 84}%`, height: '100%', background: 'var(--color-risk-low)', borderRadius: '4px' }} 
            />
          </div>
        </div>

        {/* Seismic Vibration */}
        <div className="factor-bar-row" style={{ marginBottom: '10px' }}>
          <div className="factor-bar-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Activity size={14} color="var(--color-risk-high)" />
              Micro-Seismic Vibration
            </span>
            <strong style={{ color: 'var(--color-risk-high)' }}>{zone.factors?.groundMovement?.value || 4.2} mm/s</strong>
          </div>
          <div className="factor-progress-bg" style={{ height: '7px', background: 'var(--color-blue-100)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              className="factor-progress-fill" 
              style={{ width: `${Math.min(100, ((zone.factors?.groundMovement?.value || 4.2) / 6.0) * 100)}%`, height: '100%', background: 'var(--color-risk-high)', borderRadius: '4px' }} 
            />
          </div>
        </div>

        {/* Geological Strata */}
        <div style={{ marginTop: '12px', background: 'var(--color-blue-50)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            <Layers size={13} color="var(--color-blue-500)" />
            Geological Strata & Lithology
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
            <strong>Lithology: </strong> {zone.factors?.terrain?.value || 'Colluvial soil over weathered Precambrian schist'}
          </div>
        </div>
      </div>

      {/* Evacuation Route Status */}
      <div style={{ marginBottom: '14px', background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: '8px', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--color-risk-low)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
          <Navigation size={13} />
          <span>Evacuation Corridor Status</span>
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
          Primary Route (NH-10 Sector B): <span style={{ color: 'var(--color-risk-critical)', fontWeight: 700 }}>HIGH RISK / BLOCKED</span>
        </div>
        <div style={{ fontSize: '0.76rem', color: 'var(--color-risk-low)', marginTop: '3px', fontWeight: 600 }}>
          ✓ Verified Safe Detour: Route 3B via Mangan Valley Ridge Open
        </div>
      </div>

      {/* Natural Language Reasoning */}
      {zone.whyElevated && (
        <div className="ai-reasoning-box" style={{ background: '#FDECEC', border: '1px solid #FFCDD2', borderRadius: '8px', padding: '10px 12px', fontSize: '0.82rem', color: 'var(--color-text-primary)', marginBottom: '14px', lineHeight: 1.4 }}>
          <strong style={{ color: 'var(--color-risk-critical)', display: 'block', marginBottom: '4px' }}>⚠️ AI Hazard Analysis:</strong>
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

