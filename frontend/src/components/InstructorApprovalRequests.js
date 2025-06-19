import React, { useEffect, useState } from 'react';

const InstructorApprovalRequests = ({ onBack }) => {
  const [pendingInstructors, setPendingInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingInstructors = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/instructors/pending');
      const data = await res.json();
      console.log("Fetched data:", data); // Check the response format
  
      // Ensure data is an array
      if (Array.isArray(data)) {
        setPendingInstructors(data);
      } else {
        console.error("Unexpected response format:", data);
        setPendingInstructors([]); // Handle unexpected format gracefully
      }
    } catch (err) {
      console.error("Error fetching pending instructors:", err);
      setPendingInstructors([]); // Set an empty array in case of error
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleApprove = async (id) => {
    const confirm = window.confirm("Approve this instructor?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/instructors/${id}/approve`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await res.json();

      // Remove approved instructor from list
      setPendingInstructors(prev => prev.filter(instr => instr._id !== id));
      alert(result.message);
    } catch (err) {
      console.error("Error approving instructor:", err);
      alert("Failed to approve instructor");
    }
  };

  useEffect(() => {
    fetchPendingInstructors();
  }, []);

  return (
    <div className="dashboard-card full-width">
      <button className="back-button" onClick={onBack}>⬅ Back</button>
      <h2 className="section-title">Instructor Approval Requests</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : pendingInstructors.length === 0 ? (
        <p>No pending instructor requests.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Qualification</th>
              <th>Experience</th>
              <th>Approve</th>
            </tr>
          </thead>
          <tbody>
            {pendingInstructors.map(instr => (
              <tr key={instr._id}>
                <td>{instr.FName} {instr.LName}</td>
                <td>{instr.Qualification}</td>
                <td>{instr.Experience}</td>
                <td>
                  <input type="checkbox" onChange={() => handleApprove(instr._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InstructorApprovalRequests;
