import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Grid, Button, Typography, CircularProgress } from '@mui/material';
import ApplicationForm from './ApplicationForm';

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  notes: string;
}

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) {
        setApplications(response.data);
      } else {
        console.error('Unexpected response data:', response.data);
        setError('Failed to fetch applications. Unexpected response format.');
      }
    } catch (error) {
      console.error('Failed to fetch applications', error);
      setError('Failed to fetch applications. Please try again.');
      setApplications([]); // Set to empty array in case of error
    } finally {
      setIsLoading(false);
    }
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

  const handleFormSubmit = () => {
    fetchApplications();
    handleCloseForm();
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
      <Button variant="contained" color="primary" onClick={handleAddApplication}>
        Add Application
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {applications.length === 0 ? (
        <Typography>No applications found. Add your first application!</Typography>
      ) : (
        <Grid container spacing={3}>
          {applications.map((application) => (
            <Grid item xs={12} sm={6} md={4} key={application.id}>
              <div>
                <Typography variant="h6">{application.company}</Typography>
                <Typography>{application.position}</Typography>
                <Typography>{application.status}</Typography>
                <Typography>{new Date(application.applied_date).toLocaleDateString()}</Typography>
                <Button onClick={() => handleEditApplication(application)}>Edit</Button>
              </div>
            </Grid>
          ))}
        </Grid>
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
