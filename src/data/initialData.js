// Comprehensive Initial Geo-Spatial & Telemetry Data for North-East India
export const initialLocations = [
  {
    id: "loc-mangan",
    name: "Mangan - Chungthang Highway Corridor",
    district: "North Sikkim",
    state: "Sikkim",
    coordinates: [27.512, 88.534],
    bounds: [
      [27.48, 88.50],
      [27.55, 88.56]
    ],
    riskPercentage: 86,
    riskLevel: "CRITICAL", // CRITICAL, HIGH, MODERATE, LOW
    factors: {
      rainfall: { value: 112, unit: "mm/24h", status: "Critical" },
      soilMoisture: { value: 91, unit: "%", status: "Critical" },
      groundMovement: { value: 5.8, unit: "mm/s", status: "High" },
      slope: { value: 42, unit: "°", status: "Critical" },
      terrain: { value: "Fractured Gneiss & Colluvium", status: "Unstable" }
    },
    predictionWindow: "High landslide probability in the next 4 to 6 hours.",
    whyElevated: "Extremely heavy monsoon rainfall has completely saturated overburden soil on a 42° slope. Micro-seismic geophones show progressive deep-seated shear displacement.",
    safetyPrecautions: [
      "Immediate evacuation from slope-toe dwellings to Chungthang Higher Secondary School shelter.",
      "Total ban on non-emergency vehicular movement along North Sikkim Highway.",
      "Stay strictly clear of perennial mountain rivulets prone to sudden debris flows.",
      "Maintain active communication via VHF/satellite phone stations."
    ],
    populationAtRisk: 14200,
    shelters: [
      { name: "Chungthang Community Hall Relief Camp", lat: 27.598, lng: 88.647, capacity: 450, occupied: 180 },
      { name: "Mangan District Sports Ground Shelter", lat: 27.508, lng: 88.528, capacity: 800, occupied: 320 }
    ],
    weather: {
      temp: 18,
      condition: "Heavy Rain & Mist",
      rainfall: 112,
      humidity: 96,
      wind: "28 km/h NW"
    },
    earthquakes: [
      { year: 2025, date: "14 Oct", mag: 4.8, distance: "18 km NW", impact: "Induced slope toe shear failure" },
      { year: 2024, date: "08 Jul", mag: 5.2, distance: "34 km N", impact: "Rockfall triggering on upper ridge" },
      { year: 2021, date: "05 Apr", mag: 5.4, distance: "28 km NE", impact: "Moderate ground displacement detected" }
    ]
  },
  {
    id: "loc-haflong",
    name: "Haflong - Jatinga Valley Slopes",
    district: "Dima Hasao",
    state: "Assam",
    coordinates: [25.176, 93.023],
    bounds: [
      [25.14, 92.98],
      [25.21, 93.06]
    ],
    riskPercentage: 74,
    riskLevel: "HIGH",
    factors: {
      rainfall: { value: 78, unit: "mm/24h", status: "High" },
      soilMoisture: { value: 84, unit: "%", status: "High" },
      groundMovement: { value: 3.2, unit: "mm/s", status: "Moderate" },
      slope: { value: 36, unit: "°", status: "High" },
      terrain: { value: "Soft Tertiary Shale & Siltstone", status: "Unstable" }
    },
    predictionWindow: "Elevated landslide probability in the next 12 hours.",
    whyElevated: "Persistent precipitation has liquefied fine-grained shale formations. Inclinometer S-104 reports ongoing tilt creep towards the railway cutting.",
    safetyPrecautions: [
      "Lumding-Badarpur hill rail section under precautionary speed restriction.",
      "Avoid traveling along NH-54E during nighttime rain spells.",
      "Inspect hillside retaining walls for expanding tension cracks."
    ],
    populationAtRisk: 8600,
    shelters: [
      { name: "Haflong Government College Shelter", lat: 25.182, lng: 93.029, capacity: 600, occupied: 110 }
    ],
    weather: {
      temp: 24,
      condition: "Torrential Downpour",
      rainfall: 78,
      humidity: 89,
      wind: "22 km/h SE"
    },
    earthquakes: [
      { year: 2024, date: "19 May", mag: 4.4, distance: "22 km SE", impact: "Shallow tremors recorded" },
      { year: 2022, date: "02 Jun", mag: 5.0, distance: "45 km W", impact: "Minor soil subsidence" }
    ]
  },
  {
    id: "loc-kohima",
    name: "Kohima - Zubza Bypass Sinking Zone",
    district: "Kohima",
    state: "Nagaland",
    coordinates: [25.674, 94.108],
    bounds: [
      [25.64, 94.07],
      [25.71, 94.14]
    ],
    riskPercentage: 88,
    riskLevel: "CRITICAL",
    factors: {
      rainfall: { value: 94, unit: "mm/24h", status: "High" },
      soilMoisture: { value: 88, unit: "%", status: "Critical" },
      groundMovement: { value: 6.4, unit: "mm/s", status: "Critical" },
      slope: { value: 38, unit: "°", status: "High" },
      terrain: { value: "Dishkai Schist / Loose Regolith", status: "Critical" }
    },
    predictionWindow: "Imminent landslide & road sinking hazard within 2 to 4 hours.",
    whyElevated: "Extensometers at Zubza report rapid tensile fracture widening (>12 mm/hr). Sub-surface water pressure is forcing translational debris slide.",
    safetyPrecautions: [
      "NH-29 closed at Zubza; traffic diverted via bypass route.",
      "Residents within 200m contour line ordered to relocate to Zubza Community Center.",
      "Heavy vehicles barred indefinitely."
    ],
    populationAtRisk: 19500,
    shelters: [
      { name: "Zubza Indoor Stadium Emergency Center", lat: 25.688, lng: 94.062, capacity: 500, occupied: 290 },
      { name: "Kohima Local Ground Evacuation Shelter", lat: 25.669, lng: 94.104, capacity: 1200, occupied: 410 }
    ],
    weather: {
      temp: 20,
      condition: "Severe Storm & Lightning",
      rainfall: 94,
      humidity: 94,
      wind: "32 km/h E"
    },
    earthquakes: [
      { year: 2025, date: "22 Jan", mag: 5.1, distance: "25 km NE", impact: "Widened active road subsidence" },
      { year: 2023, date: "11 Nov", mag: 4.7, distance: "40 km S", impact: "Cracks observed in culverts" }
    ]
  },
  {
    id: "loc-cherrapunji",
    name: "Sohra - Cherrapunji Gorges",
    district: "East Khasi Hills",
    state: "Meghalaya",
    coordinates: [25.298, 91.732],
    bounds: [
      [25.26, 91.69],
      [25.33, 91.77]
    ],
    riskPercentage: 48,
    riskLevel: "MODERATE",
    factors: {
      rainfall: { value: 145, unit: "mm/24h", status: "Very High" },
      soilMoisture: { value: 65, unit: "%", status: "Moderate" },
      groundMovement: { value: 1.1, unit: "mm/s", status: "Low" },
      slope: { value: 45, unit: "°", status: "Critical" },
      terrain: { value: "Massive Sandstone Plateau Escarpment", status: "Moderate" }
    },
    predictionWindow: "Moderate rockfall hazard; high flash flood probability.",
    whyElevated: "Excessive rainfall volume drains rapidly over sheer sandstone cliffs. Low soil retention reduces mudslide risk, but cliff-edge rockfall is elevated.",
    safetyPrecautions: [
      "Avoid standing near rim viewpoints during dense cloud mist.",
      "Watch for flash flooding in canyon riverbeds.",
      "Follow District Disaster Management Meghalaya advisories."
    ],
    populationAtRisk: 5200,
    shelters: [
      { name: "Sohra Civil Sub-Division Shelter", lat: 25.302, lng: 91.728, capacity: 350, occupied: 40 }
    ],
    weather: {
      temp: 19,
      condition: "Torrential Rains & Fog",
      rainfall: 145,
      humidity: 98,
      wind: "26 km/h S"
    },
    earthquakes: [
      { year: 2024, date: "03 Aug", mag: 4.2, distance: "30 km W", impact: "No major surface displacement" }
    ]
  },
  {
    id: "loc-aizawl",
    name: "Aizawl Western Slopes (Ramhlun / Chite)",
    district: "Aizawl",
    state: "Mizoram",
    coordinates: [23.731, 92.717],
    bounds: [
      [23.70, 92.68],
      [23.76, 92.75]
    ],
    riskPercentage: 68,
    riskLevel: "HIGH",
    factors: {
      rainfall: { value: 62, unit: "mm/24h", status: "Moderate" },
      soilMoisture: { value: 78, unit: "%", status: "High" },
      groundMovement: { value: 2.8, unit: "mm/s", status: "Moderate" },
      slope: { value: 34, unit: "°", status: "High" },
      terrain: { value: "Steep Sandstone-Shale Interbedding", status: "Unstable" }
    },
    predictionWindow: "High risk of slope creep and retaining wall collapse in 8 to 12 hours.",
    whyElevated: "Unplanned slope cuts and poor storm drainage overburden steep ridge developments.",
    safetyPrecautions: [
      "Clear roof drainage pipes away from slope faces.",
      "Report building foundation fissures immediately to Aizawl Municipal Corporation.",
      "Prepare emergency grab-bags for quick evacuation."
    ],
    populationAtRisk: 22000,
    shelters: [
      { name: "Ramhlun Indoor Stadium Relief Camp", lat: 23.742, lng: 92.725, capacity: 700, occupied: 150 }
    ],
    weather: {
      temp: 23,
      condition: "Intermittent Heavy Showers",
      rainfall: 62,
      humidity: 87,
      wind: "16 km/h SW"
    },
    earthquakes: [
      { year: 2024, date: "15 Dec", mag: 5.3, distance: "38 km SE", impact: "Widened ground cracks in Ramhlun" }
    ]
  },
  {
    id: "loc-guwahati",
    name: "Guwahati - Kamrup Foothills & Brahmaputra Valley",
    district: "Kamrup Metropolitan",
    state: "Assam",
    coordinates: [26.144, 91.736],
    bounds: [
      [26.10, 91.68],
      [26.19, 91.80]
    ],
    riskPercentage: 22,
    riskLevel: "LOW",
    factors: {
      rainfall: { value: 24, unit: "mm/24h", status: "Low" },
      soilMoisture: { value: 46, unit: "%", status: "Low" },
      groundMovement: { value: 0.4, unit: "mm/s", status: "Stable" },
      slope: { value: 14, unit: "°", status: "Low" },
      terrain: { value: "Alluvial Plain & Granitic Inliers", status: "Stable" }
    },
    predictionWindow: "Slope stability normal. Regular urban drainage monitoring active.",
    whyElevated: "Low slope inclination and moderate precipitation maintain healthy slope factors of safety.",
    safetyPrecautions: [
      "Regular municipal drainage clearance in low-lying sectors.",
      "Monitor Brahmaputra river gauges for downstream water influx."
    ],
    populationAtRisk: 3000,
    shelters: [
      { name: "Sarussajai Stadium Disaster Resource Center", lat: 26.115, lng: 91.758, capacity: 3000, occupied: 0 }
    ],
    weather: {
      temp: 29,
      condition: "Partly Cloudy with Light Rain",
      rainfall: 24,
      humidity: 72,
      wind: "12 km/h E"
    },
    earthquakes: [
      { year: 2021, date: "28 Apr", mag: 6.4, distance: "85 km N (Sonitpur)", impact: "Structural tremors felt throughout city" }
    ]
  }
];

// IoT Sensors Network across North-Eastern India
export const initialSensors = [
  {
    id: "S-101",
    name: "Mangan Toe Geophone Sensor",
    type: "ground_vibration",
    typeLabel: "Ground Movement / Seismic",
    locationName: "Mangan Pass, Sikkim",
    coordinates: [27.514, 88.532],
    status: "CRITICAL", // ONLINE, WARNING, CRITICAL, OFFLINE
    value: 5.8,
    unit: "mm/s",
    battery: 84,
    signal: -68,
    lastPing: "Just now",
    installationDate: "2024-03-15",
    faultDescription: "Vibration threshold exceeded (limit: 3.5 mm/s)"
  },
  {
    id: "S-102",
    name: "Mangan Slope Crack Extensometer",
    type: "crack_displacement",
    typeLabel: "Crack / Displacement Sensor",
    locationName: "Chungthang Road, Sikkim",
    coordinates: [27.525, 88.541],
    status: "OFFLINE", // Trigger for Admin alert workflow!
    value: 0.0,
    unit: "mm",
    battery: 12,
    signal: -115,
    lastPing: "38 mins ago",
    installationDate: "2024-03-16",
    faultDescription: "No telemetry transmission received for >30 minutes. Low battery / hardware fault."
  },
  {
    id: "S-103",
    name: "Haflong TDR Soil Moisture Probe",
    type: "soil_moisture",
    typeLabel: "Soil Moisture Sensor",
    locationName: "Jatinga Hill, Assam",
    coordinates: [25.178, 93.021],
    status: "WARNING",
    value: 84.2,
    unit: "%",
    battery: 79,
    signal: -74,
    lastPing: "2 mins ago",
    installationDate: "2024-05-10",
    faultDescription: "Moisture saturation approaching plastic limit (85%)"
  },
  {
    id: "S-104",
    name: "Haflong Biaxial Inclinometer",
    type: "tilt_inclinometer",
    typeLabel: "Tilt / Inclinometer Sensor",
    locationName: "Haflong Railway Cutting, Assam",
    coordinates: [25.172, 93.025],
    status: "ONLINE",
    value: 2.8,
    unit: "° tilt",
    battery: 92,
    signal: -62,
    lastPing: "1 min ago",
    installationDate: "2024-05-11",
    faultDescription: null
  },
  {
    id: "S-105",
    name: "Zubza Deep Borehole Extensometer",
    type: "crack_displacement",
    typeLabel: "Crack / Displacement Sensor",
    locationName: "NH-29 Zubza Ridge, Nagaland",
    coordinates: [25.676, 94.106],
    status: "CRITICAL",
    value: 14.6,
    unit: "mm crack width",
    battery: 76,
    signal: -78,
    lastPing: "Just now",
    installationDate: "2023-11-20",
    faultDescription: "Rapid crack extension detected: +3.2mm in last 2 hours"
  },
  {
    id: "S-106",
    name: "Kohima Sinking Zone Piezo Sensor",
    type: "ground_vibration",
    typeLabel: "Ground Movement / Seismic",
    locationName: "Zubza Bypass, Nagaland",
    coordinates: [25.671, 94.112],
    status: "ONLINE",
    value: 6.4,
    unit: "mm/s",
    battery: 88,
    signal: -65,
    lastPing: "3 mins ago",
    installationDate: "2023-11-22",
    faultDescription: null
  },
  {
    id: "S-107",
    name: "Sohra High-Capacity Rain Gauge",
    type: "rain_gauge",
    typeLabel: "Rainfall Telemetry Gauge",
    locationName: "Cherrapunji Plateau, Meghalaya",
    coordinates: [25.295, 91.735],
    status: "ONLINE",
    value: 145.0,
    unit: "mm/24h",
    battery: 95,
    signal: -58,
    lastPing: "1 min ago",
    installationDate: "2024-01-08",
    faultDescription: null
  },
  {
    id: "S-108",
    name: "Aizawl Ramhlun Inclinometer",
    type: "tilt_inclinometer",
    typeLabel: "Tilt / Inclinometer Sensor",
    locationName: "Ramhlun Vengthlang, Mizoram",
    coordinates: [23.733, 92.715],
    status: "WARNING",
    value: 3.4,
    unit: "° tilt",
    battery: 64,
    signal: -82,
    lastPing: "4 mins ago",
    installationDate: "2024-02-14",
    faultDescription: "Cumulative tilt displacement over 3°"
  },
  {
    id: "S-109",
    name: "Kamrup Alluvial Monitoring Node",
    type: "soil_moisture",
    typeLabel: "Soil Moisture Sensor",
    locationName: "Guwahati Hills, Assam",
    coordinates: [26.142, 91.738],
    status: "ONLINE",
    value: 46.0,
    unit: "%",
    battery: 99,
    signal: -55,
    lastPing: "Just now",
    installationDate: "2024-06-01",
    faultDescription: null
  }
];

// Road Network with Blockages & Alternative Routes
export const initialRoads = [
  {
    id: "road-nh10",
    name: "NH-10 (Siliguri - Gangtok Highway)",
    status: "BLOCKED", // BLOCKED or OPEN or UNSAFE
    riskLevel: "CRITICAL",
    riskPercentage: 92,
    reason: "Massive active rockslide at 29th Mile with debris blocking both carriageways.",
    coordinates: [
      [27.42, 88.48],
      [27.47, 88.51],
      [27.51, 88.53],
      [27.56, 88.56]
    ],
    blockedSection: [
      [27.49, 88.515],
      [27.52, 88.535]
    ],
    alternativeRoute: {
      name: "Alternative Route via Lava - Reshi - Rhenock Pass",
      status: "RECOMMENDED",
      riskLevel: "LOW",
      riskPercentage: 24,
      coordinates: [
        [27.42, 88.48],
        [27.40, 88.62],
        [27.46, 88.68],
        [27.53, 88.64],
        [27.56, 88.56]
      ]
    }
  },
  {
    id: "road-nh29",
    name: "NH-29 (Dimapur - Kohima Highway via Zubza)",
    status: "UNSAFE",
    riskLevel: "CRITICAL",
    riskPercentage: 88,
    reason: "Predicted severe slope failure; 14mm road tension crack actively propagating.",
    coordinates: [
      [25.62, 94.02],
      [25.65, 94.06],
      [25.674, 94.108],
      [25.72, 94.15]
    ],
    blockedSection: [
      [25.665, 94.095],
      [25.685, 94.120]
    ],
    alternativeRoute: {
      name: "Alternative Safe Detour via Medziphema - Jakhama Ridge",
      status: "RECOMMENDED",
      riskLevel: "MODERATE",
      riskPercentage: 35,
      coordinates: [
        [25.62, 94.02],
        [25.58, 94.05],
        [25.61, 94.12],
        [25.65, 94.14],
        [25.72, 94.15]
      ]
    }
  }
];

// Initial Citizen Reports Queue
export const initialCitizenReports = [
  {
    id: "CR-10245",
    hazardType: "Landslide",
    description: "Huge mud and boulders fell across both lanes near the Mangan bridge. Mud is still trickling down the hill slope.",
    locationName: "Near Chungthang Junction, North Sikkim",
    coordinates: [27.518, 88.536],
    timestamp: "2026-09-04 08:35 AM",
    status: "VERIFIED", // PENDING, VERIFIED, REJECTED, ASSIGNED, RESOLVED
    assignedOfficer: "Field Officer T. Dorjee (FO-402)",
    photoUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    reporterName: "Dorji Tenzing (Local Citizen)"
  },
  {
    id: "CR-10246",
    hazardType: "Ground Crack",
    description: "Deep tensile ground crack of width ~15cm opened behind 4 residential houses on the Zubza slope.",
    locationName: "Zubza Village Ward 3, Kohima",
    coordinates: [25.675, 94.109],
    timestamp: "2026-09-04 09:05 AM",
    status: "PENDING",
    assignedOfficer: null,
    photoUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    reporterName: "Neiketuo Angami (Resident)"
  },
  {
    id: "CR-10247",
    hazardType: "Water Seepage",
    description: "Heavy turbid spring water gushing from retaining wall weep holes onto the roadway.",
    locationName: "Lower Haflong Railway Road",
    coordinates: [25.174, 93.024],
    timestamp: "2026-09-04 07:50 AM",
    status: "ASSIGNED",
    assignedOfficer: "Field Officer Rajesh Das (FO-208)",
    photoUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
    reporterName: "Bishnu Prasad (Commuter)"
  }
];

// Initial Field Officer Tasks
export const initialFieldTasks = [
  {
    id: "TASK-801",
    title: "Emergency Slope & Debris Inspection at Mangan Bridge",
    sourceReportId: "CR-10245",
    assignedTo: "FO-402 (T. Dorjee)",
    priority: "CRITICAL",
    status: "INSPECTION", // ASSIGNED -> ACCEPTED -> TRAVELLING -> ON_SITE -> INSPECTION -> REPORT_SUBMITTED -> RESOLVED
    coordinates: [27.518, 88.536],
    locationName: "Mangan Bridge Corridor, Sikkim",
    taskType: "Hazard Verification & Geotechnical Telemetry",
    assignedAt: "2026-09-04 08:45 AM",
    deadline: "Within 2 hours",
    instructions: "Measure crack extension, evaluate crown tension scarp, assess threat to downstream culvert, and submit AI vision photo analysis.",
    inspectionData: {
      crackWidthMm: 18,
      slopeTiltDeg: 43,
      rockfallSeverity: "High",
      waterSeepageRate: "Rapid Turbid Flow",
      roadDamage: "Severe Structural Fissuring",
      aiAnalysisResult: "AI Geotechnical Model: 91% match with retrogressive rotational slip failure. High probability of secondary slide within 3 hours.",
      notes: "Slope toe saturated. Evacuation of 6 roadside houses strongly advised."
    }
  },
  {
    id: "TASK-802",
    title: "Investigate Hardware Failure: Extensometer S-102",
    sourceReportId: "ADMIN-SENSOR-S102",
    assignedTo: "FO-402 (T. Dorjee)",
    priority: "HIGH",
    status: "ASSIGNED",
    coordinates: [27.525, 88.541],
    locationName: "Chungthang Road Station S-102",
    taskType: "IoT Sensor Repair / Battery Replacement",
    assignedAt: "2026-09-04 09:15 AM",
    deadline: "Immediate",
    instructions: "Inspect sensor battery pack, solar panel charge controller, and LoRaWAN antenna connection. Restore telemetry feed to central server.",
    inspectionData: null
  },
  {
    id: "TASK-803",
    title: "Retaining Wall Seepage Inspection",
    sourceReportId: "CR-10247",
    assignedTo: "FO-208 (Rajesh Das)",
    priority: "MEDIUM",
    status: "ON_SITE",
    coordinates: [25.174, 93.024],
    locationName: "Lower Haflong Railway Road",
    taskType: "Structural & Drainage Assessment",
    assignedAt: "2026-09-04 08:00 AM",
    deadline: "Within 4 hours",
    instructions: "Check weep-hole discharge clarity and hydrostatic pressure behind retaining structure.",
    inspectionData: null
  }
];

// Active Emergency Alerts
export const initialAlerts = [
  {
    id: "ALT-901",
    type: "CRITICAL_LANDSLIDE",
    level: "CRITICAL",
    title: "🔴 CRITICAL LANDSLIDE WARNING: Mangan-Chungthang Corridor",
    district: "North Sikkim",
    coordinates: [27.512, 88.534],
    probability: 86,
    message: "Continuous torrential downpour (112mm) and active seismic ground vibration (5.8 mm/s) have created high landslide probability in the next 4-6 hours. Avoid NH-10. Follow evacuation orders.",
    action: "Avoid travel on NH-10. Relocate to designated Chungthang or Mangan relief shelters immediately.",
    issuedAt: "2026-09-04 08:15 AM",
    issuedBy: "Sikkim State Disaster Management Authority (SSDMA)"
  },
  {
    id: "ALT-902",
    type: "FLASH_FLOOD",
    level: "HIGH",
    title: "🔵 FLASH FLOOD & GORGE HAZARD: Cherrapunji Basin",
    district: "East Khasi Hills",
    coordinates: [25.298, 91.732],
    probability: 78,
    message: "Rainfall exceeding 145mm/24h in Sohra canyon. Danger of sudden mountain flash floods and roaring debris flows in downstream gorges.",
    action: "Move to higher ground. Stay clear of riverbanks, low culverts, and natural drainage ravines.",
    issuedAt: "2026-09-04 07:30 AM",
    issuedBy: "East Khasi Hills District Disaster Management Authority"
  },
  {
    id: "ALT-903",
    type: "ROAD_BLOCKAGE",
    level: "CRITICAL",
    title: "🚧 ROAD BLOCKED: NH-10 at 29th Mile",
    district: "North Sikkim",
    coordinates: [27.49, 88.515],
    probability: 92,
    message: "Active rockslide confirmed and verified. NH-10 completely blocked to vehicular traffic. Use alternative route via Lava - Reshi - Rhenock.",
    action: "Follow alternative green route. Do not attempt crossing blocked section.",
    issuedAt: "2026-09-04 08:40 AM",
    issuedBy: "Border Roads Organisation (BRO) & Traffic Control"
  }
];

// Emergency Helpline Directory
export const emergencyHelplines = [
  {
    id: "hl-1",
    category: "National Emergency",
    name: "National Disaster Management Helpline",
    number: "1078",
    description: "Toll-free 24x7 National Disaster Response Force control room",
    icon: "ShieldAlert"
  },
  {
    id: "hl-2",
    category: "Emergency",
    name: "Pan-India Emergency Response Support System",
    number: "112",
    description: "Unified police, fire, and emergency medical services",
    icon: "PhoneCall"
  },
  {
    id: "hl-3",
    category: "Disaster Management",
    name: "State Emergency Operations Centre (SEOC) - Sikkim",
    number: "1070 / 03592-201075",
    description: "Sikkim Disaster Management Operations Room",
    icon: "Activity"
  },
  {
    id: "hl-4",
    category: "Disaster Management",
    name: "SEOC Assam Disaster Control Room",
    number: "1070 / 1079",
    description: "Assam State Disaster Management Authority (ASDMA)",
    icon: "Building"
  },
  {
    id: "hl-5",
    category: "Ambulance",
    name: "Emergency Medical & Trauma Ambulance",
    number: "108",
    description: "Direct 24/7 mountain ambulance dispatch",
    icon: "HeartPulse"
  },
  {
    id: "hl-6",
    category: "Road Assistance",
    name: "Border Roads Organisation (BRO) Control Room",
    number: "0361-2640232",
    description: "Highway clearance, snow & debris removal reports",
    icon: "Truck"
  },
  {
    id: "hl-7",
    category: "Police",
    name: "Highway Patrol & Traffic Command",
    number: "1033",
    description: "National Highway safety and roadblock rescue",
    icon: "Car"
  }
];

// AI Model Parameter Weights & Configurable Thresholds
export const initialAiModelConfig = {
  modelName: "GeoEnsemble-MultiFactor-V4.2",
  version: "4.2.8-prod",
  weights: {
    rainfall: 0.30,
    soilMoisture: 0.25,
    groundMovement: 0.20,
    slope: 0.15,
    terrainGeology: 0.10
  },
  thresholds: {
    lowMax: 30,       // 0 - 30%: Green
    moderateMax: 50,  // 31 - 50%: Yellow
    highMax: 75,      // 51 - 75%: Orange
    criticalMax: 100  // 76 - 100%: Red
  },
  autoAlertTriggerThreshold: 75,
  predictiveHorizonHours: 6
};

// System Health Initial Telemetry
export const initialSystemHealth = [
  { component: "Central Reactive Telemetry Broker", status: "OPERATIONAL", latency: "18ms", uptime: "99.98%" },
  { component: "AI Landslide Ensemble Inference Engine", status: "OPERATIONAL", latency: "42ms", uptime: "99.94%" },
  { component: "GIS Spatial Engine & Tile Pipeline", status: "OPERATIONAL", latency: "25ms", uptime: "99.99%" },
  { component: "IoT Sensor Gateway (LoRa/Satellite)", status: "WARNING", latency: "145ms", note: "1 sensor offline (S-102)" },
  { component: "Emergency Siren & Push Broadcast Engine", status: "OPERATIONAL", latency: "12ms", uptime: "100.0%" }
];
