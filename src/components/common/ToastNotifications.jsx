import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

const ToastNotifications = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '74px',
        right: '16px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100% - 32px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map(toast => {
        const isCritical = toast.type === 'critical';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        let borderColor = 'var(--border-subtle)';
        let bgColor = 'rgba(13, 34, 53, 0.95)';
        let IconComp = Info;
        let iconColor = '#29B6F6';

        if (isCritical) {
          borderColor = 'var(--risk-critical)';
          bgColor = 'rgba(38, 12, 16, 0.96)';
          IconComp = AlertTriangle;
          iconColor = '#FF5252';
        } else if (isWarning) {
          borderColor = 'var(--risk-high)';
          bgColor = 'rgba(38, 24, 12, 0.96)';
          IconComp = AlertTriangle;
          iconColor = '#FFA726';
        } else if (isSuccess) {
          borderColor = '#4CAF50';
          bgColor = 'rgba(10, 32, 18, 0.96)';
          IconComp = CheckCircle2;
          iconColor = '#66BB6A';
        }

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              background: bgColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              padding: '14px 16px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'slideInRight 250ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              <IconComp size={20} color={iconColor} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>
                  {toast.title}
                </h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {toast.timestamp}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastNotifications;
