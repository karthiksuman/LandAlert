import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, Radio, Battery, Wifi, Wrench, CheckCircle2, 
  ExternalLink, ArrowRight, ShieldAlert, RefreshCw 
} from 'lucide-react';

const SensorManagement = () => {
  const { 
    sensors, 
    sensorAlerts, 
    assignOfficerToSensorRepair, 
    resolveSensorAlert,
    setIsFullScreenMap 
  } = useApp();

  const [selectedSensor, setSelectedSensor] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* 🔴 AUTOMATED SENSOR FAILURE NOTIFICATION BANNER (Critical Requirement H) */}
      {sensorAlerts.length > 0 && sensorAlerts.map(alert => (
        <div key={alert.id} className="sensor-failure-alert-banner">
          <div className="alert-banner-left">
            <div className="alert-bell-icon">
              <Radio size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="badge badge-critical" style={{ fontSize: '0.72rem' }}>
                  🔴 AUTOMATED SENSOR FAILURE
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                  {alert.sensorId}: {alert.sensorName}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#FFCDD2', margin: 0 }}>
                {alert.issue} • Location: {alert.location} (Battery: {alert.battery}%)
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              onClick={() => assignOfficerToSensorRepair(alert.sensorId)}
            >
              <Wrench size={14} />
              ASSIGN FIELD OFFICER
            </button>

            <button 
              className="btn-secondary" 
              style={{ padding: '8px 14px', fontSize: '0.82rem', borderColor: '#4CAF50', color: '#81C784' }}
              onClick={() => resolveSensorAlert(alert.sensorId)}
            >
              <CheckCircle2 size={14} />
              MARK RESOLVED
            </button>
          </div>
        </div>
      ))}

      {/* Sensor Fleet Telemetry Table */}
      <div className="data-table-container">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '2px' }}>
              IoT Geotechnical & Environmental Sensor Fleet
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time wireless LoRaWAN / Satellite telemetry from slope stations across North-East India
            </p>
          </div>
          <button className="btn-outline-cyan" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={() => setIsFullScreenMap(true)}>
            <ExternalLink size={14} />
            View Sensors on GIS Map
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Sensor ID</th>
              <th>Sensor Name & Type</th>
              <th>Location</th>
              <th>Live Reading</th>
              <th>Status</th>
              <th>Battery / Signal</th>
              <th>Last Ping</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map(sensor => {
              const isOffline = sensor.status === 'OFFLINE';
              const isCritical = sensor.status === 'CRITICAL';
              const isWarning = sensor.status === 'WARNING';

              let badgeClass = 'badge-low';
              if (isOffline) badgeClass = 'badge-critical';
              if (isCritical) badgeClass = 'badge-critical';
              if (isWarning) badgeClass = 'badge-high';

              return (
                <tr key={sensor.id}>
                  <td style={{ fontWeight: 800, color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {sensor.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{sensor.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sensor.typeLabel}</div>
                  </td>
                  <td>{sensor.locationName}</td>
                  <td>
                    <strong style={{ color: '#fff', fontSize: '0.92rem' }}>
                      {sensor.value} {sensor.unit}
                    </strong>
                  </td>
                  <td>
                    <span className={`badge ${badgeClass}`}>
                      {sensor.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: sensor.battery < 20 ? '#FF5252' : '#B0BEC5' }}>
                        <Battery size={14} /> {sensor.battery}%
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                        <Wifi size={14} /> {sensor.signal} dBm
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {sensor.lastPing}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {isOffline ? (
                        <button 
                          className="btn-triage-verify"
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                          onClick={() => assignOfficerToSensorRepair(sensor.id)}
                        >
                          Dispatch Officer
                        </button>
                      ) : (
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                          onClick={() => setSelectedSensor(sensor)}
                        >
                          Telemetry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for Sensor Detailed Telemetry */}
      {selectedSensor && (
        <div className="modal-overlay" onClick={() => setSelectedSensor(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ padding: '24px', maxWidth: '520px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '8px' }}>
              {selectedSensor.name} ({selectedSensor.id})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Station Location: {selectedSensor.locationName} • Installed: {selectedSensor.installationDate}
            </p>

            <div style={{ background: 'rgba(7, 21, 34, 0.7)', padding: '14px', borderRadius: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span>Telemetry Parameter:</span>
                <strong style={{ color: '#fff' }}>{selectedSensor.typeLabel}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span>Current Real-time Reading:</span>
                <strong style={{ color: 'var(--brand-cyan)', fontSize: '1.1rem' }}>{selectedSensor.value} {selectedSensor.unit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span>Lithium Battery Bank:</span>
                <strong style={{ color: '#00E676' }}>{selectedSensor.battery}% Health</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>LoRa Uplink Signal:</span>
                <strong>{selectedSensor.signal} dBm (Good)</strong>
              </div>
            </div>

            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setSelectedSensor(null)}>
              Close Telemetry Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorManagement;
