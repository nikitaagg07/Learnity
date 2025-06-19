


/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await axios.get(`http://localhost:5000/api/quiz/${quizId}`);
      setQuiz(response.data);
    };

    fetchQuiz();
  }, [quizId]);

  // Handle changes for title and duration
  const handleChange = (e) => {
    setQuiz({
      ...quiz,
      [e.target.name]: e.target.value
    });
  };

  // Handle changes for question text
  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };

  // Handle changes for options inside questions
  const handleOptionChange = (e, questionIndex, optionIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuiz({
      ...quiz,
      questions: updatedQuestions
    });
  };

  // Handle quiz update
  const handleUpdateQuiz = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/quiz/edit/${quizId}`,
        quiz,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      navigate('/creates');
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  return (
    <div className="edit-quiz-container">
      <h1>Edit Quiz</h1>
      {quiz && (
        <>
          {/* Edit Title *//*}
          <div className="form-group">
            <label htmlFor="title">Quiz Title</label>
            <input
              type="text"
              id="title"
              value={quiz.title}
              name="title"
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Edit Questions *//*}
          <div className="questions-container">
            {quiz.questions.map((question, qIndex) => (
              <div key={qIndex} className="question-group">
                {/* Edit Question Text *//*}
                <div className="form-group">
                  <label htmlFor={`questionText-${qIndex}`}>Question Text</label>
                  <input
                    type="text"
                    id={`questionText-${qIndex}`}
                    name="questionText"
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(e, qIndex)}
                    className="input-field"
                  />
                </div>

                {/* Edit Options *//*}
                <div className="options-container">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="form-group">
                      <label htmlFor={`option-${oIndex}`}>{`Option ${oIndex + 1}`}</label>
                      <input
                        type="text"
                        id={`option-${oIndex}`}
                        name={`option-${oIndex}`}
                        value={option}
                        onChange={(e) => handleOptionChange(e, qIndex, oIndex)}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>

                {/* Edit Correct Answer *//*}
                <div className="form-group">
                  <label htmlFor={`correctAnswer-${qIndex}`}>Correct Answer</label>
                  <select
                    id={`correctAnswer-${qIndex}`}
                    name="correctAnswer"
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(e, qIndex)}
                    className="input-field"
                  >
                    {question.options.map((option, i) => (
                      <option key={i} value={i}>
                        {`Option ${i + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Duration *//*}
          <div className="form-group">
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={quiz.duration}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Update Button *//*}
          <button onClick={handleUpdateQuiz} className="update-button">Update Quiz</button>
        </>
      )}
      <style>
        {`
          .edit-quiz-container {
            padding: 20px;
            background-color: #ecf0f1;
            font-family: Arial, sans-serif;
          }

          h1 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-group label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .input-field {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            font-size: 1rem;
            border-radius: 5px;
            border: 1px solid #ccc;
            box-sizing: border-box;
          }

          .questions-container {
            margin-top: 20px;
          }

          .question-group {
            padding: 15px;
            background-color: white;
            margin-bottom: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          .options-container {
            margin-top: 10px;
          }

          .update-button {
            background-color: #3498db;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            font-size: 1rem;
            margin-top: 20px;
          }

          .update-button:hover {
            background-color: #2980b9;
          }
        `}
      </style>
    </div>
  );
};

export default EditQuiz;*/





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await axios.get(`http://localhost:5000/api/quiz/${quizId}`);
      const updatedQuestions = response.data.questions.map(q => ({
        ...q,
        correctAnswer: q.correctAnswer - 1  // 1-based to 0-based
      }));

      setQuiz({ ...response.data, questions: updatedQuestions });
    };

    fetchQuiz();
  }, [quizId]);

  const handleChange = (e) => {
    setQuiz({
      ...quiz,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (e, index) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index][e.target.name] = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleTestCaseChange = (qIndex, tIndex, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].codingTestCases[tIndex][field] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addTestCase = (qIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].codingTestCases.push({ input: '', expectedOutput: '' });
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const removeTestCase = (qIndex, tIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].codingTestCases.splice(tIndex, 1);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleUpdateQuiz = async () => {
    const preparedQuiz = {
      ...quiz,
      questions: quiz.questions.map((q) => {
        if (q.isCodingQuestion) {
          return {
            ...q,
            correctAnswer: undefined,
            expectedOutput: q.codingTestCases.map(tc => tc.expectedOutput).join('\n'),
          };
        } else {
          return {
            ...q,
            correctAnswer: q.correctAnswer + 1  // Convert back to 1-based
          };
        }
      }),
    };

    try {
      await axios.put(
        `http://localhost:5000/api/quiz/edit/${quizId}`,
        preparedQuiz,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate('/creates');
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Edit Quiz</h1>
      {quiz && (
        <>
          <div style={styles.formGroup}>
            <label style={styles.label}>Quiz Title</label>
            <input
              type="text"
              name="title"
              value={quiz.title}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {quiz.questions.map((question, qIndex) => (
            <div key={qIndex} style={styles.questionGroup}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Question Text</label>
                <input
                  type="text"
                  name="questionText"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(e, qIndex)}
                  style={styles.input}
                />
              </div>

              {question.isCodingQuestion ? (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Time Limit (seconds)</label>
                    <input
                      type="number"
                      name="timeLimit"
                      value={question.timeLimit}
                      onChange={(e) => handleQuestionChange(e, qIndex)}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Language</label>
                    <select
                      name="language"
                      value={question.language}
                      onChange={(e) => handleQuestionChange(e, qIndex)}
                      style={styles.input}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Starter Code</label>
                    <textarea
                      name="starterCode"
                      value={question.starterCode}
                      onChange={(e) => handleQuestionChange(e, qIndex)}
                      style={styles.textarea}
                    />
                  </div>

                  <div>
                    <h4 style={styles.subHeading}>Test Cases</h4>
                    {question.codingTestCases.map((testCase, tIndex) => (
                      <div key={tIndex} style={styles.testCaseGroup}>
                        <input
                          type="text"
                          placeholder="Input"
                          value={testCase.input}
                          onChange={(e) =>
                            handleTestCaseChange(qIndex, tIndex, 'input', e.target.value)
                          }
                          style={styles.input}
                        />
                        <input
                          type="text"
                          placeholder="Expected Output"
                          value={testCase.expectedOutput}
                          onChange={(e) =>
                            handleTestCaseChange(qIndex, tIndex, 'expectedOutput', e.target.value)
                          }
                          style={styles.input}
                        />
                        <button onClick={() => removeTestCase(qIndex, tIndex)} style={styles.button}>
                          Remove Test Case
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addTestCase(qIndex)} style={styles.button}>+ Add Test Case</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Time Limit (seconds)</label>
                    <input
                      type="number"
                      value={question.timeLimit}
                      name="timeLimit"
                      onChange={(e) => handleQuestionChange(e, qIndex)}
                      style={styles.input}
                    />
                  </div>

                  <div>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} style={styles.formGroup}>
                        <label style={styles.label}>{`Option ${oIndex + 1}`}</label>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const updatedQuestions = [...quiz.questions];
                            updatedQuestions[qIndex].options[oIndex] = e.target.value;
                            setQuiz({ ...quiz, questions: updatedQuestions });
                          }}
                          style={styles.input}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Correct Answer</label>
                    <select
                      name="correctAnswer"
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(e, qIndex)}
                      style={styles.input}
                    >
                      {question.options.map((_, i) => (
                        <option key={i} value={i}>{`Option ${i + 1}`}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          ))}

          <button onClick={handleUpdateQuiz} style={styles.updateButton}>
            Update Quiz
          </button>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    marginBottom: '5px',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '8px',
  },
  button: {
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    margin: '5px 0',
  },
  updateButton: {
    padding: '10px 15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  testCaseGroup: {
    marginBottom: '10px',
  },
};

export default EditQuiz;



