import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import * as faceapi from 'face-api.js';
import {
  Box, Container, Paper, Typography, Radio, RadioGroup,
  FormControlLabel, FormControl, Button, LinearProgress,
  Card, CardContent, Grid, Alert, Divider, MenuItem,CircularProgress,
  Select, InputLabel, FormHelperText, Chip, Fade,
  Stepper, Step, StepLabel, useTheme
} from '@mui/material';
import {
  ArrowBack, ArrowForward, PlayArrow, Check, Warning, Timer
} from '@mui/icons-material';

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(60);
  const [warningCount, setWarningCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [codeRunning, setCodeRunning] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState('info');

  const { quizId } = useParams();
  const [code, setCode] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [redirectPath, setRedirectPath] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const videoRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const streamRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [timePercentage, setTimePercentage] = useState(100);

  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [redirectPath, navigate]);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/quiz/${quizId}`);
        setQuiz(response.data);
        setTimer(response.data.questions[0]?.timeLimit || 60);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setAlertMessage('Failed to load quiz. Please try again later.');
        setAlertSeverity('error');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Start timer for current question
  useEffect(() => {
    if (!quiz) return;
    
    const maxTime = quiz.questions[currentQuestionIndex]?.timeLimit || 60;
    
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          // Auto move to next question or submit at the end
          if (currentQuestionIndex < quiz?.questions.length - 1) {
            nextQuestion();
          } else {
            handleSubmit();
          }
          return 0;
        }
        // Calculate percentage for progress bar
        const percentage = (prevTimer - 1) / maxTime * 100;
        setTimePercentage(percentage);
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex, quiz]);

  // Initialize proctoring
  useEffect(() => {
    const startProctoring = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri(process.env.PUBLIC_URL + "/models");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        setAlertMessage("Webcam access is required for AI proctoring.");
        setAlertSeverity('warning');
        setRedirectPath('/');
        return;
      }

      detectionIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState !== 4) return;
        
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
        );

        if (detections.length === 0 || detections.length > 1) {
          setWarningCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              setAlertMessage("Quiz terminated due to AI proctoring violations.");
              setAlertSeverity('error');
              stopCamera();
              setRedirectPath('/dash');
            } else {
              setAlertMessage(`Warning ${newCount}/3: ${detections.length === 0 
                ? "No face detected" 
                : "Multiple faces detected"}. Please stay in front of the camera alone.`);
              setAlertSeverity('warning');
            }
            return newCount;
          });
        }
      }, 5000);
    };
    
    startProctoring();
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleAnswerChange = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz?.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      const nextQuestion = quiz.questions[nextIndex];
  
      setCurrentQuestionIndex(nextIndex);
      setTimer(nextQuestion?.timeLimit || 60);
      setTimePercentage(100);
  
      if (nextQuestion.isCodingQuestion) {
        setCode(nextQuestion.starterCode || "");
        setTestCases(nextQuestion.codingTestCases || []);
      } else {
        setCode("");
        setTestCases([]);
      }
      
      // Clear any existing alerts
      setAlertMessage(null);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      const prevQuestion = quiz.questions[prevIndex];

      setCurrentQuestionIndex(prevIndex);
      setTimer(prevQuestion?.timeLimit || 60);
      setTimePercentage(100);

      if (prevQuestion.isCodingQuestion) {
        setCode(prevQuestion.starterCode || "");
        setTestCases(prevQuestion.codingTestCases || []);
      } else {
        setCode("");
        setTestCases([]);
      }
      
      // Clear any existing alerts
      setAlertMessage(null);
    }
  };

  const handleRunCode = async () => {
    setOutput("");
    setCodeRunning(true);

    if (selectedLanguage === "javascript") {
      try {
        let capturedOutput = "";

        // Override console.log to capture output
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          capturedOutput += args.join(" ") + "\n";
          originalConsoleLog(...args);
        };

        // Wrap code in an IIFE
        const wrappedCode = `
          (function() {
            ${code}
          })();
        `;

        // Execute wrapped code
        new Function(wrappedCode)();

        // Restore console.log after execution
        console.log = originalConsoleLog;

        setOutput(capturedOutput.trim() || "Execution completed, but no output.");
        const totalCases = testCases.length;
        let passedCases = testCases.filter(test => test.passed).length;
        let calculatedScore = (passedCases / totalCases) * 100;
        
        setAlertMessage("Code executed successfully");
        setAlertSeverity("success");
      } catch (error) {
        setOutput(`Error: ${error.message}`);
        setAlertMessage(`Execution error: ${error.message}`);
        setAlertSeverity("error");
      } finally {
        setCodeRunning(false);
      }
    } else {
      // Python, C++, etc. - Call backend
      try {
        const response = await axios.post("http://localhost:5000/api/quiz/run-code", {
          language: selectedLanguage,
          code: code
        });

        setOutput(response.data.stdout || response.data.stderr || "No output");
        
        if (response.data.stderr) {
          setAlertMessage("Code execution completed with errors");
          setAlertSeverity("warning");
        } else {
          setAlertMessage("Code executed successfully");
          setAlertSeverity("success");
        }
      } catch (error) {
        console.error("Error executing code:", error);
        setOutput("Error executing code.");
        setAlertMessage("Failed to execute code");
        setAlertSeverity("error");
      } finally {
        setCodeRunning(false);
      }
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setAlertMessage('You must be logged in to submit the quiz.');
      setAlertSeverity('error');
      return;
    }

    // Format answers for submission
    let formattedAnswers = Object.keys(answers).map(index => ({
      questionId: index,
      selectedOption: answers[index]
    }));

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/attempts",
        { quizId, answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/scorecard/${response.data.attemptId}`);
    } catch (error) {
      console.error('Error submitting quiz:', error.response?.data || error.message);
      setAlertMessage(error.response?.data?.message || 'Error submitting quiz.');
      setAlertSeverity('error');
      setLoading(false);
    }
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  if (loading && !quiz) {
    return (
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading quiz...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {alertMessage && (
        <Fade in={!!alertMessage}>
          <Alert 
            severity={alertSeverity} 
            sx={{ mb: 3 }}
            onClose={() => setAlertMessage(null)}
          >
            {alertMessage}
          </Alert>
        </Fade>
      )}

      <Paper elevation={3} sx={{ p: 3, position: 'relative', overflow: 'hidden' }}>
        {/* Timer Progress Bar */}
        <LinearProgress 
          variant="determinate" 
          value={timePercentage} 
          color={timePercentage > 50 ? "primary" : timePercentage > 25 ? "warning" : "error"}
          sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4 }}
        />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              {quiz?.title}
            </Typography>
            
            {/* Stepper for question navigation */}
            <Box sx={{ mb: 4, display: { xs: 'none', sm: 'block' } }}>
              <Stepper activeStep={currentQuestionIndex} alternativeLabel>
                {quiz?.questions.map((_, index) => (
                  <Step key={index}>
                    <StepLabel></StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <Timer sx={{ mr: 1, color: timer <= 10 ? 'error.main' : 'info.main' }} />
              <Typography 
                variant="h6" 
                color={timer <= 10 ? 'error' : 'textPrimary'}
              >
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 1 }}>
              <video
                ref={videoRef}
                autoPlay
                style={{
                  width: '200px',
                  height: '150px',
                  borderRadius: '8px',
                  border: `2px solid ${theme.palette.primary.main}`,
                  objectFit: 'cover'
                }}
              ></video>
              {warningCount > 0 && (
                <Chip 
                  icon={<Warning />} 
                  label={`Warnings: ${warningCount}/3`} 
                  color="warning" 
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {currentQuestion && (
          <Fade in={!!currentQuestion}>
            <Card variant="outlined" sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </Typography>
                
                <Typography variant="body1" paragraph sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                  {currentQuestion.questionText}
                </Typography>

                {!currentQuestion.isCodingQuestion ? (
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={answers[currentQuestionIndex] !== undefined ? answers[currentQuestionIndex] : ''}
                      onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
                    >
                      {currentQuestion.options.map((option, index) => (
                        <FormControlLabel
                          key={index}
                          value={index}
                          control={<Radio color="primary" />}
                          label={option}
                          sx={{
                            p: 1,
                            mb: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            transition: 'all 0.2s',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                            ...(answers[currentQuestionIndex] === index && {
                              bgcolor: 'action.selected',
                              borderColor: 'primary.main',
                            }),
                          }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                ) : (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Coding Question
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <FormControl variant="outlined" size="small" sx={{ minWidth: 200, mb: 2 }}>
                        <InputLabel id="language-select-label">Language</InputLabel>
                        <Select
                          labelId="language-select-label"
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          label="Language"
                        >
                          <MenuItem value="javascript">JavaScript</MenuItem>
                          <MenuItem value="python3">Python</MenuItem>
                          <MenuItem value="cpp17">C++</MenuItem>
                        </Select>
                        <FormHelperText>Select your preferred coding language</FormHelperText>
                      </FormControl>
                      
                      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                        <CodeMirror
                          value={code}
                          height="250px"
                          extensions={[javascript()]}
                          theme={oneDark}
                          onChange={(value) => setCode(value)}
                        />
                      </Box>
                      
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={codeRunning || !code.trim()}
                        onClick={handleRunCode}
                        startIcon={<PlayArrow />}
                        sx={{ mt: 2 }}
                      >
                        {codeRunning ? 'Running...' : 'Run Code'}
                      </Button>
                    </Box>
                    
                    {/* Test Cases Section */}
                    {testCases.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Test Cases
                        </Typography>
                        <Grid container spacing={2}>
                          {testCases.map((testCase, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                              <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Test Case {index + 1}
                                  </Typography>
                                  <Box sx={{ my: 1 }}>
                                    <Typography variant="body2">
                                      <strong>Input:</strong> {testCase.input}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2">
                                      <strong>Expected Output:</strong> {testCase.expectedOutput}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                    
                    {/* Output Section */}
                    {output && (
                      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, fontFamily: 'monospace' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Output:
                        </Typography>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                          {output}
                        </pre>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Fade>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < (quiz?.questions.length - 1) ? (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={nextQuestion}
            >
              Next Question
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              endIcon={<Check />}
              onClick={handleSubmit}
            >
              Submit Quiz
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default QuizPage;