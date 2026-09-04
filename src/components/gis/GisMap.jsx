import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import MapLegend from './MapLegend';
import MapLayerControls from './MapLayerControls';
import LocationInfoPanel from './LocationInfoPanel';
import { Maximize2, Minimize2, Layers, Crosshair, PhoneCall, ArrowLeft, Map, Mountain, Satellite } from 'lucide-react';

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

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const layerGroupRef = useRef(null);
  const telemetryGroupRef = useRef(null);

  const [baseMapType, setBaseMapType] = useState('topo'); // 'topo' | 'light' | 'satellite' | 'dark'
  const [showLayerControls, setShowLayerControls] = useState(false);

  // Selected Zone Object
  const selectedZone = locations.find(l => l.id === selectedZoneId) || locations[0];

  // Tile Layer Definitions (2D GIS Only)
  const tileConfigs = {
    topo: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      options: { maxZoom: 18, attribution: '&copy; Esri &copy; USGS' }
    },
    light: {
      url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      options: { maxZoom: 19, subdomains: 'abcd', attribution: '&copy; CartoDB &copy; OpenStreetMap' }
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      options: { maxZoom: 18, attribution: '&copy; Esri World Imagery' }
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      options: { maxZoom: 19, subdomains: 'abcd', attribution: '&copy; CartoDB &copy; OpenStreetMap' }
    }
  };

  // 1. Initialize 2D Leaflet Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      // Center on North-East India (around Sikkim/Assam)
      const map = L.map(mapRef.current, {
        center: [26.4, 91.8],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      // Default Dark Tactical Tile Layer
      const baseTile = L.tileLayer(tileConfigs.dark.url, tileConfigs.dark.options).addTo(map);
      tileLayerRef.current = baseTile;

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      leafletMapRef.current = map;
      telemetryGroupRef.current = L.layerGroup().addTo(map);
      layerGroupRef.current = L.layerGroup().addTo(map);
    }
  }, []);

  // 2. Switch Basemap (Dark GIS vs Topography vs Satellite)
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = tileConfigs[baseMapType] || tileConfigs.dark;
    const newTile = L.tileLayer(config.url, config.options).addTo(map);
    newTile.bringToBack();
    tileLayerRef.current = newTile;
  }, [baseMapType]);

  // 3. Update Risk Zones, Sensors, Roads, and Telemetry
  useEffect(() => {
    const map = leafletMapRef.current;
    const layerGroup = layerGroupRef.current;
    const telemetryGroup = telemetryGroupRef.current;
    if (!map || !layerGroup || !telemetryGroup) return;

    layerGroup.clearLayers();
    telemetryGroup.clearLayers();

    // A. SENSOR TELEMETRY MESH (Live Photon Data Stream Lines)
    if (mapLayers.sensors && sensors.length > 1) {
      for (let i = 0; i < sensors.length - 1; i++) {
        const s1 = sensors[i];
        const s2 = sensors[i + 1];

        const line = L.polyline([s1.coordinates, s2.coordinates], {
          color: '#1565C0',
          weight: 2,
          opacity: 0.6,
          dashArray: '5, 10',
          className: 'leaflet-sensor-telemetry-line'
        });
        line.addTo(telemetryGroup);
      }
    }

    // B. RISK ZONES LAYER
    if (mapLayers.riskZones) {
      locations.forEach(loc => {
        const isSelected = loc.id === selectedZoneId;
        let color = '#388E3C'; // Low
        let fillOpacity = 0.22;

        if (loc.riskLevel === 'CRITICAL') {
          color = '#D32F2F';
          fillOpacity = 0.35;
        } else if (loc.riskLevel === 'HIGH') {
          color = '#F57C00';
          fillOpacity = 0.32;
        } else if (loc.riskLevel === 'MODERATE') {
          color = '#FBC02D';
          fillOpacity = 0.30;
        }

        // Risk Zone Circle with soft boundary
        const circle = L.circle(loc.coordinates, {
          radius: loc.riskLevel === 'CRITICAL' ? 14000 : 10000,
          color: color,
          weight: isSelected ? 3.5 : 1.8,
          fillColor: color,
          fillOpacity: isSelected ? Math.min(0.55, fillOpacity + 0.15) : fillOpacity,
          dashArray: loc.riskLevel === 'CRITICAL' ? '6, 5' : null,
          className: `risk-zone-${loc.riskLevel.toLowerCase()}`
        });

        circle.bindTooltip(`
          <div class="map-tooltip-content">
            <span class="map-tooltip-title">${loc.name}</span>
            <span class="map-tooltip-sep">•</span>
            <span style="color: ${color}; font-weight: 700;">${loc.riskPercentage}% (${loc.riskLevel})</span>
          </div>
        `, { sticky: true, className: 'leaflet-minimal-tooltip', direction: 'top', offset: [0, -10] });

        circle.on('click', () => {
          setSelectedZoneId(loc.id);
          map.flyTo(loc.coordinates, 9, { duration: 1.2 });
        });

        circle.addTo(layerGroup);

        // Circular Expanding Radar Scan Marker when zone is selected
        if (isSelected) {
          const scanIcon = L.divIcon({
            html: `<div class="location-radar-pulse"></div>`,
            className: 'leaflet-radar-div-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });
          const scanMarker = L.marker(loc.coordinates, { icon: scanIcon });
          scanMarker.addTo(layerGroup);
        }
      });
    }

    // C. IOT SENSORS LAYER
    if (mapLayers.sensors) {
      sensors.forEach(sensor => {
        const iconHtml = `
          <div class="custom-sensor-icon sensor-marker-${sensor.status.toLowerCase()}" style="width: 26px; height: 26px; font-size: 11px;">
            ${sensor.id.replace('S-', '')}
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'leaflet-sensor-div-icon',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker(sensor.coordinates, { icon: customIcon });

        const statusColor = sensor.status === 'ONLINE' ? '#2E7D32' : sensor.status === 'CRITICAL' ? '#D32F2F' : '#F57C00';
        marker.bindTooltip(`
          <div class="map-tooltip-content">
            <span class="map-tooltip-title">${sensor.id}</span>
            <span class="map-tooltip-sep">•</span>
            <span style="font-weight: 700; color: ${statusColor}">${sensor.status}</span>
            <span class="map-tooltip-sep">•</span>
            <span class="map-tooltip-muted">${sensor.value} ${sensor.unit}</span>
          </div>
        `, { sticky: true, className: 'leaflet-minimal-tooltip', direction: 'top', offset: [0, -14] });

        marker.on('click', () => {
          map.flyTo(sensor.coordinates, 10, { duration: 1 });
        });

        marker.addTo(layerGroup);
      });
    }

    // D. ROAD NETWORK & BLOCKAGES / SAFE DETOURS
    if (mapLayers.roads) {
      roads.forEach(road => {
        const isBlocked = road.status === 'BLOCKED' || road.status === 'UNSAFE';

        // Main Highway Polyline
        const roadLine = L.polyline(road.coordinates, {
          color: isBlocked ? '#D32F2F' : '#1565C0',
          weight: 4,
          dashArray: isBlocked ? '8, 8' : null,
          opacity: 0.85
        });

        roadLine.bindTooltip(`
          <div class="map-tooltip-content">
            <span class="map-tooltip-title">${road.name}</span>
            <span class="map-tooltip-sep">•</span>
            <span style="font-weight: 700; color: ${isBlocked ? '#D32F2F' : '#2E7D32'}">${road.status}</span>
          </div>
        `, { sticky: true, className: 'leaflet-minimal-tooltip' });

        roadLine.addTo(layerGroup);

        // If blocked, render Green Alternative Safe Detour Route
        if (isBlocked && road.alternativeRoute && mapLayers.blockages) {
          const altLine = L.polyline(road.alternativeRoute.coordinates, {
            color: '#2E7D32',
            weight: 5,
            dashArray: '10, 6',
            opacity: 0.95
          });

          altLine.bindTooltip(`
            <div class="map-tooltip-content">
              <span class="map-tooltip-title" style="color: #2E7D32;">✓ Safe Detour: ${road.alternativeRoute.name}</span>
              <span class="map-tooltip-sep">•</span>
              <span class="map-tooltip-muted">${road.alternativeRoute.riskPercentage}% Risk</span>
            </div>
          `, { sticky: true, className: 'leaflet-minimal-tooltip' });

          altLine.addTo(layerGroup);
        }
      });
    }

    // E. USER CURRENT GPS LOCATION MARKER
    if (userCoordinates) {
      const userGpsIcon = L.divIcon({
        html: `
          <div class="user-gps-marker">
            <div class="user-gps-pulse"></div>
            <div class="user-gps-center"></div>
          </div>
        `,
        className: 'leaflet-gps-div-icon',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const userMarker = L.marker(userCoordinates, { icon: userGpsIcon });
      userMarker.bindTooltip(`
        <div class="map-tooltip-content">
          <span class="map-tooltip-title">Your GPS Location</span>
          <span class="map-tooltip-sep">•</span>
          <span class="map-tooltip-muted">North Sikkim Slope Sector</span>
        </div>
      `, { sticky: true, className: 'leaflet-minimal-tooltip', direction: 'top', offset: [0, -10] });
      userMarker.addTo(layerGroup);
    }
  }, [locations, selectedZoneId, sensors, roads, userCoordinates, mapLayers]);

  // Handle Fullscreen resize trigger
  const toggleFullScreen = (e) => {
    if (e) e.stopPropagation();
    setIsFullScreenMap(prev => {
      const next = !prev;
      setTimeout(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
        }
      }, 300);
      return next;
    });
  };

  const handleRecenter = (e) => {
    if (e) e.stopPropagation();
    if (leafletMapRef.current && userCoordinates) {
      leafletMapRef.current.flyTo(userCoordinates, 9, { duration: 1.2 });
    }
  };

  // Determine container class
  let containerClass = "gis-map-hero";
  if (mode === 'authority') containerClass = "gis-map-authority";
  if (isFullScreenMap) containerClass = "gis-map-fullscreen";

  return (
    <div className={`gis-map-container ${containerClass}`}>
      {/* Floating Top Controls HUD */}
      <div className="map-floating-top-controls">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {isFullScreenMap && (
            <button 
              className="map-control-btn"
              onClick={toggleFullScreen}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          {/* Basemap Switcher: Topography | Light GIS | Satellite | Dark */}
          <div className="map-view-switcher">
            <button 
              className={`map-view-pill-btn ${baseMapType === 'topo' ? 'active' : ''}`}
              onClick={() => setBaseMapType('topo')}
              title="Elevation Contours & Mountain Topography"
            >
              <Mountain size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Topo
            </button>
            <button 
              className={`map-view-pill-btn ${baseMapType === 'light' ? 'active' : ''}`}
              onClick={() => setBaseMapType('light')}
              title="CartoDB Clean Light GIS"
            >
              <Map size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Light GIS
            </button>
            <button 
              className={`map-view-pill-btn ${baseMapType === 'satellite' ? 'active' : ''}`}
              onClick={() => setBaseMapType('satellite')}
              title="High-Resolution Satellite Imagery"
            >
              <Satellite size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Satellite
            </button>
            <button 
              className={`map-view-pill-btn ${baseMapType === 'dark' ? 'active' : ''}`}
              onClick={() => setBaseMapType('dark')}
              title="Dark Matter GIS"
            >
              Dark
            </button>
          </div>

          <button 
            className="map-control-btn"
            onClick={handleRecenter}
            title="Recenter to my location"
          >
            <Crosshair size={15} color="var(--cyan)" />
            <span>My Location</span>
          </button>

          <div className="map-layers-control-wrapper">
            <button 
              className={`map-control-btn ${showLayerControls ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowLayerControls(!showLayerControls);
              }}
              title="Toggle Spatial Layers"
            >
              <Layers size={15} color="var(--color-blue-500)" />
              <span>Layers</span>
            </button>

            {/* Layer Controls Floating Dropdown anchored right to this button */}
            {showLayerControls && (
              <MapLayerControls onClose={() => setShowLayerControls(false)} />
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="map-control-btn map-control-btn-critical"
            onClick={(e) => {
              e.stopPropagation();
              setIsSosOpen(true);
            }}
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

      {/* Floating Legend */}
      <MapLegend />

      {/* Floating Detailed Location Info Panel when a zone is active */}
      {selectedZone && (
        <LocationInfoPanel 
          zone={selectedZone} 
          onClose={() => setSelectedZoneId(null)} 
        />
      )}

      {/* 2D Leaflet Map Instance */}
      <div ref={mapRef} className="map-instance" />
    </div>
  );
};

export default GisMap;

