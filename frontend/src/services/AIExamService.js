import axios from "axios";

const API_URL = "http://localhost:5000/api/exams";

const AIExamService = {
  createExam: async (examData) => {
    const response = await axios.post(API_URL, examData);
    return response.data;
  },
  getAllExams: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  getExamById: async (examId) => {
    const response = await axios.get(`${API_URL}/${examId}`);
    return response.data;
  },
  updateExam: async (examId, updatedData) => {
    const response = await axios.put(`${API_URL}/${examId}`, updatedData);
    return response.data;
  },
  deleteExam: async (examId) => {
    const response = await axios.delete(`${API_URL}/${examId}`);
    return response.data;
  },
};

export default AIExamService;
