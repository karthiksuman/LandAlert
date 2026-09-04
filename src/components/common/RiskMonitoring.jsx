import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, TrendingDown, Activity, CloudRain, 
  Layers, Gauge, ArrowUpRight, ArrowDownRight, 
  MapPin, Clock, Info, ShieldAlert 
} from 'lucide-react';

const RiskMonitoring = () => {
  const { locations, selectedZoneId, setSelectedZoneId } = useApp();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h'); // '24h' | '7d'
  const [activeZoneKey, setActiveZoneKey] = useState(selectedZoneId || 'mangan');

  const activeZone = locations.find(l => l.id === activeZoneKey) || locations[0];

  // 24-Hour Time Series Data for Rainfall, Earth Displacement, Soil Saturation, and Pore Pressure
  const timeSeries24h = [
    { time: '00:00', rainfall: 14, displacement: 0.8, moisture: 68, porePressure: 18 },
    { time: '02:00', rainfall: 18, displacement: 1.0, moisture: 72, porePressure: 22 },
    { time: '04:00', rainfall: 25, displacement: 1.2, moisture: 75, porePressure: 26 },
    { time: '06:00', rainfall: 38, displacement: 1.6, moisture: 80, porePressure: 32 },
    { time: '08:00', rainfall: 52, displacement: 2.3, moisture: 84, porePressure: 38 },
    { time: '10:00', rainfall: 78, displacement: 3.4, moisture: 88, porePressure: 45 },
    { time: '12:00', rainfall: 96, displacement: 4.6, moisture: 90, porePressure: 52 },
    { time: '14:00', rainfall: 112, displacement: 5.8, moisture: 91, porePressure: 58 },
    { time: '16:00', rainfall: 85, displacement: 5.1, moisture: 89, porePressure: 55 },
    { time: '18:00', rainfall: 64, displacement: 4.2, moisture: 87, porePressure: 49 },
    { time: '20:00', rainfall: 46, displacement: 3.5, moisture: 85, porePressure: 42 },
    { time: '22:00', rainfall: 32, displacement: 2.8, moisture: 82, porePressure: 36 }
  ];

  // 7-Day Time Series Data
  const timeSeries7d = [
    { time: 'Day 1', rainfall: 32, displacement: 1.2, moisture: 65, porePressure: 22 },
    { time: 'Day 2', rainfall: 48, displacement: 1.8, moisture: 72, porePressure: 28 },
    { time: 'Day 3', rainfall: 62, displacement: 2.5, moisture: 78, porePressure: 34 },
    { time: 'Day 4', rainfall: 95, displacement: 3.9, moisture: 85, porePressure: 46 },
    { time: 'Day 5', rainfall: 124, displacement: 5.4, moisture: 91, porePressure: 56 },
    { time: 'Day 6', rainfall: 112, displacement: 5.8, moisture: 91, porePressure: 58 },
    { time: 'Day 7', rainfall: 78, displacement: 4.6, moisture: 88, porePressure: 50 }
  ];

  const currentData = selectedTimeframe === '24h' ? timeSeries24h : timeSeries7d;

  // Maximum scale bounds for charts
  const maxRain = 130; // mm
  const maxDisplacement = 7.0; // mm/h
  const maxMoisture = 100; // %

  return (
    <div className="citizen-feed-container" style={{ paddingBottom: '32px' }}>
      {/* Top Banner & Location/Time Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={22} color="var(--color-blue-500)" />
            <span>Risk Monitoring & Factor Dynamics</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            Real-time multi-factor geotechnical curves showing temporal increment and decrement
          </p>
        </div>

        {/* Sector Selector & Timeframe Toggle */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={activeZoneKey}
            onChange={(e) => {
              setActiveZoneKey(e.target.value);
              setSelectedZoneId(e.target.value);
            }}
            style={{
              padding: '7px 12px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-border)',
              background: '#FFFFFF',
              color: 'var(--color-navy)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                📍 {loc.name} ({loc.riskPercentage}%)
              </option>
            ))}
          </select>

          <div style={{ display: 'inline-flex', background: 'var(--color-blue-50)', padding: '3px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-blue-200)' }}>
            <button
              onClick={() => setSelectedTimeframe('24h')}
              style={{
                background: selectedTimeframe === '24h' ? 'var(--color-blue-500)' : 'transparent',
                color: selectedTimeframe === '24h' ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '5px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Past 24 Hours
            </button>
            <button
              onClick={() => setSelectedTimeframe('7d')}
              style={{
                background: selectedTimeframe === '7d' ? 'var(--color-blue-500)' : 'transparent',
                color: selectedTimeframe === '7d' ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '5px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Past 7 Days
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Trend Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {/* Rainfall Influx Metric */}
        <div className="card" style={{ padding: '16px', borderLeft: '4px solid #1565C0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Precipitation Rate
            </span>
            <CloudRain size={16} color="#1565C0" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-heading)' }}>
              112 mm
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.74rem', fontWeight: 700, color: '#D32F2F' }}>
              <ArrowUpRight size={14} /> +24% (Increment)
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            Threshold limit: 80 mm / 24h
          </span>
        </div>

        {/* Earth Displacement Metric */}
        <div className="card" style={{ padding: '16px', borderLeft: '4px solid #D32F2F' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Earth Movement Velocity
            </span>
            <TrendingUp size={16} color="#D32F2F" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#D32F2F', fontFamily: 'var(--font-heading)' }}>
              5.8 mm/h
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.74rem', fontWeight: 700, color: '#D32F2F' }}>
              <ArrowUpRight size={14} /> +1.2 mm/h (Accelerating)
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            Critical threshold: &gt; 3.0 mm/h
          </span>
        </div>

        {/* Soil Moisture Metric */}
        <div className="card" style={{ padding: '16px', borderLeft: '4px solid #2E7D32' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Soil Saturation
            </span>
            <Layers size={16} color="#2E7D32" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-heading)' }}>
              91%
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.74rem', fontWeight: 700, color: '#F57C00' }}>
              <ArrowUpRight size={14} /> Near Saturated
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            Pore water pressure: 58 kPa
          </span>
        </div>

        {/* Factor of Safety Metric */}
        <div className="card" style={{ padding: '16px', borderLeft: '4px solid #F57C00' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              Stability Factor (FS)
            </span>
            <Gauge size={16} color="#F57C00" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#D32F2F', fontFamily: 'var(--font-heading)' }}>
              1.04
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.74rem', fontWeight: 700, color: '#D32F2F' }}>
              <ArrowDownRight size={14} /> -0.32 (Decrementing)
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            Failure limit: &lt; 1.00 (Imminent)
          </span>
        </div>
      </div>

      {/* =======================================================
          GRAPH 1: RAINFALL INFILTRATION OVER TIME (X vs Y Axis)
          ======================================================= */}
      <div className="card" style={{ padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Graph 1: Rainfall Infiltration Volume vs Time</span>
              <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>Y: Rainfall (mm) • X: Time</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
              Shows temporal increment during afternoon cloudburst peak (14:00) and gradual night runoff decrement
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '4px', background: '#D32F2F', borderRadius: '2px' }} />
              Critical Threshold (80 mm)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '12px', height: '4px', background: '#F57C00', borderRadius: '2px' }} />
              Warning (40 mm)
            </span>
          </div>
        </div>

        {/* SVG Chart Container */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: '550px', height: '180px', position: 'relative', display: 'flex' }}>
            {/* Y-Axis Column */}
            <div style={{ width: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: '8px', fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 600, borderRight: '1px solid var(--color-border)' }}>
              <span>120 mm</span>
              <span>80 mm</span>
              <span>40 mm</span>
              <span>0 mm</span>
            </div>

            {/* X-Axis and Bars Area */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingLeft: '10px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
              {/* Critical 80mm Threshold Guideline */}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${(80 / maxRain) * 156}px`, borderTop: '1px dashed #D32F2F', zIndex: 1, opacity: 0.6 }} />
              {/* Warning 40mm Threshold Guideline */}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${(40 / maxRain) * 156}px`, borderTop: '1px dashed #F57C00', zIndex: 1, opacity: 0.6 }} />

              {/* Render Bar Chart Elements */}
              {currentData.map((d, idx) => {
                const barHeight = (d.rainfall / maxRain) * 140;
                const isCritical = d.rainfall >= 80;
                const isWarning = d.rainfall >= 40 && d.rainfall < 80;
                const color = isCritical ? '#D32F2F' : isWarning ? '#F57C00' : '#1565C0';

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', zIndex: 2, flex: 1 }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: color, marginBottom: '2px' }}>
                      {d.rainfall}
                    </span>
                    <div 
                      style={{ 
                        width: '70%', 
                        maxWidth: '22px', 
                        height: `${barHeight}px`, 
                        background: color, 
                        borderRadius: '4px 4px 0 0',
                        boxShadow: isCritical ? '0 0 8px rgba(211, 47, 47, 0.4)' : 'none',
                        transition: 'height 0.4s ease'
                      }}
                      title={`${d.time}: ${d.rainfall} mm`}
                    />
                    <span style={{ position: 'absolute', bottom: '4px', fontSize: '0.68rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                      {d.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            X-Axis: Monitored Observation Intervals ({selectedTimeframe === '24h' ? 'Hours of Day' : 'Day 1 to Day 7'})
          </div>
        </div>
      </div>

      {/* ===================================================================
          GRAPH 2: EARTH DISPLACEMENT / GROUND VIBRATION (X vs Y Line Graph)
          =================================================================== */}
      <div className="card" style={{ padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Graph 2: Earth Displacement Velocity & Slope Creep Rate</span>
              <span className="badge badge-critical" style={{ fontSize: '0.68rem' }}>Y: Movement (mm/h) • X: Time</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
              Monitored via in-place borehole inclinometers. Steep increment indicates slip surface activation.
            </p>
          </div>

          <span style={{ fontSize: '0.72rem', color: '#D32F2F', fontWeight: 700 }}>
            Active Velocity: 5.8 mm/h (Accelerated Slip)
          </span>
        </div>

        {/* SVG Line Graph Container */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: '550px', height: '190px', position: 'relative', display: 'flex' }}>
            {/* Y-Axis Column */}
            <div style={{ width: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: '8px', paddingBottom: '26px', fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 600, borderRight: '1px solid var(--color-border)' }}>
              <span>6.0 mm/h</span>
              <span>4.0 mm/h</span>
              <span>2.0 mm/h</span>
              <span>0.0 mm/h</span>
            </div>

            {/* Line Plot Area */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, position: 'relative', borderBottom: '1px solid var(--color-border)' }}>
                <svg viewBox="0 0 1000 140" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="displacementGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D32F2F" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#D32F2F" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Critical Alert Dashed Guideline at 3.0 mm/h */}
                  <line x1="20" y1={130 - (3.0 / 6.0) * 115} x2="980" y2={130 - (3.0 / 6.0) * 115} stroke="#D32F2F" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.65" />

                  {/* Shaded Area Under Curve */}
                  <polygon
                    points={`20,130 ${currentData.map((d, i) => {
                      const x = 20 + (i / (currentData.length - 1)) * 960;
                      const y = 130 - (d.displacement / maxDisplacement) * 115;
                      return `${x},${y}`;
                    }).join(' ')} 980,130`}
                    fill="url(#displacementGrad)"
                  />

                  {/* Solid Connected Line Connecting All Dots */}
                  <polyline
                    fill="none"
                    stroke="#D32F2F"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={currentData.map((d, i) => {
                      const x = 20 + (i / (currentData.length - 1)) * 960;
                      const y = 130 - (d.displacement / maxDisplacement) * 115;
                      return `${x},${y}`;
                    }).join(' ')}
                  />

                  {/* Data Point Dots Connected On The Line */}
                  {currentData.map((d, i) => {
                    const x = 20 + (i / (currentData.length - 1)) * 960;
                    const y = 130 - (d.displacement / maxDisplacement) * 115;
                    const isHigh = d.displacement >= 3.0;

                    return (
                      <g key={i}>
                        {isHigh && (
                          <circle cx={x} cy={y} r="10" fill="#D32F2F" opacity="0.25" />
                        )}
                        <circle
                          cx={x}
                          cy={y}
                          r={isHigh ? 6 : 5}
                          fill={isHigh ? '#D32F2F' : '#F57C00'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          style={{ cursor: 'pointer' }}
                        >
                          <title>{`${d.time}: ${d.displacement} mm/h (Displacement Rate)`}</title>
                        </circle>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* X-Axis Time Labels Directly Below Dots */}
              <div style={{ height: '26px', display: 'flex', justifyContent: 'space-between', paddingLeft: '12px', paddingRight: '12px', alignItems: 'center' }}>
                {currentData.map((d, i) => (
                  <span key={i} style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    {d.time}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            X-Axis: Time Sequence • Red line shows exponential ground displacement acceleration
          </div>
        </div>
      </div>

      {/* =====================================================================
          GRAPH 3: SOIL MOISTURE SATURATION & PORE PRESSURE (Dual-Axis Curve)
          ===================================================================== */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Graph 3: Soil Moisture Saturation (%) & Pore Pressure (kPa)</span>
              <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>Y: Saturation % • X: Time</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
              Continuous TDR sensor readings illustrating hydraulic gradient buildup prior to mass movement
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2E7D32' }} />
              Soil Saturation (91%)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0288D1' }} />
              Pore Pressure (58 kPa)
            </span>
          </div>
        </div>

        {/* SVG Area Curve */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: '550px', height: '190px', position: 'relative', display: 'flex' }}>
            <div style={{ width: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: '8px', paddingBottom: '26px', fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 600, borderRight: '1px solid var(--color-border)' }}>
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
            </div>

            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, position: 'relative', borderBottom: '1px solid var(--color-border)' }}>
                <svg viewBox="0 0 1000 140" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  {/* Critical Saturation Level 85% Dashed Line */}
                  <line x1="20" y1={130 - (85 / 100) * 115} x2="980" y2={130 - (85 / 100) * 115} stroke="#2E7D32" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.65" />

                  {/* Shaded Area Under Soil Saturation Curve */}
                  <polygon
                    points={`20,130 ${currentData.map((d, i) => {
                      const x = 20 + (i / (currentData.length - 1)) * 960;
                      const y = 130 - (d.moisture / maxMoisture) * 115;
                      return `${x},${y}`;
                    }).join(' ')} 980,130`}
                    fill="url(#moistureGrad)"
                  />

                  {/* 1. Connected Line For Soil Moisture Saturation (Green) */}
                  <polyline
                    fill="none"
                    stroke="#2E7D32"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={currentData.map((d, i) => {
                      const x = 20 + (i / (currentData.length - 1)) * 960;
                      const y = 130 - (d.moisture / maxMoisture) * 115;
                      return `${x},${y}`;
                    }).join(' ')}
                  />

                  {/* 2. Connected Line For Pore Pressure (Blue) */}
                  <polyline
                    fill="none"
                    stroke="#0288D1"
                    strokeWidth="2.5"
                    strokeDasharray="5,5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={currentData.map((d, i) => {
                      const x = 20 + (i / (currentData.length - 1)) * 960;
                      const y = 130 - (d.porePressure / 70) * 115;
                      return `${x},${y}`;
                    }).join(' ')}
                  />

                  {/* Green Dots for Soil Saturation */}
                  {currentData.map((d, i) => {
                    const x = 20 + (i / (currentData.length - 1)) * 960;
                    const y = 130 - (d.moisture / maxMoisture) * 115;

                    return (
                      <circle
                        key={`m-${i}`}
                        cx={x}
                        cy={y}
                        r="5"
                        fill="#2E7D32"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        style={{ cursor: 'pointer' }}
                      >
                        <title>{`${d.time}: Soil Saturation ${d.moisture}%`}</title>
                      </circle>
                    );
                  })}

                  {/* Blue Dots for Pore Pressure */}
                  {currentData.map((d, i) => {
                    const x = 20 + (i / (currentData.length - 1)) * 960;
                    const y = 130 - (d.porePressure / 70) * 115;

                    return (
                      <circle
                        key={`p-${i}`}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#0288D1"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        style={{ cursor: 'pointer' }}
                      >
                        <title>{`${d.time}: Pore Water Pressure ${d.porePressure} kPa`}</title>
                      </circle>
                    );
                  })}
                </svg>
              </div>

              {/* X-Axis Time Labels */}
              <div style={{ height: '26px', display: 'flex', justifyContent: 'space-between', paddingLeft: '12px', paddingRight: '12px', alignItems: 'center' }}>
                {currentData.map((d, i) => (
                  <span key={i} style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    {d.time}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            X-Axis: Time Progression • Saturation exceeds 85% liquefaction limit at 09:00
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMonitoring;
