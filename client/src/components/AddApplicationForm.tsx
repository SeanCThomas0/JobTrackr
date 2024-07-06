import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

interface AddApplicationFormProps {
  onSubmit: (application: { company: string; position: string; status: string }) => void;
}

const AddApplicationForm: React.FC<AddApplicationFormProps> = ({ onSubmit }) => {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ company, position, status });
    setCompany('');
    setPosition('');
    setStatus('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Company"
            fullWidth
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Position"
            fullWidth
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Status"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add Application
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddApplicationForm;