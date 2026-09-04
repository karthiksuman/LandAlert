import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialLocations,
  initialSensors,
  initialRoads,
  initialCitizenReports,
  initialFieldTasks,
  initialAlerts,
  emergencyHelplines,
  initialAiModelConfig,
  initialSystemHealth
} from '../data/initialData';
import { translations } from '../data/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Portal & Auth Management
  const [activePortal, setActivePortal] = useState('citizen'); // citizen, authority, fieldOfficer, admin
  const [authModalRole, setAuthModalRole] = useState(null); // null or portal role requiring auth
  const [currentUser, setCurrentUser] = useState({
    role: 'citizen',
    name: 'Citizen User',
    token: null
  });

  // 2. Citizen Onboarding & Localization (Always require login & onboarding on entry)
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('terra_lang') || 'en';
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationsGranted, setNotificationsGranted] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState([27.514, 88.533]); // Default around Mangan/Sikkim

  // Clear any past cached flag so user is always asked on every entry
  useEffect(() => {
    localStorage.removeItem('terra_onboarding_completed');
  }, []);

  // 3. GIS Map & Risk Zones
  const [locations, setLocations] = useState(initialLocations);
  const [selectedZoneId, setSelectedZoneId] = useState('loc-mangan');
  const [isFullScreenMap, setIsFullScreenMap] = useState(false);
  const [isTerrain3DOpen, setIsTerrain3DOpen] = useState(false);
  const [mapLayers, setMapLayers] = useState({
    riskZones: true,
    rainfall: true,
    soilMoisture: true,
    groundMovement: true,
    sensors: true,
    earthquakes: true,
    roads: true,
    blockages: true,
    shelters: true
  });

  // 4. Sensors & Admin Alerts
  const [sensors, setSensors] = useState(initialSensors);
  const [sensorAlerts, setSensorAlerts] = useState([
    {
      id: "SA-102",
      sensorId: "S-102",
      sensorName: "Mangan Slope Crack Extensometer",
      location: "Chungthang Road, Sikkim",
      issue: "Offline: No telemetry transmission received for 38 minutes.",
      battery: 12,
      timestamp: "09:12 AM",
      status: "ACTIVE"
    }
  ]);

  // 5. Citizen Reports & Field Tasks
  const [citizenReports, setCitizenReports] = useState(initialCitizenReports);
  const [fieldTasks, setFieldTasks] = useState(initialFieldTasks);
  const [activeFieldTaskId, setActiveFieldTaskId] = useState('TASK-801');

  // 6. Roads & Detours
  const [roads, setRoads] = useState(initialRoads);
  const [routeAdvisoryActive, setRouteAdvisoryActive] = useState(false);

  const viewBothRoutesOnMap = () => {
    setRouteAdvisoryActive(true);
    setMapLayers(prev => ({ ...prev, roads: true, blockages: true }));
    setSelectedZoneId('loc-mangan');
    setCitizenActiveTab('home');
  };

  // 7. Active Alerts & Helplines
  const [alerts, setAlerts] = useState(initialAlerts);
  const [helplines, setHelplines] = useState(emergencyHelplines);

  // 8. AI Model Weights & Thresholds
  const [aiConfig, setAiConfig] = useState(initialAiModelConfig);
  const [systemHealth, setSystemHealth] = useState(initialSystemHealth);

  // 9. Toast System & Modals
  const [toasts, setToasts] = useState([]);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [citizenActiveTab, setCitizenActiveTab] = useState('home'); // home, alerts, report, more

  // Translation helper
  const t = translations[selectedLanguage] || translations.en;

  // Sound generator using Web Audio API
  const playEmergencyTone = (type = 'warning') => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type === 'critical' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(type === 'critical' ? 880 : 587.33, ctx.currentTime);
      if (type === 'critical') {
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
      }

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const addToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts(prev => [{ id, title, message, type, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    if (type === 'critical' || type === 'warning') {
      playEmergencyTone(type);
    }
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(item => item.id !== id));
  };

  // 10. Network Status & Offline Queue Management (Disaster-Resilient Offline Reporting)
  const [networkStatus, setNetworkStatus] = useState(() => {
    return typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online';
  });
  const [offlineReportsQueue, setOfflineReportsQueue] = useState(() => {
    try {
      const stored = localStorage.getItem('landalert_offline_reports_queue');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Sync pending offline reports to authorities when network becomes available
  const syncOfflineReports = (customQueue = null) => {
    let queueToSync = customQueue;
    if (!queueToSync) {
      try {
        const stored = localStorage.getItem('landalert_offline_reports_queue');
        queueToSync = stored ? JSON.parse(stored) : offlineReportsQueue;
      } catch (e) {
        queueToSync = offlineReportsQueue;
      }
    }

    if (!queueToSync || queueToSync.length === 0) return;

    const count = queueToSync.length;
    const now = new Date();
    const syncedAt = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Transform queued reports into synced citizen reports
    const syncedReports = queueToSync.map(item => ({
      ...item,
      status: 'PENDING',
      syncStatus: 'SYNCED',
      syncedAt: syncedAt,
      isSyncedFromOffline: true,
      description: item.description + (item.offlineRecordedAt ? ` [Captured during field connectivity outage at ${item.offlineRecordedAt}]` : '')
    }));

    // Add to main citizen reports state so Authority Portal receives them immediately
    setCitizenReports(prev => [...syncedReports, ...prev]);

    // Clear local storage queue
    try {
      localStorage.removeItem('landalert_offline_reports_queue');
    } catch (e) {}
    setOfflineReportsQueue([]);

    // Play chime sound
    playEmergencyTone('warning');

    // Notify user with high-visibility alerts
    addToast(
      "🌐 Internet Restored: Auto-Syncing", 
      `Transmitting ${count} queued disaster report(s) from local device vault to Authority Operations Center...`, 
      "info"
    );
    setTimeout(() => {
      addToast(
        "✅ Auto-Sync Completed",
        `${count} resident hazard complaint(s) successfully received by Disaster Authorities!`,
        "success"
      );
    }, 750);
  };

  // Listen to browser network events
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus('online');
      addToast("Network Online", "Active internet connection detected. Checking offline queue...", "info");
      try {
        const stored = localStorage.getItem('landalert_offline_reports_queue');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            syncOfflineReports(parsed);
          }
        }
      } catch (e) {}
    };

    const handleOffline = () => {
      setNetworkStatus('offline');
      addToast("No Internet Connection", "Switched to Offline Mode. Field hazard reports will be saved locally on device.", "warning");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check on load if online and items exist in localStorage
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        const stored = localStorage.getItem('landalert_offline_reports_queue');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setTimeout(() => syncOfflineReports(parsed), 1200);
          }
        }
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to change network status manually (for testing/simulation in mountain conditions)
  const setNetworkMode = (mode) => {
    const prevMode = networkStatus;
    setNetworkStatus(mode);

    if (mode === 'online') {
      try {
        const stored = localStorage.getItem('landalert_offline_reports_queue');
        const parsed = stored ? JSON.parse(stored) : offlineReportsQueue;
        if (parsed && parsed.length > 0) {
          syncOfflineReports(parsed);
          return;
        }
      } catch (e) {}
      if (prevMode !== 'online') {
        addToast("Switched to High-Speed Online", "Connected to Cloud Early Warning Network.", "success");
      }
    } else if (mode === 'poor') {
      addToast(
        "Poor Network Simulated (2G / Weak Signal)", 
        "Himalayan valley conditions active. Reports will be saved locally and queued for auto-sync.", 
        "warning"
      );
    } else if (mode === 'offline') {
      addToast(
        "Offline Mode Simulated (No Internet)", 
        "Telecom blackout active. Reports will be safely stored in local device storage.", 
        "warning"
      );
    }
  };

  // Portal Switching with Authentication Protection
  const switchPortal = (targetPortal) => {
    if (targetPortal === 'citizen') {
      setActivePortal('citizen');
      return;
    }

    // Role-based auth check
    if (currentUser.role === targetPortal) {
      setActivePortal(targetPortal);
    } else {
      // Require authentication
      setAuthModalRole(targetPortal);
    }
  };

  // Login handler
  const login = (role, username, password) => {
    // In production/simulation, validates credentials and grants session
    const roleNames = {
      authority: "Commander R. Sharma (SSDMA)",
      fieldOfficer: "Field Officer T. Dorjee (FO-402)",
      admin: "Super Admin (Disaster Directorate)"
    };

    setCurrentUser({
      role,
      name: roleNames[role] || username,
      token: "jwt_simulated_token_" + Date.now()
    });

    setActivePortal(role);
    setAuthModalRole(null);
    addToast(
      "Authenticated Successfully",
      `Welcome to ${role.charAt(0).toUpperCase() + role.slice(1)} Portal as ${roleNames[role] || username}`,
      "success"
    );
  };

  // Logout handler
  const logout = () => {
    setCurrentUser({
      role: 'citizen',
      name: 'Citizen User',
      token: null
    });
    setActivePortal('citizen');
    addToast("Logged Out", "Returned to public Citizen Safety Portal", "info");
  };

  // Language changer
  const changeLanguage = (langCode) => {
    setSelectedLanguage(langCode);
    localStorage.setItem('terra_lang', langCode);
  };

  // Onboarding completion (kept in session memory so future entries prompt again)
  const completeOnboarding = () => {
    setOnboardingCompleted(true);
    addToast("Logged In Successfully", "Personalized geological risk map is now active.", "success");
  };

  // Layer toggle
  const toggleMapLayer = (layerKey) => {
    setMapLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  // WORKFLOW 1: Recalculate AI Risk Score dynamically
  const calculateRisk = (factors) => {
    const w = aiConfig.weights;
    // Normalized calculation
    const rainScore = Math.min(100, (factors.rainfall.value / 120) * 100);
    const moistureScore = factors.soilMoisture.value;
    const gvScore = Math.min(100, (factors.groundMovement.value / 7.0) * 100);
    const slopeScore = Math.min(100, (factors.slope.value / 50) * 100);
    const terrainScore = factors.terrain.status === 'Critical' ? 95 : factors.terrain.status === 'Unstable' ? 75 : 30;

    const weightedScore = Math.round(
      rainScore * w.rainfall +
      moistureScore * w.soilMoisture +
      gvScore * w.groundMovement +
      slopeScore * w.slope +
      terrainScore * w.terrainGeology
    );

    let level = 'LOW';
    if (weightedScore > aiConfig.thresholds.highMax) level = 'CRITICAL';
    else if (weightedScore > aiConfig.thresholds.moderateMax) level = 'HIGH';
    else if (weightedScore > aiConfig.thresholds.lowMax) level = 'MODERATE';

    return { percentage: Math.min(99, Math.max(10, weightedScore)), level };
  };

  // WORKFLOW 2: Citizen Hazard Report Submission (with Offline Storage & Auto-Sync)
  const submitCitizenReport = (reportData) => {
    const isOfflineMode = networkStatus === 'offline' || networkStatus === 'poor';
    const now = new Date();
    const timestamp = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isOfflineMode) {
      const offlineId = "CR-OFFLINE-" + Math.floor(10000 + Math.random() * 90000);
      const offlineReport = {
        id: offlineId,
        hazardType: reportData.hazardType || "Landslide",
        description: reportData.description,
        locationName: reportData.locationName || "Reported Geo-Location",
        coordinates: reportData.coordinates || userCoordinates,
        timestamp,
        offlineRecordedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: "PENDING",
        syncStatus: "QUEUED_OFFLINE",
        assignedOfficer: null,
        photoUrl: reportData.photoUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
        reporterName: reportData.reporterName || "Resident (Field Offline)",
        isSyncedFromOffline: true
      };

      const newQueue = [offlineReport, ...offlineReportsQueue];
      setOfflineReportsQueue(newQueue);
      try {
        localStorage.setItem('landalert_offline_reports_queue', JSON.stringify(newQueue));
      } catch (e) {}

      addToast(
        "Saved Locally in Offline Storage",
        `Incident ${offlineId} stored on device. Will auto-sync to authorities when internet returns.`,
        "warning"
      );

      return { id: offlineId, isOffline: true, queueLength: newQueue.length };
    }

    const newId = "CR-" + Math.floor(10000 + Math.random() * 90000);
    const newReport = {
      id: newId,
      hazardType: reportData.hazardType || "Landslide",
      description: reportData.description,
      locationName: reportData.locationName || "Reported Geo-Location",
      coordinates: reportData.coordinates || userCoordinates,
      timestamp,
      status: "PENDING",
      syncStatus: "ONLINE",
      assignedOfficer: null,
      photoUrl: reportData.photoUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      reporterName: reportData.reporterName || "Local Resident",
      isSyncedFromOffline: false
    };

    setCitizenReports(prev => [newReport, ...prev]);

    addToast(
      "Report Submitted",
      `Emergency ID ${newId} logged and transmitted to State Disaster Operations.`,
      "success"
    );

    return { id: newId, isOffline: false, queueLength: 0 };
  };

  // Authority verifies citizen report
  const verifyCitizenReport = (reportId) => {
    setCitizenReports(prev =>
      prev.map(r => r.id === reportId ? { ...r, status: "VERIFIED" } : r)
    );
    addToast("Report Verified", `Incident ${reportId} confirmed by Disaster Authority. Updating GIS layers.`, "warning");
  };

  // Authority assigns field officer
  const assignFieldOfficerToReport = (reportId, officerName = "Field Officer T. Dorjee (FO-402)") => {
    const report = citizenReports.find(r => r.id === reportId);
    const newTaskId = "TASK-" + Math.floor(800 + Math.random() * 200);

    setCitizenReports(prev =>
      prev.map(r => r.id === reportId ? { ...r, status: "ASSIGNED", assignedOfficer: officerName } : r)
    );

    const newTask = {
      id: newTaskId,
      title: `Field Inspection: ${report ? report.hazardType : 'Hazard'} at ${report ? report.locationName : 'Site'}`,
      sourceReportId: reportId,
      assignedTo: officerName,
      priority: "CRITICAL",
      status: "ASSIGNED",
      coordinates: report ? report.coordinates : [27.518, 88.536],
      locationName: report ? report.locationName : "Incident Site",
      taskType: "On-Site Geotechnical Inspection",
      assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deadline: "Immediate (Within 2 hrs)",
      instructions: "Conduct crack measurement, capture photos for AI vision, and submit evacuation recommendation.",
      inspectionData: null
    };

    setFieldTasks(prev => [newTask, ...prev]);
    setActiveFieldTaskId(newTaskId);

    addToast(
      "Field Task Dispatched",
      `Task ${newTaskId} assigned to ${officerName}. Notification sent to mobile unit.`,
      "info"
    );
  };

  // Field Officer updates task progression stepper
  const updateFieldTaskStatus = (taskId, newStatus, inspectionData = null) => {
    setFieldTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const updated = { ...task, status: newStatus };
          if (inspectionData) {
            updated.inspectionData = inspectionData;
          }
          return updated;
        }
        return task;
      })
    );

    if (newStatus === 'RESOLVED') {
      // Find linked report and resolve
      const task = fieldTasks.find(t => t.id === taskId);
      if (task && task.sourceReportId) {
        setCitizenReports(prev =>
          prev.map(r => r.id === task.sourceReportId ? { ...r, status: "RESOLVED" } : r)
        );
      }
      addToast("Task Resolved", `Task ${taskId} marked resolved. Authority dashboard updated.`, "success");
    } else {
      addToast("Task Progress Updated", `Task ${taskId} status advanced to ${newStatus.replace('_', ' ')}`, "info");
    }
  };

  // WORKFLOW 3: Sensor Failure & Admin Dispatch
  const assignOfficerToSensorRepair = (sensorId) => {
    const sensor = sensors.find(s => s.id === sensorId);
    const newTaskId = "TASK-S-" + Math.floor(100 + Math.random() * 900);

    const newTask = {
      id: newTaskId,
      title: `Emergency Sensor Repair: ${sensor ? sensor.name : sensorId}`,
      sourceReportId: `ADMIN-${sensorId}`,
      assignedTo: "FO-402 (T. Dorjee)",
      priority: "HIGH",
      status: "ASSIGNED",
      coordinates: sensor ? sensor.coordinates : [27.525, 88.541],
      locationName: sensor ? sensor.locationName : "Sensor Telemetry Station",
      taskType: "IoT Hardware / Battery Replacement",
      assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deadline: "Within 3 hours",
      instructions: "Check solar charge unit, replace lithium cell pack, test LoRa uplink transmission.",
      inspectionData: null
    };

    setFieldTasks(prev => [newTask, ...prev]);
    setActiveFieldTaskId(newTaskId);

    addToast(
      "Repair Dispatched",
      `Field Officer assigned to repair ${sensor ? sensor.name : sensorId}.`,
      "info"
    );
  };

  const resolveSensorAlert = (sensorId) => {
    setSensors(prev =>
      prev.map(s => s.id === sensorId ? { ...s, status: "ONLINE", faultDescription: null, lastPing: "Just now" } : s)
    );
    setSensorAlerts(prev => prev.filter(a => a.sensorId !== sensorId));
    addToast("Sensor Restored", `Sensor ${sensorId} telemetry signal back ONLINE.`, "success");
  };

  // WORKFLOW 4 & 5: Road Blockage & Detour Routing
  const toggleRoadBlockage = (roadId) => {
    setRoads(prev =>
      prev.map(road => {
        if (road.id === roadId) {
          const isNowBlocked = road.status !== 'BLOCKED';
          const newStatus = isNowBlocked ? 'BLOCKED' : 'OPEN';
          
          if (isNowBlocked) {
            addToast(
              "Road Marked BLOCKED",
              `${road.name} closed to traffic. Green alternative detour route activated for citizens.`,
              "critical"
            );
          } else {
            addToast(
              "Road Re-Opened",
              `${road.name} cleared of debris and declared safe.`,
              "success"
            );
          }
          return { ...road, status: newStatus };
        }
        return road;
      })
    );
  };

  // Broadcast Alert to Citizens
  const broadcastNewAlert = (alertData) => {
    const newId = "ALT-" + Math.floor(900 + Math.random() * 100);
    const newAlert = {
      id: newId,
      type: alertData.type || "CRITICAL_LANDSLIDE",
      level: alertData.level || "CRITICAL",
      title: alertData.title,
      district: alertData.district || "Regional",
      coordinates: alertData.coordinates || [27.512, 88.534],
      probability: alertData.probability || 85,
      message: alertData.message,
      action: alertData.action,
      issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      issuedBy: alertData.issuedBy || "State Disaster Management Authority"
    };

    setAlerts(prev => [newAlert, ...prev]);
    addToast(`🚨 ${newAlert.title}`, newAlert.message, 'critical');
  };

  // Update AI weights
  const updateAiWeights = (key, value) => {
    setAiConfig(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: parseFloat(value)
      }
    }));
    addToast("AI Model Weights Updated", `Weight for ${key} adjusted to ${value}`, "info");
  };

  // Update AI thresholds
  const updateAiThresholds = (key, value) => {
    setAiConfig(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: parseInt(value, 10)
      }
    }));
  };

  return (
    <AppContext.Provider
      value={{
        // Auth & Portal State
        activePortal,
        setActivePortal,
        authModalRole,
        setAuthModalRole,
        currentUser,
        login,
        logout,
        switchPortal,

        // Onboarding & Language
        onboardingCompleted,
        setOnboardingCompleted,
        selectedLanguage,
        changeLanguage,
        termsAccepted,
        setTermsAccepted,
        locationGranted,
        setLocationGranted,
        notificationsGranted,
        setNotificationsGranted,
        completeOnboarding,
        userCoordinates,
        setUserCoordinates,
        t,

        // GIS Map
        locations,
        setLocations,
        selectedZoneId,
        setSelectedZoneId,
        isFullScreenMap,
        setIsFullScreenMap,
        isTerrain3DOpen,
        setIsTerrain3DOpen,
        mapLayers,
        toggleMapLayer,

        // Sensors
        sensors,
        setSensors,
        sensorAlerts,
        assignOfficerToSensorRepair,
        resolveSensorAlert,

        // Citizen Reports & Field Tasks
        citizenReports,
        submitCitizenReport,
        verifyCitizenReport,
        assignFieldOfficerToReport,
        fieldTasks,
        activeFieldTaskId,
        setActiveFieldTaskId,
        updateFieldTaskStatus,

        // Roads & Detours
        roads,
        toggleRoadBlockage,
        routeAdvisoryActive,
        setRouteAdvisoryActive,
        viewBothRoutesOnMap,

        // Alerts & Helplines
        alerts,
        broadcastNewAlert,
        helplines,
        setHelplines,

        // AI & Health
        aiConfig,
        updateAiWeights,
        updateAiThresholds,
        calculateRisk,
        systemHealth,

        // UI Helpers
        toasts,
        addToast,
        removeToast,
        isSosOpen,
        setIsSosOpen,
        citizenActiveTab,
        setCitizenActiveTab,

        // Network Status & Offline Queue
        networkStatus,
        setNetworkStatus,
        setNetworkMode,
        offlineReportsQueue,
        syncOfflineReports
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
