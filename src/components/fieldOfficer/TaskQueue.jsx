import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, Clock, MapPin, AlertTriangle, ArrowRight, 
  Car, Shield, Check 
} from 'lucide-react';

const TaskQueue = ({ selectedTaskId, onSelectTask }) => {
  const { fieldTasks, updateFieldTaskStatus } = useApp();

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'badge-critical';
      case 'HIGH': return 'badge-high';
      default: return 'badge-moderate';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Assigned Field Operations</h3>
        <span className="badge badge-info">{fieldTasks.length} Active Tasks</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {fieldTasks.map(task => {
          const isSelected = selectedTaskId === task.id;
          const isResolved = task.status === 'RESOLVED';

          return (
            <div
              key={task.id}
              className={`task-card glass-panel-hoverable ${isSelected ? 'selected' : ''}`}
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--brand-cyan)' : 'var(--border-subtle)',
                boxShadow: isSelected ? '0 0 16px var(--brand-cyan-glow)' : 'var(--shadow-md)'
              }}
              onClick={() => onSelectTask(task.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {task.id}
                    </span>
                    <span className={`badge ${getPriorityBadge(task.priority)}`} style={{ fontSize: '0.68rem' }}>
                      {task.priority}
                    </span>
                    <span className="badge badge-low" style={{ fontSize: '0.68rem' }}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 style={{ color: '#fff', fontSize: '0.98rem' }}>{task.title}</h4>
                </div>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Due: {task.deadline}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <MapPin size={14} color="var(--brand-cyan)" />
                <span>{task.locationName}</span>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                {task.instructions}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskQueue;
