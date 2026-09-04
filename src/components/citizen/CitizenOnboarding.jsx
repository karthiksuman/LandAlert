import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../data/translations';
import { Globe, ShieldCheck, MapPin, Bell, Check, ArrowRight, Mountain } from 'lucide-react';

const CitizenOnboarding = () => {
  const {
    t,
    selectedLanguage,
    changeLanguage,
    termsAccepted,
    setTermsAccepted,
    locationGranted,
    setLocationGranted,
    notificationsGranted,
    setNotificationsGranted,
    completeOnboarding,
    setUserCoordinates
  } = useApp();

  const [step, setStep] = useState(1); // 1: Terms, 2: Language, 3: Location Login

  const languages = [
    { code: 'en', native: 'English', en: 'English' },
    { code: 'hi', native: 'हिन्दी', en: 'Hindi' },
    { code: 'te', native: 'తెలుగు', en: 'Telugu' },
    { code: 'as', native: 'অসমীয়া', en: 'Assamese' },
    { code: 'bn', native: 'বাংলা', en: 'Bengali' },
    { code: 'mn', native: 'মৈতৈলোন্', en: 'Meitei' },
    { code: 'ne', native: 'नेपाली', en: 'Nepali' }
  ];

  const handleLanguageSelect = (code) => {
    changeLanguage(code);
  };

  const handleAllowLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationGranted(true);
          if (setUserCoordinates) {
            setUserCoordinates([pos.coords.latitude, pos.coords.longitude]);
          }
        },
        () => setLocationGranted(true) // Graceful fallback
      );
    } else {
      setLocationGranted(true);
    }
  };

  const handleAllowNotifications = () => {
    setNotificationsGranted(true);
  };

  const handleLoginViaLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationGranted(true);
          if (setUserCoordinates) {
            setUserCoordinates([pos.coords.latitude, pos.coords.longitude]);
          }
          completeOnboarding();
        },
        () => {
          setLocationGranted(true);
          completeOnboarding();
        },
        { timeout: 6000 }
      );
    } else {
      setLocationGranted(true);
      completeOnboarding();
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        {/* Progress Dots */}
        <div className="onboarding-progress-dots">
          <div className={`onboarding-dot ${step === 1 ? 'active' : ''}`} />
          <div className={`onboarding-dot ${step === 2 ? 'active' : ''}`} />
          <div className={`onboarding-dot ${step === 3 ? 'active' : ''}`} />
        </div>

        {/* STEP 1: TERMS AND CONDITIONS */}
        {step === 1 && (
          <div>
            <div className="onboarding-header">
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px', background: 'var(--color-risk-low-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={26} color="var(--color-risk-low)" />
              </div>
              <h2>{t.onboarding?.step2Title || "Terms & Safety Agreement"}</h2>
              <p>{t.onboarding?.step2Desc || "Please review disaster data usage and resident safety guidelines"}</p>
            </div>

            <div className="terms-scroll-box">
              <p>
                <strong>1. Purpose of System:</strong> LandAlert provides AI-assisted predictive landslide risk assessments, real-time IoT geotechnical sensor telemetry, and official emergency alerts for North-Eastern India.
              </p>
              <p style={{ marginTop: '8px' }}>
                <strong>2. Advisory Nature:</strong> Landslide hazard models are scientific estimates based on rainfall volume, soil moisture saturation, ground displacement, and topographical slope. Always adhere to official National & State Disaster Management Authority (NDRF/SDMA) evacuation notices.
              </p>
              <p style={{ marginTop: '8px' }}>
                <strong>3. Geolocation & Privacy:</strong> Your GPS position is used on-device to calculate proximity to active hazard zones and provide localized evacuation advice.
              </p>
            </div>

            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
              />
              <span>{t.onboarding?.step2Checkbox || "I accept the Terms and Conditions and Emergency Guidelines"}</span>
            </label>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1.0rem', opacity: termsAccepted ? 1 : 0.4 }}
              disabled={!termsAccepted}
              onClick={() => setStep(2)}
            >
              {t.onboarding?.proceed || "ACCEPT & CONTINUE"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: LANGUAGE SELECTION */}
        {step === 2 && (
          <div>
            <div className="onboarding-header">
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px', background: 'var(--color-blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={26} color="var(--color-blue-500)" />
              </div>
              <h2>{t.onboarding?.step1Title || "Select Preferred Language"}</h2>
              <p>{t.onboarding?.step1Desc || "Choose your language for disaster warnings and interface"}</p>
            </div>

            <div className="language-grid">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  className={`language-card-btn ${selectedLanguage === lang.code ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  <span className="lang-native">{lang.native}</span>
                  <span className="lang-en">{lang.en}</span>
                </button>
              ))}
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '12px', fontSize: '1.0rem' }}
              onClick={() => setStep(3)}
            >
              Continue
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 3: LOG IN VIA LOCATION & PERMISSIONS */}
        {step === 3 && (
          <div>
            <div className="onboarding-header">
              <div style={{ width: '48px', height: '48px', margin: '0 auto 12px', borderRadius: '12px', background: 'var(--color-blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={26} color="var(--color-blue-500)" />
              </div>
              <h2>{t.onboarding?.step3Title || "Step 3: Log In via Location"}</h2>
              <p>{t.onboarding?.step3Desc || "Verify your real-time position to calculate localized slope risk and emergency evacuation routes"}</p>
            </div>

            {/* Location Permission Card */}
            <div className="permission-card">
              <div className="permission-icon-text">
                <div className="permission-icon">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-navy)', fontSize: '0.92rem', fontWeight: 700 }}>
                    {t.onboarding?.locationTitle || "Current Location Verification"}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                    {t.onboarding?.locationDesc || "Pinpoints your GPS position against active landslide hazard zones"}
                  </p>
                </div>
              </div>

              <button
                className={locationGranted ? "btn-secondary" : "btn-primary"}
                style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                onClick={handleAllowLocation}
              >
                {locationGranted ? <Check size={14} color="var(--color-risk-low)" /> : null}
                {locationGranted ? (t.onboarding?.granted || "Allowed") : (t.onboarding?.allowLocation || "Allow GPS")}
              </button>
            </div>

            {/* Notification Permission Card */}
            <div className="permission-card">
              <div className="permission-icon-text">
                <div className="permission-icon" style={{ background: 'var(--color-risk-critical-bg)', color: 'var(--color-risk-critical)' }}>
                  <Bell size={22} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-navy)', fontSize: '0.92rem', fontWeight: 700 }}>
                    {t.onboarding?.notifyTitle || "Emergency Siren Notifications"}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                    {t.onboarding?.notifyDesc || "Sends urgent high-priority disaster warnings and acoustic sirens"}
                  </p>
                </div>
              </div>

              <button
                className={notificationsGranted ? "btn-secondary" : "btn-critical"}
                style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                onClick={handleAllowNotifications}
              >
                {notificationsGranted ? <Check size={14} color="#00E676" /> : null}
                {notificationsGranted ? (t.onboarding?.granted || "Allowed") : (t.onboarding?.allowNotify || "Allow")}
              </button>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '1.0rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={handleLoginViaLocation}
              >
                <MapPin size={18} />
                <span>Log In via Location & Enter Portal</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="btn-secondary"
                style={{ width: '100%', fontSize: '0.85rem' }}
                onClick={completeOnboarding}
              >
                {t.onboarding?.continueWithoutLocation || "Log In with Regional Mountain Coordinates"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenOnboarding;
