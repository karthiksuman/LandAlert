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
      {/* 1. PRIMARY GIS RISK MAP (~50% Viewport Height) */}
      <div style={{ padding: '12px 16px 0 16px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot pulse-dot-critical" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Live GIS Geological Risk Map • North-East India
            </span>
          </div>
          <button 
            onClick={() => setIsFullScreenMap(true)}
            style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Tap Map to Expand (100% Fullscreen)
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* The 50% Map */}
        <GisMap mode="half" />
      </div>

      {/* 2. CITIZEN FEED & LOCAL CONDITIONS */}
      <div className="citizen-feed-container">
        {/* Core Citizen Question: "AM I SAFE?" */}
        <div className={`risk-summary-card ${statusInfo.cardClass}`}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div 
              style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '12px', 
                background: currentZone.riskLevel === 'CRITICAL' ? 'rgba(211, 47, 47, 0.2)' : 'rgba(46, 125, 50, 0.2)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldAlert 
                size={26} 
                color={currentZone.riskLevel === 'CRITICAL' ? '#FF5252' : '#66BB6A'} 
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span className={`badge ${statusInfo.badgeClass}`}>
                  {currentZone.riskLevel} RISK ({currentZone.riskPercentage}%)
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  📍 {currentZone.name}
                </span>
              </div>
              <h2 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '4px' }}>
                {statusInfo.title}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                {statusInfo.desc}
              </p>
            </div>
          </div>

          <button 
            className="btn-primary"
            onClick={() => setCitizenActiveTab('alerts')}
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            View Official Warnings
          </button>
        </div>

        {/* Route Safety Warning & Safe Detour */}
        <RouteSafetyCard />

        {/* Local Micro-Climate Weather & Telemetry Card */}
        {currentZone.weather && (
          <div className="glass-panel" style={{ padding: '18px 20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CloudRain size={20} color="#29B6F6" />
                <h3 style={{ fontSize: '1.0rem', color: '#fff' }}>Local Mountain Weather & Saturation</h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {currentZone.district}, {currentZone.state}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div style={{ background: 'rgba(7, 21, 34, 0.6)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Temperature</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '2px 0' }}>
                  {currentZone.weather.temp}°C
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--brand-cyan)' }}>{currentZone.weather.condition}</div>
              </div>

              <div style={{ background: 'rgba(7, 21, 34, 0.6)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>24h Precipitation</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#29B6F6', margin: '2px 0' }}>
                  {currentZone.weather.rainfall} mm
                </div>
                <div style={{ fontSize: '0.72rem', color: '#FF9100' }}>Heavy Infiltration</div>
              </div>

              <div style={{ background: 'rgba(7, 21, 34, 0.6)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Soil Relative Humidity</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00E676', margin: '2px 0' }}>
                  {currentZone.weather.humidity}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Near Saturation</div>
              </div>

              <div style={{ background: 'rgba(7, 21, 34, 0.6)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Valley Wind</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '4px 0' }}>
                  {currentZone.weather.wind}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Gusting</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenHome;
