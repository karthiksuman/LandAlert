import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import MapLegend from './MapLegend';
import MapLayerControls from './MapLayerControls';
import LocationInfoPanel from './LocationInfoPanel';
import { Maximize2, Minimize2, Layers, Crosshair, Box, PhoneCall, ArrowLeft } from 'lucide-react';

const GisMap = ({ mode = 'half' }) => {
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
    setIsTerrain3DOpen,
    setIsSosOpen
  } = useApp();

  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const layerGroupRef = useRef(null);
  const [showLayerControls, setShowLayerControls] = useState(false);

  // Selected Zone Object
  const selectedZone = locations.find(l => l.id === selectedZoneId) || locations[0];

  // Initialize Leaflet Map
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

      // CartoDB Dark Matter Tiles (High-contrast, GIS command center look)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      leafletMapRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Cleanup on unmount
    };
  }, []);

  // Update Layers & Overlays whenever data or layer toggles change
  useEffect(() => {
    const map = leafletMapRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. RISK ZONES LAYER
    if (mapLayers.riskZones) {
      locations.forEach(loc => {
        const isSelected = loc.id === selectedZoneId;
        let color = '#2E7D32'; // Low
        let fillColor = 'rgba(46, 125, 50, 0.35)';

        if (loc.riskLevel === 'CRITICAL') {
          color = '#D32F2F';
          fillColor = 'rgba(211, 47, 47, 0.45)';
        } else if (loc.riskLevel === 'HIGH') {
          color = '#F57C00';
          fillColor = 'rgba(245, 124, 0, 0.4)';
        } else if (loc.riskLevel === 'MODERATE') {
          color = '#FBC02D';
          fillColor = 'rgba(251, 192, 45, 0.35)';
        }

        // Add risk zone polygon or circle
        const circle = L.circle(loc.coordinates, {
          radius: loc.riskLevel === 'CRITICAL' ? 14000 : 10000,
          color: color,
          weight: isSelected ? 3 : 1.5,
          fillColor: fillColor,
          fillOpacity: 0.6,
          dashArray: loc.riskLevel === 'CRITICAL' ? '6, 4' : null
        });

        circle.bindTooltip(`
          <div style="font-family: Inter, sans-serif; font-size: 12px; font-weight: bold; color: #fff;">
            <strong>${loc.name}</strong><br/>
            Risk: <span style="color: ${color}">${loc.riskPercentage}% (${loc.riskLevel})</span>
          </div>
        `, { sticky: true, className: 'leaflet-custom-tooltip' });

        circle.on('click', () => {
          setSelectedZoneId(loc.id);
          map.flyTo(loc.coordinates, 9, { duration: 1.2 });
        });

        circle.addTo(layerGroup);
      });
    }

    // 2. IOT SENSORS LAYER
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

        marker.bindTooltip(`
          <div style="font-family: Inter, sans-serif; font-size: 11px; color: #fff;">
            <strong>${sensor.name} (${sensor.id})</strong><br/>
            Status: <span style="font-weight: bold; color: ${sensor.status === 'ONLINE' ? '#4CAF50' : sensor.status === 'CRITICAL' ? '#FF5252' : '#FFA726'}">${sensor.status}</span><br/>
            Reading: ${sensor.value} ${sensor.unit}<br/>
            Battery: ${sensor.battery}% | Signal: ${sensor.signal} dBm
          </div>
        `, { sticky: true });

        marker.on('click', () => {
          map.flyTo(sensor.coordinates, 11, { duration: 1 });
        });

        marker.addTo(layerGroup);
      });
    }

    // 3. ROAD NETWORK & BLOCKAGES / SAFE DETOURS
    if (mapLayers.roads) {
      roads.forEach(road => {
        const isBlocked = road.status === 'BLOCKED' || road.status === 'UNSAFE';

        // Main Highway Polyline
        const roadLine = L.polyline(road.coordinates, {
          color: isBlocked ? '#D32F2F' : '#1E88E5',
          weight: 4,
          dashArray: isBlocked ? '8, 8' : null,
          opacity: 0.85
        });

        roadLine.bindTooltip(`
          <div style="font-family: Inter, sans-serif; font-size: 11px; color: #fff;">
            <strong>${road.name}</strong><br/>
            Status: <span style="font-weight: bold; color: ${isBlocked ? '#FF5252' : '#66BB6A'}">${road.status}</span><br/>
            ${road.reason}
          </div>
        `);

        roadLine.addTo(layerGroup);

        // If blocked, render Green Alternative Safe Route
        if (isBlocked && road.alternativeRoute && mapLayers.blockages) {
          const altLine = L.polyline(road.alternativeRoute.coordinates, {
            color: '#00E676',
            weight: 5,
            dashArray: '10, 6',
            opacity: 0.95
          });

          altLine.bindTooltip(`
            <div style="font-family: Inter, sans-serif; font-size: 11px; color: #fff;">
              <strong style="color: #00E676;">✓ ${road.alternativeRoute.name}</strong><br/>
              Status: Safe Alternative Detour (Risk: ${road.alternativeRoute.riskPercentage}%)
            </div>
          `, { sticky: true });

          altLine.addTo(layerGroup);
        }
      });
    }

    // 4. USER CURRENT GPS LOCATION MARKER
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
      userMarker.bindTooltip("<strong>Your Current GPS Location</strong><br/>North Sikkim Slope Zone", { sticky: true });
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

  const handleRecenter = () => {
    if (leafletMapRef.current && userCoordinates) {
      leafletMapRef.current.flyTo(userCoordinates, 9, { duration: 1.2 });
    }
  };

  // Determine container class
  let containerClass = "gis-map-half";
  if (mode === 'authority') containerClass = "gis-map-authority";
  if (isFullScreenMap) containerClass = "gis-map-fullscreen";

  return (
    <div 
      className={`gis-map-container ${containerClass}`}
      onClick={() => {
        // If on mobile/half mode, clicking the map expands to full-screen mode!
        if (!isFullScreenMap && mode === 'half') {
          toggleFullScreen();
        }
      }}
    >
      {/* Floating Top Controls */}
      <div className="map-floating-top-controls">
        <div style={{ display: 'flex', gap: '8px' }}>
          {isFullScreenMap && (
            <button 
              className="map-control-btn"
              onClick={toggleFullScreen}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          <button 
            className="map-control-btn"
            onClick={handleRecenter}
            title="Recenter to my location"
          >
            <Crosshair size={16} color="#29B6F6" />
            <span>My Location</span>
          </button>

          <button 
            className="map-control-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowLayerControls(!showLayerControls);
            }}
            title="Toggle Map Layers"
          >
            <Layers size={16} color="#29B6F6" />
            <span>Layers</span>
          </button>

          <button 
            className="map-control-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsTerrain3DOpen(true);
            }}
            title="Open 3D Elevation Model"
          >
            <Box size={16} color="#00E676" />
            <span>3D DEM</span>
          </button>
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
            <PhoneCall size={16} />
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

      {/* Floating Detailed Location Info Panel when a zone is active */}
      {selectedZone && (
        <LocationInfoPanel 
          zone={selectedZone} 
          onClose={() => setSelectedZoneId(null)} 
        />
      )}

      {/* Leaflet Map Div */}
      <div ref={mapRef} className="map-instance" />
    </div>
  );
};

export default GisMap;
