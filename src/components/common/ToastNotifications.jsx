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
        zIndex: 'var(--z-toast-alert, 1100)',
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

        let borderColor = 'var(--color-blue-500)';
        let bgColor = '#FFFFFF';
        let IconComp = Info;
        let iconColor = 'var(--color-blue-500)';

        if (isCritical) {
          borderColor = 'var(--color-risk-critical)';
          bgColor = '#FDECEC';
          IconComp = AlertTriangle;
          iconColor = 'var(--color-risk-critical)';
        } else if (isWarning) {
          borderColor = 'var(--color-risk-high)';
          bgColor = '#FFFFFF';
          IconComp = AlertTriangle;
          iconColor = 'var(--color-risk-high)';
        } else if (isSuccess) {
          borderColor = 'var(--color-risk-low)';
          bgColor = '#FFFFFF';
          IconComp = CheckCircle2;
          iconColor = 'var(--color-risk-low)';
        }

        return (
          <div
            key={toast.id}
            className={isCritical ? "badge-pulse" : ""}
            style={{
              pointerEvents: 'auto',
              background: bgColor,
              border: '1px solid var(--color-border)',
              borderLeft: `5px solid ${borderColor}`,
              borderRadius: '12px',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'alert-slide-in 0.3s ease-out'
            }}
          >
            <div style={{ flexShrink: 0, marginTop: '2px' }}>
              <IconComp size={20} color={iconColor} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--color-navy)', fontWeight: 700 }}>
                  {toast.title}
                </h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {toast.timestamp}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                color: 'var(--color-text-muted)',
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
