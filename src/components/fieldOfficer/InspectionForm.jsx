import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Camera, Sparkles, Send, CheckCircle2, AlertTriangle, 
  Upload, ShieldAlert, Cpu, Activity, Ruler, ShieldCheck, Check
} from 'lucide-react';

const InspectionForm = ({ task, onSubmitted }) => {
  const { updateFieldTaskStatus, addToast, t } = useApp();

  const [crackWidth, setCrackWidth] = useState(task.inspectionData?.crackWidthMm || 18);
  const [slopeTilt, setSlopeTilt] = useState(task.inspectionData?.slopeTiltDeg || 42);
  const [rockfall, setRockfall] = useState(task.inspectionData?.rockfallSeverity || 'High');
  const [waterSeepage, setWaterSeepage] = useState(task.inspectionData?.waterSeepageRate || 'Rapid Turbid Flow');
  const [roadDamage, setRoadDamage] = useState(task.inspectionData?.roadDamage || 'Severe Structural Fissuring');
  const [notes, setNotes] = useState(task.inspectionData?.notes || 'Slope toe saturated. Evacuation of 6 roadside houses strongly advised.');
  
  // AI Vision Image Analysis Simulation
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiResult, setAiResult] = useState(task.inspectionData?.aiAnalysisResult || null);
  const [showEditForm, setShowEditForm] = useState(false);

  const isSubmitted = task.status === 'REPORT_SUBMITTED' || task.status === 'RESOLVED';

  const handleRunAiVision = () => {
    setIsAnalyzingAi(true);
    setTimeout(() => {
      setIsAnalyzingAi(false);
      const res = "AI Geotechnical Model: 91% match with retrogressive rotational slip failure. High probability of secondary slide within 3 hours.";
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
      aiAnalysisResult: aiResult || "Geotechnical telemetry logged: 91% match with retrogressive rotational slip failure.",
      notes,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      referenceId: "SEOC-INSP-" + task.id.replace('TASK-', '')
    };

    updateFieldTaskStatus(task.id, 'REPORT_SUBMITTED', inspectionData);
    setShowEditForm(false);
    if (onSubmitted) onSubmitted();
  };

  return (
    <div className="glass-panel inspection-form-container" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-navy)', marginBottom: '2px' }}>
            {t.fieldOfficer?.formTitle || "On-Site Geotechnical Inspection Form"}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {t.fieldOfficer?.formSub || "Logging ground telemetry & crack kinematics"} for {task.locationName}
          </p>
        </div>
        <span className="badge badge-info">
          {t.fieldOfficer?.officerTerminal || "OFFICER TERMINAL"}
        </span>
      </div>

      {/* Official Government Submission Acknowledgment Banner */}
      {isSubmitted && !showEditForm && (
        <div style={{ 
          background: '#E8F5E9', 
          border: '1px solid #A5D6A7', 
          borderRadius: '10px', 
          padding: '16px', 
          marginBottom: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={22} color="var(--color-risk-low)" />
              <strong style={{ color: '#1B5E20', fontSize: '0.92rem' }}>
                {t.fieldOfficer?.reportSubmitted || "Report Transmitted Successfully to State Disaster Authority"}
              </strong>
            </div>
            <span className="badge badge-low" style={{ fontSize: '0.72rem' }}>
              ✓ EOC LOGGED
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#2E7D32', margin: '0 0 10px' }}>
            Field measurements and AI crack diagnosis have been transmitted to the Authority Command Center. The State Disaster Management Authority is actively evaluating slope hazard evacuations.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#1B5E20', background: 'rgba(255,255,255,0.7)', padding: '8px 12px', borderRadius: '6px' }}>
            <span><strong>Ref:</strong> {task.inspectionData?.referenceId || `SEOC-INSP-${task.id}`}</span>
            <span><strong>Logged At:</strong> {task.inspectionData?.submittedAt || 'Just Now'}</span>
            <span><strong>Crack:</strong> {crackWidth} mm</span>
            <span><strong>Tilt:</strong> {slopeTilt}°</span>
            <span><strong>Status:</strong> Active in Authority Triage</span>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn-secondary" 
              style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              onClick={() => setShowEditForm(true)}
            >
              Update / Add More Field Observations
            </button>
          </div>
        </div>
      )}

      {/* Form Content */}
      {(!isSubmitted || showEditForm) && (
        <form onSubmit={handleSubmit}>
          {/* Numerical Telemetry Form Grid */}
          <div className="telemetry-form-grid">
            <div className="telemetry-input-group">
              <label>{t.fieldOfficer?.crackWidth || "Crack Displacement Width (mm)"}</label>
              <input 
                type="number" 
                value={crackWidth} 
                onChange={e => setCrackWidth(e.target.value)} 
                required 
              />
            </div>

            <div className="telemetry-input-group">
              <label>{t.fieldOfficer?.slopeTilt || "Inclinometer / Slope Tilt (°)"}</label>
              <input 
                type="number" 
                value={slopeTilt} 
                onChange={e => setSlopeTilt(e.target.value)} 
                required 
              />
            </div>

            <div className="telemetry-input-group">
              <label>{t.fieldOfficer?.rockfall || "Rockfall Activity Severity"}</label>
              <select value={rockfall} onChange={e => setRockfall(e.target.value)}>
                <option value="Critical">Critical (Continuous Boulder Fall)</option>
                <option value="High (Frequent Rocks)">High (Frequent Rocks)</option>
                <option value="Moderate (Occasional Gravel)">Moderate (Occasional Gravel)</option>
                <option value="Low / Stable">Low / Stable</option>
              </select>
            </div>

            <div className="telemetry-input-group">
              <label>{t.fieldOfficer?.seepage || "Sub-Surface Water Seepage"}</label>
              <select value={waterSeepage} onChange={e => setWaterSeepage(e.target.value)}>
                <option value="Rapid Turbid Flow (Muddy Spring)">Rapid Turbid Flow (Muddy Spring)</option>
                <option value="Moderate Weep Discharge">Moderate Weep Discharge</option>
                <option value="Dry / No Seepage">Dry / No Seepage</option>
              </select>
            </div>
          </div>

          {/* Structural Road Damage */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              {t.fieldOfficer?.structuralDamage || "Roadway & Infrastructure Structural Damage"}
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
              {t.fieldOfficer?.notes || "Geotechnical Field Observations & Recommendations"}
            </label>
            <textarea 
              rows={3} 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              required 
            />
          </div>

          {/* AI-Assisted Geotechnical Image Analysis Simulation */}
          <div className="ai-analysis-box" style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="var(--color-blue-500)" />
                <h4 style={{ color: 'var(--color-navy)', fontSize: '0.92rem', margin: 0 }}>
                  {t.fieldOfficer?.aiVisionTitle || "AI Computer Vision Fracture Analysis"}
                </h4>
              </div>

              <button 
                type="button" 
                className="btn-secondary" 
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                onClick={handleRunAiVision}
                disabled={isAnalyzingAi}
              >
                <Sparkles size={14} />
                {isAnalyzingAi ? (t.fieldOfficer?.analyzingAi || "Analyzing Slope Image...") : (t.fieldOfficer?.runAiVision || "Run AI Visual Inference")}
              </button>
            </div>

            {aiResult ? (
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginTop: '8px', background: 'var(--color-blue-50)', border: '1px solid var(--color-blue-100)', padding: '10px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--color-blue-600)', display: 'block', marginBottom: '2px' }}>
                  ✓ Neural Geotechnical Diagnostic:
                </strong>
                {aiResult}
              </div>
            ) : (
              <div style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, marginTop: '8px', background: 'var(--color-blue-50)', border: '1px solid var(--color-blue-100)', padding: '10px', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--color-blue-600)', display: 'block', marginBottom: '2px' }}>
                  ✓ Neural Geotechnical Diagnostic:
                </strong>
                AI Geotechnical Model: 91% match with retrogressive rotational slip failure. High probability of secondary slide within 3 hours.
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: '1.0rem', 
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #1565C0, #0D47A1)',
              boxShadow: '0 4px 14px rgba(21, 101, 192, 0.35)',
              cursor: 'pointer'
            }}
          >
            <Send size={18} />
            {t.fieldOfficer?.submitReport || "SUBMIT REPORT TO GOVERNMENT & STATE AUTHORITY"}
          </button>
        </form>
      )}
    </div>
  );
};

export default InspectionForm;
