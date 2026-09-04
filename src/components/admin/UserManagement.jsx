import React, { useState } from 'react';
import { Users, Shield, HardHat, User, UserPlus, Check, Lock } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 'usr-1', name: 'Commander R. Sharma', role: 'authority', roleLabel: 'State Disaster Authority', agency: 'Sikkim SDMA', status: 'ACTIVE' },
    { id: 'usr-2', name: 'Field Officer T. Dorjee', role: 'fieldOfficer', roleLabel: 'Field Response Officer', agency: 'North Sikkim Mobile Unit', status: 'ON_DUTY' },
    { id: 'usr-3', name: 'Officer Rajesh Das', role: 'fieldOfficer', roleLabel: 'Field Response Officer', agency: 'Dima Hasao Hill Unit', status: 'ON_DUTY' },
    { id: 'usr-4', name: 'Chief Director P. Nath', role: 'admin', roleLabel: 'Super Admin', agency: 'Disaster Information HQ', status: 'ACTIVE' },
    { id: 'usr-5', name: 'Dorji Tenzing', role: 'citizen', roleLabel: 'Verified Citizen Reporter', agency: 'Mangan Community Watch', status: 'ACTIVE' }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '2px' }}>
            System Users & Role-Based Access Control
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Manage authorized credentials for Authorities, Field Teams, and Super Admins
          </p>
        </div>
        <span className="badge badge-info">{users.length} Active System Accounts</span>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User Name / ID</th>
              <th>System Role</th>
              <th>Station / Agency</th>
              <th>Authorization Status</th>
              <th>Role Scope</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)', fontFamily: 'var(--font-mono)' }}>{u.id}</div>
                </td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-low' : u.role === 'authority' ? 'badge-critical' : u.role === 'fieldOfficer' ? 'badge-high' : 'badge-info'}`}>
                    {u.roleLabel}
                  </span>
                </td>
                <td>{u.agency}</td>
                <td>
                  <span style={{ color: '#00E676', fontWeight: 600, fontSize: '0.82rem' }}>
                    ● {u.status}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {u.role === 'admin' ? 'Super Admin System Control' : u.role === 'authority' ? 'Triage, Broadcast & Verifications' : u.role === 'fieldOfficer' ? 'Tactical Inspection & GPS' : 'Public Hazard Reporting'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
