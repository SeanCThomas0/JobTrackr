import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);

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

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Your Job Applications
      </Typography>
      <List>
        {applications.map((app) => (
          <ListItem key={app.id}>
            <ListItemText primary={app.company} secondary={`${app.position} - ${app.status}`} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary">
        Add New Application
      </Button>
    </Container>
  );
};

export default Dashboard;