import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const submitForm = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
};

export const fetchCourses = async () => {
  return (await axios.get(`${API_URL}/courses`)).data;
};

/*export const fetchEnrolledCourses = async (learnerId) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/learners/enrolled/${learnerId}`);
    setEnrolledCourses(response.data);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    setLoading(false);
  }
};*/


export const enrollInCourse = async (learnerId, courseId) => {
  return (await axios.post(`${API_URL}/learners/enroll`, { learnerId, courseId })).data;
};
