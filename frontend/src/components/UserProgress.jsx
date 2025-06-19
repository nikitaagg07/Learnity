import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProgress = ({ userId, courseId }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/progress/${userId}/${courseId}`)
      .then(response => {
        setProgress(response.data);
      })
      .catch(error => {
        console.error("Error fetching progress:", error);
      });
  }, [userId, courseId]);

  if (!progress) return <p>Loading progress...</p>;

  return (
    <div>
      <h3>Your Progress</h3>
      <p>Completed Lessons: {progress.completedLessons.join(", ") || "None"}</p>
      <h4>Notes:</h4>
      <ul>
        {Object.entries(progress.notes || {}).map(([lesson, note]) => (
          <li key={lesson}>Lesson {lesson}: {note}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProgress;
