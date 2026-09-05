import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import TaskQueue from './TaskQueue';
import LiveNavigation from './LiveNavigation';
import InspectionForm from './InspectionForm';
import { 
  CheckCircle2, Clock, Car, MapPin, ClipboardCheck, 
  Send, ShieldAlert, ArrowRight, Radio, HardHat 
} from 'lucide-react';

const FieldOfficerPortal = () => {
  const { 
    fieldTasks, 
    activeFieldTaskId, 
    setActiveFieldTaskId, 
    updateFieldTaskStatus,
    setIsSosOpen,
    t
  } = useApp();

  const [officerTab, setOfficerTab] = useState('tasks'); // 'tasks' | 'form'
  const currentTask = fieldTasks.find(t => t.id === activeFieldTaskId) || fieldTasks[0];

  const steps = [
    { key: 'ASSIGNED', label: 'Assigned', icon: Clock },
    { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
    { key: 'TRAVELLING', label: 'Travelling', icon: Car },
    { key: 'ON_SITE', label: 'On Site', icon: MapPin },
    { key: 'INSPECTION', label: 'Inspection', icon: ClipboardCheck },
    { key: 'REPORT_SUBMITTED', label: 'Reported', icon: Send },
    { key: 'RESOLVED', label: 'Resolved', icon: ShieldAlert }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentTask?.status);

  const handleAdvanceStep = () => {
    if (!currentTask) return;
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      updateFieldTaskStatus(currentTask.id, steps[nextIndex].key);
    }
  };

  return (
    <div className="officer-layout" style={{ paddingBottom: 'calc(var(--bottom-nav-height) + 24px)' }}>
      {/* Officer Status Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HardHat size={24} color="var(--color-risk-high)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--color-navy)', marginBottom: '2px' }}>
              Field Inspection Unit: FO-402 (T. Dorjee)
            </h2>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Connected to State Disaster Operations Gateway • LoRa Link Active
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-critical" onClick={() => setIsSosOpen(true)} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            <Radio size={14} />
            Officer Distress SOS
          </button>
        </div>
      </div>

      {/* VIEW 1: ACTIVE TASKS & WORKFLOW PROGRESSION */}
      {officerTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Task Stepper for Selected Task */}
          {currentTask && (
            <div className="glass-panel" style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Active Workflow Progression: {currentTask.id}
                  </span>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', margin: '2px 0 0' }}>{currentTask.title}</h3>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {currentStepIndex < steps.length - 1 && (
                    <button 
                      className="btn-primary" 
                      onClick={handleAdvanceStep}
                      style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                    >
                      Advance: {steps[currentStepIndex + 1]?.label}
                      <ArrowRight size={14} />
                    </button>
                  )}

                  <button 
                    className="btn-outline-cyan"
                    onClick={() => setOfficerTab('form')}
                    style={{ fontSize: '0.82rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ClipboardCheck size={14} />
                    Open Inspection Form
                  </button>
                </div>
              </div>

              <div className="workflow-stepper">
                {steps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isCompleted = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div 
                      key={step.key} 
                      className={`step-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                      <div className="step-icon-circle">
                        <StepIcon size={16} />
                      </div>
                      <span className="step-label">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grid: Task Queue on Left, Live Navigation Route on Right */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            <div>
              <TaskQueue 
                selectedTaskId={activeFieldTaskId} 
                onSelectTask={setActiveFieldTaskId} 
              />
            </div>

            {currentTask && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <LiveNavigation 
                  task={currentTask} 
                  onArrived={() => updateFieldTaskStatus(currentTask.id, 'ON_SITE')} 
                />

                <div className="glass-panel" style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.98rem', color: 'var(--color-navy)', margin: '0 0 4px' }}>
                      Ready to log field crack & tilt kinematics?
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                      Complete the official on-site geotechnical form and transmit to SDMA EOC.
                    </p>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => setOfficerTab('form')}
                    style={{ fontSize: '0.85rem', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ClipboardCheck size={16} />
                    <span>Open Inspection Form</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: DEDICATED SEPARATE INSPECTION FORM */}
      {officerTab === 'form' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Bar for Dedicated Form with Task Switcher & Back Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <button
              className="btn-secondary"
              onClick={() => setOfficerTab('tasks')}
              style={{ fontSize: '0.82rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>← Back to Active Tasks</span>
            </button>

            {/* Task selector to switch task being inspected */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Selected Task:
              </span>
              <select
                value={activeFieldTaskId}
                onChange={e => setActiveFieldTaskId(e.target.value)}
                style={{ fontSize: '0.85rem', fontWeight: 600, padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: '#FFFFFF' }}
              >
                {fieldTasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id}: {t.locationName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Full-width Inspection Form */}
          {currentTask && (
            <InspectionForm 
              task={currentTask} 
              onSubmitted={() => {
                updateFieldTaskStatus(currentTask.id, 'REPORT_SUBMITTED');
              }} 
            />
          )}
        </div>
      )}

      {/* Fixed Bottom Dashboard Navigation Bar with Equal Spacing */}
      <nav className="citizen-bottom-nav">
        <button
          className={`bottom-nav-item ${officerTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setOfficerTab('tasks')}
        >
          <Clock size={19} />
          <span>{t.fieldOfficer?.activeTasks || "Active Tasks"}</span>
        </button>

        <button
          className={`bottom-nav-item ${officerTab === 'form' ? 'active' : ''}`}
          onClick={() => setOfficerTab('form')}
        >
          <ClipboardCheck size={19} />
          <span>{t.fieldOfficer?.inspectionForm || "Inspection Form"}</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => setIsSosOpen(true)}
          style={{ color: '#D32F2F' }}
        >
          <ShieldAlert size={19} />
          <span>{t.fieldOfficer?.distressSos || "Distress SOS"}</span>
        </button>
      </nav>
    </div>
  );
};

export default FieldOfficerPortal;
