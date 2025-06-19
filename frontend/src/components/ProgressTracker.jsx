import React, { useState } from "react";
import axios from "axios";

const ProgressTracker = ({ userId, courseId }) => {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [notes, setNotes] = useState("");

  const handleSaveProgress = () => {
    axios.post("http://localhost:5000/api/progress", {
      userId,
      courseId,
      lessonIndex,
      notes,
    })
    .then(response => {
      alert("Progress saved!");
    })
    .catch(error => {
      console.error("Error saving progress:", error);
    });
  };

  return (
    <div>
      <h3>Track Your Progress</h3>
      <input
        type="number"
        placeholder="Lesson Index"
        value={lessonIndex}
        onChange={(e) => setLessonIndex(Number(e.target.value))}
      />
      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button onClick={handleSaveProgress}>Save Progress</button>
    </div>
  );
};

export default ProgressTracker;
