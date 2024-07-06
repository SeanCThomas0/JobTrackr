import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AddApplicationForm from './AddApplicationForm';

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
    }
  };

  const handleAddApplication = async (newApplication: Omit<Application, 'id'>) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/applications', newApplication, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApplications();
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add application', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Job Application Tracker
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Cancel' : 'Add Application'}
      </Button>
      {showAddForm && <AddApplicationForm onSubmit={handleAddApplication} />}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.company}</TableCell>
                <TableCell>{app.position}</TableCell>
                <TableCell>{app.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Dashboard;