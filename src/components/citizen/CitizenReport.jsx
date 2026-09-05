import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Camera, MapPin, Send, CheckCircle2, AlertTriangle, 
  Upload, RefreshCw, X, SwitchCamera, Sparkles, ShieldCheck 
} from 'lucide-react';

const CitizenReport = () => {
  const { submitCitizenReport, userCoordinates, addToast, t } = useApp();

  const [hazardType, setHazardType] = useState('Landslide');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Near Mangan Bridge Road, Sikkim');
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80');
  const [submittedId, setSubmittedId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Camera capture modal state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const nativeCameraInputRef = useRef(null);

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

  // Start Device Camera
  const startCamera = async (mode = facingMode) => {
    setCameraError(null);
    setIsCameraOpen(true);

    // Stop existing stream if any
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (e) {
          console.warn("Video play error:", e);
        }
      }
    } catch (err) {
      console.warn("Could not access camera via getUserMedia:", err);
      setCameraError(err.message || "Camera access denied or unavailable");
    }
  };

  // Stop Device Camera
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  // Switch between front and back cameras
  const toggleFacingMode = () => {
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  // Snap photo from live video stream
  const captureSnapshot = () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, width, height);

      // Add geo-timestamp watermark banner
      ctx.fillStyle = "rgba(11, 31, 51, 0.75)";
      ctx.fillRect(0, height - 32, width, 32);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(
        `📍 ${userCoordinates[0].toFixed(4)}°N, ${userCoordinates[1].toFixed(4)}°E • ${new Date().toLocaleTimeString()}`,
        12,
        height - 12
      );

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPhotoPreview(dataUrl);
      closeCamera();
      addToast("Photo Evidence Captured", "Geo-tagged field observation photo attached.", "success");
    } catch (err) {
      console.error("Failed to capture snapshot:", err);
      // Fallback
      closeCamera();
    }
  };

  // Fallback trigger if camera device not accessible
  const handleFallbackCameraCapture = () => {
    if (nativeCameraInputRef.current) {
      nativeCameraInputRef.current.click();
      closeCamera();
    } else {
      setPhotoPreview('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80');
      closeCamera();
      addToast("Photo Attached", "Simulated field camera observation attached.", "info");
    }
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '4px' }}>
          {t.report?.title || "Report a Hazard or Landslide"}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          {t.report?.subtitle || "Submit real-time geo-tagged field observations directly to District Emergency Control Rooms"}
        </p>
      </div>

      {submittedId ? (
        /* Report Submission Success Screen */
        <div 
          className="card" 
          style={{ 
            padding: '36px 24px', 
            textAlign: 'center', 
            border: '1px solid #4CAF50',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 300ms ease-out'
          }}
        >
          <div 
            style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'var(--color-risk-low-bg)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}
          >
            <CheckCircle2 size={36} color="var(--color-risk-low)" />
          </div>

          <h3 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '6px' }}>
            {t.report?.submittedSuccess || "Report Submitted Successfully"}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', maxWidth: '440px', margin: '0 auto 18px' }}>
            {t.report?.submittedDesc || "Your field observation has been transmitted to the State Disaster Management Authority and logged in the Authority Command Center."}
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
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
              {t.report?.trackingId || "Official Incident Tracking ID"}
            </span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>
              {submittedId}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn-primary" onClick={handleReset}>
              <RefreshCw size={14} />
              {t.report?.submitAnother || "Submit Another Report"}
            </button>
          </div>
        </div>
      ) : (
        /* The Report Form */
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px' }}>
          {/* Hazard Type Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              {t.report?.hazardCategory || "Hazard Category"}
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
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              {t.report?.descLabel || "Detailed Description of Ground Cracks / Debris / Threat"}
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={t.report?.descPlaceholder || "e.g. Rocks and mud sliding across roadway; large tension crack visible along hillside above houses..."}
              required
            />
          </div>

          {/* Photo Proof & Preview */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              {t.report?.photoProof || "Photo / Video Evidence"}
            </label>

            {photoPreview && (
              <div style={{ position: 'relative', marginBottom: '10px', maxHeight: '200px', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <img src={photoPreview} alt="Hazard preview" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <span className="badge badge-info" style={{ position: 'absolute', bottom: '8px', right: '8px', fontSize: '0.7rem' }}>
                  Geo-Tagged Evidence
                </span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* File upload from gallery */}
              <label 
                className="btn-secondary" 
                style={{ cursor: 'pointer', flex: 1, minWidth: '140px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Upload size={16} />
                {t.report?.uploadPhoto || "Upload Photo"}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  style={{ display: 'none' }} 
                />
              </label>

              {/* Native mobile camera fallback input */}
              <input 
                type="file" 
                ref={nativeCameraInputRef}
                accept="image/*" 
                capture="environment"
                onChange={handlePhotoUpload} 
                style={{ display: 'none' }} 
              />

              {/* Camera Trigger Button */}
              <button 
                type="button" 
                className="btn-primary"
                style={{ flex: 1, minWidth: '140px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                onClick={() => startCamera('environment')}
              >
                <Camera size={16} />
                {t.report?.simulateCamera || "Simulate Camera Capture"}
              </button>
            </div>
          </div>

          {/* Location & GPS Info */}
          <div style={{ background: 'var(--color-blue-50)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <MapPin size={16} color="var(--color-blue-500)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-blue-600)', textTransform: 'uppercase' }}>
                {t.report?.autoGps || "Auto-Captured GPS Location & Timestamp"}
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
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '14px', fontSize: '1.0rem', cursor: 'pointer' }}
          >
            {isSubmitting ? (
              <span>Transmitting Incident to SDRF...</span>
            ) : (
              <>
                <Send size={16} />
                {t.report?.submitToAuth || "SUBMIT REPORT TO AUTHORITIES"}
              </>
            )}
          </button>
        </form>
      )}

      {/* LIVE CAMERA CAPTURE VIEWFINDER MODAL */}
      {isCameraOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(11, 31, 51, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '520px',
            background: '#0B1F33',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            {/* Camera Viewfinder Top Bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D32F2F', animation: 'pulse 1.2s infinite' }} />
                <span>Live Camera Viewfinder</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  title="Switch Camera"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <SwitchCamera size={16} />
                </button>

                <button
                  type="button"
                  onClick={closeCamera}
                  title="Close Camera"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Video Viewfinder Window */}
            <div style={{ position: 'relative', width: '100%', height: '360px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video
                ref={(el) => {
                  videoRef.current = el;
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch(e => console.warn("Video play error on ref:", e));
                  }
                }}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Viewfinder Reticle Overlays */}
              <div style={{
                position: 'absolute',
                inset: '24px',
                border: '1.5px dashed rgba(255,255,255,0.4)',
                borderRadius: '8px',
                pointerEvents: 'none'
              }} />

              {/* Camera Error / Permission Blocked Fallback Display */}
              {cameraError && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(11,31,51,0.92)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  textAlign: 'center',
                  color: '#FFFFFF'
                }}>
                  <AlertTriangle size={36} color="#F57C00" style={{ marginBottom: '10px' }} />
                  <h4 style={{ margin: '0 0 6px', fontSize: '1.05rem' }}>Camera Stream Notice</h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', maxWidth: '320px', margin: '0 0 16px' }}>
                    Web browser camera permission is restricted or hardware is unavailable.
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={handleFallbackCameraCapture}
                      style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                    >
                      Use Native Mobile Camera
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={closeCamera}
                      style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Viewfinder Bottom Control Bar */}
            <div style={{
              padding: '18px 24px',
              background: '#071522',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.7)' }}>
                📍 GPS Tag: {userCoordinates[0].toFixed(3)}°N, {userCoordinates[1].toFixed(3)}°E
              </div>

              {/* Shutter Capture Button */}
              <button
                type="button"
                onClick={captureSnapshot}
                title="Capture Snapshot"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '4px solid #1565C0',
                  boxShadow: '0 0 16px rgba(21,101,192,0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 100ms'
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1.0)'}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1565C0' }} />
              </button>

              <button
                type="button"
                onClick={closeCamera}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {t.report?.cancelCamera || "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenReport;
