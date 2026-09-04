import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, HardHat, Settings, Lock, User, ArrowRight, X, Sparkles } from 'lucide-react';

const AuthModal = () => {
  const { authModalRole, setAuthModalRole, login } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!authModalRole) return null;

  const roleMeta = {
    authority: {
      title: "State Disaster Authority Login",
      subtitle: "Emergency Operations Center & Incident Command",
      icon: ShieldAlert,
      iconColor: "#29B6F6",
      bgImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      demoUser: "authority",
      demoPass: "disaster2026",
      officialRoleText: "SDMA / NDRF / District Magistrate Access Only"
    },
    fieldOfficer: {
      title: "Field Officer Terminal",
      subtitle: "On-Site Geotechnical Inspection & Telemetry Unit",
      icon: HardHat,
      iconColor: "#FFA726",
      bgImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      demoUser: "officer",
      demoPass: "field2026",
      officialRoleText: "Authorized Field Geologists & BRO Response Units"
    },
    admin: {
      title: "Super Admin Command Console",
      subtitle: "IoT Telemetry Network, AI Models & System Control",
      icon: Settings,
      iconColor: "#66BB6A",
      bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      demoUser: "admin",
      demoPass: "admin2026",
      officialRoleText: "Root Disaster Information System Administration"
    }
  };

  const currentMeta = roleMeta[authModalRole] || roleMeta.authority;
  const RoleIcon = currentMeta.icon;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please provide username and password");
      return;
    }
    setError('');
    login(authModalRole, username, password);
  };

  const handleDemoFill = () => {
    setUsername(currentMeta.demoUser);
    setPassword(currentMeta.demoPass);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalRole(null)}>
      <div 
        className="modal-content auth-modal-box" 
        onClick={e => e.stopPropagation()}
        style={{
          backgroundImage: `linear-gradient(rgba(7, 21, 34, 0.88), rgba(7, 21, 34, 0.94)), url(${currentMeta.bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          padding: '32px 28px'
        }}
      >
        {/* Close Button */}
        <button 
          className="btn-secondary" 
          onClick={() => setAuthModalRole(null)}
          style={{ position: 'absolute', top: 16, right: 16, padding: '6px 10px', borderRadius: '50%' }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div 
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '16px', 
              background: 'rgba(255, 255, 255, 0.08)', 
              border: `1px solid ${currentMeta.iconColor}`,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: `0 0 20px ${currentMeta.iconColor}40`
            }}
          >
            <RoleIcon size={28} color={currentMeta.iconColor} />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '4px' }}>
            {currentMeta.title}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {currentMeta.subtitle}
          </p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(211, 47, 47, 0.2)', 
            border: '1px solid #E57373', 
            borderRadius: '8px', 
            padding: '10px', 
            color: '#FFCDD2', 
            fontSize: '0.85rem', 
            marginBottom: '16px', 
            textAlign: 'center' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Username / Official ID
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={`e.g. ${currentMeta.demoUser}`}
                style={{ paddingLeft: '38px' }}
                autoFocus
              />
              <User size={16} color="#78909C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                style={{ paddingLeft: '38px' }}
              />
              <Lock size={16} color="#78909C" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Quick Demo Autofill helper for evaluator convenience */}
          <button 
            type="button" 
            onClick={handleDemoFill}
            style={{ 
              alignSelf: 'flex-start', 
              fontSize: '0.78rem', 
              color: 'var(--brand-cyan)', 
              background: 'rgba(41, 182, 246, 0.08)',
              border: '1px dashed rgba(41, 182, 246, 0.3)',
              padding: '6px 12px',
              borderRadius: '6px',
              marginTop: '4px'
            }}
          >
            <Sparkles size={12} />
            Click to Auto-Fill Demo Credentials ({currentMeta.demoUser})
          </button>

          <button 
            type="submit" 
            className="btn-primary"
            style={{ marginTop: '12px', width: '100%', padding: '12px', fontSize: '1.0rem' }}
          >
            Authenticate & Open Portal
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔒 {currentMeta.officialRoleText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
