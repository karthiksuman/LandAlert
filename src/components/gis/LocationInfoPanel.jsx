import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, AlertTriangle, CloudRain, Droplets, Activity, Mountain, ShieldCheck, History, Sun } from 'lucide-react';

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

  return (
    <div className="location-info-panel">
      <div className="location-info-header">
        <div>
          <div className="zone-title">{zone.name}</div>
          <div className="zone-subtitle">{zone.district}, {zone.state}</div>
        </div>
        <button 
          onClick={onClose} 
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Big Risk Score Gauge */}
      <div className="risk-score-display">
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
            Estimated Landslide Risk
          </div>
          <div className="risk-pct-large" style={{ color: riskColor }}>
            {zone.riskPercentage}%
          </div>
        </div>
        <span 
          className={`badge badge-${zone.riskLevel.toLowerCase()}`}
          style={{ fontSize: '0.85rem', padding: '6px 12px' }}
        >
          <span className={`pulse-dot pulse-dot-${zone.riskLevel.toLowerCase()}`} />
          {zone.riskLevel} RISK
        </span>
      </div>

      {/* 6-Hour Prediction Window */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderLeft: `3px solid ${riskColor}`, 
        padding: '8px 12px', 
        borderRadius: '4px',
        fontSize: '0.82rem',
        color: '#fff',
        marginBottom: '12px'
      }}>
        <strong>AI Forecast: </strong> {zone.predictionWindow}
      </div>

      {/* Contributing Factors */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
          Contributing Environmental Factors
        </div>

        {/* Rainfall */}
        <div className="factor-bar-row">
          <div className="factor-bar-label">
            <span>🌧 24h Rainfall</span>
            <strong style={{ color: '#fff' }}>{zone.factors.rainfall.value} {zone.factors.rainfall.unit}</strong>
          </div>
          <div className="factor-progress-bg">
            <div 
              className="factor-progress-fill" 
              style={{ width: `${Math.min(100, (zone.factors.rainfall.value / 150) * 100)}%`, background: '#29B6F6' }} 
            />
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="factor-bar-row">
          <div className="factor-bar-label">
            <span>💧 Soil Moisture</span>
            <strong style={{ color: '#fff' }}>{zone.factors.soilMoisture.value}%</strong>
          </div>
          <div className="factor-progress-bg">
            <div 
              className="factor-progress-fill" 
              style={{ width: `${zone.factors.soilMoisture.value}%`, background: '#00E676' }} 
            />
          </div>
        </div>

        {/* Ground Movement */}
        <div className="factor-bar-row">
          <div className="factor-bar-label">
            <span>🌍 Ground Vibration</span>
            <strong style={{ color: '#fff' }}>{zone.factors.groundMovement.value} mm/s</strong>
          </div>
          <div className="factor-progress-bg">
            <div 
              className="factor-progress-fill" 
              style={{ width: `${Math.min(100, (zone.factors.groundMovement.value / 7.0) * 100)}%`, background: '#FF9100' }} 
            />
          </div>
        </div>

        {/* Slope Angle */}
        <div className="factor-bar-row">
          <div className="factor-bar-label">
            <span>📐 Mountain Slope</span>
            <strong style={{ color: '#fff' }}>{zone.factors.slope.value}° ({zone.factors.slope.status})</strong>
          </div>
          <div className="factor-progress-bg">
            <div 
              className="factor-progress-fill" 
              style={{ width: `${(zone.factors.slope.value / 50) * 100}%`, background: '#FF5252' }} 
            />
          </div>
        </div>

        {/* Terrain Geology */}
        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          ⛰ <strong>Terrain: </strong> {zone.factors.terrain.value}
        </div>
      </div>

      {/* Why is risk high? Natural Language Reasoning */}
      <div className="ai-reasoning-box">
        <strong>⚠️ Why is the risk elevated?</strong>
        {zone.whyElevated}
      </div>

      {/* Safety Precautions */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
          Official Safety Instructions
        </div>
        <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          {zone.safetyPrecautions.map((precaution, idx) => (
            <li key={idx} style={{ marginBottom: '4px' }}>{precaution}</li>
          ))}
        </ul>
      </div>

      {/* Previous Earthquakes Accordion */}
      {zone.earthquakes && zone.earthquakes.length > 0 && (
        <div style={{ marginBottom: '14px', background: 'rgba(7, 21, 34, 0.6)', padding: '10px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
            <History size={14} color="#29B6F6" />
            <span>Historical Seismic Events</span>
          </div>
          {zone.earthquakes.map((eq, i) => (
            <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '4px 0' }}>
              <strong>{eq.year} ({eq.date})</strong>: Mag {eq.mag} • {eq.distance} away
              <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{eq.impact}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Action to Survival Guide */}
      <button 
        className="btn-primary" 
        onClick={() => setCitizenActiveTab('more')}
        style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
      >
        <ShieldCheck size={16} />
        Open Full Landslide Survival Guide
      </button>
    </div>
  );
};

export default LocationInfoPanel;
