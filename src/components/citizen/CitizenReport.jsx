import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Camera, MapPin, Send, CheckCircle2, AlertTriangle, Upload, RefreshCw } from 'lucide-react';

const CitizenReport = () => {
  const { submitCitizenReport, userCoordinates } = useApp();

  const [hazardType, setHazardType] = useState('Landslide');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Near Mangan Bridge Road, Sikkim');
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80');
  const [submittedId, setSubmittedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const id = submitCitizenReport({
        hazardType,
        description,
        locationName,
        coordinates: userCoordinates,
        photoUrl: photoPreview,
        reporterName: "Citizen Field Reporter"
      });
      setIsSubmitting(false);
      setSubmittedId(id);
    }, 600);
  };

  const handleReset = () => {
    setSubmittedId(null);
    setDescription('');
  };

  return (
    <div className="citizen-feed-container">
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '4px' }}>
          Report a Hazard or Landslide
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Submit geo-tagged field observations directly to District Emergency Control Rooms
        </p>
      </div>

      {submittedId ? (
        /* Report Submission Success Screen */
        <div 
          className="glass-panel" 
          style={{ 
            padding: '36px 24px', 
            textAlign: 'center', 
            border: '1px solid #4CAF50',
            boxShadow: '0 0 25px rgba(76, 175, 80, 0.25)',
            animation: 'fadeIn 300ms ease-out'
          }}
        >
          <div 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'rgba(76, 175, 80, 0.2)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}
          >
            <CheckCircle2 size={36} color="#00E676" />
          </div>

          <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '6px' }}>
            Report Submitted Successfully
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 18px' }}>
            Your field observation has been transmitted to the State Disaster Management Authority and logged in the Authority Command Center.
          </p>

          <div 
            style={{ 
              display: 'inline-block', 
              background: 'rgba(7, 21, 34, 0.8)', 
              border: '1px solid var(--border-highlight)', 
              borderRadius: '8px', 
              padding: '10px 20px', 
              marginBottom: '24px' 
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Official Incident Tracking ID
            </span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>
              {submittedId}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn-primary" onClick={handleReset}>
              <RefreshCw size={14} />
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        /* The Report Form */
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px' }}>
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
          <div style={{ background: 'rgba(7, 21, 34, 0.65)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <MapPin size={16} color="#29B6F6" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-cyan)', textTransform: 'uppercase' }}>
                Auto-Captured GPS Location & Timestamp
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#fff' }}>
              {locationName} • {userCoordinates[0].toFixed(4)}°N, {userCoordinates[1].toFixed(4)}°E
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Recorded: {new Date().toLocaleTimeString()} (Standard Time)
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '14px', fontSize: '1.0rem' }}
          >
            {isSubmitting ? (
              <span>Transmitting Incident to SDRF...</span>
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
