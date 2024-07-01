// frontend/src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, List, ListItem, ListItemText } from '@material-ui/core';
import axios from 'axios';

interface Application {
  id: number;
  companyName: string;
  position: string;
  status: string;
}

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Application[]>('http://localhost:3000/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Dashboard</Typography>
      <Button onClick={onLogout} variant="contained" color="secondary">
        Logout
      </Button>
      <List>
        {applications.map((app) => (
          <ListItem key={app.id}>
            <ListItemText
              primary={app.companyName}
              secondary={`${app.position} - ${app.status}`}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Dashboard;