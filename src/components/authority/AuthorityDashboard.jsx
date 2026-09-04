import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import GisMap from '../gis/GisMap';
import AlertBroadcastModal from './AlertBroadcastModal';
import { Radio, ShieldAlert, Check, X, UserCheck, AlertTriangle, CloudRain, Droplets, Activity } from 'lucide-react';

const AuthorityDashboard = () => {
  const { 
    locations, 
    selectedZoneId, 
    citizenReports, 
    verifyCitizenReport, 
    assignFieldOfficerToReport,
    sensors 
  } = useApp();

  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  const selectedZone = locations.find(l => l.id === selectedZoneId) || locations[0];
  const pendingReports = citizenReports.filter(r => r.status === 'PENDING' || r.status === 'VERIFIED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '2px' }}>
            Disaster Operations Command & Control Center
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-Time GIS Predictive Hazard Map & Incident Dispatch • North-East India Sector
          </p>
        </div>

        <button 
          className="btn-critical" 
          onClick={() => setIsBroadcastOpen(true)}
          style={{ padding: '9px 18px', fontSize: '0.88rem' }}
        >
          <Radio size={16} />
          Broadcast Regional Disaster Warning
        </button>
      </div>

      {/* 70% GIS Command View Grid */}
      <div className="authority-command-grid">
        {/* Left: 70% Height Primary GIS Map */}
        <div style={{ position: 'relative' }}>
          <GisMap mode="authority" />
        </div>

        {/* Right: Live Triage Queue & Quick Actions Drawer */}
        <div className="authority-triage-panel">
          <div className="triage-header">
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Citizen Reports Triage</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {pendingReports.length} pending operations review
              </span>
            </div>
            <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>
              LIVE FEED
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingReports.length === 0 ? (
              <div style={{ padding: '24px 10px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ✓ No unreviewed citizen reports in queue.
              </div>
            ) : (
              pendingReports.map(report => (
                <div key={report.id} className="report-triage-card">
                  <div className="report-triage-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>
                        {report.id}
                      </span>
                      <span className="badge badge-critical" style={{ fontSize: '0.65rem' }}>
                        {report.status}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {report.timestamp.split(' ')[1]}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.88rem', color: '#fff', marginBottom: '4px' }}>
                    {report.hazardType} • {report.locationName}
                  </h4>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, maxHeight: '42px', overflow: 'hidden' }}>
                    {report.description}
                  </p>

                  <div className="report-triage-actions">
                    {report.status === 'PENDING' && (
                      <button 
                        className="btn-triage-verify"
                        onClick={() => verifyCitizenReport(report.id)}
                      >
                        <Check size={12} /> Verify
                      </button>
                    )}
                    <button 
                      className="btn-triage-assign"
                      onClick={() => assignFieldOfficerToReport(report.id)}
                    >
                      <UserCheck size={12} /> Assign Officer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Environmental Telemetry Card for Selected Zone */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: 'auto' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Active Zone Telemetry: {selectedZone.name}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
              <div style={{ background: 'rgba(7, 21, 34, 0.6)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-muted)' }}>24h Rain Gauge</div>
                <strong style={{ color: '#29B6F6', fontSize: '0.95rem' }}>{selectedZone.factors.rainfall.value} mm</strong>
              </div>
              <div style={{ background: 'rgba(7, 21, 34, 0.6)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Soil Saturation</div>
                <strong style={{ color: '#00E676', fontSize: '0.95rem' }}>{selectedZone.factors.soilMoisture.value}%</strong>
              </div>
              <div style={{ background: 'rgba(7, 21, 34, 0.6)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Ground Vibration</div>
                <strong style={{ color: '#FF9100', fontSize: '0.95rem' }}>{selectedZone.factors.groundMovement.value} mm/s</strong>
              </div>
              <div style={{ background: 'rgba(7, 21, 34, 0.6)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Slope Gradient</div>
                <strong style={{ color: '#FF5252', fontSize: '0.95rem' }}>{selectedZone.factors.slope.value}°</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Alert Modal */}
      <AlertBroadcastModal 
        isOpen={isBroadcastOpen} 
        onClose={() => setIsBroadcastOpen(false)} 
      />
    </div>
  );
};

export default AuthorityDashboard;
