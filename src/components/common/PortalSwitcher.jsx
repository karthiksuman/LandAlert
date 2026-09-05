import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, Check, User, ShieldAlert, HardHat, Settings, Lock } from 'lucide-react';

const PortalSwitcher = () => {
  const { activePortal, switchPortal, currentUser, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const portals = [
    { id: 'citizen', label: t.portals?.citizen || 'Resident', icon: User, requiresAuth: false },
    { id: 'authority', label: t.portals?.authority || 'Authorities', icon: ShieldAlert, requiresAuth: true },
    { id: 'fieldOfficer', label: t.portals?.fieldOfficer || 'Field Officer', icon: HardHat, requiresAuth: true },
    { id: 'admin', label: t.portals?.admin || 'Admin', icon: Settings, requiresAuth: true }
  ];

  const currentPortalConfig = portals.find(p => p.id === activePortal) || portals[0];
  const CurrentIcon = currentPortalConfig.icon;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (portalId) => {
    setIsOpen(false);
    switchPortal(portalId);
  };

  return (
    <div className="portal-switcher" ref={dropdownRef}>
      <button
        className="portal-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Switch Portal"
      >
        <CurrentIcon size={16} color="var(--color-blue-300)" />
        <span className="portal-text">{currentPortalConfig.label}</span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
      </button>

      {isOpen && (
        <div className="portal-dropdown-menu">
          <div className="portal-dropdown-header">
            {t.header?.selectPortal || "Select System Portal"}
          </div>
          {portals.map((portal) => {
            const IconComponent = portal.icon;
            const isSelected = activePortal === portal.id;
            const isUnlocked = !portal.requiresAuth || currentUser.role === portal.id;

            return (
              <button
                key={portal.id}
                className={`portal-option-item ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelect(portal.id)}
              >
                <div className="option-icon-label">
                  <IconComponent size={16} color={isSelected ? 'var(--color-blue-500)' : 'var(--color-text-muted)'} />
                  <span>{portal.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {!isUnlocked && <Lock size={12} color="var(--color-text-muted)" />}
                  {isSelected && <Check size={16} color="var(--color-blue-500)" />}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortalSwitcher;
