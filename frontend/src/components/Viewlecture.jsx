import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Viewlecture = () => {
  const [lectures, setLectures] = useState([]);
  const [timers, setTimers] = useState({});
  useEffect(() => {
    const fetchLectures = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const lectureRes = await axios.get('http://localhost:5000/api/lecture/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLectures(lectureRes.data);
      } catch (error) {
        console.error('Error fetching lectures:', error);
      }
    };
    fetchLectures();
  }, []);


  useEffect(() => {
    const countdowns = {};
    lectures.forEach((lecture) => {
      countdowns[lecture._id] = setInterval(() => {
        const now = new Date().getTime();
        const lectureTime = new Date(`${lecture.date}T${lecture.time}`).getTime();
        const difference = lectureTime - now;

        if (difference <= 0) {
          clearInterval(countdowns[lecture._id]);
          setTimers((prev) => ({ ...prev, [lecture._id]: 'Lecture Started!' }));
        } else {
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / (1000 * 60)) % 60);
          const seconds = Math.floor((difference / 1000) % 60);
          setTimers((prev) => ({ ...prev, [lecture._id]: `${hours}h ${minutes}m ${seconds}s` }));
        }
      }, 1000);
    });

    return () => Object.values(countdowns).forEach(clearInterval);
  }, [lectures]);

  const handleStartLecture = (meetingLink) => {
    window.open(meetingLink, '_blank');
  };
  

  return (
    <div className="lecture-container">
      <h2>Scheduled Lectures</h2>
      <ul className="lecture-list">
        {lectures.map((lecture) => (
          <li key={lecture._id} className="lecture-item">
            <div className="lecture-title">{lecture.topic}</div>
            <div>Date: {lecture.date}</div>
            <div>Time: {lecture.time}</div>
            <div className="countdown">Time Left: {timers[lecture._id] || 'Calculating...'}</div>
            <button className="action-button start" onClick={() => handleStartLecture(lecture.meetingLink)}>Start Lecture</button>

          </li>
        ))}
      </ul>

      <style>
        {`
          .lecture-container {
            margin-top: 20px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          .lecture-list {
            list-style-type: none;
            padding: 0;
          }

          .lecture-item {
            background-color: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          .lecture-title {
            font-size: 18px;
            font-weight: bold;
          }

          .countdown {
            font-size: 14px;
            color: #e74c3c;
            margin-top: 5px;
          }

          .action-button {
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px;
            color: white;
            font-size: 14px;
          }

          .start {
            background-color: #2ecc71;
          }

          .start:hover {
            background-color: #27ae60;
          }
        `}
      </style>
    </div>
  );
};

export default Viewlecture;