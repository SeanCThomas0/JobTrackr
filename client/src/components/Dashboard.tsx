import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import ApplicationForm from './ApplicationForm';

interface Application {
  id?: number;
  companyName: string;
  position: string;
  applicationDate: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Ensure the data is an array
      const applicationsData: Application[] = Array.isArray(response.data) ? response.data : [];
      setApplications(applicationsData);
    } catch (error) {
      console.error('Failed to fetch applications', error);
      setApplications([]); // Ensure applications is an array even if the fetch fails
    }
  };

  const handleAdd = () => {
    setSelectedApplication(null);
    setOpen(true);
  };

  const handleEdit = (application: Application) => {
    setSelectedApplication(application);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetchApplications();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Job Applications
      </Typography>
      <List>
        {applications.map((app) => (
          <ListItem key={app.id} button onClick={() => handleEdit(app)}>
            <ListItemText primary={app.companyName} secondary={`${app.position} - ${app.status}`} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add New Application
      </Button>
      {open && <ApplicationForm onClose={handleClose} application={selectedApplication} />}
    </Container>
  );
};

export default Dashboard;
