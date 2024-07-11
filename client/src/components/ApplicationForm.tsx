import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';

interface ApplicationFormProps {
  onClose: () => void;
  onSubmit: () => void;
  application: {
    id: number;
    company: string;
    position: string;
    status: string;
    applied_date: string;
    notes: string;
  } | null;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onClose, onSubmit, application }) => {
  const [company, setCompany] = useState(application?.company || '');
  const [position, setPosition] = useState(application?.position || '');
  const [status, setStatus] = useState(application?.status || 'Applied');
  const [appliedDate, setAppliedDate] = useState(application?.applied_date || '');
  const [notes, setNotes] = useState(application?.notes || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!company.trim() || !position.trim() || !status || !appliedDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const headers = { Authorization: `Bearer ${token}` };
      const url = application?.id
        ? `http://localhost:5000/applications/${application.id}`
        : `http://localhost:5000/applications`;

      const formData = {
        company: company.trim(),
        position: position.trim(),
        status,
        applied_date: appliedDate,
        notes: notes.trim(),
      };

      const method = application?.id ? 'put' : 'post';

      await axios({
        method,
        url,
        headers,
        data: formData,
      });

      onSubmit();
    } catch (error) {
      console.error('Failed to save application', error);
      setError('Failed to save application. Please check the form data and try again.');
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{application ? 'Edit Application' : 'New Application'}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="dense"
            label="Company"
            type="text"
            fullWidth
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Position"
            type="text"
            fullWidth
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
          <TextField
            select
            margin="dense"
            label="Status"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <MenuItem value="Applied">Applied</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Applied Date"
            type="date"
            fullWidth
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            margin="dense"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <DialogActions>
            <Button onClick={onClose} color="primary">
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