// CreateQuiz.jsx
/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  
  
  
  const handleCreateQuiz = async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Error: No token found in localStorage');
      return;
    }
  
    console.log('Token being sent:', token); // Debugging
  
    try {
      const response = await axios.post(
        'http://localhost:5001/api/quiz/create',
        { title, questions, duration },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Quiz created:', response.data); // Debugging
      navigate('/creatorss');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error);
    }
  };
  


  return (
    <div>
      <h1>Create Quiz</h1>
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div>
        {questions.map((question, index) => (
          <div key={index}>
            <input
              type="text"
              name="questionText"
              placeholder="Question Text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(index, e)}
            />
            {question.options.map((option, i) => (
              <input
                key={i}
                type="text"
                name={`option-${i}`}
                placeholder={`Option ${i + 1}`}
                value={option}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].options[i] = e.target.value;
                  setQuestions(newQuestions);
                }}
              />
            ))}
            <select
              name="correctAnswer"
              value={question.correctAnswer}
              onChange={(e) => handleQuestionChange(index, e)}
            >
              {question.options.map((option, i) => (
                <option key={i} value={i}>
                  {` ${i + 1}`}
                </option>
              ))}
            </select>
            <button onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
          </div>
        ))}
      </div>
      <button onClick={handleAddQuestion}>Add Question</button>
      <input
        type="number"
        placeholder="Duration in minutes"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />
      <button onClick={handleCreateQuiz}>Create Quiz</button>
    </div>
  );
};

export default CreateQuiz;*/



/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0 },
  ]);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: No token found in localStorage');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/quiz/create',
        { title, questions, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Quiz created:', response.data);
      navigate('/creatorss');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar *//*}
      /*<div className="sidebar">
        <h2>Create Quiz</h2>
        <button className="create-quiz-button" onClick={handleAddQuestion}>Add Question</button>
      </div>

      {/* Content Area *//*}
      <div className="content-area">
        <h2>Quiz Details</h2>
        <div className="form-container">
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />

          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <input
                type="text"
                name="questionText"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, e)}
                className="input-field"
              />
              {question.options.map((option, i) => (
                <input
                  key={i}
                  type="text"
                  name={`option-${i}`}
                  placeholder={`Option ${i + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].options[i] = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  className="input-field"
                />
              ))}
              <select
                name="correctAnswer"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(index, e)}
                className="input-field"
              >
                {question.options.map((option, i) => (
                  <option key={i} value={i}>{`Option ${i + 1}`}</option>
                ))}
              </select>
              <button className="remove-button" onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
            </div>
          ))}

          <input
            type="number"
            placeholder="Duration in minutes"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="input-field"
          />
          <button className="create-quiz-button" onClick={handleCreateQuiz}>Create Quiz</button>
        </div>
      </div>

      {/* Inline CSS *//*}
      <style>
        {`
          .dashboard-container {
            display: flex;
            font-family: Arial, sans-serif;
          }
          
          .sidebar {
            width: 250px;
            height: 100vh;
            background-color: #2c3e50;
            color: white;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
          }

          .sidebar h2 {
            margin-bottom: 20px;
            font-size: 24px;
          }

          .create-quiz-button {
            padding: 10px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 20px;
          }

          .create-quiz-button:hover {
            background-color: #2980b9;
          }

          .content-area {
            flex-grow: 1;
            padding: 20px;
            background-color: #ecf0f1;
          }

          .form-container {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .input-field {
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
            margin-bottom: 10px;
            width: 100%;
          }

          .question-container {
            background-color: white;
            padding: 20px;
            margin: 10px 0;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          .remove-button {
            background-color: #e74c3c;
            color: white;
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
          }

          .remove-button:hover {
            background-color: #c0392b;
          }
        `}
      </style>
    </div>
  );
};

export default CreateQuiz;*/


/*import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(10);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      isCodingQuestion: false,
      starterCode: "",
      testCases: [{ input: "", expectedOutput: "" }],
    },
  ]);
  const navigate = useNavigate();

  // Handle changes in questions
  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  // Toggle between MCQ and coding question
  const handleQuestionTypeChange = (index) => {
    const newQuestions = [...questions];
    newQuestions[index].isCodingQuestion = !newQuestions[index].isCodingQuestion;

    // Reset fields when switching
    if (newQuestions[index].isCodingQuestion) {
      newQuestions[index].options = [];
      newQuestions[index].correctAnswer = "";
      newQuestions[index].starterCode = "";
      newQuestions[index].testCases = [{ input: "", expectedOutput: "" }];
    } else {
      newQuestions[index].options = ["", "", "", ""];
      newQuestions[index].correctAnswer = 0;
      newQuestions[index].starterCode = "";
      newQuestions[index].testCases = [];
    }

    setQuestions(newQuestions);
  };

  // Add a new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        isCodingQuestion: false,
        starterCode: "",
        testCases: [{ input: "", expectedOutput: "" }],
      },
    ]);
  };

  // Remove a question
  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  // Handle test case changes
  const handleTestCaseChange = (qIndex, tcIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].testCases[tcIndex][field] = value;
    setQuestions(newQuestions);
  };

  // Add a new test case
  const handleAddTestCase = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].testCases.push({ input: "", expectedOutput: "" });
    setQuestions(newQuestions);
  };

  // Remove a test case
  const handleRemoveTestCase = (qIndex, tcIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].testCases = newQuestions[qIndex].testCases.filter((_, i) => i !== tcIndex);
    setQuestions(newQuestions);
  };

  // Submit quiz
  const handleCreateQuiz = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error: No token found in localStorage");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/quiz/create",
        { title, questions, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Quiz created:", response.data);
      navigate("/creatorss");
    } catch (error) {
      console.error("Error creating quiz:", error.response?.data || error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Create Quiz</h2>
        <button className="create-quiz-button" onClick={handleAddQuestion}>
          Add Question
        </button>
      </div>

      <div className="content-area">
        <h2>Quiz Details</h2>
        <div className="form-container">
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />

          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <input
                type="text"
                name="questionText"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, e)}
                className="input-field"
              />

              {/* Toggle MCQ or Coding Question *//*}
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={question.isCodingQuestion}
                  onChange={() => handleQuestionTypeChange(index)}
                />
                Is Coding Question?
              </label>

              {/* Coding Question Section *//*}
              {question.isCodingQuestion ? (
                <>
                  <textarea
                    name="starterCode"
                    placeholder="Starter Code"
                    value={question.starterCode}
                    onChange={(e) => handleQuestionChange(index, e)}
                    className="input-field code-editor"
                  />
                  <h4>Test Cases</h4>
                  {question.testCases.map((testCase, tcIndex) => (
                    <div key={tcIndex} className="test-case">
                      <input
                        type="text"
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(e) =>
                          handleTestCaseChange(index, tcIndex, "input", e.target.value)
                        }
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Expected Output"
                        value={testCase.expectedOutput}
                        onChange={(e) =>
                          handleTestCaseChange(index, tcIndex, "expectedOutput", e.target.value)
                        }
                        className="input-field"
                      />
                      <button className="remove-button" onClick={() => handleRemoveTestCase(index, tcIndex)}>
                        Remove Test Case
                      </button>
                    </div>
                  ))}
                  <button className="create-quiz-button" onClick={() => handleAddTestCase(index)}>
                    Add Test Case
                  </button>
                </>
              ) : (
                // MCQ Section
                <>
                  {question.options.map((option, i) => (
                    <input
                      key={i}
                      type="text"
                      name={`option-${i}`}
                      placeholder={`Option ${i + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].options[i] = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      className="input-field"
                    />
                  ))}
                  <select
                    name="correctAnswer"
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(index, e)}
                    className="input-field"
                  >
                    {question.options.map((option, i) => (
                      <option key={i} value={i}>{`Option ${i + 1}`}</option>
                    ))}
                  </select>
                </>
              )}

              <button className="remove-button" onClick={() => handleRemoveQuestion(index)}>
                Remove Question
              </button>
            </div>
          ))}

          <input
            type="number"
            placeholder="Duration in minutes"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="input-field"
          />
          <button className="create-quiz-button" onClick={handleCreateQuiz}>
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;*/


/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswer: 0, isCoding: false, language: 'javascript', starterCode: '', testCases: [{ input: '', expectedOutput: '' }] }
  ]);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  /*const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };*/

  /*const handleQuestionChange = (index) => {
  
    const newQuestions = [...questions];
    newQuestions[index].isCodingQuestion = !newQuestions[index].isCodingQuestion;
    setQuestions(newQuestions);
  };
  

  const handleAddQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0, isCoding: false, language: 'javascript', starterCode: '', testCases: [{ input: '', expectedOutput: '' }] }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: No token found in localStorage');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/quiz/create',
        { title, questions, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Quiz created:', response.data);
      navigate('/creatorss');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Create Quiz</h2>
        <button className="create-quiz-button" onClick={handleAddQuestion}>Add Question</button>
      </div>

      <div className="content-area">
        <h2>Quiz Details</h2>
        <div className="form-container">
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />

          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <input
                type="text"
                name="questionText"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, e)}
                className="input-field"
              />
              <label>
                <input
                  type="checkbox"
                  checked={question.isCoding}
                  onChange={() => {
                    const newQuestions = [...questions];
                    newQuestions[index].isCoding = !newQuestions[index].isCoding;
                    setQuestions(newQuestions);
                  }}
                /> Is Coding Question?
              </label>
              {question.isCoding ? (
                <>
                  <select
                    value={question.language}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].language = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="input-field"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </select>
                  <textarea
                    placeholder="Starter Code"
                    value={question.starterCode}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].starterCode = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="input-field"
                  />
                  <h4>Test Cases</h4>
                  {question.testCases.map((testCase, i) => (
                    <div key={i}>
                      <input
                        type="text"
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].testCases[i].input = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="Expected Output"
                        value={testCase.expectedOutput}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].testCases[i].expectedOutput = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        className="input-field"
                      />
                    </div>
                  ))}
                </>
              ) : (
                question.options.map((option, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[i] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="input-field"
                  />
                ))
              )}
              <button className="remove-button" onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
            </div>
          ))}

          <input
            type="number"
            placeholder="Duration in minutes"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="input-field"
          />
          <button className="create-quiz-button" onClick={handleCreateQuiz}>Create Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;*/


/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      isCoding: false,
      language: 'javascript',
      starterCode: '',
      testCases: [{ input: '', expectedOutput: '' }],
    },
  ]);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        isCoding: false,
        language: 'javascript',
        starterCode: '',
        testCases: [{ input: '', expectedOutput: '' }],
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: No token found in localStorage');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/quiz/create',
        { title, questions, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Quiz created:', response.data);
      navigate('/creatorss');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar *//*/*}
      <div className="w-1/4 bg-gray-900 text-white p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddQuestion}
        >
          + Add Question
        </button>
      </div>

      {/* Main Content *//*}
      <div className="w-3/4 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Quiz Details</h2>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          {/* Quiz Title Input *//*}
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          {questions.map((question, index) => (
            <div key={index} className="bg-white p-4 rounded shadow-md mb-4">
              {/* Question Input *//*}
              <input
                type="text"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].questionText = e.target.value;
                  setQuestions(newQuestions);
                }}
                className="w-full p-2 border rounded mb-2"
              />

              {/* Coding Question Checkbox *//*}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={question.isCoding}
                  onChange={() => {
                    const newQuestions = [...questions];
                    newQuestions[index].isCoding = !newQuestions[index].isCoding;
                    setQuestions(newQuestions);
                  }}
                />
                <span>Is Coding Question?</span>
              </label>

              {question.isCoding ? (
                <>
                  {/* Language Selection *//*}
                  <select
                    value={question.language}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].language = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="w-full p-2 border rounded my-2"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </select>

                  {/* Starter Code Input *//*}
                  <textarea
                    placeholder="Starter Code"
                    value={question.starterCode}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].starterCode = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="w-full p-2 border rounded mb-2"
                  />

                  <h4 className="font-semibold mt-2">Test Cases</h4>
                  {question.testCases.map((testCase, i) => (
                    <div key={i} className="flex space-x-2 mt-2">
                      <input
                        type="text"
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].testCases[i].input = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        className="w-1/2 p-2 border rounded"
                      />
                      <input
                        type="text"
                        placeholder="Expected Output"
                        value={testCase.expectedOutput}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].testCases[i].expectedOutput = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        className="w-1/2 p-2 border rounded"
                      />
                    </div>
                  ))}
                </>
              ) : (
                question.options.map((option, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[i] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="w-full p-2 border rounded my-1"
                  />
                ))
              )}

              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={() => handleRemoveQuestion(index)}
              >
                Remove Question
              </button>
            </div>
          ))}

          {/* Quiz Duration Input *//*}
          <input
            type="number"
            placeholder="Duration in minutes"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-2 border rounded my-4"
          />

          {/* Create Quiz Button *//*}
          <button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateQuiz}
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;*/

/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      isCodingQuestion: false,
      language: 'javascript',
      starterCode: '',
      testCases: [{ input: '', expectedOutput: '' }],
    },
  ]);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        isCodingQuestion: false,
        language: 'javascript',
        starterCode: '',
        testCases: [{ input: '', expectedOutput: '' }],
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: No token found in localStorage');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/quiz/create',
        { title, questions, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Quiz created:', response.data);
      navigate('/creatorss');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar *//*}
      <div style={styles.sidebar}>
        <h2 style={styles.heading}>Create Quiz</h2>
        <button style={styles.addButton} onClick={handleAddQuestion}>
          + Add Question
        </button>
      </div>

      {/* Main Content *//** *//*}
      <div style={styles.content}>
        <h2 style={styles.heading}>Quiz Details</h2>

        <div style={styles.quizBox}>
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          {questions.map((question, index) => (
            <div key={index} style={styles.questionBox}>
              <input
                type="text"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].questionText = e.target.value;
                  setQuestions(newQuestions);
                }}
                style={styles.input}
              />

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={question.isCodingQuestion}
                  onChange={() => {
                    const newQuestions = [...questions];
                    newQuestions[index].isCodingQuestion = !newQuestions[index].isCodingQuestion;
                    setQuestions(newQuestions);
                  }}
                />
                <span>Is Coding Question?</span>
              </label>

              {question.isCodingQuestion ? (
                <>
                  <select
                    value={question.language}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].language = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={styles.input}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </select>

                  <textarea
                    placeholder="Starter Code"
                    value={question.starterCode}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].starterCode = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={styles.input}
                  />

                  <h4 style={styles.subHeading}>Test Cases</h4>
                  {question.testCases.map((testCase, i) => (
                    <div key={i} style={styles.testCaseBox}>
                      <input
                        type="text"
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].testCases[i].input = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        style={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="Expected Output"
                        value={testCase.expectedOutput}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].testCases[i].expectedOutput = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        style={styles.input}
                      />
                    </div>
                  ))}
                </>
              ) : (
                question.options.map((option, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[i] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={styles.input}
                  />
                ))
              )}

              <button style={styles.removeButton} onClick={() => handleRemoveQuestion(index)}>
                Remove Question
              </button>
            </div>
          ))}

          <input
            type="number"
            placeholder="Duration in minutes"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={styles.input}
          />

          <button style={styles.createButton} onClick={handleCreateQuiz}>
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline Styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    width: '25%',
    backgroundColor: '#2C3E50',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  addButton: {
    width: '100%',
    backgroundColor: '#3498DB',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  },
  content: {
    width: '75%',
    padding: '20px',
    overflowY: 'auto',
  },
  quizBox: {
    backgroundColor: '#F8F9FA',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  questionBox: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  subHeading: {
    fontSize: '18px',
    marginTop: '10px',
  },
  testCaseBox: {
    display: 'flex',
    gap: '10px',
  },
  removeButton: {
    width: '100%',
    backgroundColor: '#E74C3C',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
  createButton: {
    width: '100%',
    backgroundColor: '#27AE60',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default CreateQuiz;*/

/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      isCodingQuestion: false,
      language: 'javascript',
      starterCode: '',
      testCases: [{ input: '', expectedOutput: '' }],
    },
  ]);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        isCodingQuestion: false,
        language: 'javascript',
        starterCode: '',
        testCases: [{ input: '', expectedOutput: '' }],
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Error: No token found in localStorage');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5001/api/quiz/create',
        { title, questions, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Quiz created:', response.data);
      navigate('/creatorss');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar *//*}
      <div style={styles.sidebar}>
        <h2 style={styles.heading}>Create Quiz</h2>
        <button style={styles.addButton} onClick={handleAddQuestion}>
          + Add Question
        </button>
      </div>

      {/* Main Content *//*}
      <div style={styles.content}>
        <h2 style={styles.heading}>Quiz Details</h2>

        <div style={styles.quizBox}>
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          {questions.map((question, index) => (
            <div key={index} style={styles.questionBox}>
              <input
                type="text"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].questionText = e.target.value;
                  setQuestions(newQuestions);
                }}
                style={styles.input}
              />

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={question.isCodingQuestion}
                  onChange={() => {
                    const newQuestions = [...questions];
                    newQuestions[index].isCodingQuestion = !newQuestions[index].isCodingQuestion;

                    // Reset fields based on question type
                    if (newQuestions[index].isCodingQuestion) {
                      newQuestions[index].options = [];
                      newQuestions[index].correctAnswer = null;
                      newQuestions[index].starterCode = '';
                      newQuestions[index].testCases = [{ input: '', expectedOutput: '' }];
                    } else {
                      newQuestions[index].options = ['', '', '', ''];
                      newQuestions[index].correctAnswer = 0;
                      newQuestions[index].starterCode = undefined;
                      newQuestions[index].testCases = undefined;
                    }

                    setQuestions(newQuestions);
                  }}
                />
                <span>Is Coding Question?</span>
              </label>

              {question.isCodingQuestion ? (
                <>
                  <select
                    value={question.language}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].language = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={styles.input}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </select>

                  <textarea
                    placeholder="Starter Code"
                    value={question.starterCode}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].starterCode = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={styles.input}
                  />

                  <h4 style={styles.subHeading}>Test Cases</h4>
                  {question.testCases.map((testCase, i) => (
                    <div key={i} style={styles.testCaseBox}>
                      <input
                        type="text"
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].testCases[i].input = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        style={styles.input}
                      />
                      <input
                        type="text"
                        placeholder="Expected Output"
                        value={testCase.expectedOutput}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].testCases[i].expectedOutput = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        style={styles.input}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {question.options.map((option, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].options[i] = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      style={styles.input}
                    />
                  ))}

                  {/* Correct Answer Dropdown *//*}
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].correctAnswer = parseInt(e.target.value);
                      setQuestions(newQuestions);
                    }}
                    style={styles.input}
                  >
                    {question.options.map((_, i) => (
                      <option key={i} value={i}>
                        Option {i + 1}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <button style={styles.removeButton} onClick={() => handleRemoveQuestion(index)}>
                Remove Question
              </button>
            </div>
          ))}

          <input
            type="number"
            placeholder="Duration in minutes"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={styles.input}
          />

          <button style={styles.createButton} onClick={handleCreateQuiz}>
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles remain unchanged
const styles = { /* (Same styles as your original code) */ /*};

export default CreateQuiz;*/





/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      isCodingQuestion: false,
      language: 'javascript',
      starterCode: '',
      testCases: [{ input: '', expectedOutput: '' }],
    },
  ]);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        isCodingQuestion: false,
        language: 'javascript',
        starterCode: '',
        testCases: [{ input: '', expectedOutput: '' }],
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      console.log("Token being sent:", token); // 🔍 Debugging

      console.error('Error: No token found in localStorage');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/quiz/create',
        { title, questions, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Quiz created:', response.data);
      navigate('/updateCourse');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar *//*}
      <div style={{ width: '20%', backgroundColor: '#0d47a1', color: 'white', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Create Quiz</h2>
        <button style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }} onClick={handleAddQuestion}>
          + Add Question
        </button>
      </div>

      {/* Main Content *//*}
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Quiz Details</h2>
        <input type="text" placeholder="Quiz Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />

        {questions.map((question, index) => (
          <div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
            <input type="text" placeholder="Question Text" value={question.questionText} onChange={(e) => {
              const newQuestions = [...questions];
              newQuestions[index].questionText = e.target.value;
              setQuestions(newQuestions);
            }} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />

            <label style={{ display: 'block', marginBottom: '10px' }}>
              <input type="checkbox" checked={question.isCodingQuestion} onChange={() => {
                const newQuestions = [...questions];
                newQuestions[index].isCodingQuestion = !newQuestions[index].isCodingQuestion;
                if (newQuestions[index].isCodingQuestion) {
                  newQuestions[index].options = [];
                  newQuestions[index].correctAnswer = null;
                  newQuestions[index].starterCode = '';
                  newQuestions[index].testCases = [{ input: '', expectedOutput: '' }];
                } else {
                  newQuestions[index].options = ['', '', '', ''];
                  newQuestions[index].correctAnswer = 0;
                  newQuestions[index].starterCode = undefined;
                  newQuestions[index].testCases = undefined;
                }
                setQuestions(newQuestions);
              }} /> Is Coding Question?
            </label>

            {question.isCodingQuestion ? (
              <>
                <select value={question.language} onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].language = e.target.value;
                  setQuestions(newQuestions);
                }} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>

                <textarea placeholder="Starter Code" value={question.starterCode} onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].starterCode = e.target.value;
                  setQuestions(newQuestions);
                }} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />

                <h4>Test Cases</h4>
                {question.testCases.map((testCase, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <input type="text" placeholder="Input" value={testCase.input} onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].testCases[i].input = e.target.value;
                      setQuestions(newQuestions);
                    }} style={{ width: '45%', padding: '10px', marginRight: '10px' }} />
                    <input type="text" placeholder="Expected Output" value={testCase.expectedOutput} onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].testCases[i].expectedOutput = e.target.value;
                      setQuestions(newQuestions);
                    }} style={{ width: '45%', padding: '10px' }} />
                  </div>
                ))}
              </>
            ) : (
              <>
                {question.options.map((option, i) => (
                  <input key={i} type="text" placeholder={`Option ${i + 1}`} value={option} onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].options[i] = e.target.value;
                    setQuestions(newQuestions);
                  }} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                ))}
                <select value={question.correctAnswer} onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].correctAnswer = Number(e.target.value);
                  setQuestions(newQuestions);
                }} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
                  {question.options.map((option, i) => (
                    <option key={i} value={i}>{`Option ${i + 1}`}</option>
                  ))}
                </select>
              </>
            )}
            <button style={{ backgroundColor: 'red', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }} onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
          </div>
        ))}

        <input type="number" placeholder="Duration in minutes" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <button style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }} onClick={handleCreateQuiz}>Create Quiz</button>
      </div>
    </div>
  );
};

export default CreateQuiz;*/







/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      isCodingQuestion: false,
      language: 'javascript',
      starterCode: '',
      codingTestCases: [{ input: '', expectedOutput: '' }],
      timeLimit: 60, // Default time limit per question (in seconds)
    },
  ]);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        isCodingQuestion: false,
        language: 'javascript',
        starterCode: '',
        codingTestCases: [{ input: '', expectedOutput: '' }],
        timeLimit: 60,
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error('Error: No token found in localStorage');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/quiz/create',
        { title, questions, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Quiz created:', response.data);
      navigate('/updateCourse');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar *//*}
      <div style={{ width: '20%', backgroundColor: '#0d47a1', color: 'white', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Create Quiz</h2>
        <button
          style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
          onClick={handleAddQuestion}
        >
          + Add Question
        </button>
      </div>

      {/* Main Content *//*}
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Quiz Details</h2>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        {questions.map((question, index) => (
          <div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Question Text"
              value={question.questionText}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].questionText = e.target.value;
                setQuestions(newQuestions);
              }}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />

            <label style={{ display: 'block', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={question.isCodingQuestion}
                onChange={() => {
                  const newQuestions = [...questions];
                  newQuestions[index].isCodingQuestion = !newQuestions[index].isCodingQuestion;
                  if (newQuestions[index].isCodingQuestion) {
                    newQuestions[index].options = [];
                    newQuestions[index].correctAnswer = null;
                    newQuestions[index].starterCode = '';
                    newQuestions[index].codingTestCases = [{ input: '', expectedOutput: '' }];
                  } else {
                    newQuestions[index].options = ['', '', '', ''];
                    newQuestions[index].correctAnswer = 0;
                    newQuestions[index].starterCode = undefined;
                    newQuestions[index].codingTestCases = undefined;
                  }
                  setQuestions(newQuestions);
                }}
              /> Is Coding Question?
            </label>

            <label>
              Time Limit (seconds):
              <input
                type="number"
                value={question.timeLimit}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].timeLimit = Number(e.target.value);
                  setQuestions(newQuestions);
                }}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
            </label>

            {question.isCodingQuestion ? (
              <>
                <select
                  value={question.language}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].language = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>

                <textarea
                  placeholder="Starter Code"
                  value={question.starterCode}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].starterCode = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />

                <h4>Test Cases</h4>
                {question.codingTestCases.map((testCase, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Input"
                      value={testCase.input}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].codingTestCases[i].input = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      style={{ width: '45%', padding: '10px', marginRight: '10px' }}
                    />
                    <input
                      type="text"
                      placeholder="Expected Output"
                      value={testCase.expectedOutput}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].codingTestCases[i].expectedOutput = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      style={{ width: '45%', padding: '10px' }}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                {question.options.map((option, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[i] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                  />
                ))}
              </>
            )}
            <button onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
          </div>
        ))}

        <button onClick={handleCreateQuiz}>Create Quiz</button>
      </div>
    </div>
  );
};

export default CreateQuiz;*/






/*import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      isCodingQuestion: false,
      language: 'javascript',
      starterCode: '',
      timeLimit: 60,  // default 60 seconds
      codingTestCases: [{ input: '', expectedOutput: '' }],
    },
  ]);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        isCodingQuestion: false,
        language: 'javascript',
        starterCode: '',
        timeLimit: 60, // default value for each question
        codingTestCases: [{ input: '', expectedOutput: '' }],
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Error: No token found in localStorage');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/quiz/create',
        { title, questions, duration },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Quiz created:', response.data);
      navigate('/updateCourse');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar *//*}
      <div style={{ width: '20%', backgroundColor: '#0d47a1', color: 'white', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Create Quiz</h2>
        <button
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={handleAddQuestion}
        >
          + Add Question
        </button>
      </div>

      {/* Main Content *//*}
      <div style={{ flex: 1, padding: '20px' }}>
        <h2>Quiz Details</h2>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />

        {questions.map((question, index) => (
          <div key={index} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Question Text"
              value={question.questionText}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].questionText = e.target.value;
                setQuestions(newQuestions);
              }}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />

            <label style={{ display: 'block', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={question.isCodingQuestion}
                onChange={() => {
                  const newQuestions = [...questions];
                  newQuestions[index].isCodingQuestion = !newQuestions[index].isCodingQuestion;
                  if (newQuestions[index].isCodingQuestion) {
                    newQuestions[index].options = [];
                    newQuestions[index].correctAnswer = null;
                    newQuestions[index].starterCode = '';
                    newQuestions[index].codingTestCases = [{ input: '', expectedOutput: '' }];
                  } else {
                    newQuestions[index].options = ['', '', '', ''];
                    newQuestions[index].correctAnswer = 0;
                    newQuestions[index].starterCode = '';
                    newQuestions[index].codingTestCases = [];
                  }
                  setQuestions(newQuestions);
                }}
              />{' '}
              Is Coding Question?
            </label>

            {/* Time Limit (New Field) *//*}
            <input
              type="number"
              placeholder="Time Limit (seconds)"
              value={question.timeLimit}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].timeLimit = Number(e.target.value);
                setQuestions(newQuestions);
              }}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />

            {question.isCodingQuestion ? (
              <>
                <select
                  value={question.language}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].language = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>

                <textarea
                  placeholder="Starter Code"
                  value={question.starterCode}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].starterCode = e.target.value;
                    setQuestions(newQuestions);
                  }}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />

                <h4>Test Cases</h4>
                {question.codingTestCases.map((testCase, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Input"
                      value={testCase.input}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].codingTestCases[i].input = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      style={{ width: '45%', padding: '10px', marginRight: '10px' }}
                    />
                    <input
                      type="text"
                      placeholder="Expected Output"
                      value={testCase.expectedOutput}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].codingTestCases[i].expectedOutput = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      style={{ width: '45%', padding: '10px' }}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                {question.options.map((option, i) => (
                  <input
                    key={i}
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[i] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                  />
                ))}
                <select
                  value={question.correctAnswer}
                  onChange={(e) => {
                    const newQuestions = [...questions];
                    newQuestions[index].correctAnswer = Number(e.target.value);
                    setQuestions(newQuestions);
                  }}
                  style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                >
                  {question.options.map((option, i) => (
                    <option key={i} value={i}>{`Option ${i + 1}`}</option>
                  ))}
                </select>
              </>
            )}

            <button onClick={() => handleRemoveQuestion(index)}>Remove Question</button>
          </div>
        ))}

        <button onClick={handleCreateQuiz}>Create Quiz</button>
      </div>
    </div>
  );
};

export default CreateQuiz;*/




import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Inline CSS for simplicity
const styles = {
  container: {
    display: 'flex',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  sidebar: {
    width: '200px',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '20px',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  sidebarButton: {
    display: 'block',
    backgroundColor: 'transparent',
    color: '#fff',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    textAlign: 'left',
    margin: '10px 0',
  },
  content: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f9f9f9',
    overflowY: 'auto',
  },
  input: {
    width: '100%',
    padding: '8px',
    margin: '5px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  questionContainer: {
    marginBottom: '15px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
  },
  button: {
    padding: '10px 15px',
    margin: '10px 5px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    marginLeft: '5px',
  },
  textarea: {
    width: '100%',
    height: '80px',
    padding: '8px',
    margin: '5px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  select: {
    padding: '8px',
    margin: '5px 0',
    borderRadius: '4px',
  },
};

const CreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 1,
      isCodingQuestion: false,
      language: 'javascript',
      starterCode: '',
      timeLimit: 60,
      codingTestCases: [{ input: '', expectedOutput: '' }],
      expectedOutput: ''
    },
  ]);
  const [duration, setDuration] = useState(10);
  const navigate = useNavigate();

  const questionsSectionRef = useRef(null);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: 1,
        isCodingQuestion: false,
        language: 'javascript',
        starterCode: '',
        timeLimit: 60,
        codingTestCases: [{ input: '', expectedOutput: '' }],
        expectedOutput: ''
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateQuiz = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    const cleanedQuestions = questions.map(q => {
      if (q.isCodingQuestion) {
        return {
          ...q,
          correctAnswer: undefined,
          options: undefined,
          expectedOutput: q.codingTestCases.map(tc => tc.expectedOutput).join('\n')
        };
      } else {
        return {
          ...q,
          language: undefined,
          starterCode: undefined,
          codingTestCases: undefined,
          expectedOutput: undefined,
          correctAnswer: q.correctAnswer
        };
      }
    });

    const payload = {
      title,
      questions: cleanedQuestions,
      duration
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/quiz/create',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Quiz created:', response.data);
      navigate('/updateCourse');
    } catch (error) {
      console.error('Error creating quiz:', error.response?.data || error);
    }
  };

 /* const scrollToQuestions = () => {
    questionsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };*/

  return (
    <div style={styles.container}>
      {/* Sidebar */}
    

      {/* Main content */}
      <div style={styles.content}>
        <h2>Create Quiz</h2>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        

        {/* Questions Section */}
        <div ref={questionsSectionRef}>
          {questions.map((question, index) => (
            <div key={index} style={styles.questionContainer}>
              <input
                type="text"
                placeholder="Question Text"
                value={question.questionText}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].questionText = e.target.value;
                  setQuestions(newQuestions);
                }}
                style={styles.input}
              />
              <label>
                <input
                  type="checkbox"
                  checked={question.isCodingQuestion}
                  onChange={() => {
                    const newQuestions = [...questions];
                    newQuestions[index].isCodingQuestion = !newQuestions[index].isCodingQuestion;
                    setQuestions(newQuestions);
                  }}
                /> Coding Question?
              </label>

            {/* Time Limit */}
            <input
              type="number"
              placeholder="Time Limit (seconds)"
              value={question.timeLimit}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].timeLimit = Number(e.target.value);
                setQuestions(newQuestions);
              }}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
              {question.isCodingQuestion ? (
                <>
                  <select
                    value={question.language}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].language = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={styles.select}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </select>
                  <textarea
                    placeholder="Starter Code"
                    value={question.starterCode}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].starterCode = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    style={styles.textarea}
                  />
                  <h3>TEST CASE</h3>
                  {question.codingTestCases.map((testCase, i) => (
                    <div key={i}>
                      <input
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].codingTestCases[i].input = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        style={styles.input}
                      />
                      <input
                        placeholder="Expected Output"
                        value={testCase.expectedOutput}
                        onChange={(e) => {
                          const newQuestions = [...questions];
                          newQuestions[index].codingTestCases[i].expectedOutput = e.target.value;
                          setQuestions(newQuestions);
                        }}
                        style={styles.input}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {question.options.map((option, i) => (
                    <input
                      key={i}
                      placeholder={`Option ${i + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newQuestions = [...questions];
                        newQuestions[index].options[i] = e.target.value;
                        setQuestions(newQuestions);
                      }}
                      style={styles.input}
                    />
                  ))}
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].correctAnswer = Number(e.target.value);
                      setQuestions(newQuestions);
                    }}
                    style={styles.select}
                  >
                    {question.options.map((_, i) => (
                      <option key={i} value={i + 1}>Option {i + 1}</option>
                    ))}
                  </select>
                </>
              )}
              <button style={styles.removeButton} onClick={() => handleRemoveQuestion(index)}>Remove</button>
            </div>
          ))}
        </div>
        <button style={styles.button} onClick={handleAddQuestion}>
        + Add Question
        </button>
        {/* Add more navigation buttons if needed */}
      
        <button style={styles.button} onClick={handleCreateQuiz}>Create Quiz</button>
      </div>
    </div>
  );
};

export default CreateQuiz;







