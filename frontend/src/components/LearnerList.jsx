// import React from 'react';
// import {
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Button, Typography
// } from '@mui/material';

// const LearnerList = ({ learners, onViewLearner, onBack }) => {
//   return (
//     <>
//       <Button onClick={onBack} variant="outlined" sx={{ mb: 2 }}>
//         ← Back to User Management
//       </Button>
//       <Typography variant="h6" gutterBottom>View Learners</Typography>
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>No. of Courses Enrolled</TableCell>
//               <TableCell>Total Amount Paid</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {learners.map((learner) => (
//               <TableRow key={learner._id} onClick={() => onViewLearner(learner)} style={{ cursor: 'pointer' }}>
//                 <TableCell>{learner.name}</TableCell>
//                 <TableCell>{learner.email}</TableCell>
//                 <TableCell>{learner.courseCount}</TableCell>
//                 <TableCell>₹{learner.totalAmountPaid}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </>
//   );
// };

// export default LearnerList;


import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Collapse, Typography, Box, Button
} from '@mui/material';

const LearnerList = ({ learners, fetchLearnerCourses, onBack }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [learnerCoursesMap, setLearnerCoursesMap] = useState({});

  const handleRowClick = async (learner) => {
    const isExpanded = expandedRow === learner._id;
    setExpandedRow(isExpanded ? null : learner._id);

    if (!isExpanded && !learnerCoursesMap[learner._id]) {
      const courses = await fetchLearnerCourses(learner._id);
      setLearnerCoursesMap(prev => ({ ...prev, [learner._id]: courses }));
    }
  };

  return (
    <>
      <Button onClick={onBack} variant="outlined" sx={{ mb: 2 }}>
        ← Back to User Management
      </Button>
      <Typography variant="h6" gutterBottom>View Learners</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ 
                backgroundColor: '#e3f2fd',
                '& th': {
                    color: '#1565c0',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    borderBottom: '2px solid #90caf9'
                }
            }}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>No. of Courses Enrolled</TableCell>
              <TableCell>Total Amount Paid</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {learners.map((learner) => (
              <React.Fragment key={learner._id}>
                <TableRow hover style={{ cursor: 'pointer' }} onClick={() => handleRowClick(learner)}>
                  <TableCell>{learner.name}</TableCell>
                  <TableCell>{learner.email}</TableCell>
                  <TableCell>{learner.courseCount}</TableCell>
                  <TableCell>₹{learner.totalAmountPaid}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} sx={{ p: 0 }}>
                    <Collapse in={expandedRow === learner._id} timeout="auto" unmountOnExit>
                      <Box
                        sx={{
                          margin: 1,
                          padding: 2,
                          backgroundColor: '#f0f7ff',
                          borderRadius: 2,
                          border: '1px solid #90caf9',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom style={{ fontWeight: 'bold', color: '#1976d2' }}>
                          Enrolled Courses
                        </Typography>
                        <Table size="small" sx={{ 
                          backgroundColor: 'white',
                          borderRadius: 1,
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                          <TableHead>
                            <TableRow sx={{ 
                                backgroundColor: '#fff3e0',
                                '& th': {
                                    color: '#e65100',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    borderBottom: '1px solid #ffb74d',
                                    padding: '8px 16px'
                                }
                            }}>
                              <TableCell>Course Name</TableCell>
                              <TableCell>Amount Paid</TableCell>
                              <TableCell>Joining Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(learnerCoursesMap[learner._id] || []).map((course, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{course.courseName}</TableCell>
                                <TableCell>₹{course.amount}</TableCell>
                                <TableCell>{new Date(course.joiningDate).toLocaleDateString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LearnerList;
