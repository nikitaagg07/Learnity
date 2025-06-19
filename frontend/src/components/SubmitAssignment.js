
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const SubmitAssignment = () => {
//   const [form, setForm] = useState({ studentName: "" });
//   const [file, setFile] = useState(null);
//   const [assignments, setAssignments] = useState([]);
//   const [selectedAssignment, setSelectedAssignment] = useState("");

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/assignments/all");
//         setAssignments(response.data);
//       } catch (error) {
//         console.error("Error fetching assignments:", error);
//         alert("Failed to load assignments.");
//       }
//     };
//     fetchAssignments();
//   }, []);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.studentName || !selectedAssignment || !file) {
//       alert("Please fill all fields before submitting.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("studentName", form.studentName);
//     formData.append("assignmentTitle", selectedAssignment);
//     formData.append("submittedFile", file);

//     try {
//       await axios.post("http://localhost:5000/api/submissions/submit", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Assignment submitted successfully!");
//       setFile(null);
//       setSelectedAssignment("");
//       setForm({ studentName: "" });
//     } catch (error) {
//       console.error("Submission error:", error);
//       alert("Failed to submit assignment.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-blue-500">
//       <div className="w-full max-w-lg p-10 bg-white bg-opacity-30 backdrop-blur-md shadow-2xl rounded-2xl border border-white border-opacity-40 text-white text-center">
//         <h2 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">🚀 Submit Your Assignment</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <input
//             type="text"
//             name="studentName"
//             placeholder="Enter your name"
//             value={form.studentName}
//             onChange={(e) => setForm({ ...form, studentName: e.target.value })}
//             required
//             className="w-full p-4 rounded-lg bg-white bg-opacity-30 text-white border border-white placeholder-white focus:ring-4 focus:ring-yellow-400 focus:outline-none"
//           />
//           <select
//             value={selectedAssignment}
//             onChange={(e) => setSelectedAssignment(e.target.value)}
//             required
//             className="w-full p-4 rounded-lg bg-white bg-opacity-30 text-white border border-white focus:ring-4 focus:ring-green-400 focus:outline-none"
//           >
//             <option value="" className="text-black">📜 Select Assignment</option>
//             {assignments.length > 0 ? (
//               assignments.map((assignment) => (
//                 <option key={assignment._id} value={assignment.title} className="text-black">
//                   {assignment.title}
//                 </option>
//               ))
//             ) : (
//               <option disabled className="text-black">Loading assignments...</option>
//             )}
//           </select>
//           <input
//             type="file"
//             onChange={handleFileChange}
//             required
//             className="w-full p-4 rounded-lg bg-white bg-opacity-30 text-white border border-white focus:ring-4 focus:ring-pink-400 focus:outline-none"
//           />
//           <button
//             type="submit"
//             className="w-full bg-yellow-400 hover:bg-yellow-500 transition-all duration-200 text-gray-900 font-bold py-4 rounded-lg shadow-md transform hover:scale-110 hover:shadow-xl hover:text-white hover:bg-gradient-to-r from-purple-500 to-yellow-400"
//           >
//             📤 Submit Now!
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubmitAssignment;
import axios from "axios";

const React = require("react");
const { useState, useEffect } = React;

const { toast, ToastContainer } = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
require("./SubmitAssignment.css");

const SubmitAssignment = () => {
  const [form, setForm] = useState({ studentName: "" });
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/assignments/all");
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
        toast.error("❌ Failed to load assignments.");
      }
    };
    fetchAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentName || !selectedAssignment || !file) {
      toast.warning("⚠️ Please fill all fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("studentName", form.studentName);
    formData.append("assignmentTitle", selectedAssignment);
    formData.append("file", file);
    

    try {
      await axios.post("http://localhost:5000/api/submissions/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Assignment submitted successfully!");
      setFile(null);
      setSelectedAssignment("");
      setForm({ studentName: "" });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("❌ Failed to submit assignment.");
    }
  };

  return React.createElement(
    "div",
    { className: "submit-container" },
    React.createElement(
      "form",
      { className: "submit-form", onSubmit: handleSubmit },
      React.createElement("h2", { className: "form-title" }, "🚀 Submit Your Assignment"),
      React.createElement("input", {
        type: "text",
        name: "studentName",
        placeholder: "🎓 Enter your name",
        value: form.studentName,
        onChange: (e) => setForm({ ...form, studentName: e.target.value }),
        required: true,
      }),
      React.createElement(
        "select",
        {
          value: selectedAssignment,
          onChange: (e) => setSelectedAssignment(e.target.value),
          required: true,
        },
        React.createElement("option", { value: "" }, "📜 Select Assignment"),
        assignments.map((assignment) =>
          React.createElement(
            "option",
            { key: assignment._id, value: assignment.title },
            assignment.title
          )
        )
      ),
      React.createElement("input", {
        type: "file",
        onChange: handleFileChange,
        required: true,
      }),
      React.createElement("button", { type: "submit" }, "📤 Submit Now!")
    ),
    React.createElement(ToastContainer, { position: "top-right", autoClose: 3000 })
  );
};

export default SubmitAssignment;
