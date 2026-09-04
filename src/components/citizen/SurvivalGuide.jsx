import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, Eye, Package, Compass, Mountain, Home, Waves } from 'lucide-react';

const SurvivalGuide = () => {
  const [phase, setPhase] = useState('BEFORE');

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-navy)', fontWeight: 700, marginBottom: '4px' }}>
          Official Landslide Survival & Preparedness Guide
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Disaster mitigation protocols formulated with National Disaster Management Authority (NDMA)
        </p>
      </div>

      {/* Phase Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
        <button
          className={phase === 'BEFORE' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setPhase('BEFORE')}
          style={{ fontSize: '0.85rem', padding: '10px' }}
        >
          1. Before a Slide
        </button>
        <button
          className={phase === 'DURING' ? 'btn-critical' : 'btn-secondary'}
          onClick={() => setPhase('DURING')}
          style={{ fontSize: '0.85rem', padding: '10px' }}
        >
          2. During a Slide
        </button>
        <button
          className={phase === 'AFTER' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setPhase('AFTER')}
          style={{ fontSize: '0.85rem', padding: '10px' }}
        >
          3. After a Slide
        </button>
      </div>

      {/* PHASE 1: BEFORE */}
      {phase === 'BEFORE' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Eye size={20} color="var(--color-blue-500)" />
              <h4 style={{ color: 'var(--color-navy)', fontSize: '0.95rem', fontWeight: 700 }}>Monitor Geological Alerts</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              Keep battery radios or TerraAlert active during intense rainfall spells. Watch for unusual sounds such as rumbling trees or sudden mud discoloration in streams.
            </p>
          </div>

          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Package size={20} color="var(--color-risk-low)" />
              <h4 style={{ color: 'var(--color-navy)', fontSize: '0.95rem', fontWeight: 700 }}>Prepare 72h Emergency Grab-Bag</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              Pack drinking water purification tablets, dry rations, first-aid bandages, waterproof flashlight, whistle, copies of government identity cards, and essential medications.
            </p>
          </div>

          <div className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Compass size={20} color="var(--color-risk-high)" />
              <h4 style={{ color: 'var(--color-navy)', fontSize: '0.95rem', fontWeight: 700 }}>Pre-Map Evacuation Routes</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              Identify at least two evacuation paths to designated community relief shelters that do not traverse across steep drainage gullies or slope toes.
            </p>
          </div>
        </div>
      )}

      {/* PHASE 2: DURING */}
      {phase === 'DURING' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--color-risk-critical)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Mountain size={20} color="var(--color-risk-critical)" />
              <h4 style={{ color: 'var(--color-navy)', fontSize: '0.95rem', fontWeight: 700 }}>Move Lateral to Slide Path</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              Do NOT attempt to run downhill in front of a debris flow. Move quickly laterally (perpendicular) to the path of descending mud and boulders to stable bedrock.
            </p>
          </div>

          <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--color-risk-critical)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Waves size={20} color="var(--color-risk-critical)" />
              <h4 style={{ color: 'var(--color-navy)', fontSize: '0.95rem', fontWeight: 700 }}>Avoid Mountain Bridges & Culverts</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              River crossings and ravine culverts are prime bottlenecks for violent flash flood dam bursts. Never shelter underneath bridges or retaining parapets.
            </p>
          </div>

          <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--color-risk-critical)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Home size={20} color="var(--color-risk-critical)" />
              <h4 style={{ color: 'var(--color-navy)', fontSize: '0.95rem', fontWeight: 700 }}>If Trapped Indoors: Curl and Protect</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              If escape is impossible, get under sturdy furniture such as heavy tables or move to the upper floor room furthest away from the hillside slope face.
            </p>
          </div>
        </div>
      )}

      {/* PHASE 3: AFTER */}
      {phase === 'AFTER' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--color-blue-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <AlertTriangle size={20} color="var(--color-blue-500)" />
              <h4 style={{ color: 'var(--color-navy)', fontSize: '0.95rem', fontWeight: 700 }}>Watch for Secondary Slides</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              The head scarp and flanking debris frequently suffer secondary collapse within 24 to 48 hours. Stay completely clear of slide disaster perimeters.
            </p>
          </div>

          <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--color-blue-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <CheckCircle2 size={20} color="var(--color-risk-low)" />
              <h4 style={{ color: 'var(--color-navy)', fontSize: '0.95rem', fontWeight: 700 }}>Report Injured & Trapped Persons</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              Use the SOS emergency tool or call 1078 / 112 to direct NDRF and SDRF search-and-rescue teams without entering dangerous unstable slip zones.
            </p>
          </div>

          <div className="card" style={{ padding: '18px', borderLeft: '4px solid var(--color-blue-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Shield size={20} color="var(--color-blue-500)" />
              <h4 style={{ color: 'var(--color-navy)', fontSize: '0.95rem', fontWeight: 700 }}>Check Foundation Integrity</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
              Do not re-enter hillside dwellings until geotechnical structural engineers have surveyed foundation pilings and retaining walls for tilt deformation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurvivalGuide;
