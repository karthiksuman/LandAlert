import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import MapLegend from './MapLegend';
import MapLayerControls from './MapLayerControls';
import LocationInfoPanel from './LocationInfoPanel';
import { Maximize2, Minimize2, Layers, Crosshair, PhoneCall, ArrowLeft, Map, Mountain, Satellite, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

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
    setIsSosOpen,
    routeAdvisoryActive,
    setRouteAdvisoryActive
  } = useApp();

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const layerGroupRef = useRef(null);
  const telemetryGroupRef = useRef(null);

  const [baseMapType, setBaseMapType] = useState('osm'); // 'osm' | 'topo' | 'satellite'
  const [showLayerControls, setShowLayerControls] = useState(false);

  // Selected Zone Object
  const selectedZone = locations.find(l => l.id === selectedZoneId) || locations[0];

  // Tile Layer Definitions (OpenStreetMap Standard Basemap - Zero API Key required)
  const tileConfigs = {
    osm: {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: { 
        maxZoom: 19, 
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' 
      }
    },
    topo: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      options: { 
        maxZoom: 18, 
        attribution: '&copy; Esri &copy; USGS' 
      }
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      options: { 
        maxZoom: 18, 
        attribution: '&copy; Esri World Imagery' 
      }
    }
  };

  // 1. Initialize 2D Leaflet Map with OpenStreetMap Standard Basemap
  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      // Center on North-East India (around Sikkim/Assam)
      const map = L.map(mapRef.current, {
        center: [26.4, 91.8],
        zoom: 7,
        zoomControl: false,
        attributionControl: true
      });

      // Default OpenStreetMap Tile Layer (Zero API Key required)
      const baseTile = L.tileLayer(tileConfigs.osm.url, tileConfigs.osm.options).addTo(map);
      tileLayerRef.current = baseTile;

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      leafletMapRef.current = map;
      telemetryGroupRef.current = L.layerGroup().addTo(map);
      layerGroupRef.current = L.layerGroup().addTo(map);
    }
  }, []);

  // 2. Switch Basemap (OpenStreetMap vs Topography vs Satellite)
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = tileConfigs[baseMapType] || tileConfigs.osm;
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
        const isAdvisoryTarget = routeAdvisoryActive && road.id === 'road-nh10';

        // 1. HAZARDOUS ROUTE WHERE LANDSLIDE MAY OCCUR (Thick Red Line)
        if (isBlocked) {
          // Outer Hazard Glow Aura
          const halo = L.polyline(road.coordinates, {
            color: 'rgba(211, 47, 47, 0.35)',
            weight: isAdvisoryTarget ? 16 : 12,
            lineCap: 'round',
            lineJoin: 'round'
          });
          halo.addTo(layerGroup);

          // Main Thick Red Polyline
          const roadLine = L.polyline(road.coordinates, {
            color: '#D32F2F',
            weight: isAdvisoryTarget ? 9 : 7,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });

          roadLine.bindTooltip(`
            <div class="map-tooltip-content" style="border-left: 3px solid #D32F2F;">
              <span class="map-tooltip-title" style="color: #D32F2F; font-weight: 800;">🔴 HIGH LANDSLIDE RISK: ${road.name}</span>
              <span class="map-tooltip-sep">•</span>
              <span style="font-weight: 700; color: #D32F2F;">${road.riskPercentage}% Hazard (BLOCKED)</span>
            </div>
          `, { sticky: true, className: 'leaflet-minimal-tooltip' });

          roadLine.addTo(layerGroup);

          // Blockage / Rockslide icon along blocked section (e.g. 29th Mile)
          if (road.blockedSection) {
            const blockIcon = L.divIcon({
              html: `
                <div style="background: #D32F2F; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; box-shadow: 0 2px 10px rgba(211,47,47,0.5); white-space: nowrap; border: 2px solid #FFF; display: flex; align-items: center; gap: 4px;">
                  ⚠️ Active Rockslide: 29th Mile (NH-10 Blocked)
                </div>
              `,
              className: 'leaflet-road-blockage-icon',
              iconAnchor: [85, 14]
            });
            const blockMarker = L.marker(road.blockedSection[0], { icon: blockIcon });
            blockMarker.bindTooltip("Severe active rockslide with debris blocking both carriageways. 4.2 mm/h tension cracks.", { direction: 'top' });
            blockMarker.addTo(layerGroup);
          }
        } else {
          // Normal Open Highway
          const roadLine = L.polyline(road.coordinates, {
            color: '#1565C0',
            weight: 4,
            opacity: 0.85
          });

          roadLine.bindTooltip(`
            <div class="map-tooltip-content">
              <span class="map-tooltip-title">${road.name}</span>
              <span class="map-tooltip-sep">•</span>
              <span style="font-weight: 700; color: #2E7D32;">OPEN / SAFE</span>
            </div>
          `, { sticky: true, className: 'leaflet-minimal-tooltip' });

          roadLine.addTo(layerGroup);
        }

        // 2. BEST REFERRED ROUTE BY AI (Thick Green Line)
        if (isBlocked && road.alternativeRoute && mapLayers.blockages) {
          // Outer Safe Glow Aura
          const altHalo = L.polyline(road.alternativeRoute.coordinates, {
            color: 'rgba(46, 125, 50, 0.35)',
            weight: isAdvisoryTarget ? 16 : 12,
            lineCap: 'round',
            lineJoin: 'round'
          });
          altHalo.addTo(layerGroup);

          // Main Thick Green Polyline
          const altLine = L.polyline(road.alternativeRoute.coordinates, {
            color: '#2E7D32',
            weight: isAdvisoryTarget ? 9 : 7,
            opacity: 1,
            lineCap: 'round',
            lineJoin: 'round'
          });

          altLine.bindTooltip(`
            <div class="map-tooltip-content" style="border-left: 3px solid #2E7D32;">
              <span class="map-tooltip-title" style="color: #2E7D32; font-weight: 800;">🟢 BEST REFERRED ROUTE BY AI</span>
              <span class="map-tooltip-sep">•</span>
              <span class="map-tooltip-title">${road.alternativeRoute.name}</span>
              <span class="map-tooltip-sep">•</span>
              <span style="color: #2E7D32; font-weight: 700;">${road.alternativeRoute.riskPercentage}% Risk (SAFE & CLEAR)</span>
            </div>
          `, { sticky: true, className: 'leaflet-minimal-tooltip' });

          altLine.addTo(layerGroup);

          // Safe route waypoint marker
          const safeIcon = L.divIcon({
            html: `
              <div style="background: #2E7D32; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; box-shadow: 0 2px 10px rgba(46,125,50,0.5); white-space: nowrap; border: 2px solid #FFF; display: flex; align-items: center; gap: 4px;">
                ✓ AI Recommended Safe Detour (Lava - Reshi Pass)
              </div>
            `,
            className: 'leaflet-road-safe-icon',
            iconAnchor: [95, 14]
          });
          const safeMarker = L.marker(road.alternativeRoute.coordinates[2], { icon: safeIcon });
          safeMarker.bindTooltip("Geologically stable ridgeline bypass route actively monitored by BRO clearance patrol units.", { direction: 'top' });
          safeMarker.addTo(layerGroup);
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
  }, [locations, selectedZoneId, sensors, roads, userCoordinates, mapLayers, routeAdvisoryActive]);

  // Automatically zoom and fit both routes when Route Advisory is activated
  useEffect(() => {
    if (routeAdvisoryActive && leafletMapRef.current) {
      // Zoom to encompass both NH-10 and Lava-Reshi Detour in Sikkim
      leafletMapRef.current.fitBounds([
        [27.36, 88.42],
        [27.60, 88.74]
      ], { padding: [50, 50], maxZoom: 12, animate: true, duration: 1.2 });
    }
  }, [routeAdvisoryActive]);

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
      {/* Route Advisory Active Floating HUD Banner */}
      {routeAdvisoryActive && (
        <div style={{
          position: 'absolute',
          top: '56px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-pill)',
          boxShadow: '0 4px 18px rgba(11, 31, 51, 0.16)',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '92%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#D32F2F', fontWeight: 800 }}>
              <span style={{ width: '16px', height: '5px', background: '#D32F2F', borderRadius: '2px', display: 'inline-block' }} />
              Hazard Route: NH-10 (Landslide Risk: 92%)
            </span>
            <span style={{ color: 'var(--color-text-muted)', fontWeight: 700 }}>vs</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#2E7D32', fontWeight: 800 }}>
              <span style={{ width: '16px', height: '5px', background: '#2E7D32', borderRadius: '2px', display: 'inline-block' }} />
              Best Referred Route by AI: Lava - Reshi Detour (24% Safe)
            </span>
          </div>
          <button
            onClick={() => setRouteAdvisoryActive(false)}
            style={{
              background: 'var(--color-blue-50)',
              border: '1px solid var(--color-blue-200)',
              color: 'var(--color-navy)',
              cursor: 'pointer',
              padding: '3px 8px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Reset Map View"
          >
            <X size={13} />
            <span>Close Route View</span>
          </button>
        </div>
      )}

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

          {/* Basemap Switcher: OpenStreetMap | Topography | Satellite */}
          <div className="map-view-switcher">
            <button 
              className={`map-view-pill-btn ${baseMapType === 'osm' ? 'active' : ''}`}
              onClick={() => setBaseMapType('osm')}
              title="GIS Map Basemap"
            >
              <Map size={13} style={{ display: 'inline', marginRight: '4px' }} />
              GIS Map
            </button>
            <button 
              className={`map-view-pill-btn ${baseMapType === 'topo' ? 'active' : ''}`}
              onClick={() => setBaseMapType('topo')}
              title="Elevation Contours & Mountain Topography"
            >
              <Mountain size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Topo
            </button>
            <button 
              className={`map-view-pill-btn ${baseMapType === 'satellite' ? 'active' : ''}`}
              onClick={() => setBaseMapType('satellite')}
              title="High-Resolution Satellite Imagery"
            >
              <Satellite size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Satellite
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

