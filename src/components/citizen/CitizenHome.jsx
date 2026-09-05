import React from 'react';
import { useApp } from '../../context/AppContext';
import GisMap from '../gis/GisMap';
import { ShieldAlert, CloudRain, Wind, Droplets, Thermometer, AlertTriangle, ArrowUpRight } from 'lucide-react';

const CitizenHome = () => {
  const { locations, selectedZoneId, setCitizenActiveTab, setIsFullScreenMap } = useApp();

  const currentZone = locations.find(l => l.id === selectedZoneId) || locations[0];

  const getStatusBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return {
          title: "CRITICAL DANGER: HIGH LANDSLIDE HAZARD",
          desc: "Slope saturation and active seismic ground vibration exceed safety thresholds. Immediate caution advised.",
          badgeClass: "badge-critical",
          cardClass: "critical"
        };
      case 'HIGH':
        return {
          title: "WARNING: ELEVATED LANDSLIDE RISK",
          desc: "Continuous rainfall is weakening hillside colluvium. Avoid non-essential mountain transit.",
          badgeClass: "badge-high",
          cardClass: "high"
        };
      case 'MODERATE':
        return {
          title: "CAUTION: MODERATE GEOLOGICAL RISK",
          desc: "Slope monitoring active. Low risk of deep failure, but watch for cliff-edge rockfall.",
          badgeClass: "badge-moderate",
          cardClass: ""
        };
      default:
        return {
          title: "SAFE: NORMAL SLOPE CONDITIONS",
          desc: "Environmental indicators and ground stability parameters are currently within normal baseline limits.",
          badgeClass: "badge-low",
          cardClass: ""
        };
    }
  };

  const statusInfo = getStatusBadge(currentZone.riskLevel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* 1. PRIMARY 2D GIS RISK MAP (~68% Viewport Height) */}
      <div style={{ padding: '8px 12px 0 12px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot pulse-dot-critical" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Live GIS Geological Risk Command Map • North-East India
            </span>
          </div>
          <button 
            onClick={() => setIsFullScreenMap(true)}
            style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-blue-600)', background: 'var(--color-blue-50)', border: '1px solid var(--color-border)', padding: '5px 12px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Expand Fullscreen</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* The 52vh Hero 2D GIS Map */}
        <GisMap mode="hero" />
      </div>

      {/* 2. CITIZEN FEED & LOCAL CONDITIONS */}
      <div className="citizen-feed-container">
        {/* Core Citizen Question: "AM I SAFE?" */}
        <div className={`risk-summary-card ${statusInfo.cardClass}`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div 
              style={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: '14px', 
                background: currentZone.riskLevel === 'CRITICAL' ? 'var(--risk-critical-bg)' : 'var(--risk-low-bg)',
                border: currentZone.riskLevel === 'CRITICAL' ? '1px solid var(--color-risk-critical)' : '1px solid var(--color-risk-low)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldAlert 
                size={28} 
                color={currentZone.riskLevel === 'CRITICAL' ? 'var(--color-risk-critical)' : 'var(--color-risk-low)'} 
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <span className={`badge ${statusInfo.badgeClass}`}>
                  <span className={`pulse-dot pulse-dot-${currentZone.riskLevel.toLowerCase()}`} />
                  {currentZone.riskLevel} RISK ({currentZone.riskPercentage}%)
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  📍 Selected Zone: <strong style={{ color: 'var(--color-navy)' }}>{currentZone.name}</strong>
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
                {statusInfo.title}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {statusInfo.desc}
              </p>
            </div>
          </div>

          <button 
            className="btn-primary"
            onClick={() => setCitizenActiveTab('alerts')}
            style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 600, borderRadius: '10px', whiteSpace: 'nowrap' }}
          >
            View Official Warnings
          </button>
        </div>



        {/* Local Micro-Climate Weather & Telemetry Card */}
        {currentZone.weather && (
          <div className="card" style={{ padding: '20px 22px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-blue-50)', border: '1px solid var(--color-blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CloudRain size={20} color="var(--color-blue-500)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Himalayan Atmospheric & Saturation Telemetry</h3>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Automated Weather Station (AWS) Mesh</div>
                </div>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-blue-600)', background: 'var(--color-blue-50)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-border)' }}>
                {currentZone.district}, {currentZone.state}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', padding: '14px 12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ambient Temperature</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-navy)', margin: '4px 0' }}>
                  {currentZone.weather.temp}°C
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-blue-500)', fontWeight: 600 }}>{currentZone.weather.condition}</div>
              </div>

              <div style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', padding: '14px 12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>24h Precipitation</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-blue-600)', margin: '4px 0' }}>
                  {currentZone.weather.rainfall} mm
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-risk-high)', fontWeight: 600 }}>Heavy Infiltration</div>
              </div>

              <div style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', padding: '14px 12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Soil Saturation</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-risk-low)', margin: '4px 0' }}>
                  {currentZone.weather.humidity}%
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-risk-low)', fontWeight: 600 }}>Near Saturation</div>
              </div>

              <div style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', padding: '14px 12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ridge Wind Vector</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy)', margin: '6px 0' }}>
                  {currentZone.weather.wind}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Gusting Winds</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenHome;
