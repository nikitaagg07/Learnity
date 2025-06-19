import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Collapse, Typography, Box, Button
} from '@mui/material';

const InstructorList = ({ instructors, fetchInstructorCourses, onBack }) => {
    const [expandedRow, setExpandedRow] = useState(null);
    const [instructorCoursesMap, setInstructorCoursesMap] = useState({});

    const handleRowClick = async (instructor) => {
        const isExpanded = expandedRow === instructor._id;
        setExpandedRow(isExpanded ? null : instructor._id);

        if (!isExpanded && !instructorCoursesMap[instructor._id]) {
            const courses = await fetchInstructorCourses(instructor._id);
            setInstructorCoursesMap(prev => ({ ...prev, [instructor._id]: courses }));
        }
    };

    return (
        <>
            <Button onClick={onBack} variant="outlined" sx={{ mb: 2 }}>
                ← Back to User Management
            </Button>
            <Typography variant="h6" gutterBottom>View Instructors</Typography>
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
                            <TableCell>Mobile</TableCell>
                            <TableCell>Qualification</TableCell>
                            <TableCell>Experience</TableCell>
                            <TableCell>No. of Courses Added</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {instructors.map((inst) => (
                            <React.Fragment key={inst._id}>
                                <TableRow hover style={{ cursor: 'pointer' }} onClick={() => handleRowClick(inst)}>
                                    <TableCell>{inst.name}</TableCell>
                                    <TableCell>{inst.email}</TableCell>
                                    <TableCell>{inst.mobile}</TableCell>
                                    <TableCell>{inst.qualification}</TableCell>
                                    <TableCell>{inst.experience}</TableCell>
                                    <TableCell>{inst.courseCount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ p: 0 }}>
                                        <Collapse in={expandedRow === inst._id} timeout="auto" unmountOnExit>
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
                                                    Courses Added
                                                </Typography>
                                                <Table size="small" sx={{ 
                                                    marginLeft: 2,
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
                                                            <TableCell>Course</TableCell>
                                                            <TableCell>Category</TableCell>
                                                            <TableCell>Level</TableCell>
                                                            <TableCell>Price</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell>Created Date</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {(instructorCoursesMap[inst._id] || []).map((course, idx) => (
                                                            <TableRow key={idx}>
                                                                <TableCell>{course.title}</TableCell>
                                                                <TableCell>{course.category}</TableCell>
                                                                <TableCell>{course.level}</TableCell>
                                                                <TableCell>{course.price ? `₹${course.price}` : 'N/A'}</TableCell>
                                                                <TableCell>{course.status?.charAt(0).toUpperCase() + course.status?.slice(1)}</TableCell>
                                                                <TableCell>
                                                                    {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                                                                </TableCell>
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

export default InstructorList;
