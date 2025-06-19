import React, { useState } from 'react';
import './AdminDashboard.css';

const SupportDetailView = ({ ticket, onBack }) => {
  const [current, setCurrent] = useState(ticket);
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/support/${current._id}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({status: newStatus })
      });
      const data = await res.json();
      
      console.log("✅ Server response:", data); 

      if (data.updatedSupport) {
        setCurrent(data.updatedSupport);
        alert(`Status updated to "${newStatus}"`);
      } else {
        alert('Failed to update status.');
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Error updating status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dashboard-card full-width">
      <h2 className="section-title">Support Ticket Details</h2>
      <button className="back-button" onClick={onBack}>⬅ Back</button>

      <p><strong>Ticket ID:</strong> {current._id}</p>
      <p><strong>User:</strong> {current.userName}</p>
      <p><strong>Role:</strong> {current.userType}</p>
      <p><strong>Subject:</strong> {current.subject}</p>
      <p><strong>Category:</strong> {current.category}</p>
      <p><strong>Status:</strong>
        <span className={`status-badge ${current.status.toLowerCase()}`} style={{ marginLeft: '0.5rem' }}>
          {current.status}
        </span>
      </p>
      <p><strong>Message:</strong> {current.message}</p>
      <p><strong>Created At:</strong> {new Date(current.createdAt).toLocaleString()}</p>
      {current.file && (
        <p><strong>Attachment:</strong> <a href={current.file} download>Download File</a></p>
      )}

      <div className="button-group">
        {current.status !== 'In Progress' && current.status !== 'Closed' && (
          <button
            className="approve-button"
            onClick={() => updateStatus('In Progress')}
            disabled={updating}
          >
            Mark as In Progress
          </button>
        )}

        {current.status !== 'Closed' && (
          <button
            className="approve-button"
            onClick={() => updateStatus('Closed')}
            disabled={updating}
            style={{ backgroundColor: '#2e7d32' }}
          >
            Mark as Resolved
          </button>
        )}
      </div>
    </div>
  );
};

export default SupportDetailView;
