import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Creators = () => {
  const [quizzes, setQuizzes] = useState([]);
 // const [lectures, setLectures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log("Token being sent:", token); // 🔍 Debugging

      console.error('Error: No token found in localStorage');
        return;
      }
      try {
        const quizRes = await axios.get('http://localhost:5000/api/quiz/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        /*const lectureRes = await axios.get('http://localhost:5000/api/lecture/creator', {
          headers: { Authorization: `Bearer ${token}` }
        });*/
        setQuizzes(quizRes.data);
        //setLectures(lectureRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  //const handleCreateQuiz = () => navigate('/create-quiz');
  //const handleScheduleLecture = () => navigate('/lecture');
  const handleEditQuiz = (quizId) => navigate(`/edit-quiz/${quizId}`);
  //const handleStartLecture = (lectureId) => navigate(`/meeting/${lectureId}`);
  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/quiz/delete/${quizId}`, {
        //headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Creator Dashboard</h2>
        
       
      </div>

      {/* Content Area */}
      <div className="content-area">
        <h2>My Quizzes</h2>
        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="quiz-item">
              <div className="quiz-title">{quiz.title}</div>
              <div>Questions: {quiz.questions.length}</div>
              <div>Duration: {quiz.duration} mins</div>
              <button className="action-button edit" onClick={() => handleEditQuiz(quiz._id)}>Edit</button>
              <button className="action-button delete" onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
            </li>
          ))}
        </ul>

       
      </div>

      {/* Styling */}
      <style>
        {`
          .dashboard-container {
            display: flex;
            height: 100vh;
            background-color: #ecf0f1;
          }

          .sidebar {
            width: 250px;
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .sidebar h2 {
            font-size: 22px;
            margin-bottom: 20px;
          }

          .dashboard-button {
            width: 90%;
            padding: 10px;
            margin-top: 10px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
          }

          .dashboard-button:hover {
            background-color: #2980b9;
          }

          .content-area {
            flex-grow: 1;
            padding: 20px;
          }

          .quiz-list, .lecture-list {
            list-style-type: none;
            padding: 0;
          }

          .quiz-item, .lecture-item {
            background-color: white;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          .quiz-title, .lecture-title {
            font-size: 18px;
            font-weight: bold;
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

          .edit {
            background-color: #f39c12;
          }
          .edit:hover {
            background-color: #e67e22;
          }

          .delete {
            background-color: #e74c3c;
          }
          .delete:hover {
            background-color: #c0392b;
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

export default Creators;
