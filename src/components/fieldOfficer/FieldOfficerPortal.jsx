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
    setIsSosOpen 
  } = useApp();

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
    <div className="officer-layout">
      {/* Officer Status Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
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

      {/* Task Stepper for Selected Task */}
      {currentTask && (
        <div className="glass-panel" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Active Workflow Progression: {currentTask.id}
              </span>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)' }}>{currentTask.title}</h3>
            </div>

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

      {/* Grid: Task Queue on Left, Active Action on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', paddingBottom: 'calc(var(--bottom-nav-height) + 16px)' }}>
        {/* Task List */}
        <div>
          <TaskQueue 
            selectedTaskId={activeFieldTaskId} 
            onSelectTask={setActiveFieldTaskId} 
          />
        </div>

        {/* Tactical Actions for Selected Task */}
        {currentTask && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Live Navigation Route */}
            <LiveNavigation 
              task={currentTask} 
              onArrived={() => updateFieldTaskStatus(currentTask.id, 'ON_SITE')} 
            />

            {/* Inspection Form */}
            <InspectionForm 
              task={currentTask} 
              onSubmitted={() => updateFieldTaskStatus(currentTask.id, 'REPORT_SUBMITTED')} 
            />
          </div>
        )}
      </div>

      {/* Fixed Bottom Dashboard Navigation Bar with Equal Spacing */}
      <nav className="citizen-bottom-nav">
        <button
          className="bottom-nav-item active"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Clock size={19} />
          <span>Active Tasks</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => {
            const el = document.querySelector('.live-nav-panel');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <Car size={19} />
          <span>Live GPS Nav</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => {
            const el = document.querySelector('.inspection-form-container');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <ClipboardCheck size={19} />
          <span>Inspection Form</span>
        </button>

        <button
          className="bottom-nav-item"
          onClick={() => setIsSosOpen(true)}
          style={{ color: '#D32F2F' }}
        >
          <ShieldAlert size={19} />
          <span>Distress SOS</span>
        </button>
      </nav>
    </div>
  );
};

export default FieldOfficerPortal;
