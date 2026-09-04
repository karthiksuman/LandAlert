import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';

const Terrain3DCanvas = ({ onSelectZone, activeZoneId }) => {
  const mountRef = useRef(null);
  const { locations, sensors, roads } = useApp();
  const [hoveredObject, setHoveredObject] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030A14);
    scene.fog = new THREE.FogExp2(0x040E1A, 0.0035);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 58, 88);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f2b48, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x19C7FF, 1.8);
    dirLight.position.set(40, 80, 50);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0xFF8A00, 0.9);
    rimLight.position.set(-60, 40, -50);
    scene.add(rimLight);

    // 3. Realistic 3D Mountainous Terrain Elevation Mesh
    const terrainSize = 180;
    const segments = 110;
    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const posAttr = geometry.attributes.position;
    const count = posAttr.count;
    const colors = new Float32Array(count * 3);

    // Procedural multi-octave mountainous elevation generator (Himalayan / North-East topography)
    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      // Multi-scale ridge synthesis
      const distFromCenter = Math.sqrt(x * x + z * z);
      const ridge1 = Math.sin(x * 0.045 + 1.2) * Math.cos(z * 0.038) * 16;
      const ridge2 = Math.sin((x + z) * 0.07) * 7;
      const valley = Math.cos(x * 0.02) * Math.sin(z * 0.025) * 12;
      const noise = Math.sin(x * 0.15) * Math.cos(z * 0.15) * 2.5;

      let elevation = (ridge1 + ridge2 + valley + noise) * (1 - Math.min(distFromCenter / (terrainSize * 0.8), 0.7));
      if (elevation < -4) elevation = -4; // River canyon floor

      posAttr.setY(i, elevation);

      // Height-based elevation contour gradient
      const normHeight = (elevation + 4) / 36;
      if (normHeight < 0.25) {
        // Deep river valley (Navy Blue)
        colors[i * 3] = 0.04;
        colors[i * 3 + 1] = 0.12;
        colors[i * 3 + 2] = 0.24;
      } else if (normHeight < 0.55) {
        // Mid-slope colluvium (Cyan / Slate)
        colors[i * 3] = 0.08;
        colors[i * 3 + 1] = 0.28;
        colors[i * 3 + 2] = 0.45;
      } else if (normHeight < 0.82) {
        // Upper ridge rockface (Bright Topographic Cyan)
        colors[i * 3] = 0.10;
        colors[i * 3 + 1] = 0.55;
        colors[i * 3 + 2] = 0.80;
      } else {
        // High Peak / Tension Crest (Crisp Peak White)
        colors[i * 3] = 0.85;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 1.0;
      }
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    // Shaded Material with wireframe contour fusion
    const terrainMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.75,
      metalness: 0.2,
      wireframe: false,
      flatShading: false
    });

    const terrainMesh = new THREE.Mesh(geometry, terrainMaterial);
    scene.add(terrainMesh);

    // Topographic Grid Contour Wireframe Overlay
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x19C7FF,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const terrainWireframe = new THREE.Mesh(geometry, wireframeMat);
    terrainWireframe.position.y += 0.08;
    scene.add(terrainWireframe);

    // Helper to get elevation at any (x, z)
    const getTerrainHeight = (x, z) => {
      const ridge1 = Math.sin(x * 0.045 + 1.2) * Math.cos(z * 0.038) * 16;
      const ridge2 = Math.sin((x + z) * 0.07) * 7;
      const valley = Math.cos(x * 0.02) * Math.sin(z * 0.025) * 12;
      return Math.max(-4, (ridge1 + ridge2 + valley) * 0.8);
    };

    // 4. Volumetric 3D Risk Zones
    const zoneMeshes = [];
    locations.forEach((loc, idx) => {
      // Map geo-coordinates to local 3D terrain coordinates
      const angle = (idx / locations.length) * Math.PI * 2;
      const radius = 25 + (idx % 3) * 18;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = getTerrainHeight(x, z);

      let hexColor = 0x19D47B;
      if (loc.riskLevel === 'CRITICAL') hexColor = 0xFF3B3B;
      else if (loc.riskLevel === 'HIGH') hexColor = 0xFF8A00;
      else if (loc.riskLevel === 'MODERATE') hexColor = 0xFFD43B;

      // Glowing Ground Ring
      const ringGeo = new THREE.RingGeometry(8, 11, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hexColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.55
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x, y + 0.3, z);
      scene.add(ringMesh);

      // Translucent Volumetric Hazard Dome
      const domeGeo = new THREE.SphereGeometry(10, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({
        color: hexColor,
        transparent: true,
        opacity: 0.22,
        roughness: 0.3,
        metalness: 0.5,
        side: THREE.DoubleSide
      });
      const domeMesh = new THREE.Mesh(domeGeo, domeMat);
      domeMesh.position.set(x, y, z);
      domeMesh.userData = { id: loc.id, name: loc.name, riskLevel: loc.riskLevel, type: 'zone', x, y, z };
      scene.add(domeMesh);
      zoneMeshes.push(domeMesh);
    });

    // 5. Glowing 3D Sensor Nodes (IoT Network)
    const sensorNodes = [];
    const sensorPositions = [];

    sensors.forEach((sensor, idx) => {
      const angle = (idx / sensors.length) * Math.PI * 2 + 0.3;
      const dist = 18 + (idx % 4) * 16;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = getTerrainHeight(x, z) + 4.5;

      sensorPositions.push(new THREE.Vector3(x, y, z));

      let nodeColor = 0x19C7FF; // Online Cyan
      if (sensor.status === 'CRITICAL') nodeColor = 0xFF3B3B;
      else if (sensor.status === 'WARNING') nodeColor = 0xFF8A00;
      else if (sensor.status === 'OFFLINE') nodeColor = 0x555555;

      // 3D Sensor Beacon Sphere
      const sphereGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: sensor.status === 'OFFLINE' ? 0.2 : 0.9,
        roughness: 0.2
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(x, y, z);
      sphere.userData = { id: sensor.id, name: sensor.name, status: sensor.status, type: 'sensor', x, y, z };
      scene.add(sphere);
      sensorNodes.push(sphere);

      // Vertical Laser Line to Ground
      const groundY = getTerrainHeight(x, z);
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, groundY, z),
        new THREE.Vector3(x, y, z)
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: nodeColor, transparent: true, opacity: 0.6 });
      const verticalLine = new THREE.Line(lineGeo, lineMat);
      scene.add(verticalLine);
    });

    // 6. Active Telemetry Lines with Moving Photon Packets
    const connectionLines = [];
    const photonPoints = [];

    for (let i = 0; i < sensorPositions.length - 1; i++) {
      const p1 = sensorPositions[i];
      const p2 = sensorPositions[i + 1];

      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x19C7FF,
        transparent: true,
        opacity: 0.35
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      connectionLines.push(line);

      // Photon packet particle on each connection
      const photonGeo = new THREE.SphereGeometry(0.5, 8, 8);
      const photonMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const photon = new THREE.Mesh(photonGeo, photonMat);
      photon.userData = { p1, p2, progress: (i * 0.2) % 1.0, speed: 0.008 + (i % 3) * 0.004 };
      scene.add(photon);
      photonPoints.push(photon);
    }

    // 7. 3D Mountain Highway with Active Blockage & Safe Detour
    const roadPointsUnsafe = [
      new THREE.Vector3(-45, getTerrainHeight(-45, -20) + 0.6, -20),
      new THREE.Vector3(-20, getTerrainHeight(-20, -10) + 0.6, -10),
      new THREE.Vector3(5, getTerrainHeight(5, 5) + 0.6, 5),
      new THREE.Vector3(35, getTerrainHeight(35, 15) + 0.6, 15)
    ];
    const curveUnsafe = new THREE.CatmullRomCurve3(roadPointsUnsafe);
    const roadGeoUnsafe = new THREE.TubeGeometry(curveUnsafe, 40, 0.6, 8, false);
    const roadMatUnsafe = new THREE.MeshBasicMaterial({ color: 0xFF3B3B });
    const roadMeshUnsafe = new THREE.Mesh(roadGeoUnsafe, roadMatUnsafe);
    scene.add(roadMeshUnsafe);

    // Green Alternative Safe Detour Corridor
    const roadPointsSafe = [
      new THREE.Vector3(-45, getTerrainHeight(-45, -20) + 0.6, -20),
      new THREE.Vector3(-30, getTerrainHeight(-30, -35) + 0.6, -35),
      new THREE.Vector3(0, getTerrainHeight(0, -38) + 0.6, -38),
      new THREE.Vector3(25, getTerrainHeight(25, -20) + 0.6, -20),
      new THREE.Vector3(35, getTerrainHeight(35, 15) + 0.6, 15)
    ];
    const curveSafe = new THREE.CatmullRomCurve3(roadPointsSafe);
    const roadGeoSafe = new THREE.TubeGeometry(curveSafe, 40, 0.6, 8, false);
    const roadMatSafe = new THREE.MeshBasicMaterial({ color: 0x19D47B });
    const roadMeshSafe = new THREE.Mesh(roadGeoSafe, roadMatSafe);
    scene.add(roadMeshSafe);

    // 8. Interactive Mouse Orbit Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngle = 0;
    let cameraElevation = 54;
    let cameraDistance = 86;
    let targetLookAt = new THREE.Vector3(0, 0, 0);

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) {
        // Raycasting for node hover
        const rect = renderer.domElement.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
        const intersects = raycaster.intersectObjects([...zoneMeshes, ...sensorNodes]);

        if (intersects.length > 0) {
          const obj = intersects[0].object;
          setHoveredObject(obj.userData);
          renderer.domElement.style.cursor = 'pointer';
        } else {
          setHoveredObject(null);
          renderer.domElement.style.cursor = 'grab';
        }
        return;
      }

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      cameraAngle -= deltaX * 0.008;
      cameraElevation = Math.max(18, Math.min(84, cameraElevation + deltaY * 0.25));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      cameraDistance = Math.max(35, Math.min(140, cameraDistance + e.deltaY * 0.06));
    };

    const onClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
      const intersects = raycaster.intersectObjects([...zoneMeshes, ...sensorNodes]);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.id) {
          onSelectZone(obj.userData.id);
          // Trigger radar scan animation
          setIsScanning(true);
          setTimeout(() => setIsScanning(false), 2400);

          // Smoothly animate target to clicked point
          targetLookAt.set(obj.userData.x, obj.userData.y, obj.userData.z);
        }
      }
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });
    domEl.addEventListener('click', onClick);

    // 9. Animation Loop with Subtle Atmospheric Camera Drift
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Subtle atmospheric camera drift when user is not dragging
      if (!isDragging) {
        cameraAngle += 0.0007; // Very gentle drift
      }

      // Smooth camera position interpolation
      const targetCamX = targetLookAt.x + Math.sin(cameraAngle) * cameraDistance;
      const targetCamZ = targetLookAt.z + Math.cos(cameraAngle) * cameraDistance;
      const targetCamY = targetLookAt.y + cameraElevation;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;

      camera.lookAt(targetLookAt);

      // Animate Sensor Beacons (Pulsing breath)
      sensorNodes.forEach((node, i) => {
        if (node.userData.status !== 'OFFLINE') {
          const pulse = 1 + Math.sin(elapsedTime * 3 + i) * 0.15;
          node.scale.set(pulse, pulse, pulse);
        }
      });

      // Animate Moving Data Packets (Photons along connection vectors)
      photonPoints.forEach(photon => {
        photon.userData.progress += photon.userData.speed;
        if (photon.userData.progress > 1.0) photon.userData.progress = 0;

        photon.position.lerpVectors(
          photon.userData.p1,
          photon.userData.p2,
          photon.userData.progress
        );
      });

      // Subtle Volumetric Hazard Zone breathing
      zoneMeshes.forEach((mesh, idx) => {
        if (mesh.userData.riskLevel === 'CRITICAL') {
          const pulse = 1 + Math.sin(elapsedTime * 2.2 + idx) * 0.08;
          mesh.scale.set(pulse, pulse, pulse);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // 10. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      domEl.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);

      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      geometry.dispose();
      terrainMaterial.dispose();
      renderer.dispose();
    };
  }, [locations, sensors, roads]);

  return (
    <div className="terrain-3d-canvas-wrapper" ref={mountRef}>
      {/* 3D HUD Tooltip on Hover */}
      {hoveredObject && (
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(4, 14, 23, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-highlight)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            boxShadow: '0 0 16px var(--cyan-glow)',
            pointerEvents: 'none',
            zIndex: 100
          }}
        >
          {hoveredObject.type === 'zone' ? (
            <span>📍 {hoveredObject.name} • {hoveredObject.riskLevel} RISK (Click to inspect)</span>
          ) : (
            <span>📡 IoT Sensor {hoveredObject.id}: {hoveredObject.name} • Status: {hoveredObject.status}</span>
          )}
        </div>
      )}

      {/* Holographic Radar Scanner Overlay on Location Selection */}
      {isScanning && (
        <div className="radar-scanner-overlay">
          <div className="radar-sweep-beam" />
          <div className="radar-status-text">
            SCANNING SLOPE VECTORS • AI RISK ANALYSIS COMPLETE
          </div>
        </div>
      )}
    </div>
  );
};

export default Terrain3DCanvas;
