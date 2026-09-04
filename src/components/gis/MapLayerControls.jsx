import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, X } from 'lucide-react';

const MapLayerControls = ({ onClose }) => {
  const { mapLayers, toggleMapLayer } = useApp();

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
    <div className="map-floating-layers-panel">
      <div className="layers-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
          <Layers size={16} color="#29B6F6" />
          <span>GIS Map Layers</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '2px' }}>
          <X size={16} />
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
