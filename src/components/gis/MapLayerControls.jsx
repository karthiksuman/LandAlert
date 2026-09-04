import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, X } from 'lucide-react';

const MapLayerControls = ({ onClose }) => {
  const { mapLayers, toggleMapLayer } = useApp();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    // Delay adding click listener so the trigger button click doesn't close it immediately
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  const layersConfig = [
    { key: 'riskZones', label: 'Landslide Risk Zones' },
    { key: 'rainfall', label: 'Rainfall Telemetry Overlay' },
    { key: 'soilMoisture', label: 'Soil Moisture Sensors' },
    { key: 'groundMovement', label: 'Ground Vibration / Seismic' },
    { key: 'sensors', label: 'IoT Sensor Network Nodes' },
    { key: 'earthquakes', label: 'Historical Earthquakes' },
    { key: 'roads', label: 'Highways & Mountain Roads' },
    { key: 'blockages', label: 'Road Blockages & Safe Detours' },
    { key: 'shelters', label: 'Evacuation Relief Camps' }
  ];

  return (
    <div 
      className="map-floating-layers-panel" 
      ref={panelRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="layers-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-navy)' }}>
          <Layers size={16} color="var(--color-blue-500)" />
          <span>GIS Map Layers</span>
        </div>
        <button 
          onClick={onClose} 
          style={{ background: 'var(--color-blue-50)', border: '1px solid var(--color-border)', borderRadius: '50%', color: 'var(--color-text-muted)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
          title="Close Layers"
        >
          <X size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {layersConfig.map(layer => (
          <label key={layer.key} className="layer-toggle-row">
            <span>{layer.label}</span>
            <input
              type="checkbox"
              checked={!!mapLayers[layer.key]}
              onChange={() => toggleMapLayer(layer.key)}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default MapLayerControls;
