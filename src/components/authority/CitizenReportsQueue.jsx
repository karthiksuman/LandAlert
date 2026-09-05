import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, UserCheck, CheckCircle2, Clock, MapPin, Eye, ShieldAlert, FileText } from 'lucide-react';

const CitizenReportsQueue = () => {
  const { 
    citizenReports, 
    verifyCitizenReport, 
    assignFieldOfficerToReport,
    addToast,
    t
  } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
            {t.authority?.triageQueue || "Citizen Field Incident Triage Queue"}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {t.authority?.triageSub || "Incoming hazard observations requiring verification, field task dispatch, or emergency closure"}
          </p>
        </div>
        <span className="badge badge-info">
          {citizenReports.length} {t.authority?.totalIncidents || "Total Incidents Logged"}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {citizenReports.map(report => {
          const isPending = report.status === 'PENDING';
          const isVerified = report.status === 'VERIFIED';
          const isAssigned = report.status === 'ASSIGNED';
          const isInspectionSubmitted = report.status === 'INSPECTION_SUBMITTED';
          const isResolved = report.status === 'RESOLVED';

          let statusBadgeClass = 'badge-moderate';
          if (isVerified) statusBadgeClass = 'badge-critical';
          if (isAssigned) statusBadgeClass = 'badge-high';
          if (isInspectionSubmitted) statusBadgeClass = 'badge-critical';
          if (isResolved) statusBadgeClass = 'badge-low';

          return (
            <div key={report.id} className="glass-panel" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-blue-500)', fontFamily: 'var(--font-mono)' }}>
                      {report.id}
                    </span>
                    <span className={`badge ${statusBadgeClass}`} style={{ fontSize: '0.7rem' }}>
                      {report.status.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-navy)', fontWeight: 700 }}>
                      {report.hazardType}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Reported by: <strong>{report.reporterName}</strong> • {report.timestamp}
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  📍 {report.locationName} ({report.coordinates[0].toFixed(4)}°N, {report.coordinates[1].toFixed(4)}°E)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: report.photoUrl ? '1fr 140px' : '1fr', gap: '14px', marginBottom: '14px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {report.description}
                </p>

                {report.photoUrl && (
                  <div style={{ height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                    <img src={report.photoUrl} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Official Field Inspection Telemetry Box */}
              {report.fieldInspection && (
                <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '12px 14px', borderRadius: '8px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ color: '#1B5E20', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={15} color="#2E7D32" />
                      {t.authority?.fieldReportReceived || "Official Geotechnical Field Report Received"}
                    </strong>
                    <span className="badge badge-critical" style={{ fontSize: '0.68rem' }}>
                      ACTION REQUIRED
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', fontSize: '0.78rem', color: '#2E7D32', marginBottom: '6px' }}>
                    <span><strong>Crack Width:</strong> {report.fieldInspection.crackWidthMm} mm</span>
                    <span><strong>Slope Tilt:</strong> {report.fieldInspection.slopeTiltDeg}°</span>
                    <span><strong>Rockfall:</strong> {report.fieldInspection.rockfallSeverity}</span>
                    <span><strong>Water Seepage:</strong> {report.fieldInspection.waterSeepageRate}</span>
                  </div>
                  {report.fieldInspection.notes && (
                    <div style={{ fontSize: '0.8rem', color: '#1B5E20' }}>
                      <strong>Officer Recommendation:</strong> {report.fieldInspection.notes}
                    </div>
                  )}
                  {report.fieldInspection.aiAnalysisResult && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-blue-600)', marginTop: '4px' }}>
                      <strong>AI Vision:</strong> {report.fieldInspection.aiAnalysisResult}
                    </div>
                  )}
                </div>
              )}

              {report.assignedOfficer && !report.fieldInspection && (
                <div style={{ background: 'var(--color-blue-50)', border: '1px solid var(--color-blue-100)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--color-blue-600)', marginBottom: '12px' }}>
                  👷 Dispatched Field Unit: <strong>{report.assignedOfficer}</strong>
                </div>
              )}

              {/* Triage Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                {isPending && (
                  <>
                    <button 
                      className="btn-triage-verify" 
                      onClick={() => verifyCitizenReport(report.id)}
                    >
                      <Check size={14} />
                      {t.authority?.verifyIncident || "VERIFY INCIDENT"}
                    </button>
                    <button 
                      className="btn-triage-reject" 
                      onClick={() => addToast("Report Rejected", `Report ${report.id} marked invalid/false alarm.`, "info")}
                    >
                      <X size={14} />
                      {t.authority?.reject || "REJECT"}
                    </button>
                  </>
                )}

                {isInspectionSubmitted && (
                  <button 
                    className="btn-primary" 
                    style={{ fontSize: '0.8rem', padding: '6px 14px', background: '#D32F2F', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => {
                      addToast("Evacuation Order Issued", `Evacuation siren and directive broadcast for ${report.locationName}. Road closure applied.`, "critical");
                    }}
                  >
                    <ShieldAlert size={14} />
                    {t.authority?.approveEvacuation || "APPROVE EVACUATION & BROADCAST SIREN"}
                  </button>
                )}

                {!isAssigned && !isResolved && !isInspectionSubmitted && (
                  <button 
                    className="btn-triage-assign" 
                    onClick={() => assignFieldOfficerToReport(report.id)}
                  >
                    <UserCheck size={14} />
                    {t.authority?.assignOfficer || "ASSIGN FIELD OFFICER"}
                  </button>
                )}

                {isAssigned && !isInspectionSubmitted && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-risk-high)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} />
                    Field Inspection In Progress
                  </span>
                )}

                {isResolved && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-risk-low)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} />
                    Incident Remediated & Closed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CitizenReportsQueue;
