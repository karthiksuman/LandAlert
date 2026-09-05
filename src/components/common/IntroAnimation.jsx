import React, { useState, useEffect } from 'react';
import { Activity, Wifi, ShieldAlert } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const IntroAnimation = () => {
  const [show, setShow] = useState(() => {
    return sessionStorage.getItem('terra_intro_seen') !== 'true';
  });

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 2900);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleDismiss = () => {
    sessionStorage.setItem('terra_intro_seen', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="intro-overlay">
      {/* Satellite Coordinate Grid */}
      <div className="intro-satellite-grid" />

      {/* Mountain Contour Silhouette */}
      <div className="intro-mountain-silhouette" />

      {/* Vector Line Connectors between IoT sensors */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <line x1="28%" y1="38%" x2="52%" y2="45%" className="intro-vector-line" />
        <line x1="52%" y1="45%" x2="74%" y2="32%" className="intro-vector-line" />
        <line x1="52%" y1="45%" x2="40%" y2="58%" className="intro-vector-line" />
      </svg>

      {/* Animated Sensor Nodes */}
      <div className="intro-sensor-node node-1" />
      <div className="intro-sensor-node node-2" />
      <div className="intro-sensor-node node-3" />
      <div className="intro-sensor-node node-4" />

      {/* Center Branding Reveal */}
      <div className="intro-branding">
        <div className="intro-emblem" style={{ overflow: 'hidden', padding: '6px' }}>
          <img src={logoImg} alt="LandAlert Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h1 className="intro-title">
          <span className="brand-logo-large-l">L</span>andAlert India
        </h1>
        <div className="intro-subtitle">
          Landslide Early Warning & Disaster Management System
        </div>
      </div>

      {/* Skip Button */}
      <button className="intro-skip-btn" onClick={handleDismiss}>
        Skip Intro ➔
      </button>
    </div>
  );
};

export default IntroAnimation;
