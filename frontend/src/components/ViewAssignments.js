import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [gradedSubmissions, setGradedSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/assignments/all");
        if (Array.isArray(response.data)) {
          setAssignments(response.data);
        } else {
          console.error("Invalid response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

      const fetchGraded = async () => {
        try {
          const res = await axios.get("http://localhost:5000/api/submissions/graded");
          setGradedSubmissions(res.data);
        } catch (err) {
          console.error("Error fetching graded submissions:", err);
        }
      };

      fetchAssignments();
      fetchGraded();
    }, []);

  const getGradedInfoForAssignment = (assignmentTitle) => {
    return gradedSubmissions.filter(sub => sub.assignmentTitle === assignmentTitle);
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const closeModal = () => {
    setSelectedAssignment(null);
  };

  const handleNotification = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/assignments/latest");
      if (!response.data) {
        toast.info("No new assignments available", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: "✅",
        });
        return;
      }
      const latestAssignment = response.data;
      toast.info(
        `New Assignment: "${latestAssignment.title}" due on ${
          latestAssignment.cutOffDate
            ? new Date(latestAssignment.cutOffDate).toLocaleDateString()
            : "No due date set"
        }`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: "📢",
        }
      );
    } catch (error) {
      toast.error("Failed to fetch latest assignment", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "❌",
      });
      console.error("Error fetching latest assignment:", error);
    }
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStatusBadge = (assignment) => {
    const now = new Date();
    const cutOffDate = assignment.cutOffDate ? new Date(assignment.cutOffDate) : null;
    
    if (!cutOffDate) {
      return <span className="status-badge no-deadline">No Deadline</span>;
    }
    
    if (now > cutOffDate) {
      return <span className="status-badge overdue">Closed</span>;
    }
    
    // Calculate days remaining
    const daysRemaining = Math.ceil((cutOffDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 2) {
      return <span className="status-badge urgent">Due Soon</span>;
    }
    
    return <span className="status-badge active">Active</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading assignments...</p>
      </div>
    );
  }

  return (
    <div className="assignments-container">
      <ToastContainer />
      
      <div className="assignments-header">
        <h1>Assignments Dashboard</h1>
        <p>View and manage all your course assignments</p>
      </div>

      <div className="assignments-actions">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search assignments by title or section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <button className="notification-btn" onClick={handleNotification}>
          <span className="btn-icon">🔔</span>
          <span className="btn-text">Check Notifications</span>
        </button>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className="no-assignments">
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <h3>No assignments found</h3>
            <p>Try adjusting your search or check back later for new assignments</p>
          </div>
        </div>
      ) : (
        <div className="assignments-grid">
          {filteredAssignments.map((assignment) => (
            <div key={assignment._id} className="assignment-card" onClick={() => handleViewDetails(assignment)}>
              <div className="card-header">
                <h3>{assignment.title}</h3>
                {renderStatusBadge(assignment)}
              </div>
              
              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-icon">📚</span>
                  <span className="detail-text">{assignment.section}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span className="detail-text">
                    {assignment.date ? new Date(assignment.date).toLocaleDateString() : "No Date"}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-icon">⏳</span>
                  <span className="detail-text">
                    Due: {assignment.cutOffDate ? new Date(assignment.cutOffDate).toLocaleDateString() : "Not set"}
                  </span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-icon">🏆</span>
                  <span className="detail-text">{assignment.totalMarks} Points</span>
                </div>
              </div>
              
              <div className="card-footer">
                <button className="view-details-btn">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAssignment && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedAssignment.title}</h2>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="assignment-details">
                <div className="detail-row">
                  <div className="detail-column">
                    <div className="detail-label">Section</div>
                    <div className="detail-value">{selectedAssignment.section}</div>
                  </div>
                  <div className="detail-column">
                    <div className="detail-label">Date Assigned</div>
                    <div className="detail-value">
                      {selectedAssignment.date ? new Date(selectedAssignment.date).toLocaleDateString() : "No Date"}
                    </div>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-column">
                    <div className="detail-label">Due Date</div>
                    <div className="detail-value">
                      {selectedAssignment.cutOffDate ? new Date(selectedAssignment.cutOffDate).toLocaleDateString() : "Not set"}
                    </div>
                  </div>
                  <div className="detail-column">
                    <div className="detail-label">Total Points</div>
                    <div className="detail-value">{selectedAssignment.totalMarks}</div>
                  </div>
                </div>
              </div>

              {selectedAssignment.supportFiles && selectedAssignment.supportFiles.length > 0 ? (
                <div className="pdf-container">
                  <h3>Assignment Files</h3>
                  {selectedAssignment.supportFiles.map((file, index) => (
                    <div key={index} className="pdf-item">
                      <div className="pdf-info">
                        <span className="pdf-icon">📄</span>
                        <span className="pdf-name">Assignment PDF {index + 1}</span>
                      </div>
                      <iframe
                        src={`http://localhost:5000/api/assignments/files/${file}`}
                        width="100%"
                        height="300px"
                        title={`Assignment PDF ${index + 1}`}
                        className="pdf-frame"
                      ></iframe>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-files">
                  <span className="no-files-icon">📁</span>
                  <p>No files uploaded for this assignment</p>
                </div>
              )}

              <div className="grading-info">
                <h3>Grading Information</h3>
                {getGradedInfoForAssignment(selectedAssignment.title).length > 0 ? (
                  <div className="graded-submissions">
                    {getGradedInfoForAssignment(selectedAssignment.title).map((submission, index) => (
                      <div key={index} className="graded-item">
                        <div className="graded-row">
                          <div className="graded-column">
                            <div className="graded-label">Student</div>
                            <div className="graded-value">{submission.studentName}</div>
                          </div>
                          <div className="graded-column">
                            <div className="graded-label">Graded By</div>
                            <div className="graded-value">{submission.gradedBy || "N/A"}</div>
                          </div>
                        </div>
                        
                        <div className="graded-row">
                          <div className="graded-column">
                            <div className="graded-label">Grade</div>
                            <div className="graded-value grade">{submission.grade || "Not graded"}</div>
                          </div>
                        </div>
                        
                        <div className="graded-row full-width">
                          <div className="graded-column">
                            <div className="graded-label">Remarks</div>
                            <div className="graded-value remarks">{submission.remarks || "No remarks"}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-grading">
                    <span className="no-grading-icon">📊</span>
                    <p>No grading information available yet</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="submit-btn" onClick={() => navigate("/submitassignment")}>
                <span className="btn-icon">📝</span>
                <span className="btn-text">Submit Assignment</span>
              </button>
              <button className="close-modal-btn" onClick={closeModal}>
                <span className="btn-icon">❌</span>
                <span className="btn-text">Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Global Styles */
        :root {
          --primary-color: #3f51b5;
          --primary-light: #757de8;
          --primary-dark: #002984;
          --secondary-color: #ff9800;
          --success-color: #4caf50;
          --danger-color: #f44336;
          --warning-color: #ff9800;
          --info-color: #2196f3;
          --light-gray: #f5f5f5;
          --medium-gray: #e0e0e0;
          --dark-gray: #757575;
          --text-primary: #212121;
          --text-secondary: #757575;
          --border-radius: 8px;
          --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        /* Container */
        .assignments-container {
          padding: 2rem;
          background-color: #f8f9fa;
          min-height: 100vh;
          font-family: 'Roboto', 'Segoe UI', sans-serif;
          color: var(--text-primary);
        }

        /* Header */
        .assignments-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--medium-gray);
        }

        .assignments-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .assignments-header p {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }

        /* Actions Container */
        .assignments-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        /* Search */
        .search-container {
          position: relative;
          flex: 1;
          max-width: 500px;
        }

        .search-container input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: var(--border-radius);
          border: 1px solid var(--medium-gray);
          font-size: 1rem;
          transition: var(--transition);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        }

        .search-container input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--dark-gray);
        }

        /* Notification Button */
        .notification-btn {
          background-color: white;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          padding: 0.75rem 1.25rem;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
          box-shadow: var(--box-shadow);
        }

        .notification-btn:hover {
          background-color: var(--primary-color);
          color: white;
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        /* Assignments Grid */
        .assignments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* Assignment Card */
        .assignment-card {
          background-color: white;
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          cursor: pointer;
          border: 1px solid var(--medium-gray);
        }

        .assignment-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          padding: 1.25rem;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          max-width: 70%;
        }

        .status-badge {
          padding: 0.3rem 0.75rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.active {
          background-color: var(--success-color);
          color: white;
        }

        .status-badge.urgent {
          background-color: var(--warning-color);
          color: white;
        }

        .status-badge.overdue {
          background-color: var(--danger-color);
          color: white;
        }

        .status-badge.no-deadline {
          background-color: var(--info-color);
          color: white;
        }

        .card-details {
          padding: 1.25rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .detail-item:last-child {
          margin-bottom: 0;
        }

        .detail-icon {
          margin-right: 0.75rem;
          font-size: 1.1rem;
        }

        .detail-text {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .card-footer {
          padding: 1rem 1.25rem;
          background-color: var(--light-gray);
          border-top: 1px solid var(--medium-gray);
        }

        .view-details-btn {
          width: 100%;
          padding: 0.5rem;
          background-color: transparent;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
          border-radius: var(--border-radius);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }

        .view-details-btn:hover {
          background-color: var(--primary-color);
          color: white;
        }

        /* Empty State */
        .no-assignments {
          padding: 3rem;
          text-align: center;
        }

        .empty-state {
          background-color: white;
          padding: 3rem;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .empty-state p {
          color: var(--text-secondary);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .modal-content {
          background-color: white;
          border-radius: var(--border-radius);
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          padding: 1.5rem;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top-left-radius: var(--border-radius);
          border-top-right-radius: var(--border-radius);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: var(--transition);
        }

        .close-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .modal-body {
          padding: 1.5rem;
        }

        .assignment-details {
          margin-bottom: 2rem;
          background-color: var(--light-gray);
          padding: 1.5rem;
          border-radius: var(--border-radius);
        }

        .detail-row {
          display: flex;
          margin-bottom: 1rem;
          gap: 1.5rem;
        }

        .detail-row:last-child {
          margin-bottom: 0;
        }

        .detail-column {
          flex: 1;
        }

        .detail-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-value {
          font-size: 1rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        /* PDF Container */
        .pdf-container {
          margin-bottom: 2rem;
        }

        .pdf-container h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .pdf-item {
          margin-bottom: 1.5rem;
        }

        .pdf-item:last-child {
          margin-bottom: 0;
        }

        .pdf-info {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .pdf-icon {
          margin-right: 0.75rem;
          font-size: 1.1rem;
        }

        .pdf-name {
          font-weight: 500;
        }

        .pdf-frame {
          border: 1px solid var(--medium-gray);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
        }

        .no-files {
          text-align: center;
          padding: 2rem;
          background-color: var(--light-gray);
          border-radius: var(--border-radius);
        }

        .no-files-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        /* Grading Info */
        .grading-info {
          margin-bottom: 1.5rem;
        }

        .grading-info h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: var(--text-primary);
        }

        .graded-submissions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .graded-item {
          background-color: var(--light-gray);
          padding: 1.25rem;
          border-radius: var(--border-radius);
          border-left: 4px solid var(--primary-color);
        }

        .graded-row {
          display: flex;
          margin-bottom: 1rem;
          gap: 1.5rem;
        }

        .graded-row:last-child {
          margin-bottom: 0;
        }

        .graded-row.full-width .graded-column {
          flex: 1;
        }

        .graded-column {
          flex: 1;
        }

        .graded-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .graded-value {
          font-size: 1rem;
          color: var(--text-primary);
        }

        .graded-value.grade {
          font-weight: 700;
          color: var(--primary-color);
        }

        .graded-value.remarks {
          background-color: white;
          padding: 0.75rem;
          border-radius: var(--border-radius);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .no-grading {
          text-align: center;
          padding: 2rem;
          background-color: var(--light-gray);
          border-radius: var(--border-radius);
        }

        .no-grading-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        /* Modal Footer */
        .modal-footer {
          padding: 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          border-top: 1px solid var(--medium-gray);
        }

        .submit-btn, .close-modal-btn {
          padding: 0.75rem 1.5rem;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
        }

        .submit-btn {
          background-color: var(--primary-color);
          color: white;
          border: none;
        }

        .submit-btn:hover {
          background-color: var(--primary-dark);
        }

        .close-modal-btn {
          background-color: white;
          color: var(--danger-color);
          border: 1px solid var(--danger-color);
        }

        .close-modal-btn:hover {
          background-color: var(--danger-color);
          color: white;
        }

        /* Loading Spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid var(--light-gray);
          border-radius: 50%;
          border-top: 5px solid var(--primary-color);
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Media Queries */
        @media (max-width: 768px) {
          .assignments-container {
            padding: 1rem;
          }
          
          .assignments-header h1 {
            font-size: 2rem;
          }
          
          .assignments-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-container {
            max-width: 100%;
          }
          
          .modal-content {
            max-width: 95%;
            max-height: 85vh;
          }
          
          .detail-row {
            flex-direction: column;
            gap: 1rem;
          }
          
          .graded-row {
            flex-direction: column;
            gap: 1rem;
          }
          
          .modal-footer {
            flex-direction: column-reverse;
          }
          
          .submit-btn, .close-modal-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewAssignments;