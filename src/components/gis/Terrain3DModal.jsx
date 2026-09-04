import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, RotateCw, ZoomIn, ZoomOut, Mountain, ShieldAlert } from 'lucide-react';

const Terrain3DModal = () => {
  const { isTerrain3DOpen, setIsTerrain3DOpen, locations, selectedZoneId } = useApp();
  const [rotation, setRotation] = useState(35);
  const [pitch, setPitch] = useState(60);
  const [zoom, setZoom] = useState(1);

  if (!isTerrain3DOpen) return null;

  const currentZone = locations.find(l => l.id === selectedZoneId) || locations[0];

  return (
    <div className="modal-overlay" onClick={() => setIsTerrain3DOpen(false)}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '820px', padding: '24px', background: '#071522', border: '1px solid var(--border-highlight)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(41, 182, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mountain size={20} color="#29B6F6" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>3D Topographic Terrain Elevation Model</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Isometric Digital Elevation Model (DEM) & Slope Failure Analysis • {currentZone.name}
              </p>
            </div>
          </div>
          <button className="btn-secondary" onClick={() => setIsTerrain3DOpen(false)} style={{ padding: '6px 10px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* 3D Canvas / Interactive Isometric Projection */}
        <div 
          style={{
            height: '380px',
            background: 'radial-gradient(circle at center, #0D2B45 0%, #050E17 80%)',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Controls HUD */}
          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: '8px', zIndex: 10 }}>
            <button 
              className="map-control-btn" 
              onClick={() => setRotation(r => (r + 15) % 360)}
              title="Rotate 3D View"
            >
              <RotateCw size={14} />
              <span>Rotate</span>
            </button>
            <button 
              className="map-control-btn" 
              onClick={() => setZoom(z => Math.min(1.4, z + 0.1))}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button 
              className="map-control-btn" 
              onClick={() => setZoom(z => Math.max(0.7, z - 0.1))}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
          </div>

          {/* Interactive SVG 3D Terrain Mesh */}
          <svg 
            width="550" 
            height="320" 
            viewBox="0 0 550 320"
            style={{
              transform: `scale(${zoom}) rotateX(${pitch}deg) rotateZ(${rotation}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 200ms ease-out'
            }}
          >
            {/* Base Wireframe Contours */}
            {[-80, -40, 0, 40, 80].map((yOff, idx) => (
              <path
                key={idx}
                d={`M 50 ${160 + yOff} Q 150 ${80 + yOff - (idx === 2 ? 60 : 20)} 275 ${140 + yOff - (idx === 2 ? 80 : 10)} T 500 ${160 + yOff}`}
                fill="none"
                stroke="rgba(41, 182, 246, 0.35)"
                strokeWidth="1.5"
              />
            ))}

            {/* High-Risk Slip Surface Shear Plane */}
            <path
              d="M 180 120 Q 275 60 370 110 L 390 190 Q 275 160 160 190 Z"
              fill="rgba(211, 47, 47, 0.45)"
              stroke="#D32F2F"
              strokeWidth="2"
            />

            {/* IoT Sensor Nodes on Slope */}
            <circle cx="275" cy="110" r="7" fill="#00E676" stroke="#FFFFFF" strokeWidth="2" />
            <text x="285" y="115" fill="#FFFFFF" fontSize="11" fontWeight="bold">S-101 (Geophone)</text>

            <circle cx="220" cy="140" r="7" fill="#FF1744" stroke="#FFFFFF" strokeWidth="2" />
            <text x="230" y="145" fill="#FF8A80" fontSize="11" fontWeight="bold">S-102 (Crack)</text>

            <circle cx="340" cy="130" r="7" fill="#29B6F6" stroke="#FFFFFF" strokeWidth="2" />
            <text x="350" y="135" fill="#FFFFFF" fontSize="11" fontWeight="bold">S-104 (Inclinometer)</text>
          </svg>

          {/* Bottom Telemetry HUD */}
          <div 
            style={{ 
              position: 'absolute', 
              bottom: 12, 
              left: 12, 
              background: 'rgba(7, 21, 34, 0.85)', 
              padding: '8px 14px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)'
            }}
          >
            <div>Elevation: <strong>1,840m MSL</strong> • Slope Gradient: <strong>42° Steep</strong></div>
            <div style={{ color: 'var(--risk-critical)', fontWeight: 700 }}>Active Shear Strain: 4.8 mm/hr</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Digital Elevation Model sourced from Indian Remote Sensing Satellite (Cartosat-3 DEM)
          </span>
          <button className="btn-secondary" onClick={() => setIsTerrain3DOpen(false)}>
            Close 3D View
          </button>
        </div>
      </div>
    </div>
  );
};

export default Terrain3DModal;
