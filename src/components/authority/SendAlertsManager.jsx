import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BellRing, Radio, AlertTriangle, Send, ShieldAlert, 
  MapPin, CheckCircle2, XCircle, Volume2, Smartphone, 
  Waves, AlertOctagon, Eye, Sparkles, Navigation, RotateCcw
} from 'lucide-react';

const SendAlertsManager = () => {
  const { locations, alerts, broadcastNewAlert, revokeAlert, setAuthorityActiveTab, t } = useApp();

  const [targetDistrict, setTargetDistrict] = useState(locations[0]?.district || "North Sikkim");
  const [hazardType, setHazardType] = useState("CRITICAL_LANDSLIDE");
  const [severityLevel, setSeverityLevel] = useState("CRITICAL");
  const [probability, setProbability] = useState(88);
  const [title, setTitle] = useState("CRITICAL LANDSLIDE WARNING: Immediate Slope Evacuation");
  const [message, setMessage] = useState(
    "Continuous torrential downpour (120mm/24h) and active ground tension cracks (>5.0 mm/h) detected along hillside slope. High probability of deep rotational failure in next 2-4 hours."
  );
  const [action, setAction] = useState(
    "Immediate mandatory evacuation. Move away from steep hill toes to designated Mangan Community Relief Shelters. Avoid mountain highways."
  );
  const [issuedBy, setIssuedBy] = useState("State Disaster Management Authority (SDMA) & District Collector");
  const [channels, setChannels] = useState({
    portal: true,
    siren: true,
    sms: true
  });
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // One-Click Emergency Presets
  const presets = [
    {
      label: "🚨 Critical Landslide Evacuation",
      type: "CRITICAL_LANDSLIDE",
      level: "CRITICAL",
      probability: 94,
      district: "North Sikkim",
      title: "CRITICAL LANDSLIDE WARNING: Immediate Slope Toe Evacuation",
      message: "Extensive subsurface shear failure and active ground displacement (>5.2 mm/h) detected along mountain flank. Immediate slope collapse imminent.",
      action: "Immediate mandatory evacuation. Relocate to upper ridge community shelters or municipal relief hall."
    },
    {
      label: "🌊 Flash Flood & Debris Surge",
      type: "FLASH_FLOOD",
      level: "HIGH",
      probability: 84,
      district: "East Khasi Hills",
      title: "FLASH FLOOD & DEBRIS SURGE WARNING: River Basin Inundation",
      message: "Heavy mountain torrents carrying rocks and mud slurry. Drainage culverts overflowing in Sohra canyon.",
      action: "Stay clear of gorge slopes and riverbanks. Do not attempt driving through inundated mountain roads."
    },
    {
      label: "🚧 Highway Rockfall & Blockage",
      type: "ROAD_BLOCKAGE",
      level: "CRITICAL",
      probability: 91,
      district: "North Sikkim",
      title: "HIGHWAY BLOCKED: Severe Rockfall along Arterial Corridor",
      message: "Both carriageways blocked by massive boulders and colluvium debris. Active rockfall hazard persists.",
      action: "Divert transit via recommended alternative green bypass route. Do not bypass police barricades."
    },
    {
      label: "⚡ Severe Cloudburst Pre-Warning",
      type: "WEATHER_ADVISORY",
      level: "MODERATE",
      probability: 68,
      district: "Kamrup Metropolitan",
      title: "HEAVY PRECIPITATION ALERT: Saturated Hillside Pre-Warning",
      message: "Forecast anticipates >120mm rainfall over next 8 hours. Colluvial topsoils approaching 100% saturation.",
      action: "Prepare emergency go-bags. Monitor live LandAlert GIS maps and local administration broadcasts."
    }
  ];

  const applyPreset = (preset) => {
    setHazardType(preset.type);
    setSeverityLevel(preset.level);
    setProbability(preset.probability);
    setTargetDistrict(preset.district);
    setTitle(preset.title);
    setMessage(preset.message);
    setAction(preset.action);
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    setIsBroadcasting(true);

    const targetLoc = locations.find(l => l.district === targetDistrict) || locations[0];

    setTimeout(() => {
      broadcastNewAlert({
        type: hazardType,
        level: severityLevel,
        title,
        district: targetDistrict,
        coordinates: targetLoc?.coordinates || [27.512, 88.534],
        probability: Number(probability),
        message,
        action,
        issuedBy
      });

      setIsBroadcasting(false);
    }, 600);
  };

  const getAccentColor = (lvl) => {
    switch (lvl) {
      case 'CRITICAL': return 'var(--color-risk-critical)';
      case 'HIGH': return 'var(--color-risk-high)';
      case 'MODERATE': return 'var(--color-risk-moderate)';
      default: return 'var(--color-blue-500)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* 1. Header Banner with Live Siren / CAP Beacon */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '14px',
        background: 'linear-gradient(135deg, rgba(21,101,192,0.06), rgba(211,47,47,0.08))',
        padding: '20px 24px',
        borderRadius: '16px',
        border: '1px solid var(--color-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '14px', 
            background: 'var(--risk-critical-bg)', 
            border: '1px solid var(--color-risk-critical)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(211,47,47,0.2)'
          }}>
            <BellRing size={26} color="var(--color-risk-critical)" style={{ animation: 'pulse 1.5s infinite' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span className="pulse-dot pulse-dot-critical" />
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-risk-critical)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Public Emergency Broadcast Channel Active
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--color-navy)', fontWeight: 800, margin: 0 }}>
              Send Alerts to Residents
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '3px 0 0' }}>
              Broadcast real-time life-safety warnings, evacuation directives, and emergency sirens directly to residents' screens
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="badge badge-critical" style={{ padding: '6px 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={14} />
            {alerts.length} Active Broadcasts in Circulation
          </span>
        </div>
      </div>

      {/* 2. One-Click Emergency Template Presets */}
      <div>
        <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-navy)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
          ⚡ Rapid Emergency Presets (One-Click Auto-Fill)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="btn-secondary"
              onClick={() => applyPreset(preset)}
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '10px 14px',
                textAlign: 'left',
                justifyContent: 'flex-start',
                borderRadius: '10px',
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                background: '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-blue-500)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Form Grid (Left: Broadcast Dispatcher Form, Right: Live Resident Preview) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Form Column */}
        <form onSubmit={handleBroadcast} className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Send size={18} color="var(--color-blue-500)" />
            <span>Configure Emergency Public Alert</span>
          </h3>

          {/* District & Location */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
              Target District / Region
            </label>
            <select
              value={targetDistrict}
              onChange={e => setTargetDistrict(e.target.value)}
              style={{ fontSize: '0.88rem' }}
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.district}>
                  📍 {loc.district} ({loc.name}, {loc.state})
                </option>
              ))}
              <option value="All North-East Corridor">🌐 All North-East Mountain Sectors</option>
            </select>
          </div>

          {/* Severity & Hazard Type Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
                Severity Level
              </label>
              <select
                value={severityLevel}
                onChange={e => setSeverityLevel(e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="CRITICAL">🔴 CRITICAL (Immediate Evacuation)</option>
                <option value="HIGH">🟠 HIGH (Elevated Danger)</option>
                <option value="MODERATE">🟡 MODERATE (Heightened Caution)</option>
                <option value="LOW">🔵 ADVISORY (Informational)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
                Hazard Category
              </label>
              <select
                value={hazardType}
                onChange={e => setHazardType(e.target.value)}
                style={{ fontSize: '0.88rem' }}
              >
                <option value="CRITICAL_LANDSLIDE">Mountain Slope Landslide</option>
                <option value="FLASH_FLOOD">Flash Flood & Mudflow</option>
                <option value="ROAD_BLOCKAGE">Highway Rockfall Blockage</option>
                <option value="WEATHER_ADVISORY">Severe Cloudburst / Rainfall</option>
                <option value="GENERAL_EVACUATION">General Evacuation Order</option>
              </select>
            </div>
          </div>

          {/* Probability Slider */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                Calculated Hazard Probability
              </label>
              <strong style={{ color: getAccentColor(severityLevel), fontSize: '0.95rem' }}>{probability}%</strong>
            </div>
            <input 
              type="range" 
              min="20" 
              max="99" 
              value={probability} 
              onChange={e => setProbability(e.target.value)}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Alert Title */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
              Alert Headline / Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. CRITICAL LANDSLIDE WARNING: Slope Toe Evacuation"
              required
              style={{ fontSize: '0.9rem', fontWeight: 600 }}
            />
          </div>

          {/* Warning Message */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
              Official Warning Description
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe telemetry triggers, rain accumulation, and impending slide timing..."
              required
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {/* Action Directives */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
              Mandatory Resident Action & Evacuation Directive
            </label>
            <textarea
              rows={2}
              value={action}
              onChange={e => setAction(e.target.value)}
              placeholder="e.g. Move immediately to upper ridge shelters; do not attempt crossing valley bridge..."
              required
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {/* Issuing Authority */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
              Issuing Authority Signature
            </label>
            <input
              type="text"
              value={issuedBy}
              onChange={e => setIssuedBy(e.target.value)}
              required
              style={{ fontSize: '0.85rem' }}
            />
          </div>

          {/* Broadcast Channels Multi-select */}
          <div style={{ background: 'var(--color-blue-50)', padding: '12px 14px', borderRadius: '10px', marginBottom: '20px', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-blue-600)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Dissemination Channels (Simultaneous Dispatch)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-navy)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={channels.portal} 
                  onChange={e => setChannels(prev => ({ ...prev, portal: e.target.checked }))} 
                />
                <Smartphone size={15} color="var(--color-blue-500)" />
                <span>Deliver to Resident Web & Mobile Portals</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-navy)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={channels.siren} 
                  onChange={e => setChannels(prev => ({ ...prev, siren: e.target.checked }))} 
                />
                <Volume2 size={15} color="var(--color-risk-critical)" />
                <span>Trigger Regional High-Decibel Acoustic Sirens</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-navy)', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={channels.sms} 
                  onChange={e => setChannels(prev => ({ ...prev, sms: e.target.checked }))} 
                />
                <Radio size={15} color="var(--color-risk-high)" />
                <span>Pan-India Emergency Cell Broadcast (CAP v1.2)</span>
              </label>
            </div>
          </div>

          {/* Big Broadcast Button */}
          <button
            type="submit"
            className="btn-critical"
            disabled={isBroadcasting}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1.02rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              borderRadius: '10px',
              boxShadow: '0 4px 16px rgba(211,47,47,0.3)',
              cursor: 'pointer'
            }}
          >
            {isBroadcasting ? (
              <span>Transmitting Siren & Alerts to Residents...</span>
            ) : (
              <>
                <BellRing size={20} />
                <span>BROADCAST ALERT TO RESIDENTS</span>
              </>
            )}
          </button>
        </form>

        {/* Live Resident Preview Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={17} color="var(--color-blue-500)" />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
                  Live Resident View Preview
                </h4>
              </div>
              <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                What Citizens See
              </span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
              This is the exact layout delivered to residents' phones and web dashboards upon broadcast:
            </p>

            {/* Resident Card Preview */}
            <div 
              className="card"
              style={{
                padding: '18px',
                borderLeft: `5px solid ${getAccentColor(severityLevel)}`,
                boxShadow: '0 4px 14px rgba(11,31,51,0.08)',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {hazardType === 'FLASH_FLOOD' ? (
                    <Waves size={18} color="var(--color-blue-500)" />
                  ) : hazardType === 'ROAD_BLOCKAGE' ? (
                    <AlertOctagon size={18} color="var(--color-risk-high)" />
                  ) : (
                    <AlertTriangle size={18} color={getAccentColor(severityLevel)} />
                  )}
                  <span className={`badge badge-${severityLevel.toLowerCase()}`} style={{ fontSize: '0.7rem' }}>
                    {severityLevel} ({probability}%)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    📍 {targetDistrict}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Just Now
                </span>
              </div>

              <h3 style={{ fontSize: '1.02rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '6px' }}>
                {title || "Emergency Landslide Hazard Warning"}
              </h3>

              <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', lineHeight: 1.45, marginBottom: '10px' }}>
                {message || "No warning message entered yet."}
              </p>

              {/* Action Directive Box */}
              <div 
                style={{ 
                  background: 'var(--color-blue-50)', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '8px', 
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginBottom: '10px'
                }}
              >
                <ShieldAlert size={16} color="var(--color-risk-low)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-risk-low)', textTransform: 'uppercase' }}>
                    Mandatory Resident Action / Evacuation Advice
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-primary)', marginTop: '2px' }}>
                    {action || "Adhere to district evacuation instructions."}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                Issued by: <strong>{issuedBy}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Broadcasts List */}
      <div className="glass-panel" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-navy)', fontWeight: 700, margin: 0 }}>
              Active Emergency Broadcasts in Circulation ({alerts.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
              Broadcast alerts actively delivered to resident mobile notifications and municipal siren mesh
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.map(alert => {
            const isFlood = alert.type === 'FLASH_FLOOD';
            const isBlockage = alert.type === 'ROAD_BLOCKAGE';
            const accent = isFlood ? 'var(--color-blue-500)' : isBlockage ? 'var(--color-risk-high)' : 'var(--color-risk-critical)';

            return (
              <div 
                key={alert.id}
                className="card"
                style={{
                  padding: '16px 18px',
                  borderLeft: `5px solid ${accent}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-blue-500)', fontFamily: 'var(--font-mono)' }}>
                      {alert.id}
                    </span>
                    <span className={`badge badge-${alert.level?.toLowerCase() || 'critical'}`} style={{ fontSize: '0.68rem' }}>
                      {alert.level}
                    </span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                      📍 {alert.district} • {alert.issuedAt}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 4px' }}>
                    {alert.title}
                  </h4>

                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 6px', lineHeight: 1.4 }}>
                    {alert.message}
                  </p>

                  <div style={{ fontSize: '0.76rem', color: 'var(--color-risk-low)', fontWeight: 600 }}>
                    Directives: {alert.action}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => revokeAlert(alert.id)}
                    style={{ fontSize: '0.76rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <XCircle size={14} color="var(--color-risk-critical)" />
                    <span>Revoke Alert</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SendAlertsManager;
