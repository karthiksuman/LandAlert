import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, Navigation, 
  History, CloudRain, Calendar, ArrowRight, Wind, Droplets, 
  TrendingUp, MapPin, ExternalLink, Compass 
} from 'lucide-react';

const SafetyInsights = () => {
  const { locations, setSelectedZoneId, setCitizenActiveTab } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('detour'); // detour, history, weather

  // Historical Major Landslide Disasters in North-East India
  const historicalAlertYears = [
    {
      year: "2024",
      date: "June - July 2024",
      title: "Teesta Basin Flash Floods & Debris Surge",
      region: "Mangan & Dikchu Highway, North Sikkim",
      rainfall: "260 mm in 24h",
      impact: "NH-10 cut off for 18 days; 1,400 tourists evacuated via Indian Army air bridge.",
      severity: "CRITICAL",
      prevented: "Early acoustic sensors alerted 3 hours in advance, zero transit fatalities."
    },
    {
      year: "2023",
      date: "October 2023",
      title: "South Lhonak Glacial Lake Outburst (GLOF) & Landslides",
      region: "Chungthang - Singtam Sector, Sikkim",
      rainfall: "195 mm cloudburst",
      impact: "Chungthang Dam breached; massive rockslides destroyed 14 border bridges.",
      severity: "CRITICAL",
      prevented: "State-wide sirens mobilized 22,000 residents to upper relief grounds."
    },
    {
      year: "2022",
      date: "June 2022",
      title: "Tupul Railway Construction Slope Failure",
      region: "Noney District, Manipur",
      rainfall: "310 mm cumulative 48h",
      impact: "Ijei river dammed by debris, 55 casualties including territorial army camp.",
      severity: "DISASTER",
      prevented: "Prompted installation of real-time borehole extensometers across all rail routes."
    },
    {
      year: "2020",
      date: "May - June 2020",
      title: "Lumding - Badarpur Hill Section Earth Sips",
      region: "Haflong, Dima Hasao, Assam",
      rainfall: "220 mm continuous precipitation",
      impact: "Hill cutting collapse snapped lifeline rail corridor connecting Tripura & Mizoram.",
      severity: "HIGH",
      prevented: "Geotextile slope netting and soil nails deployed along 38 vulnerable spurs."
    },
    {
      year: "2018",
      date: "August 2018",
      title: "Cherrapunji - Sohra Escarpment Slips",
      region: "East Khasi Hills, Meghalaya",
      rainfall: "410 mm extreme downpour",
      impact: "Deep rotational slips on sandstone-limestone boundary; multiple road cutoffs.",
      severity: "HIGH",
      prevented: "Community rainfall gauge network established with SMS broadcast alarms."
    }
  ];

  // 5-Day Forward Meteorological Weather & Soil Saturation Forecast
  const weatherForecast = [
    { day: "Today", date: "Sep 4", temp: "22°C", rainMm: 112, rainProb: "95%", condition: "Heavy Mountain Rain", risk: "CRITICAL", wind: "28 km/h", saturation: "91%" },
    { day: "Tomorrow", date: "Sep 5", temp: "21°C", rainMm: 88, rainProb: "85%", condition: "Intense Downpours", risk: "HIGH", wind: "24 km/h", saturation: "86%" },
    { day: "Saturday", date: "Sep 6", temp: "23°C", rainMm: 45, rainProb: "65%", condition: "Scattered Showers", risk: "MODERATE", wind: "18 km/h", saturation: "74%" },
    { day: "Sunday", date: "Sep 7", temp: "24°C", rainMm: 20, rainProb: "40%", condition: "Cloudy Intervals", risk: "LOW", wind: "14 km/h", saturation: "58%" },
    { day: "Monday", date: "Sep 8", temp: "25°C", rainMm: 12, rainProb: "25%", condition: "Partly Sunny", risk: "SAFE", wind: "12 km/h", saturation: "48%" },
  ];

  const handleViewOnMap = () => {
    setSelectedZoneId('mangan');
    setCitizenActiveTab('home');
  };

  return (
    <div className="citizen-feed-container" style={{ paddingBottom: '30px' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '4px' }}>
          Safety & Tactical Insights
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Real-time route detours, historical landslide archives, and meteorological saturation outlook
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '18px' }}>
        <button
          className={activeSubTab === 'detour' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
          onClick={() => setActiveSubTab('detour')}
        >
          <Navigation size={15} />
          Route Safety & Detour
        </button>

        <button
          className={activeSubTab === 'history' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
          onClick={() => setActiveSubTab('history')}
        >
          <History size={15} />
          Previous Landslide Years
        </button>

        <button
          className={activeSubTab === 'weather' ? 'btn-primary' : 'btn-secondary'}
          style={{ fontSize: '0.82rem', padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
          onClick={() => setActiveSubTab('weather')}
        >
          <CloudRain size={15} />
          Weather & Rain Forecast
        </button>
      </div>

      {/* 1. ROUTE SAFETY & DETOUR ADVISORY (Matching Image 2) */}
      {activeSubTab === 'detour' && (
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-risk-critical)' }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', fontWeight: 700, margin: 0 }}>
                  Route Safety & Detour Advisory
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                  AI slope hazard models and ground displacement telemetry predict hazardous travel on primary mountain highways.
                </p>
              </div>
            </div>

            <span className="badge badge-critical" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
              BLOCKED
            </span>
          </div>

          {/* Two-Column Comparison Cards (Image 2 style) */}
          <div className="route-comparison-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '8px' }}>
            {/* Left: High Risk / Blocked Route */}
            <div 
              style={{ 
                padding: '18px', 
                borderRadius: '12px', 
                background: '#FFF5F5', 
                border: '1px solid #FFCDD2', 
                borderLeft: '5px solid #D32F2F',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#D32F2F', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  HIGH RISK / NOT RECOMMENDED
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#D32F2F' }}>
                  Risk: 92%
                </span>
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
                NH-10 (Siliguri - Gangtok Highway)
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Massive active rockslide at 29th Mile with debris blocking both carriageways. Hillside slope tension cracks widening at 4.2 mm/hr.
              </p>
            </div>

            {/* Right: Recommended Safe Detour Route */}
            <div 
              style={{ 
                padding: '18px', 
                borderRadius: '12px', 
                background: '#E8F5E9', 
                border: '1px solid #C8E6C9', 
                borderLeft: '5px solid #2E7D32',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#2E7D32', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  RECOMMENDED SAFE DETOUR
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2E7D32' }}>
                  Risk: 24% (Safe)
                </span>
              </div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
                Alternative Route via Lava - Reshi - Rhenock Pass
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Geologically stable ridgeline bypass route actively monitored by BRO clearance patrol units. Pavement intact with safe transit clearances.
              </p>
            </div>
          </div>

          {/* Action Button to Map */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button 
              className="btn-outline-cyan" 
              onClick={handleViewOnMap}
              style={{ fontSize: '0.85rem', padding: '9px 18px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Compass size={16} />
              <span>View Both Routes on GIS Map ➔</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. PREVIOUS LANDSLIDE ALERT YEARS ARCHIVE */}
      {activeSubTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Historical Disaster Records & Geological Failure Archive (North-East India)
            </span>
            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
              5 Major Records
            </span>
          </div>

          {historicalAlertYears.map((item, idx) => (
            <div 
              key={idx} 
              className="card" 
              style={{ 
                padding: '20px', 
                borderLeft: `5px solid ${item.severity === 'CRITICAL' || item.severity === 'DISASTER' ? '#D32F2F' : '#F57C00'}` 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-heading)' }}>
                    Year {item.year}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    • {item.date}
                  </span>
                </div>

                <span 
                  className={`badge ${item.severity === 'CRITICAL' || item.severity === 'DISASTER' ? 'badge-critical' : 'badge-high'}`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {item.severity}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '6px' }}>
                {item.title}
              </h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="var(--color-blue-500)" />
                  {item.region}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CloudRain size={14} color="var(--color-blue-500)" />
                  Precipitation: <strong>{item.rainfall}</strong>
                </span>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: '0 0 8px 0' }}>
                <strong>Impact:</strong> {item.impact}
              </p>

              <div style={{ background: 'var(--color-blue-50)', border: '1px solid var(--color-blue-100)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', color: 'var(--color-navy)' }}>
                <strong>Early Warning Lesson:</strong> {item.prevented}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. METEOROLOGICAL WEATHER FORECAST */}
      {activeSubTab === 'weather' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Current Satellite & Doppler Radar Status */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CloudRain size={20} color="var(--color-blue-500)" />
                <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700, margin: 0 }}>
                  IMD Doppler Weather Radar & Precipitation Outlook
                </h3>
              </div>
              <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>
                RED RAINFALL WATCH
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 16px 0' }}>
              Active monsoon trough anchored over North-East Himalaya. Heavy moisture-laden South-Westerly winds creating intense orographic lift over steep North Sikkim and Dima Hasao escarpments.
            </p>

            {/* 5-Day Forward Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
              {weatherForecast.map((w, i) => (
                <div 
                  key={i} 
                  style={{ 
                    background: i === 0 ? 'var(--color-blue-50)' : 'var(--color-bg-tertiary)',
                    border: i === 0 ? '1.5px solid var(--color-blue-400)' : '1px solid var(--color-border)',
                    borderRadius: '10px',
                    padding: '12px 10px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy)' }}>{w.day}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{w.date}</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-navy)', margin: '4px 0' }}>{w.temp}</span>
                  <span 
                    className={`badge ${w.risk === 'CRITICAL' ? 'badge-critical' : w.risk === 'HIGH' ? 'badge-high' : 'badge-low'}`}
                    style={{ fontSize: '0.65rem', padding: '2px 6px' }}
                  >
                    {w.rainMm} mm
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Rain: {w.rainProb}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                    Soil Sat: {w.saturation}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Rainfall Precipitation Bars */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '14px' }}>
              Hourly Infiltration Rate (Past 12 Hours vs Next 12 Hours)
            </h4>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '6px', height: '140px', paddingBottom: '20px', borderBottom: '1px solid var(--color-border)' }}>
              {[
                { time: '02:00', val: 18, color: '#1565C0' },
                { time: '04:00', val: 24, color: '#1565C0' },
                { time: '06:00', val: 32, color: '#1565C0' },
                { time: '08:00', val: 48, color: '#F57C00' },
                { time: '10:00', val: 68, color: '#D32F2F' },
                { time: '12:00', val: 92, color: '#D32F2F' },
                { time: '14:00', val: 112, color: '#B71C1C' },
                { time: '16:00', val: 84, color: '#D32F2F' },
                { time: '18:00', val: 70, color: '#F57C00' },
                { time: '20:00', val: 52, color: '#F57C00' },
                { time: '22:00', val: 35, color: '#1565C0' },
                { time: '00:00', val: 22, color: '#1565C0' }
              ].map((bar, bIdx) => (
                <div key={bIdx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, color: bar.color, marginBottom: '3px' }}>
                    {bar.val}
                  </span>
                  <div 
                    style={{ 
                      width: '100%', 
                      maxWidth: '18px', 
                      height: `${(bar.val / 120) * 90}px`, 
                      background: bar.color, 
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }} 
                    title={`${bar.time}: ${bar.val} mm/h`}
                  />
                  <span style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', marginTop: '6px', whiteSpace: 'nowrap' }}>
                    {bar.time}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              <span>Horizontal Peak: 112 mm at 14:00 (Critical Saturation Trigger)</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D32F2F' }} />
                Critical &gt; 60 mm/h
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyInsights;
