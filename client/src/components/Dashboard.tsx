import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ApplicationForm from './ApplicationForm';

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  notes: string;
}

interface ApplicationStats {
  total: number;
  applied: number;
  rejected: number;
  accepted: number;
}

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ApplicationStats>({ total: 0, applied: 0, rejected: 0, accepted: 0 });

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setApplications(response.data);
        calculateStats(response.data);
      } else {
        console.error('Unexpected response data:', response.data);
        setError('Failed to fetch applications. Unexpected response format.');
      }
    } catch (error) {
      console.error('Failed to fetch applications', error);
      setError('Failed to fetch applications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (apps: Application[]) => {
    const newStats = apps.reduce((acc, app) => {
      acc.total++;
      acc[app.status.toLowerCase() as keyof ApplicationStats]++;
      return acc;
    }, { total: 0, applied: 0, rejected: 0, accepted: 0 } as ApplicationStats);
    setStats(newStats);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAddApplication = () => {
    setCurrentApplication(null);
    setIsFormOpen(true);
  };

  const handleEditApplication = (application: Application) => {
    setCurrentApplication(application);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentApplication(null);
  };

  const handleFormSubmit = async () => {
    await fetchApplications();
    handleCloseForm();
  };

  const handleDeleteApplication = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchApplications();
    } catch (error) {
      console.error('Failed to delete application', error);
      setError('Failed to delete application. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Job Applications
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddApplication} style={{ marginBottom: '20px' }}>
        Add Application
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="h6" gutterBottom>
        Stats: Total: {stats.total}, Applied: {stats.applied}, Rejected: {stats.rejected}, Accepted: {stats.accepted}
      </Typography>
      {applications.length === 0 ? (
        <Typography>No applications found. Add your first application!</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.company}</TableCell>
                  <TableCell>{application.position}</TableCell>
                  <TableCell>{application.status}</TableCell>
                  <TableCell>{new Date(application.applied_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEditApplication(application)}>Edit</Button>
                    <Button onClick={() => handleDeleteApplication(application.id)} color="secondary">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isFormOpen && (
        <ApplicationForm
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          application={currentApplication}
        />
      )}
    </Container>
  );
};

export default Dashboard;