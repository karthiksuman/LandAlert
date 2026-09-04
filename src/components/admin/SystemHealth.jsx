import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, CheckCircle2, AlertTriangle, Server, Cpu, Radio, Shield } from 'lucide-react';

const SystemHealth = () => {
  const { systemHealth, sensors, citizenReports, alerts } = useApp();

  const offlineSensorsCount = sensors.filter(s => s.status === 'OFFLINE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">
            <Radio size={24} />
          </div>
          <div>
            <div className="kpi-value">{sensors.length}</div>
            <div className="kpi-label">Deployed IoT Sensors</div>
          </div>
        </div>

        <div className="kpi-card" style={{ borderColor: offlineSensorsCount > 0 ? 'var(--color-risk-critical)' : 'var(--color-border)' }}>
          <div className="kpi-icon" style={{ background: 'var(--color-risk-critical-bg)', color: 'var(--color-risk-critical)' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="kpi-value" style={{ color: offlineSensorsCount > 0 ? 'var(--color-risk-critical)' : 'var(--color-navy)' }}>
              {offlineSensorsCount}
            </div>
            <div className="kpi-label">Sensors Requiring Service</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'var(--color-risk-low-bg)', color: 'var(--color-risk-low)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="kpi-value">99.96%</div>
            <div className="kpi-label">System Gateway Uptime</div>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: 'var(--color-risk-high-bg)', color: 'var(--color-risk-high)' }}>
            <Activity size={24} />
          </div>
          <div>
            <div className="kpi-value">{alerts.length}</div>
            <div className="kpi-label">Active Disaster Advisories</div>
          </div>
        </div>
      </div>

      {/* Infrastructure Telemetry Table */}
      <div className="data-table-container">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--color-navy)', fontWeight: 700 }}>Core Infrastructure Health Telemetry</h3>
          <span className="badge badge-low">All Core Daemons Online</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>System Daemon / Service</th>
              <th>Status</th>
              <th>Network Latency</th>
              <th>Notes / Diagnostics</th>
            </tr>
          </thead>
          <tbody>
            {systemHealth.map((item, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>{item.component}</td>
                <td>
                  <span className={`badge ${item.status === 'OPERATIONAL' ? 'badge-low' : 'badge-high'}`}>
                    {item.status}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)' }}>{item.latency}</td>
                <td style={{ color: 'var(--text-muted)' }}>{item.note || `Uptime: ${item.uptime}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemHealth;
