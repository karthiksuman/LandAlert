import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Camera, MapPin, Send, CheckCircle2, AlertTriangle, Upload, 
  RefreshCw, Wifi, WifiOff, CloudOff, HardDrive, Zap, Clock, ShieldCheck
} from 'lucide-react';

const CitizenReport = () => {
  const { 
    submitCitizenReport, 
    userCoordinates, 
    networkStatus, 
    setNetworkMode,
    offlineReportsQueue,
    syncOfflineReports,
    t
  } = useApp();

  const [hazardType, setHazardType] = useState('Landslide');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Near Mangan Bridge Road, Sikkim');
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80');
  const [submissionResult, setSubmissionResult] = useState(null); // { id, isOffline, queueLength }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLowOrNoNet = networkStatus === 'offline' || networkStatus === 'poor';

  const hazardTypes = [
    "Landslide",
    "Road blockage",
    "Ground crack",
    "Rockfall",
    "Water seepage",
    "Fallen debris",
    "Flash flood",
    "Other hazard"
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const res = submitCitizenReport({
        hazardType,
        description,
        locationName,
        coordinates: userCoordinates,
        photoUrl: photoPreview,
        reporterName: isLowOrNoNet ? "Resident (Offline Field Report)" : "Resident Field Observer"
      });
      setIsSubmitting(false);
      setSubmissionResult(res);
    }, 600);
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setDescription('');
  };

  return (
    <div className="citizen-feed-container">
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '4px' }}>
          Report a Hazard or Landslide
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Submit geo-tagged field observations directly to District Emergency Control Rooms
        </p>
      </div>

      {/* 1. DISASTER FIELD TELECOM STATUS & SIMULATION TOGGLE */}
      <div 
        style={{
          background: networkStatus === 'online' ? 'var(--color-blue-50)' : networkStatus === 'poor' ? '#FFF8E1' : '#FFEBEE',
          border: `1px solid ${networkStatus === 'online' ? 'var(--color-blue-200)' : networkStatus === 'poor' ? '#FFE082' : '#FFCDD2'}`,
          borderRadius: '12px',
          padding: '14px 16px',
          marginBottom: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {networkStatus === 'online' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#1B5E20', fontWeight: 700, fontSize: '0.86rem' }}>
                <Wifi size={18} color="#2E7D32" />
                🟢 High-Speed Online (Live Cloud Sync Active)
              </span>
            ) : networkStatus === 'poor' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E65100', fontWeight: 700, fontSize: '0.86rem' }}>
                <WifiOff size={18} color="#EF6C00" />
                🟠 Poor / Intermittent Signal (Offline Storage Mode Active)
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#B71C1C', fontWeight: 700, fontSize: '0.86rem' }}>
                <CloudOff size={18} color="#C62828" />
                🔴 No Internet / Telecom Blackout (Local Device Storage Active)
              </span>
            )}
          </div>

          {/* Quick Simulation Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Simulate Signal:
            </span>
            <button
              type="button"
              onClick={() => setNetworkMode('online')}
              className={networkStatus === 'online' ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '6px' }}
            >
              Online
            </button>
            <button
              type="button"
              onClick={() => setNetworkMode('poor')}
              className={networkStatus === 'poor' ? 'btn-primary' : 'btn-secondary'}
              style={{ 
                padding: '4px 10px', 
                fontSize: '0.74rem', 
                borderRadius: '6px', 
                background: networkStatus === 'poor' ? '#F57C00' : '',
                color: networkStatus === 'poor' ? '#FFF' : ''
              }}
            >
              Poor Signal
            </button>
            <button
              type="button"
              onClick={() => setNetworkMode('offline')}
              className={networkStatus === 'offline' ? 'btn-critical' : 'btn-secondary'}
              style={{ padding: '4px 10px', fontSize: '0.74rem', borderRadius: '6px' }}
            >
              No Internet
            </button>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
          {networkStatus === 'online' ? (
            "Connected to State Emergency Network. All hazard observations will be transmitted immediately to Disaster Operations."
          ) : (
            <span>
              <strong>Zero Data Loss Protection:</strong> In mountainous disaster zones with damaged towers or poor connectivity, 
              your complaints are automatically stored in local device memory. Once internet signal returns, 
              the system will <strong>auto-sync</strong> and dispatch the report to authorities immediately.
            </span>
          )}
        </p>
      </div>

      {/* 2. PENDING OFFLINE OUTBOX (IF ANY ITEMS STORED IN LOCAL STORAGE) */}
      {offlineReportsQueue.length > 0 && (
        <div 
          style={{
            background: '#FFFDE7',
            border: '1px solid #FFF59D',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '18px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HardDrive size={18} color="#F57F17" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F57F17' }}>
                Offline Storage Outbox ({offlineReportsQueue.length} Pending Auto-Sync)
              </span>
            </div>

            {networkStatus === 'online' && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => syncOfflineReports()}
                style={{ padding: '4px 12px', fontSize: '0.75rem', borderRadius: '6px' }}
              >
                <Zap size={14} />
                Sync Now to Authorities
              </button>
            )}
          </div>

          <p style={{ fontSize: '0.77rem', color: 'var(--color-text-secondary)', margin: '0 0 10px 0' }}>
            These reports were saved locally while offline. When internet is restored, they automatically transmit to the Disaster Authority Operations Center.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {offlineReportsQueue.map(item => (
              <div 
                key={item.id} 
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #FFE082',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '0.78rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                    {item.id} • {item.hazardType}
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.73rem' }}>
                    📍 {item.locationName} • Recorded: {item.offlineRecordedAt || item.timestamp}
                  </div>
                </div>
                <span 
                  style={{
                    background: '#FFF8E1',
                    color: '#E65100',
                    border: '1px solid #FFE082',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Clock size={12} />
                  {networkStatus === 'online' ? 'Ready to Sync' : 'Waiting for Signal ⏳'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {submissionResult ? (
        /* Submission Confirmation Screen */
        <div 
          className="card" 
          style={{ 
            padding: '36px 24px', 
            textAlign: 'center', 
            border: submissionResult.isOffline ? '1px solid #FF9800' : '1px solid #4CAF50',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 300ms ease-out'
          }}
        >
          <div 
            style={{ 
              width: '68px', 
              height: '68px', 
              borderRadius: '50%', 
              background: submissionResult.isOffline ? '#FFF3E0' : 'var(--color-risk-low-bg)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}
          >
            {submissionResult.isOffline ? (
              <HardDrive size={36} color="#E65100" />
            ) : (
              <CheckCircle2 size={36} color="var(--color-risk-low)" />
            )}
          </div>

          <h3 style={{ fontSize: '1.35rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '6px' }}>
            {submissionResult.isOffline 
              ? "Report Saved Locally (Offline Vault)"
              : "Report Submitted Successfully"}
          </h3>

          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 18px', lineHeight: 1.5 }}>
            {submissionResult.isOffline ? (
              <span>
                <strong>No or poor internet connection detected.</strong> Your hazard observation has been 
                safely encrypted and saved to your device's local memory. 
                <br /><br />
                As soon as internet connectivity returns, LandAlert will 
                <strong> automatically sync and transmit</strong> this report directly to the 
                State Disaster Management Authority and Command Center.
              </span>
            ) : (
              "Your field observation has been transmitted to the State Disaster Management Authority and logged in the Authority Command Center."
            )}
          </p>

          <div 
            style={{ 
              display: 'inline-block', 
              background: submissionResult.isOffline ? '#FFF8E1' : 'rgba(7, 21, 34, 0.8)', 
              border: `1px solid ${submissionResult.isOffline ? '#FFE082' : 'var(--border-highlight)'}`, 
              borderRadius: '8px', 
              padding: '10px 20px', 
              marginBottom: '24px' 
            }}
          >
            <span style={{ fontSize: '0.75rem', color: submissionResult.isOffline ? '#E65100' : 'var(--text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 700 }}>
              {submissionResult.isOffline ? "Offline Incident Tracking ID (Queued)" : "Official Incident Tracking ID"}
            </span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: submissionResult.isOffline ? '#D84315' : 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>
              {submissionResult.id}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {submissionResult.isOffline && (
              <button 
                className="btn-primary" 
                onClick={() => {
                  setNetworkMode('online');
                }}
                style={{ background: '#2E7D32', borderColor: '#2E7D32' }}
              >
                <Zap size={14} />
                Test Auto-Sync (Switch to Online Now)
              </button>
            )}

            <button className="btn-secondary" onClick={handleReset}>
              <RefreshCw size={14} />
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* The Report Form */
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px' }}>
          {/* Low/No Connectivity Advisory Pill */}
          {isLowOrNoNet && (
            <div 
              style={{
                background: '#FFF3E0',
                border: '1px solid #FFE0B2',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <HardDrive size={18} color="#E65100" />
              <span style={{ fontSize: '0.82rem', color: '#E65100', fontWeight: 600 }}>
                Offline Storage Active: This report will be saved locally on your device and will auto-sync to Authorities once network recovers.
              </span>
            </div>
          )}

          {/* Hazard Type Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Hazard Category
            </label>
            <select
              value={hazardType}
              onChange={e => setHazardType(e.target.value)}
              style={{ fontSize: '0.95rem' }}
            >
              {hazardTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Detailed Description of Ground Cracks / Debris / Threat
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Rocks and mud sliding across roadway; large tension crack visible along hillside above houses..."
              required
            />
          </div>

          {/* Photo Proof & Preview */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Photo / Video Evidence
            </label>

            {photoPreview && (
              <div style={{ position: 'relative', marginBottom: '10px', maxHeight: '180px', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <img src={photoPreview} alt="Hazard preview" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <span className="badge badge-info" style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '0.7rem' }}>
                  Geo-Tagged Evidence
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <label 
                className="btn-secondary" 
                style={{ cursor: 'pointer', flex: 1, fontSize: '0.85rem' }}
              >
                <Upload size={16} />
                Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>

              <button 
                type="button" 
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.85rem' }}
                onClick={() => setPhotoPreview('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80')}
              >
                <Camera size={16} />
                Simulate Camera Capture
              </button>
            </div>
          </div>

          {/* Location & GPS Info */}
          <div style={{ background: 'var(--color-blue-50)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <MapPin size={16} color="var(--color-blue-500)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-blue-600)', textTransform: 'uppercase' }}>
                Auto-Captured GPS Location & Timestamp
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-navy)', fontWeight: 600 }}>
              {locationName} • {userCoordinates[0].toFixed(4)}°N, {userCoordinates[1].toFixed(4)}°E
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Recorded: {new Date().toLocaleTimeString()} (Standard Time)
            </div>
          </div>

          <button
            type="submit"
            className={isLowOrNoNet ? "btn-critical" : "btn-primary"}
            disabled={isSubmitting}
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: '1.0rem',
              background: isLowOrNoNet ? '#E65100' : '',
              borderColor: isLowOrNoNet ? '#E65100' : ''
            }}
          >
            {isSubmitting ? (
              <span>{isLowOrNoNet ? "Saving Report Locally to Device Vault..." : "Transmitting Incident to SDRF..."}</span>
            ) : isLowOrNoNet ? (
              <>
                <HardDrive size={18} />
                SAVE REPORT LOCALLY (AUTO-SYNC ON SIGNAL)
              </>
            ) : (
              <>
                <Send size={16} />
                SUBMIT INCIDENT REPORT TO AUTHORITIES
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default CitizenReport;
