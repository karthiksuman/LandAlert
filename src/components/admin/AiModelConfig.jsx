import React from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, Sliders, ShieldAlert, Sparkles, Check } from 'lucide-react';

const AiModelConfig = () => {
  const { aiConfig, updateAiWeights, updateAiThresholds, calculateRisk, locations } = useApp();

  const testLocation = locations[0]; // Mangan
  const previewScore = calculateRisk(testLocation.factors);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '2px' }}>
            AI Landslide Prediction Model Configuration
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Adjust multi-factor weighted ensemble algorithms and categorical alert thresholds
          </p>
        </div>
        <span className="badge badge-info">
          Model: {aiConfig.modelName} ({aiConfig.version})
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
        {/* Factor Weights Slider Panel */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sliders size={20} color="var(--color-blue-500)" />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700 }}>Environmental Factor Weights</h3>
          </div>

          {/* Rainfall Weight */}
          <div className="slider-group">
            <div className="slider-header">
              <span>🌧 Rainfall Infiltration (24h)</span>
              <strong style={{ color: 'var(--color-blue-600)' }}>{Math.round(aiConfig.weights.rainfall * 100)}%</strong>
            </div>
            <input 
              type="range" 
              min="0.05" 
              max="0.60" 
              step="0.05" 
              value={aiConfig.weights.rainfall} 
              onChange={e => updateAiWeights('rainfall', e.target.value)}
              className="range-slider"
            />
          </div>

          {/* Soil Moisture Weight */}
          <div className="slider-group">
            <div className="slider-header">
              <span>💧 Soil Moisture Saturation (TDR)</span>
              <strong style={{ color: 'var(--color-blue-600)' }}>{Math.round(aiConfig.weights.soilMoisture * 100)}%</strong>
            </div>
            <input 
              type="range" 
              min="0.05" 
              max="0.50" 
              step="0.05" 
              value={aiConfig.weights.soilMoisture} 
              onChange={e => updateAiWeights('soilMoisture', e.target.value)}
              className="range-slider"
            />
          </div>

          {/* Ground Movement Weight */}
          <div className="slider-group">
            <div className="slider-header">
              <span>🌍 Seismic Vibration & Inclinometer Tilt</span>
              <strong style={{ color: 'var(--color-blue-600)' }}>{Math.round(aiConfig.weights.groundMovement * 100)}%</strong>
            </div>
            <input 
              type="range" 
              min="0.05" 
              max="0.50" 
              step="0.05" 
              value={aiConfig.weights.groundMovement} 
              onChange={e => updateAiWeights('groundMovement', e.target.value)}
              className="range-slider"
            />
          </div>

          {/* Slope Angle Weight */}
          <div className="slider-group">
            <div className="slider-header">
              <span>📐 Topographical Slope Gradient (DEM)</span>
              <strong style={{ color: 'var(--color-blue-600)' }}>{Math.round(aiConfig.weights.slope * 100)}%</strong>
            </div>
            <input 
              type="range" 
              min="0.05" 
              max="0.40" 
              step="0.05" 
              value={aiConfig.weights.slope} 
              onChange={e => updateAiWeights('slope', e.target.value)}
              className="range-slider"
            />
          </div>

          {/* Terrain Geology */}
          <div className="slider-group">
            <div className="slider-header">
              <span>⛰ Geological Stratum Stability</span>
              <strong style={{ color: 'var(--color-blue-600)' }}>{Math.round(aiConfig.weights.terrainGeology * 100)}%</strong>
            </div>
            <input 
              type="range" 
              min="0.05" 
              max="0.30" 
              step="0.05" 
              value={aiConfig.weights.terrainGeology} 
              onChange={e => updateAiWeights('terrainGeology', e.target.value)}
              className="range-slider"
            />
          </div>
        </div>

        {/* Risk Thresholds & Live Calculation Simulator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Risk Classification Thresholds */}
          <div className="card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '14px' }}>
              Risk Classification Thresholds
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-blue-50)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span className="badge badge-low">Low / Safe Risk</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>0% — {aiConfig.thresholds.lowMax}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-blue-50)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span className="badge badge-moderate">Moderate Risk</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{aiConfig.thresholds.lowMax + 1}% — {aiConfig.thresholds.moderateMax}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-blue-50)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span className="badge badge-high">High Risk</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{aiConfig.thresholds.moderateMax + 1}% — {aiConfig.thresholds.highMax}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-blue-50)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span className="badge badge-critical">Critical Danger</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{aiConfig.thresholds.highMax + 1}% — 100%</span>
              </div>
            </div>
          </div>

          {/* Live Simulator Preview */}
          <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--color-risk-low)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} color="var(--color-risk-low)" />
              <h4 style={{ color: 'var(--color-navy)', fontSize: '0.95rem', fontWeight: 700 }}>Live Model Dynamic Inference</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
              Simulating recalculation for {testLocation.name} with updated weight sliders:
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-blue-50)', border: '1px solid var(--color-border)', padding: '12px', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Dynamically Calculated Probability</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-blue-600)', lineHeight: 1.1 }}>
                  {previewScore.percentage}%
                </div>
              </div>
              <span className={`badge badge-${previewScore.level.toLowerCase()}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
                {previewScore.level} RISK
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiModelConfig;
