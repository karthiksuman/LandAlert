import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Languages, ChevronDown, Check } from 'lucide-react';

const languagesList = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ne', label: 'Nepali', native: 'नेपाली' },
  { code: 'mn', label: 'Manipuri', native: 'মৈতৈলোন' }
];

const LanguageSwitcher = () => {
  const { selectedLanguage, changeLanguage, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languagesList.find(l => l.code === selectedLanguage) || languagesList[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        className="portal-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'var(--color-blue-50)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-pill)',
          padding: '5px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: 'var(--color-navy)'
        }}
        title="Change Language"
        aria-label="Change Language"
      >
        <Languages size={15} color="var(--color-blue-500)" />
        <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {currentLang.native}
        </span>
        <ChevronDown size={13} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 180ms' }} />
      </button>

      {isOpen && (
        <div 
          className="portal-dropdown-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 1100,
            minWidth: '160px',
            background: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '6px',
            boxShadow: '0 8px 24px rgba(11, 31, 51, 0.15)'
          }}
        >
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', padding: '6px 10px', letterSpacing: '0.5px' }}>
            {t.header?.language || "Language"} / লোন / भाषा
          </div>
          {languagesList.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isSelected ? 'var(--color-blue-50)' : 'transparent',
                  color: isSelected ? 'var(--color-blue-600)' : 'var(--color-navy)',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 150ms'
                }}
              >
                <span>{lang.native} <small style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>({lang.label})</small></span>
                {isSelected && <Check size={14} color="var(--color-blue-500)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
