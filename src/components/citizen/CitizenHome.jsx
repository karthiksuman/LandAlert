import React from 'react';
import { useApp } from '../../context/AppContext';
import GisMap from '../gis/GisMap';
import RouteSafetyCard from './RouteSafetyCard';
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
      {/* 1. PRIMARY 3D GIS SPATIAL TERRAIN MAP (68-72% Viewport Height) */}
      <div style={{ padding: '8px 12px 0 12px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot pulse-dot-critical" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              3D Intelligent Spatial Terrain • North-East India Command
            </span>
          </div>
          <button 
            onClick={() => setIsFullScreenMap(true)}
            style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cyan)', background: 'rgba(25, 199, 255, 0.1)', border: '1px solid rgba(25, 199, 255, 0.25)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <span>Expand Fullscreen</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Hero 3D Spatial Terrain Map Viewport */}
        <GisMap mode="hero" />
      </div>

      {/* 2. CITIZEN FEED & LOCAL CONDITIONS */}
      <div className="citizen-feed-container">
        {/* Core Citizen Question: "AM I SAFE?" */}
        <div className={`risk-summary-card card-tilt-3d ${statusInfo.cardClass}`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div 
              style={{ 
                width: '52px', 
                height: '52px', 
                borderRadius: '16px', 
                background: currentZone.riskLevel === 'CRITICAL' ? 'rgba(255, 59, 59, 0.2)' : 'rgba(25, 212, 123, 0.2)',
                border: currentZone.riskLevel === 'CRITICAL' ? '1px solid rgba(255, 59, 59, 0.4)' : '1px solid rgba(25, 212, 123, 0.4)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: currentZone.riskLevel === 'CRITICAL' ? '0 0 20px rgba(255, 59, 59, 0.4)' : '0 0 20px rgba(25, 212, 123, 0.3)'
              }}
            >
              <ShieldAlert 
                size={30} 
                color={currentZone.riskLevel === 'CRITICAL' ? '#FF3B3B' : '#19D47B'} 
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <span className={`badge ${statusInfo.badgeClass}`}>
                  <span className={`pulse-dot pulse-dot-${currentZone.riskLevel.toLowerCase()}`} />
                  {currentZone.riskLevel} RISK ({currentZone.riskPercentage}%)
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  📍 Selected Zone: <strong style={{ color: '#fff' }}>{currentZone.name}</strong>
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
                {statusInfo.title}
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {statusInfo.desc}
              </p>
            </div>
          </div>

          <button 
            className="btn-primary"
            onClick={() => setCitizenActiveTab('alerts')}
            style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700, borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap' }}
          >
            View Official Warnings
          </button>
        </div>

        {/* Route Safety Warning & Safe Detour */}
        <div className="card-tilt-3d">
          <RouteSafetyCard />
        </div>

        {/* Local Micro-Climate Weather & Telemetry Card */}
        {currentZone.weather && (
          <div className="glass-panel card-tilt-3d" style={{ padding: '22px 24px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(25, 199, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CloudRain size={20} color="var(--cyan)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>Himalayan Atmospheric & Saturation Telemetry</h3>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Automated Weather Station (AWS) Mesh</div>
                </div>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--cyan)', background: 'rgba(25, 199, 255, 0.1)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(25, 199, 255, 0.2)' }}>
                {currentZone.district}, {currentZone.state}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(6, 19, 31, 0.7)', border: '1px solid var(--border-glass)', padding: '14px 12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ambient Temperature</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '4px 0' }}>
                  {currentZone.weather.temp}°C
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--cyan)', fontWeight: 600 }}>{currentZone.weather.condition}</div>
              </div>

              <div style={{ background: 'rgba(6, 19, 31, 0.7)', border: '1px solid var(--border-glass)', padding: '14px 12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>24h Precipitation</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#19C7FF', margin: '4px 0', textShadow: '0 0 10px rgba(25, 199, 255, 0.4)' }}>
                  {currentZone.weather.rainfall} mm
                </div>
                <div style={{ fontSize: '0.74rem', color: '#FF8A00', fontWeight: 600 }}>Heavy Infiltration</div>
              </div>

              <div style={{ background: 'rgba(6, 19, 31, 0.7)', border: '1px solid var(--border-glass)', padding: '14px 12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Soil Saturation</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#19D47B', margin: '4px 0', textShadow: '0 0 10px rgba(25, 212, 123, 0.4)' }}>
                  {currentZone.weather.humidity}%
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--green)', fontWeight: 600 }}>Near Saturation</div>
              </div>

              <div style={{ background: 'rgba(6, 19, 31, 0.7)', border: '1px solid var(--border-glass)', padding: '14px 12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Ridge Wind Vector</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '6px 0' }}>
                  {currentZone.weather.wind}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gusting Winds</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenHome;
