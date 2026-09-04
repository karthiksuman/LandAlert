import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Camera, Sparkles, Send, CheckCircle2, AlertTriangle, 
  Upload, ShieldAlert, Cpu, Activity, Ruler 
} from 'lucide-react';

const InspectionForm = ({ task, onSubmitted }) => {
  const { updateFieldTaskStatus, addToast } = useApp();

  const [crackWidth, setCrackWidth] = useState(task.inspectionData?.crackWidthMm || 18);
  const [slopeTilt, setSlopeTilt] = useState(task.inspectionData?.slopeTiltDeg || 42);
  const [rockfall, setRockfall] = useState(task.inspectionData?.rockfallSeverity || 'High');
  const [waterSeepage, setWaterSeepage] = useState(task.inspectionData?.waterSeepageRate || 'Rapid Turbid Flow');
  const [roadDamage, setRoadDamage] = useState(task.inspectionData?.roadDamage || 'Severe Fissuring');
  const [notes, setNotes] = useState(task.inspectionData?.notes || 'Ground toe saturated. Tensile scarp widening at ~3mm/hr.');
  
  // AI Vision Image Analysis Simulation
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiResult, setAiResult] = useState(task.inspectionData?.aiAnalysisResult || null);

  const handleRunAiVision = () => {
    setIsAnalyzingAi(true);
    setTimeout(() => {
      setIsAnalyzingAi(false);
      const res = "AI Deep Convolutional Geological Vision: 92.4% match with active retrogressive rotational slope failure. High secondary collapse probability within 3 hours. Recommendation: Immediate 300m toe perimeter evacuation.";
      setAiResult(res);
      addToast("AI Vision Analysis Complete", "High-confidence shear failure pattern identified.", "warning");
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const inspectionData = {
      crackWidthMm: Number(crackWidth),
      slopeTiltDeg: Number(slopeTilt),
      rockfallSeverity: rockfall,
      waterSeepageRate: waterSeepage,
      roadDamage,
      aiAnalysisResult: aiResult || "Geotechnical telemetry logged.",
      notes
    };

    updateFieldTaskStatus(task.id, 'REPORT_SUBMITTED', inspectionData);
    if (onSubmitted) onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '2px' }}>
            On-Site Geotechnical Inspection Form
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Logging ground telemetry & crack kinematics for {task.locationName}
          </p>
        </div>
        <span className="badge badge-info">
          OFFICER TERMINAL
        </span>
      </div>

      {/* Numerical Telemetry Form Grid */}
      <div className="telemetry-form-grid">
        <div className="telemetry-input-group">
          <label>Crack Displacement Width (mm)</label>
          <input 
            type="number" 
            value={crackWidth} 
            onChange={e => setCrackWidth(e.target.value)} 
            required 
          />
        </div>

        <div className="telemetry-input-group">
          <label>Inclinometer / Slope Tilt (°)</label>
          <input 
            type="number" 
            value={slopeTilt} 
            onChange={e => setSlopeTilt(e.target.value)} 
            required 
          />
        </div>

        <div className="telemetry-input-group">
          <label>Rockfall Activity Severity</label>
          <select value={rockfall} onChange={e => setRockfall(e.target.value)}>
            <option value="Critical">Critical (Continuous Boulder Fall)</option>
            <option value="High">High (Frequent Rocks)</option>
            <option value="Moderate">Moderate (Occasional Gravel)</option>
            <option value="Low">Low / Stable</option>
          </select>
        </div>

        <div className="telemetry-input-group">
          <label>Sub-Surface Water Seepage</label>
          <select value={waterSeepage} onChange={e => setWaterSeepage(e.target.value)}>
            <option value="Rapid Turbid Flow">Rapid Turbid Flow (Muddy Spring)</option>
            <option value="Moderate Weep">Moderate Weep Discharge</option>
            <option value="Dry">Dry / No Seepage</option>
          </select>
        </div>
      </div>

      {/* Structural Road Damage */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
          Roadway & Infrastructure Structural Damage
        </label>
        <input 
          type="text" 
          value={roadDamage} 
          onChange={e => setRoadDamage(e.target.value)} 
          required 
        />
      </div>

      {/* Field Geologist Notes */}
      <div style={{ marginBottom: '18px' }}>
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
          Geotechnical Field Observations & Recommendations
        </label>
        <textarea 
          rows={3} 
          value={notes} 
          onChange={e => setNotes(e.target.value)} 
          required 
        />
      </div>

      {/* AI-Assisted Geotechnical Image Analysis Simulation */}
      <div className="ai-analysis-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="#29B6F6" />
            <h4 style={{ color: '#fff', fontSize: '0.92rem' }}>AI Computer Vision Fracture Analysis</h4>
          </div>

          <button 
            type="button" 
            className="btn-outline-cyan"
            style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            onClick={handleRunAiVision}
            disabled={isAnalyzingAi}
          >
            <Sparkles size={14} />
            {isAnalyzingAi ? "Analyzing Slope Image..." : "Run AI Visual Inference"}
          </button>
        </div>

        {aiResult ? (
          <div style={{ fontSize: '0.82rem', color: '#B0BEC5', lineHeight: 1.4, marginTop: '8px', background: 'rgba(7, 21, 34, 0.7)', padding: '10px', borderRadius: '6px' }}>
            <strong style={{ color: '#29B6F6', display: 'block', marginBottom: '2px' }}>
              ✓ Neural Geotechnical Diagnostic:
            </strong>
            {aiResult}
          </div>
        ) : (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Upload or capture photo from field tablet to run edge neural network slip-surface detection.
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="btn-primary" 
        style={{ width: '100%', padding: '14px', fontSize: '1.0rem', marginTop: '10px' }}
      >
        <Send size={16} />
        TRANSMIT INSPECTION REPORT TO STATE AUTHORITY
      </button>
    </form>
  );
};

export default InspectionForm;
