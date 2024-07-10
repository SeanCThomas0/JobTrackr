import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';

interface Application {
  id?: number;
  company: string;
  position: string;
  status: string;
  applied_date: string;
  notes: string;
}

interface ApplicationFormProps {
  onClose: () => void;
  onSubmit: () => void;
  application?: Application | null;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onClose, onSubmit, application }) => {
  const [formData, setFormData] = useState<Application>({
    company: '',
    position: '',
    status: '',
    applied_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (application) {
      setFormData(application);
    }
  }, [application]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (application?.id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/applications/${application.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/applications`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Failed to save application', error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>{application ? 'Edit Application' : 'Add Application'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            name="company"
            label="Company Name"
            fullWidth
            value={formData.company}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            name="position"
            label="Position"
            fullWidth
            value={formData.position}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            name="status"
            label="Status"
            fullWidth
            value={formData.status}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            name="applied_date"
            label="Applied Date"
            type="date"
            fullWidth
            value={formData.applied_date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            name="notes"
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            margin="normal"
          />
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationForm;