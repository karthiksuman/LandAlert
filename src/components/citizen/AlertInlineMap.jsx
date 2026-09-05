import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { Maximize2, X, Navigation, AlertTriangle, ShieldCheck, Waves, AlertOctagon } from 'lucide-react';

const AlertInlineMap = ({ alert, onClose, onGoToFullMap }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { roads, locations } = useApp();

  const coords = alert.coordinates || [27.512, 88.534];
  const isFlood = alert.type === 'FLASH_FLOOD';
  const isBlockage = alert.type === 'ROAD_BLOCKAGE';
  const color = isFlood ? '#1565C0' : isBlockage ? '#D32F2F' : alert.level === 'CRITICAL' ? '#D32F2F' : '#F57C00';

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet instance
    const map = L.map(mapContainerRef.current, {
      center: coords,
      zoom: 11,
      zoomControl: false,
      attributionControl: false
    });
    mapInstanceRef.current = map;

    // Basemap tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Danger Radius Circle
    const radius = alert.level === 'CRITICAL' ? 1400 : 900;
    L.circle(coords, {
      color: color,
      fillColor: color,
      fillOpacity: 0.22,
      weight: 2,
      dashArray: '6, 6'
    }).addTo(map);

    // Custom Pulsing DivIcon Marker
    const pinIcon = L.divIcon({
      html: `
        <div style="
          position: relative;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${color};
            opacity: 0.4;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <div style="
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: ${color};
            border: 2.5px solid #FFFFFF;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 11px;
            font-weight: 800;
          ">!</div>
        </div>
      `,
      className: 'leaflet-alert-pin-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker(coords, { icon: pinIcon }).addTo(map);
    marker.bindTooltip(`
      <div style="font-family: sans-serif; font-size: 11px; font-weight: 700;">
        <span style="color: ${color};">${alert.title}</span><br/>
        <span>📍 ${alert.district}</span>
      </div>
    `, { permanent: false, direction: 'top', offset: [0, -10] });

    // If it's a road blockage or related road alert, draw the thick red and green lines
    if (isBlockage || alert.title.includes('NH-10') || alert.title.includes('Road')) {
      const blockedRoad = roads.find(r => r.status === 'BLOCKED' || r.id === 'road-nh10') || roads[0];
      if (blockedRoad && blockedRoad.coordinates) {
        // Red Blocked Road
        L.polyline(blockedRoad.coordinates, {
          color: 'rgba(211, 47, 47, 0.4)',
          weight: 16,
          lineCap: 'round'
        }).addTo(map);

        L.polyline(blockedRoad.coordinates, {
          color: '#D32F2F',
          weight: 8,
          lineCap: 'round'
        }).addTo(map).bindTooltip("🔴 BLOCKED HIGHWAY SECTION", { sticky: true });

        // Green Detour Road
        if (blockedRoad.alternativeRoute && blockedRoad.alternativeRoute.coordinates) {
          L.polyline(blockedRoad.alternativeRoute.coordinates, {
            color: 'rgba(46, 125, 50, 0.4)',
            weight: 16,
            lineCap: 'round'
          }).addTo(map);

          L.polyline(blockedRoad.alternativeRoute.coordinates, {
            color: '#2E7D32',
            weight: 8,
            lineCap: 'round'
          }).addTo(map).bindTooltip("🟢 RECOMMENDED SAFE DETOUR", { sticky: true });

          // Fit bounds to show both routes
          const allPoints = [...blockedRoad.coordinates, ...blockedRoad.alternativeRoute.coordinates];
          map.fitBounds(allPoints, { padding: [30, 30] });
        }
      }
    }

    // Leaflet resize invalidate after render
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
    };
  }, [alert]);

  return (
    <div style={{
      marginTop: '12px',
      marginBottom: '12px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: `2px solid ${color}`,
      boxShadow: '0 4px 16px rgba(11,31,51,0.12)',
      background: '#0B1F33',
      position: 'relative'
    }}>
      {/* Top Map Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 14px',
        background: '#071522',
        color: '#FFFFFF',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: 700 }}>
          <span className="pulse-dot pulse-dot-critical" />
          <span>Live GIS Tactical Location: {alert.district}</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.72rem' }}>
            ({coords[0].toFixed(3)}°N, {coords[1].toFixed(3)}°E)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn-outline-cyan"
            onClick={onGoToFullMap}
            style={{
              fontSize: '0.72rem',
              padding: '4px 10px',
              color: '#FFFFFF',
              borderColor: 'var(--brand-cyan)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
            title="Open Fullscreen GIS Command Map"
          >
            <Maximize2 size={12} />
            <span>Open Full GIS Map</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF'
            }}
            title="Close Inline Map"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          height: '250px', 
          width: '100%', 
          background: '#E5E3DF' 
        }} 
      />

      {/* Bottom Map Legend Bar */}
      <div style={{
        padding: '6px 12px',
        background: '#071522',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.8)',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
            <span>Active Hazard Epicenter</span>
          </span>
          {isBlockage && (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '12px', height: '4px', background: '#D32F2F' }} />
                <span>Blocked Road</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '12px', height: '4px', background: '#2E7D32' }} />
                <span>Safe Detour</span>
              </span>
            </>
          )}
        </div>
        <span style={{ color: 'var(--brand-cyan)', fontWeight: 600 }}>
          {alert.probability}% Hazard Risk
        </span>
      </div>
    </div>
  );
};

export default AlertInlineMap;
