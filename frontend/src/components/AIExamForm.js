import React, { useState } from "react";
import AIExamService from "../services/AIExamService";
import { Container, Form, Button, Row, Col, Card, Alert } from "react-bootstrap";

const courseCategories = ['Programming', 'Design', 'Marketing'];
const courseLevelOptions = ['Beginner', 'Intermediate', 'Advanced'];
const languageOptions = ['English', 'Spanish', 'French'];

const AIExamForm = () => {
  const [examData, setExamData] = useState({
    title: "",
    category: "",
    difficulty: "Easy",
    description: "",
    duration: "", // Keep as string for easy binding with the input
    totalMarks: "",
    questions: [],
    createdBy: "65a7f9c3d4e9f700149d3e27", // Example User ID (Replace dynamically)
  });

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData({
      ...examData,
      [name]: name === "duration" || name === "totalMarks" ? parseInt(value, 10) || "" : value,
    });
  };

  // Handle question options change
  const handleQuestionChange = (e, index) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = e.target.value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  // Add a new question
  const addQuestion = () => {
    if (
      !newQuestion.questionText ||
      !newQuestion.correctAnswer ||
      newQuestion.options.includes("") // Ensure options are filled
    ) {
      alert("Please fill in all question details before adding!");
      return;
    }

    setExamData({
      ...examData,
      questions: [...examData.questions, newQuestion],
    });

    setNewQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !examData.title ||
      !examData.category ||
      !examData.description ||
      !examData.duration ||
      !examData.totalMarks
    ) {
      alert("Please fill in all required fields before submitting.");
      return;
    }

    if (examData.questions.length === 0) {
      alert("Please add at least one question before submitting.");
      return;
    }

    // Ensure that duration and totalMarks are numbers
    const formattedExamData = {
      ...examData,
      duration: parseInt(examData.duration, 10),
      totalMarks: parseInt(examData.totalMarks, 10),
      // Filter out empty options before submitting
      questions: examData.questions.map((q) => ({
        ...q,
        options: q.options.filter((option) => option.trim() !== ""),
      })),
    };

    try {
      console.log("Exam Data being sent:", formattedExamData);
      await AIExamService.createExam(formattedExamData);
      alert("AI Exam created successfully!");

      setExamData({
        title: "",
        category: "",
        difficulty: "Easy",
        description: "",
        duration: "",
        totalMarks: "",
        questions: [],
        createdBy: "65a7f9c3d4e9f700149d3e27", // Example User ID (Reset)
      });
    } catch (error) {
      console.error("Error creating AI exam:", error.response ? error.response.data : error.message);
      alert("Failed to create AI Exam. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Create AI Exam</h2>

      <Form onSubmit={handleSubmit}>
        {/* Exam Details Section */}
        <Card className="mb-4 p-3 shadow-sm">
          <Card.Body>
            <h4>Exam Details</h4>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Exam Title</Form.Label>
                  <Form.Control type="text" name="title" value={examData.title} onChange={handleChange} required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Control type="text" name="category" value={examData.category} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Difficulty Level</Form.Label>
                  <Form.Select name="difficulty" value={examData.difficulty} onChange={handleChange}>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" name="description" value={examData.description} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control type="number" name="duration" value={examData.duration} onChange={handleChange} required />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Total Marks</Form.Label>
                  <Form.Control type="number" name="totalMarks" value={examData.totalMarks} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Add Questions Section */}
        <Card className="mb-4 p-3 shadow-sm">
          <Card.Body>
            <h4>Add Questions</h4>

            <Form.Group className="mb-3">
              <Form.Label>Question Text</Form.Label>
              <Form.Control type="text" value={newQuestion.questionText} onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })} required />
            </Form.Group>

            <Row className="mb-3">
              {newQuestion.options.map((option, index) => (
                <Col md={6} key={index}>
                  <Form.Group>
                    <Form.Label>Option {index + 1}</Form.Label>
                    <Form.Control type="text" value={option} onChange={(e) => handleQuestionChange(e, index)} required />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Correct Answer</Form.Label>
              <Form.Control type="text" value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Explanation</Form.Label>
              <Form.Control type="text" value={newQuestion.explanation} onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })} />
            </Form.Group>

            <Button variant="outline-primary" onClick={addQuestion}>
              Add Question
            </Button>
          </Card.Body>
        </Card>

        <Button variant="primary" type="submit" className="w-100 mt-4">
          Submit Exam
        </Button>
      </Form>
    </Container>
  );
};

export default AIExamForm;
