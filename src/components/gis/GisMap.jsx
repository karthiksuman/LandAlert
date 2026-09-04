import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import Terrain3DCanvas from './Terrain3DCanvas';
import MapLegend from './MapLegend';
import MapLayerControls from './MapLayerControls';
import LocationInfoPanel from './LocationInfoPanel';
import { Maximize2, Minimize2, Layers, Crosshair, PhoneCall, ArrowLeft, Globe, Map } from 'lucide-react';

const GisMap = ({ mode = 'hero' }) => {
  const {
    locations,
    selectedZoneId,
    setSelectedZoneId,
    sensors,
    roads,
    userCoordinates,
    mapLayers,
    isFullScreenMap,
    setIsFullScreenMap,
    setIsSosOpen
  } = useApp();

  const [viewMode, setViewMode] = useState('3d'); // '3d' (Three.js Spatial Terrain) or '2d' (Leaflet GIS)
  const [showLayerControls, setShowLayerControls] = useState(false);

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const layerGroupRef = useRef(null);

  const selectedZone = locations.find(l => l.id === selectedZoneId) || locations[0];

  // Initialize Leaflet for 2D mode when active
  useEffect(() => {
    if (viewMode !== '2d') return;
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapRef.current, {
        center: [26.4, 91.8],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      leafletMapRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = leafletMapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. RISK ZONES
    if (mapLayers.riskZones) {
      locations.forEach(loc => {
        const isSelected = loc.id === selectedZoneId;
        let color = '#19D47B';
        let fillColor = 'rgba(25, 212, 123, 0.35)';

        if (loc.riskLevel === 'CRITICAL') {
          color = '#FF3B3B';
          fillColor = 'rgba(255, 59, 59, 0.45)';
        } else if (loc.riskLevel === 'HIGH') {
          color = '#FF8A00';
          fillColor = 'rgba(255, 138, 0, 0.4)';
        } else if (loc.riskLevel === 'MODERATE') {
          color = '#FFD43B';
          fillColor = 'rgba(255, 212, 59, 0.35)';
        }

        const circle = L.circle(loc.coordinates, {
          radius: loc.riskLevel === 'CRITICAL' ? 14000 : 10000,
          color: color,
          weight: isSelected ? 3 : 1.5,
          fillColor: fillColor,
          fillOpacity: 0.6,
          dashArray: loc.riskLevel === 'CRITICAL' ? '6, 4' : null
        });

        circle.bindTooltip(`
          <div style="font-family: var(--font-main); font-size: 11px; font-weight: bold; color: #fff;">
            <strong>${loc.name}</strong><br/>
            Estimated Risk: <span style="color: ${color}">${loc.riskPercentage}% (${loc.riskLevel})</span>
          </div>
        `, { sticky: true });

        circle.on('click', () => {
          setSelectedZoneId(loc.id);
          map.flyTo(loc.coordinates, 9, { duration: 1.2 });
        });

        circle.addTo(layerGroup);
      });
    }

    // 2. SENSORS
    if (mapLayers.sensors) {
      sensors.forEach(sensor => {
        const iconHtml = `
          <div class="custom-sensor-icon sensor-marker-${sensor.status.toLowerCase()}" style="width: 24px; height: 24px; font-size: 10px;">
            ${sensor.id.replace('S-', '')}
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'leaflet-sensor-div-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(sensor.coordinates, { icon: customIcon });
        marker.bindTooltip(`<strong>${sensor.name} (${sensor.id})</strong><br/>Status: ${sensor.status}`, { sticky: true });
        marker.addTo(layerGroup);
      });
    }

    // 3. ROADS & DETOURS
    if (mapLayers.roads) {
      roads.forEach(road => {
        const isBlocked = road.status === 'BLOCKED' || road.status === 'UNSAFE';
        const roadLine = L.polyline(road.coordinates, {
          color: isBlocked ? '#FF3B3B' : '#1687FF',
          weight: 4,
          dashArray: isBlocked ? '8, 8' : null,
          opacity: 0.85
        });
        roadLine.addTo(layerGroup);

        if (isBlocked && road.alternativeRoute && mapLayers.blockages) {
          const altLine = L.polyline(road.alternativeRoute.coordinates, {
            color: '#19D47B',
            weight: 5,
            dashArray: '10, 6',
            opacity: 0.95
          });
          altLine.addTo(layerGroup);
        }
      });
    }
  }, [viewMode, locations, selectedZoneId, sensors, roads, mapLayers]);

  const toggleFullScreen = (e) => {
    if (e) e.stopPropagation();
    setIsFullScreenMap(prev => !prev);
  };

  const handleSelectZone = (zoneId) => {
    setSelectedZoneId(zoneId);
  };

  let containerClass = "gis-map-hero";
  if (mode === 'authority') containerClass = "gis-map-authority";
  if (isFullScreenMap) containerClass = "gis-map-fullscreen";

  return (
    <div className={`gis-map-container ${containerClass}`}>
      {/* 1. 3D Spatial Terrain View (Three.js Hero) */}
      {viewMode === '3d' ? (
        <Terrain3DCanvas 
          onSelectZone={handleSelectZone}
          activeZoneId={selectedZoneId}
        />
      ) : (
        /* 2. 2D Tactical GIS Map View (Leaflet) */
        <div ref={mapRef} className="map-instance" />
      )}

      {/* Floating Top Controls HUD */}
      <div className="map-floating-top-controls">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isFullScreenMap && (
            <button className="map-control-btn" onClick={toggleFullScreen}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          {/* View Mode Toggle Pill (3D Spatial vs 2D GIS) */}
          <div className="map-view-switcher">
            <button 
              className={`map-view-pill-btn ${viewMode === '3d' ? 'active' : ''}`}
              onClick={() => setViewMode('3d')}
            >
              <Globe size={13} style={{ display: 'inline', marginRight: '4px' }} />
              3D Spatial Terrain
            </button>
            <button 
              className={`map-view-pill-btn ${viewMode === '2d' ? 'active' : ''}`}
              onClick={() => setViewMode('2d')}
            >
              <Map size={13} style={{ display: 'inline', marginRight: '4px' }} />
              2D Tactical GIS
            </button>
          </div>

          <button 
            className="map-control-btn"
            onClick={() => setShowLayerControls(!showLayerControls)}
            title="Toggle Spatial Layers"
          >
            <Layers size={15} color="var(--cyan)" />
            <span>Layers</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="map-control-btn map-control-btn-critical"
            onClick={() => setIsSosOpen(true)}
            title="Emergency SOS Contacts"
          >
            <PhoneCall size={15} />
            <span>SOS</span>
          </button>

          <button 
            className="map-control-btn"
            onClick={toggleFullScreen}
            title={isFullScreenMap ? "Exit Fullscreen" : "Expand Fullscreen"}
          >
            {isFullScreenMap ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Layer Controls Floating Panel */}
      {showLayerControls && (
        <MapLayerControls onClose={() => setShowLayerControls(false)} />
      )}

      {/* Floating Legend */}
      <MapLegend />

      {/* Floating Location Information Panel when a zone is active */}
      {selectedZone && (
        <LocationInfoPanel 
          zone={selectedZone} 
          onClose={() => setSelectedZoneId(null)} 
        />
      )}
    </div>
  );
};

export default GisMap;
