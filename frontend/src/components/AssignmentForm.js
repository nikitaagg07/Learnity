// import React, { useState } from "react";
// import axios from "axios";
// import "./AssignmentForm.css";

// const AssignmentForm = () => {
//   const [form, setForm] = useState({
//     title: "",
//     section: "",
//     description: "",
//     totalMarks: "",
//     lastDate: "",
//     maxWords: "",
//     instructions: "",
//     dueDate: "",
//     cutOffDate: "",
//     enableResubmission: false,
//     ruleBasedDay: "",
//     notifications: {
//       notifyGradersOnSubmission: false,
//       notifyGradersOnLateSubmission: false,
//       reminderToGrade: "",
//     },
//   });

//   const [files, setFiles] = useState([]);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name.startsWith("notifications.")) {
//       setForm((prev) => ({
//         ...prev,
//         notifications: {
//           ...prev.notifications,
//           [name.split(".")[1]]: type === "checkbox" ? checked : value,
//         },
//       }));
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!form.title) newErrors.title = "Title is required";
//     if (!form.section) newErrors.section = "Section is required";
//     if (!form.totalMarks) newErrors.totalMarks = "Total marks are required";
//     if (!form.lastDate) newErrors.lastDate = "Last date is required";
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     const data = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       if (typeof value === "object") {
//         Object.entries(value).forEach(([subKey, subValue]) => {
//           data.append(`notifications.${subKey}`, subValue);
//         });
//       } else {
//         data.append(key, value);
//       }
//     });
//     files.forEach((file) => data.append("supportFiles", file));

//     try {
//       await axios.post("http://localhost:5000/api/assignments/create", data);
//       alert("Assignment created!");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to create assignment.");
//     }
//   };

//   return (
//     <form className="assignment-form" onSubmit={handleSubmit}>
//       <input name="title" placeholder="Title" onChange={handleChange} />
//       {errors.title && <span className="error">{errors.title}</span>}

//       <input name="section" placeholder="Section" onChange={handleChange} />
//       {errors.section && <span className="error">{errors.section}</span>}

//       <textarea name="description" placeholder="Description" onChange={handleChange} />
//       <input name="totalMarks" type="number" placeholder="Total Marks" onChange={handleChange} />
//       {errors.totalMarks && <span className="error">{errors.totalMarks}</span>}

//       <input name="lastDate" type="date" onChange={handleChange} />
//       {errors.lastDate && <span className="error">{errors.lastDate}</span>}

//       <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />

//       <button type="submit">Create Assignment</button>
//     </form>
//   );
// };

// export default AssignmentForm;
// import React, { useState } from "react";
// import axios from "axios";

// const AssignmentForm = () => {
//   const [form, setForm] = useState({
//     title: "",
//     section: "",
//     totalMarks: "",
//     date: "",
//     description: "",
//     maxWords: "",
//     instructions: "",
//     cutOffDate: "",
//     enableResubmission: false,
//   });

//   const [files, setFiles] = useState([]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prevForm) => ({
//       ...prevForm,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setFiles([...e.target.files]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = new FormData();
//     Object.entries(form).forEach(([key, value]) => {
//       if (key === "date" || key === "cutOffDate") {
//         data.append(key, value ? new Date(value).toISOString() : "");
//       } else {
//         data.append(key, value);
//       }
//     });

//     files.forEach((file) => {
//       data.append("supportFiles", file);
//     });

//     try {
//       await axios.post("http://localhost:5000/api/assignments/create", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("✅ Assignment created successfully!");
//     } catch (error) {
//       console.error("❌ Error creating assignment:", error);
//       alert("❌ Assignment creation failed.");
//     }
//   };

//   return (
//     <div style={{
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       minHeight: "100vh",
//       background: "linear-gradient(120deg, #89f7fe, #66a6ff)"
//     }}>
//       <form onSubmit={handleSubmit} style={{
//         width: "450px",
//         padding: "30px",
//         background: "white",
//         borderRadius: "15px",
//         boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
//         textAlign: "center"
//       }}>
//         <h2 style={{ 
//           color: "#333", 
//           fontSize: "24px", 
//           marginBottom: "15px" 
//         }}>📝 Create Assignment</h2>

//         <input name="title" placeholder="📌 Title" onChange={handleChange} required style={inputStyle} />
//         <input name="section" placeholder="📚 Section" onChange={handleChange} required style={inputStyle} />
//         <input name="totalMarks" type="number" placeholder="🎯 Total Marks" onChange={handleChange} required style={inputStyle} />
//         <input name="date" type="date" onChange={handleChange} required style={inputStyle} />
//         <textarea name="description" placeholder="📝 Description" onChange={handleChange} style={textareaStyle}></textarea>
//         <input name="maxWords" type="number" placeholder="📖 Max Words" onChange={handleChange} style={inputStyle} />
//         <textarea name="instructions" placeholder="📜 Instructions" onChange={handleChange} style={textareaStyle}></textarea>
//         <input name="cutOffDate" type="date" onChange={handleChange} style={inputStyle} />

//         <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
//           <input type="checkbox" name="enableResubmission" onChange={handleChange} />
//           Enable Resubmission
//         </label>

//         <input type="file" multiple onChange={handleFileChange} style={{
//           display: "block",
//           margin: "10px auto",
//           padding: "8px",
//           borderRadius: "5px",
//           border: "1px solid #ccc"
//         }} />

//         <button type="submit" style={buttonStyle}>🚀 Create Assignment</button>
//       </form>
//     </div>
//   );
// };

// const inputStyle = {
//   width: "100%",
//   padding: "10px",
//   margin: "8px 0",
//   borderRadius: "8px",
//   border: "1px solid #ccc",
//   fontSize: "16px",
//   transition: "0.3s",
//   outline: "none",
//   boxShadow: "0px 4px 10px rgba(0,0,0,0.1)"
// };

// const textareaStyle = {
//   ...inputStyle,
//   minHeight: "80px",
//   resize: "none"
// };

// const buttonStyle = {
//   width: "100%",
//   padding: "12px",
//   border: "none",
//   borderRadius: "8px",
//   backgroundColor: "#28a745",
//   color: "white",
//   fontSize: "18px",
//   fontWeight: "bold",
//   cursor: "pointer",
//   transition: "0.3s",
//   marginTop: "10px",
//   boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"
// };

// export default AssignmentForm;

import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignmentFormAndReview = () => {
  const [form, setForm] = useState({
    title: "",
    section: "",
    totalMarks: "",
    date: "",
    description: "",
    maxWords: "",
    instructions: "",
    cutOffDate: "",
    enableResubmission: false,
  });

  const [files, setFiles] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [grade, setGrade] = useState("");

  // Fetch assignments for review
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/submissions");
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchSubmissions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "date" || key === "cutOffDate") {
        data.append(key, value ? new Date(value).toISOString() : "");
      } else {
        data.append(key, value);
      }
    });

    files.forEach((file) => {
      data.append("supportFiles", file);
    });

    try {
      await axios.post("http://localhost:5000/api/assignments/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Assignment created successfully!");
    } catch (error) {
      console.error("❌ Error creating assignment:", error);
      alert("❌ Assignment creation failed.");
    }
  };

  const handleRemarkSubmit = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/submissions/remark/${id}`, {
        remarks,
        grade,
        gradedBy: "Instructor Name", // Change this dynamically if needed
      });
      alert("✅ Remark added successfully!");
      setRemarks("");
      setGrade("");
    } catch (error) {
      console.error("❌ Error adding remark:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>📝 Create Assignment</h2>
        <form onSubmit={handleSubmitAssignment} style={styles.form}>
          <input name="title" placeholder="📌 Title" onChange={handleChange} required style={styles.input} />
          <input name="section" placeholder="📚 Section" onChange={handleChange} required style={styles.input} />
          <input name="totalMarks" type="number" placeholder="🎯 Total Marks" onChange={handleChange} required style={styles.input} />
          <input name="date" type="date" onChange={handleChange} required style={styles.input} />
          <textarea name="description" placeholder="📝 Description" onChange={handleChange} style={styles.textarea}></textarea>
          <input name="maxWords" type="number" placeholder="📖 Max Words" onChange={handleChange} style={styles.input} />
          <textarea name="instructions" placeholder="📜 Instructions" onChange={handleChange} style={styles.textarea}></textarea>
          <input name="cutOffDate" type="date" onChange={handleChange} style={styles.input} />
          
          <label style={styles.checkboxLabel}>
            <input type="checkbox" name="enableResubmission" onChange={handleChange} />
            Enable Resubmission
          </label>

          <input type="file" multiple onChange={handleFileChange} style={styles.fileInput} />
          <button type="submit" style={styles.submitButton}>🚀 Create Assignment</button>
        </form>
      </div>

      {/* Review Submissions Section */}
      <div style={styles.reviewContainer}>
        <h2 style={styles.header}>👨‍🏫 Review Submissions</h2>
        {submissions.length === 0 ? (
          <p>No submissions found.</p>
        ) : (
          <ul style={styles.submissionList}>
            {submissions.map((submission) => (
              <li key={submission._id} style={styles.submissionItem}>
                <strong>{submission.studentName}</strong> - 
                <a href={`http://localhost:5000/uploads/${submission.submittedFile}`} target="_blank" rel="noopener noreferrer" style={styles.link}>
                  View File
                </a>
                <button onClick={() => setSelectedSubmission(submission)} style={styles.reviewButton}>Review</button>
              </li>
            ))}
          </ul>
        )}

        {selectedSubmission && (
          <div style={styles.reviewForm}>
            <h3>Review Submission</h3>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks"
              style={styles.textarea}
            />
            <input
              type="number"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="Grade"
              style={styles.input}
            />
            <button onClick={() => handleRemarkSubmit(selectedSubmission._id)} style={styles.submitButton}>Submit Remark</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Styling
const styles = {
  container: {
    display: "flex",
    justifyContent: "space-around",
    padding: "20px",
    background: "linear-gradient(120deg, #89f7fe, #66a6ff)",
  },
  formContainer: {
    width: "45%",
    padding: "30px",
    background: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  header: {
    color: "#333",
    fontSize: "24px",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    transition: "0.3s",
    outline: "none",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    background: "#f9f9f9",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    transition: "0.3s",
    outline: "none",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    background: "#f9f9f9",
    resize: "none",
    minHeight: "80px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
  },
  fileInput: {
    display: "block",
    margin: "10px auto",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#28a745",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
    marginTop: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
  },
  reviewContainer: {
    width: "45%",
    padding: "30px",
    background: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
    marginTop: "20px",
  },
  submissionList: {
    listStyle: "none",
    paddingLeft: 0,
  },
  submissionItem: {
    marginBottom: "10px",
    padding: "10px",
    background: "#f0f8ff",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
  reviewButton: {
    padding: "8px 16px",
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },
  reviewForm: {
    marginTop: "20px",
  },
};

export default AssignmentFormAndReview;