import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneCall, Plus, Trash2, Edit2, Check, Shield } from 'lucide-react';

const EmergencyHelplines = () => {
  const { helplines, setHelplines, addToast } = useApp();

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newCategory, setNewCategory] = useState('Disaster Management');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName || !newNumber) return;

    const newHl = {
      id: 'hl-' + Date.now(),
      category: newCategory,
      name: newName,
      number: newNumber,
      description: newDesc || "Configured Emergency Operations Line"
    };

    setHelplines(prev => [newHl, ...prev]);
    setNewName('');
    setNewNumber('');
    setNewDesc('');
    addToast("Emergency Helpline Added", `${newHl.name} (${newHl.number}) saved to live directory.`, "success");
  };

  const handleDelete = (id) => {
    setHelplines(prev => prev.filter(h => h.id !== id));
    addToast("Helpline Removed", "Hotline deleted from directory.", "info");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '2px' }}>
            Emergency Helpline Directory Management
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Configure emergency contact hotlines displayed in Citizen SOS & More sections
          </p>
        </div>
        <span className="badge badge-info">{helplines.length} Numbers Configured</span>
      </div>

      {/* Add New Helpline Form */}
      <form onSubmit={handleAdd} className="glass-panel" style={{ padding: '20px' }}>
        <h4 style={{ color: '#fff', fontSize: '0.98rem', marginBottom: '12px' }}>
          Add New Regional Emergency / Relief Line
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Service Name</label>
            <input type="text" placeholder="e.g. Mangan District Control Room" value={newName} onChange={e => setNewName(e.target.value)} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phone Number / Toll-Free</label>
            <input type="text" placeholder="e.g. 03592-202111" value={newNumber} onChange={e => setNewNumber(e.target.value)} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</label>
            <select value={newCategory} onChange={e => setNewCategory(e.target.value)}>
              <option value="National Emergency">National Emergency</option>
              <option value="Disaster Management">Disaster Management</option>
              <option value="Police">Police</option>
              <option value="Ambulance">Ambulance</option>
              <option value="Road Assistance">Road Assistance</option>
              <option value="District Operations">District Operations</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Description</label>
            <input type="text" placeholder="e.g. 24x7 Flood & Landslide Operations" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          <Plus size={15} />
          Save Hotline to Directory
        </button>
      </form>

      {/* Directory Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Category</th>
              <th>Dial Number</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {helplines.map(hl => (
              <tr key={hl.id}>
                <td style={{ fontWeight: 600, color: '#fff' }}>{hl.name}</td>
                <td>
                  <span className="badge badge-critical" style={{ fontSize: '0.68rem' }}>
                    {hl.category}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-cyan)' }}>
                  {hl.number}
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{hl.description}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(hl.id)}
                    style={{ background: 'none', border: 'none', color: '#FF5252', cursor: 'pointer', padding: '4px' }}
                    title="Delete Hotline"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmergencyHelplines;
