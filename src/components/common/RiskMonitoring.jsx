import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, TrendingDown, Activity, CloudRain, 
  Layers, Gauge, ArrowUpRight, ArrowDownRight, 
  MapPin, Clock, Info, ShieldAlert 
} from 'lucide-react';

const RiskMonitoring = () => {
  const { locations, selectedZoneId, setSelectedZoneId, t } = useApp();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h'); // '24h' | '7d'
  const [activeZoneKey, setActiveZoneKey] = useState(selectedZoneId || locations[0]?.id || 'loc-mangan');

  useEffect(() => {
    if (selectedZoneId) {
      setActiveZoneKey(selectedZoneId);
    }
  }, [selectedZoneId]);

  const activeZone = locations.find(l => l.id === activeZoneKey) || locations[0];

  // Base 24-Hour and 7-Day Templates
  const baseSeries24h = [
    { time: '00:00', rainNorm: 0.12, dispNorm: 0.14, moistNorm: 0.74, poreNorm: 0.31 },
    { time: '02:00', rainNorm: 0.16, dispNorm: 0.17, moistNorm: 0.79, poreNorm: 0.37 },
    { time: '04:00', rainNorm: 0.22, dispNorm: 0.21, moistNorm: 0.82, poreNorm: 0.44 },
    { time: '06:00', rainNorm: 0.34, dispNorm: 0.28, moistNorm: 0.88, poreNorm: 0.55 },
    { time: '08:00', rainNorm: 0.46, dispNorm: 0.40, moistNorm: 0.92, poreNorm: 0.65 },
    { time: '10:00', rainNorm: 0.70, dispNorm: 0.58, moistNorm: 0.96, poreNorm: 0.77 },
    { time: '12:00', rainNorm: 0.85, dispNorm: 0.79, moistNorm: 0.99, poreNorm: 0.89 },
    { time: '14:00', rainNorm: 1.00, dispNorm: 1.00, moistNorm: 1.00, poreNorm: 1.00 },
    { time: '16:00', rainNorm: 0.76, dispNorm: 0.88, moistNorm: 0.97, poreNorm: 0.94 },
    { time: '18:00', rainNorm: 0.57, dispNorm: 0.72, moistNorm: 0.95, poreNorm: 0.84 },
    { time: '20:00', rainNorm: 0.41, dispNorm: 0.60, moistNorm: 0.93, poreNorm: 0.72 },
    { time: '22:00', rainNorm: 0.28, dispNorm: 0.48, moistNorm: 0.90, poreNorm: 0.62 }
  ];

  const baseSeries7d = [
    { time: 'Day 1', rainNorm: 0.28, dispNorm: 0.20, moistNorm: 0.71, poreNorm: 0.37 },
    { time: 'Day 2', rainNorm: 0.42, dispNorm: 0.31, moistNorm: 0.79, poreNorm: 0.48 },
    { time: 'Day 3', rainNorm: 0.55, dispNorm: 0.43, moistNorm: 0.85, poreNorm: 0.58 },
    { time: 'Day 4', rainNorm: 0.84, dispNorm: 0.67, moistNorm: 0.93, poreNorm: 0.79 },
    { time: 'Day 5', rainNorm: 1.10, dispNorm: 0.93, moistNorm: 1.00, poreNorm: 0.96 },
    { time: 'Day 6', rainNorm: 1.00, dispNorm: 1.00, moistNorm: 1.00, poreNorm: 1.00 },
    { time: 'Day 7', rainNorm: 0.69, dispNorm: 0.79, moistNorm: 0.96, poreNorm: 0.86 }
  ];

  // Dynamically derive current data from active location factors
  const peakRain = activeZone.factors?.rainfall?.value || 112;
  const peakDisp = activeZone.factors?.groundMovement?.value || 5.8;
  const peakMoist = activeZone.factors?.soilMoisture?.value || 91;
  const peakPore = Math.round(peakMoist * 0.64);

  const rawData = selectedTimeframe === '24h' ? baseSeries24h : baseSeries7d;
  const currentData = rawData.map(d => ({
    time: d.time,
    rainfall: Math.round(d.rainNorm * peakRain),
    displacement: Number((d.dispNorm * peakDisp).toFixed(1)),
    moisture: Math.min(100, Math.round(d.moistNorm * peakMoist)),
    porePressure: Math.round(d.poreNorm * peakPore)
  }));

  // Dynamic Scale bounds for charts
  const maxRain = Math.max(140, peakRain * 1.25);
  const maxDisplacement = Math.max(7.0, peakDisp * 1.2);
  const maxMoisture = 100;

  // Dynamic Stability Factor (FS)
  const stabilityFactor = activeZone.riskLevel === 'CRITICAL'
    ? (1.00 + (100 - activeZone.riskPercentage) * 0.005).toFixed(2)
    : activeZone.riskLevel === 'HIGH'
    ? (1.20 + (80 - activeZone.riskPercentage) * 0.01).toFixed(2)
    : activeZone.riskLevel === 'MODERATE'
    ? (1.45 + (50 - activeZone.riskPercentage) * 0.015).toFixed(2)
    : (1.85 + (30 - activeZone.riskPercentage) * 0.02).toFixed(2);

  // Rainfall Trend
  const isRainIncrement = peakRain >= 70;
  const rainPct = Math.abs(Math.round(((peakRain - 70) / 70) * 100));

  // Earth movement status
  const isEarthCritical = peakDisp >= 3.0;

  return (
    <div className="citizen-feed-container" style={{ paddingBottom: '32px' }}>
      {/* Top Banner & Location/Time Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={22} color="var(--color-blue-500)" />
            <span>{t.monitoring?.title || "Risk Monitoring & Factor Dynamics"}</span>
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            {t.monitoring?.subtitle || "Real-time multi-factor geotechnical curves showing temporal increment and decrement"}
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
              {t.monitoring?.past24h || "Past 24 Hours"}
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
              {t.monitoring?.past7d || "Past 7 Days"}
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Trend Summary Cards (DYNAMICALLY DERIVED FROM activeZone) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {/* 1. Rainfall Influx Metric */}
        <div className="card" style={{ padding: '16px', borderLeft: '4px solid #1565C0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              {t.monitoring?.precipRate || "Precipitation Rate"}
            </span>
            <CloudRain size={16} color="#1565C0" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-heading)' }}>
              {peakRain} mm
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.74rem', fontWeight: 700, color: isRainIncrement ? '#D32F2F' : '#2E7D32' }}>
              {isRainIncrement ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
              {isRainIncrement ? `+${rainPct}% (${t.monitoring?.increment || 'Increment'})` : `-${rainPct}% (Normal)`}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            {t.monitoring?.thresholdLimit || "Threshold limit"}: 80 mm / 24h
          </span>
        </div>

        {/* 2. Earth Displacement Metric */}
        <div className="card" style={{ padding: '16px', borderLeft: isEarthCritical ? '4px solid #D32F2F' : '4px solid #2E7D32' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              {t.monitoring?.earthMovement || "Earth Movement Velocity"}
            </span>
            <TrendingUp size={16} color={isEarthCritical ? '#D32F2F' : '#2E7D32'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: isEarthCritical ? '#D32F2F' : '#10202E', fontFamily: 'var(--font-heading)' }}>
              {peakDisp} mm/h
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.74rem', fontWeight: 700, color: isEarthCritical ? '#D32F2F' : '#2E7D32' }}>
              {isEarthCritical ? (
                <><ArrowUpRight size={14} /> +{(peakDisp - 3.0).toFixed(1)} mm/h ({t.monitoring?.accelerating || 'Accelerating'})</>
              ) : (
                <><ArrowDownRight size={14} /> Stable (&lt; 3.0 mm/h)</>
              )}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            {t.monitoring?.criticalThreshold || "Critical threshold"}: &gt; 3.0 mm/h
          </span>
        </div>

        {/* 3. Soil Moisture Metric */}
        <div className="card" style={{ padding: '16px', borderLeft: peakMoist > 80 ? '4px solid #F57C00' : '4px solid #2E7D32' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              {t.monitoring?.soilSaturation || "Soil Saturation"}
            </span>
            <Layers size={16} color={peakMoist > 80 ? '#F57C00' : '#2E7D32'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-heading)' }}>
              {peakMoist}%
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.74rem', fontWeight: 700, color: peakMoist > 80 ? '#F57C00' : '#2E7D32' }}>
              {peakMoist > 85 ? (t.monitoring?.nearSaturated || "Near Saturated") : peakMoist > 70 ? "High Moisture" : "Stable Moisture"}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            {t.monitoring?.porePressure || "Pore water pressure"}: {peakPore} kPa
          </span>
        </div>

        {/* 4. Factor of Safety Metric */}
        <div className="card" style={{ padding: '16px', borderLeft: Number(stabilityFactor) < 1.2 ? '4px solid #D32F2F' : Number(stabilityFactor) < 1.4 ? '4px solid #F57C00' : '4px solid #2E7D32' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
              {t.monitoring?.stabilityFactor || "Stability Factor (FS)"}
            </span>
            <Gauge size={16} color={Number(stabilityFactor) < 1.2 ? '#D32F2F' : '#2E7D32'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: Number(stabilityFactor) < 1.2 ? '#D32F2F' : 'var(--color-navy)', fontFamily: 'var(--font-heading)' }}>
              {stabilityFactor}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.74rem', fontWeight: 700, color: Number(stabilityFactor) < 1.2 ? '#D32F2F' : '#2E7D32' }}>
              {Number(stabilityFactor) < 1.2 ? (
                <><ArrowDownRight size={14} /> -0.32 ({t.monitoring?.decrement || 'Decrementing'})</>
              ) : Number(stabilityFactor) < 1.4 ? (
                <><ArrowDownRight size={14} /> -0.12 (Marginal)</>
              ) : (
                <><ArrowUpRight size={14} /> +0.18 (Stable)</>
              )}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            {t.monitoring?.failureLimit || "Failure limit"}: &lt; 1.00 ({Number(stabilityFactor) < 1.2 ? 'Critical' : 'Safe'})
          </span>
        </div>
      </div>

      {/* GRAPH 1: RAINFALL INFILTRATION OVER TIME */}
      <div className="card" style={{ padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{t.monitoring?.graph1Title || "Graph 1: Rainfall Infiltration Volume vs Time"}</span>
              <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>Y: Rainfall (mm) • X: Time</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
              Observation for {activeZone.name} ({activeZone.district}, {activeZone.state})
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
              <span>{Math.round(maxRain)} mm</span>
              <span>80 mm</span>
              <span>40 mm</span>
              <span>0 mm</span>
            </div>

            {/* X-Axis and Bars Area */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingLeft: '10px', paddingBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
              {/* Critical 80mm Threshold Guideline */}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${Math.min(150, (80 / maxRain) * 156)}px`, borderTop: '1px dashed #D32F2F', zIndex: 1, opacity: 0.6 }} />
              {/* Warning 40mm Threshold Guideline */}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${Math.min(150, (40 / maxRain) * 156)}px`, borderTop: '1px dashed #F57C00', zIndex: 1, opacity: 0.6 }} />

              {/* Render Bar Chart Elements */}
              {currentData.map((d, idx) => {
                const barHeight = Math.max(4, Math.min(150, (d.rainfall / maxRain) * 140));
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

      {/* GRAPH 2: EARTH DISPLACEMENT VELOCITY */}
      <div className="card" style={{ padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{t.monitoring?.graph2Title || "Graph 2: Earth Displacement Velocity & Slope Creep Rate"}</span>
              <span className={`badge ${isEarthCritical ? 'badge-critical' : 'badge-low'}`} style={{ fontSize: '0.68rem' }}>
                Y: Movement (mm/h) • X: Time
              </span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
              Monitored via inclinometers. Sensor reading: {peakDisp} mm/h ({activeZone.name})
            </p>
          </div>

          <span style={{ fontSize: '0.72rem', color: isEarthCritical ? '#D32F2F' : '#2E7D32', fontWeight: 700 }}>
            Active Velocity: {peakDisp} mm/h {isEarthCritical ? '(Accelerated Slip)' : '(Stable Baseline)'}
          </span>
        </div>

        {/* SVG Line Graph Container */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <div style={{ minWidth: '550px', height: '190px', position: 'relative', display: 'flex' }}>
            <div style={{ width: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: '8px', paddingBottom: '24px', fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 600, borderRight: '1px solid var(--color-border)' }}>
              <span>{maxDisplacement.toFixed(1)}</span>
              <span>{(maxDisplacement * 0.66).toFixed(1)}</span>
              <span>{(maxDisplacement * 0.33).toFixed(1)}</span>
              <span>0.0</span>
            </div>

            <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, position: 'relative', borderBottom: '1px solid var(--color-border)' }}>
                {/* 3.0 mm/h Critical Threshold */}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${Math.min(130, (3.0 / maxDisplacement) * 140)}px`, borderTop: '1px dashed #D32F2F', zIndex: 1, opacity: 0.6 }} />

                <svg viewBox="0 0 1000 140" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="dispGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isEarthCritical ? "#D32F2F" : "#1565C0"} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={isEarthCritical ? "#D32F2F" : "#1565C0"} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  <polygon
                    points={`20,130 ${currentData.map((d, i) => {
                      const x = 20 + (i / (currentData.length - 1)) * 960;
                      const y = Math.max(10, 130 - (d.displacement / maxDisplacement) * 115);
                      return `${x},${y}`;
                    }).join(' ')} 980,130`}
                    fill="url(#dispGrad)"
                  />

                  <polyline
                    fill="none"
                    stroke={isEarthCritical ? "#D32F2F" : "#1565C0"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={currentData.map((d, i) => {
                      const x = 20 + (i / (currentData.length - 1)) * 960;
                      const y = Math.max(10, 130 - (d.displacement / maxDisplacement) * 115);
                      return `${x},${y}`;
                    }).join(' ')}
                  />

                  {currentData.map((d, i) => {
                    const x = 20 + (i / (currentData.length - 1)) * 960;
                    const y = Math.max(10, 130 - (d.displacement / maxDisplacement) * 115);

                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="4"
                        fill={isEarthCritical ? "#D32F2F" : "#1565C0"}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      >
                        <title>{`${d.time}: ${d.displacement} mm/h`}</title>
                      </circle>
                    );
                  })}
                </svg>
              </div>

              <div style={{ height: '24px', display: 'flex', justifyContent: 'space-between', paddingLeft: '12px', paddingRight: '12px', alignItems: 'center' }}>
                {currentData.map((d, i) => (
                  <span key={i} style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    {d.time}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            X-Axis: Time Sequence • Kinematic slope telemetry
          </div>
        </div>
      </div>

      {/* GRAPH 3: SOIL MOISTURE SATURATION */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{t.monitoring?.graph3Title || "Graph 3: Soil Moisture Saturation (%) & Pore Pressure (kPa)"}</span>
              <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>Y: Saturation % • X: Time</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
              Readings for {activeZone.name}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', fontSize: '0.72rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2E7D32' }} />
              Soil Saturation ({peakMoist}%)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0288D1' }} />
              Pore Pressure ({peakPore} kPa)
            </span>
          </div>
        </div>

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

                  <line x1="20" y1={130 - (85 / 100) * 115} x2="980" y2={130 - (85 / 100) * 115} stroke="#2E7D32" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.65" />

                  <polygon
                    points={`20,130 ${currentData.map((d, i) => {
                      const x = 20 + (i / (currentData.length - 1)) * 960;
                      const y = 130 - (d.moisture / maxMoisture) * 115;
                      return `${x},${y}`;
                    }).join(' ')} 980,130`}
                    fill="url(#moistureGrad)"
                  />

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

                  <polyline
                    fill="none"
                    stroke="#0288D1"
                    strokeWidth="2.5"
                    strokeDasharray="5,5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={currentData.map((d, i) => {
                      const x = 20 + (i / (currentData.length - 1)) * 960;
                      const y = 130 - (d.porePressure / Math.max(70, peakPore * 1.1)) * 115;
                      return `${x},${y}`;
                    }).join(' ')}
                  />

                  {currentData.map((d, i) => {
                    const x = 20 + (i / (currentData.length - 1)) * 960;
                    const y = 130 - (d.moisture / maxMoisture) * 115;
                    return (
                      <circle
                        key={`m-${i}`}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#2E7D32"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      >
                        <title>{`${d.time}: Soil Saturation ${d.moisture}%`}</title>
                      </circle>
                    );
                  })}
                </svg>
              </div>

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
            X-Axis: Time Progression • Saturation readings
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMonitoring;
