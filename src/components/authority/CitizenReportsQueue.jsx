import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, UserCheck, CheckCircle2, Clock, MapPin, Eye } from 'lucide-react';

const CitizenReportsQueue = () => {
  const { 
    citizenReports, 
    verifyCitizenReport, 
    assignFieldOfficerToReport,
    addToast
  } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', marginBottom: '4px' }}>
            Citizen Field Incident Triage Queue
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Incoming hazard observations requiring verification, field task dispatch, or emergency closure
          </p>
        </div>
        <span className="badge badge-info">
          {citizenReports.length} Total Incidents Logged
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {citizenReports.map(report => {
          const isPending = report.status === 'PENDING';
          const isVerified = report.status === 'VERIFIED';
          const isAssigned = report.status === 'ASSIGNED';
          const isResolved = report.status === 'RESOLVED';

          let statusBadgeClass = 'badge-moderate';
          if (isVerified) statusBadgeClass = 'badge-critical';
          if (isAssigned) statusBadgeClass = 'badge-high';
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
                      {report.status}
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

              {report.assignedOfficer && (
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
                      VERIFY INCIDENT
                    </button>
                    <button 
                      className="btn-triage-reject" 
                      onClick={() => addToast("Report Rejected", `Report ${report.id} marked invalid/false alarm.`, "info")}
                    >
                      <X size={14} />
                      REJECT
                    </button>
                  </>
                )}

                {!isAssigned && !isResolved && (
                  <button 
                    className="btn-triage-assign" 
                    onClick={() => assignFieldOfficerToReport(report.id)}
                  >
                    <UserCheck size={14} />
                    ASSIGN FIELD OFFICER
                  </button>
                )}

                {isAssigned && (
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
