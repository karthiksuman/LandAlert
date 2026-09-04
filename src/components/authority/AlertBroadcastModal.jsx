import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Send, X, AlertTriangle, Radio } from 'lucide-react';

const AlertBroadcastModal = ({ isOpen, onClose }) => {
  const { broadcastNewAlert, locations } = useApp();

  const [type, setType] = useState('CRITICAL_LANDSLIDE');
  const [level, setLevel] = useState('CRITICAL');
  const [title, setTitle] = useState('🔴 CRITICAL LANDSLIDE EVACUATION ADVISORY');
  const [district, setDistrict] = useState('North Sikkim');
  const [probability, setProbability] = useState(88);
  const [message, setMessage] = useState('Excessive rainfall (112mm) and deep geotechnical shear vibration detected. High likelihood of slope failure in next 4 hours.');
  const [action, setAction] = useState('Immediate evacuation to designated Chungthang relief shelter. All non-emergency transit prohibited on NH-10.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const loc = locations.find(l => l.district.toLowerCase().includes(district.toLowerCase())) || locations[0];

    broadcastNewAlert({
      type,
      level,
      title,
      district,
      coordinates: loc.coordinates,
      probability: Number(probability),
      message,
      action,
      issuedBy: "State Disaster Management Authority Operations Room"
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(211, 47, 47, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={22} color="#FF5252" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>Broadcast Emergency Alert</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Targeted push notification and siren advisory to citizen devices
              </p>
            </div>
          </div>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '6px 10px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Warning Type
              </label>
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="CRITICAL_LANDSLIDE">Critical Landslide</option>
                <option value="FLASH_FLOOD">Flash Flood Warning</option>
                <option value="ROAD_BLOCKAGE">Highway Blockage</option>
                <option value="EVACUATION">Mandatory Evacuation Order</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Severity Level
              </label>
              <select value={level} onChange={e => setLevel(e.target.value)}>
                <option value="CRITICAL">Critical (Red Alert)</option>
                <option value="HIGH">High (Orange Alert)</option>
                <option value="MODERATE">Moderate (Yellow Alert)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Target District / Zone
              </label>
              <input 
                type="text" 
                value={district} 
                onChange={e => setDistrict(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Hazard Prob %
              </label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={probability} 
                onChange={e => setProbability(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Broadcast Title
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Official Warning Message
            </label>
            <textarea 
              rows={3} 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Mandatory Citizen Action / Safety Instructions
            </label>
            <input 
              type="text" 
              value={action} 
              onChange={e => setAction(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn-critical" 
            style={{ marginTop: '10px', padding: '12px', fontSize: '0.95rem' }}
          >
            <Send size={16} />
            Transmit Emergency Broadcast to Region
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlertBroadcastModal;
