import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button
} from '@mui/material';

const AdminList = ({ admins, onBack }) => {
  return (
    <>
      <Button onClick={onBack} variant="outlined" sx={{ mb: 2 }}>
        ← Back to User Management
      </Button>
      <Typography variant="h6" gutterBottom>View Admins</Typography>
      <TableContainer component={Paper}>
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
              <TableCell>Admin ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin._id} hover>
                <TableCell>{admin.AdminID}</TableCell>
                <TableCell>{admin.name}</TableCell>
                <TableCell>{admin.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default AdminList;
