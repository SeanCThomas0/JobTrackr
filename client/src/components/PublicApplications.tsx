import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface PublicApplication {
  id: number;
  company: string;
  position: string;
  status: string;
  applied_date: string;
}

const PublicApplications: React.FC = () => {
  const [applications, setApplications] = useState<PublicApplication[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicApplications();
  }, []);

  const fetchPublicApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/public-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch public applications', error);
      setError('Failed to fetch public applications. Please try again.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Public Applications</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {applications.length === 0 ? (
        <Typography>No public applications found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applied Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{application.company}</TableCell>
                  <TableCell>{application.position}</TableCell>
                  <TableCell>{application.status}</TableCell>
                  <TableCell>{new Date(application.applied_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default PublicApplications;