import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';

interface Application {
  id?: number;
  companyName: string;
  position: string;
  applicationDate: string;
  status: string;
}

interface ApplicationFormProps {
  onClose: () => void;
  application?: Application | null;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onClose, application }) => {
  const [formData, setFormData] = useState<Application>({
    companyName: '',
    position: '',
    applicationDate: '',
    status: '',
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
      if (!token) {
        throw new Error("No token found");
      }
      if (application) {
        await axios.put(`${process.env.REACT_APP_API_URL}/applications/${application.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/applications`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
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
            name="companyName"
            label="Company Name"
            fullWidth
            value={formData.companyName}
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
            name="applicationDate"
            label="Application Date"
            type="date"
            fullWidth
            value={formData.applicationDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            name="status"
            label="Status"
            fullWidth
            value={formData.status}
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
