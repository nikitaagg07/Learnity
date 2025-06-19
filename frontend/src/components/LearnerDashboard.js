// src/components/LearnerDashboard.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Badge, ProgressBar, Alert } from 'react-bootstrap';
import axios from 'axios';
import RecommendedCourses from './RecommendationsPage';
// import EnrolledCoursesList from './EnrolledCoursesList';

const LearnerDashboard = () => {
  const [learner, setLearner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressStats, setProgressStats] = useState({
    inProgress: 0,
    completed: 0,
    notStarted: 0
  });

  // Get learner ID from auth context or localStorage
  const learnerId = localStorage.getItem('learnerId') || '123456789012'; // Example ID

  useEffect(() => {
    const fetchLearnerData = async () => {
      try {
        setLoading(true);
        
        // Fetch learner profile
        const learnerResponse = await axios.get(`/api/learner/${learnerId}`);
        setLearner(learnerResponse.data);
        
        // Fetch progress data
        const progressResponse = await axios.get(`/api/user/progress?user_id=${learnerId}`);
        
        // Calculate progress statistics
        const progress = progressResponse.data.progress || [];
        const stats = {
          inProgress: progress.filter(p => p.status === 'in_progress').length,
          completed: progress.filter(p => p.status === 'completed').length,
          notStarted: progress.filter(p => p.status === 'not_started').length
        };
        
        setProgressStats(stats);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching learner data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchLearnerData();
  }, [learnerId]);

  if (loading) {
    return <div className="text-center my-5">Loading dashboard...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="dashboard-container my-5">
      <Row className="mb-4">
        <Col>
          <h1>Welcome back, {learner?.name || 'Learner'}!</h1>
          <p className="text-muted">Continue your learning journey</p>
        </Col>
      </Row>

      {/* Learning Progress Stats */}
      <Row className="mb-5">
        <Col md={4} className="mb-3">
          <Card className="h-100 dashboard-stat-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <h1 className="display-4 text-primary mb-0">{progressStats.inProgress}</h1>
              <p className="text-muted mb-0">Courses in Progress</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 dashboard-stat-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <h1 className="display-4 text-success mb-0">{progressStats.completed}</h1>
              <p className="text-muted mb-0">Courses Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100 dashboard-stat-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <h1 className="display-4 text-info mb-0">
                {progressStats.inProgress + progressStats.completed + progressStats.notStarted}
              </h1>
              <p className="text-muted mb-0">Total Enrolled Courses</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Advanced Personalized Recommendations */}
      <section className="mb-5">
        <RecommendedCourses learnerId={learnerId} limit={4} advanced={true} />
      </section>

      {/* Main Dashboard Content */}
      <Tabs defaultActiveKey="enrolled" className="mb-4">
        <Tab eventKey="enrolled" title="My Courses">
          {/* <EnrolledCoursesList learnerId={learnerId} /> */}
        </Tab>
        <Tab eventKey="recommended" title="More Recommendations">
          <section className="py-4">
            <RecommendedCourses learnerId={learnerId} limit={8} />
          </section>
        </Tab>
        <Tab eventKey="bookmarks" title="Bookmarked">
          <section className="py-4">
            {/* Bookmarked courses component would go here */}
            <p>Your bookmarked courses will appear here.</p>
          </section>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default LearnerDashboard;