import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, Check, User, ShieldAlert, HardHat, Settings, Lock } from 'lucide-react';

const PortalSwitcher = () => {
  const { activePortal, switchPortal, currentUser } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const portals = [
    { id: 'citizen', label: 'Citizen', icon: User, requiresAuth: false },
    { id: 'authority', label: 'Authorities', icon: ShieldAlert, requiresAuth: true },
    { id: 'fieldOfficer', label: 'Field Officer', icon: HardHat, requiresAuth: true },
    { id: 'admin', label: 'Admin', icon: Settings, requiresAuth: true }
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
        <CurrentIcon size={16} color="#29B6F6" />
        <span className="portal-text">{currentPortalConfig.label}</span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
      </button>

      {isOpen && (
        <div className="portal-dropdown-menu">
          <div className="portal-dropdown-header">
            Select System Portal
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
                  <IconComponent size={16} color={isSelected ? '#29B6F6' : '#B0BEC5'} />
                  <span>{portal.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {!isUnlocked && <Lock size={12} color="#78909C" />}
                  {isSelected && <Check size={16} color="#29B6F6" />}
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
