const AIExam = require("../models/AIExam");

// Create an AI Exam
exports.createAIExam = async (req, res) => {
    try {
        const { title, description, duration, totalMarks, questions, createdBy } = req.body;

        if (!title || !description || !duration || !totalMarks || !questions || !createdBy) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newExam = new AIExam({ title, description, duration, totalMarks, questions, createdBy });
        await newExam.save();
        res.status(201).json(newExam);
    } catch (error) {
        console.error("Error creating AI Exam:", error);
        res.status(500).json({ message: "An error occurred while creating the exam" });
    }
};

// Get all AI Exams
exports.getAllAIExams = async (req, res) => {
    try {
        const exams = await AIExam.find();
        res.status(200).json(exams);
    } catch (error) {
        console.error("Error fetching AI Exams:", error);
        res.status(500).json({ message: "An error occurred while fetching exams" });
    }
};

// Get a single AI Exam by ID
exports.getExamById = async (req, res) => {
    try {
        const exam = await AIExam.findById(req.params.examId);
        if (!exam) return res.status(404).json({ message: "Exam not found" });
        res.status(200).json(exam);
    } catch (error) {
        console.error("Error fetching exam:", error);
        res.status(500).json({ message: "An error occurred while fetching the exam" });
    }
};

// Update an AI Exam
exports.updateExam = async (req, res) => {
    try {
        const updatedExam = await AIExam.findByIdAndUpdate(req.params.examId, req.body, { new: true });
        if (!updatedExam) return res.status(404).json({ message: "Exam not found" });
        res.status(200).json(updatedExam);
    } catch (error) {
        console.error("Error updating exam:", error);
        res.status(500).json({ message: "An error occurred while updating the exam" });
    }
};

// Delete an AI Exam
exports.deleteExam = async (req, res) => {
    try {
        const deletedExam = await AIExam.findByIdAndDelete(req.params.examId);
        if (!deletedExam) return res.status(404).json({ message: "Exam not found" });
        res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
        console.error("Error deleting exam:", error);
        res.status(500).json({ message: "An error occurred while deleting the exam" });
    }
};
