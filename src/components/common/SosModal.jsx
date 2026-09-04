import React from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneCall, ShieldAlert, HeartPulse, Building, X, MapPin, Copy, Check } from 'lucide-react';

const SosModal = () => {
  const { isSosOpen, setIsSosOpen, helplines, userCoordinates, addToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isSosOpen) return null;

  const handleCopyLocation = () => {
    const locText = `${userCoordinates[0].toFixed(5)}, ${userCoordinates[1].toFixed(5)} (Mangan District, North Sikkim)`;
    navigator.clipboard?.writeText(locText);
    setCopied(true);
    addToast("GPS Coordinates Copied", locText, "info");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSosOpen(false)}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '620px', padding: '24px', position: 'relative' }}
      >
        <button 
          className="btn-secondary" 
          onClick={() => setIsSosOpen(false)}
          style={{ position: 'absolute', top: 18, right: 18, padding: '6px 10px', borderRadius: '50%' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div 
            style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #D32F2F, #B71C1C)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(211, 47, 47, 0.6)'
            }}
          >
            <PhoneCall size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', fontWeight: 700 }}>Emergency SOS Helplines</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              24/7 National, Regional & Local Disaster Operations Dispatch
            </p>
          </div>
        </div>

        {/* Current GPS coordinates banner for emergency caller */}
        <div 
          style={{ 
            background: 'var(--color-blue-50)', 
            border: '1px solid var(--color-border)', 
            borderRadius: '10px', 
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={20} color="var(--color-blue-500)" />
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-blue-600)', textTransform: 'uppercase' }}>
                Your Emergency GPS Coordinates
              </div>
              <div style={{ fontSize: '0.92rem', color: 'var(--color-navy)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                {userCoordinates[0].toFixed(5)}°N, {userCoordinates[1].toFixed(5)}°E
              </div>
            </div>
          </div>
          <button 
            onClick={handleCopyLocation}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy GPS"}
          </button>
        </div>

        {/* Emergency Helplines List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
          {helplines.map(hl => (
            <div 
              key={hl.id} 
              style={{ 
                background: 'var(--color-bg-tertiary)', 
                border: '1px solid var(--color-border)', 
                borderRadius: '10px', 
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span className="badge badge-critical" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                    {hl.category}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--color-navy)', fontWeight: 700 }}>{hl.name}</h4>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {hl.description}
                </p>
              </div>

              <a 
                href={`tel:${hl.number.split('/')[0].trim()}`}
                className="btn-critical"
                style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '0.92rem', flexShrink: 0 }}
              >
                <PhoneCall size={14} />
                {hl.number}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SosModal;
