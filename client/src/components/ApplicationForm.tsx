import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

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
  const [status, setStatus] = useState(application?.status || '');
  const [appliedDate, setAppliedDate] = useState(application?.applied_date || '');
  const [notes, setNotes] = useState(application?.notes || '');
  const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = { Authorization: `Bearer ${token}` };
    const url = application?.id
      ? `http://localhost:5000/applications/${application.id}`
      : `http://localhost:5000/applications`;

    // Format the date to YYYY-MM-DD
    const formattedDate = new Date(appliedDate).toISOString().split('T')[0];

    // Ensure formData has all required fields
    const formData = {
      company: company.trim(),
      position: position.trim(),
      status: status.trim(),
      applied_date: formattedDate,
      notes: notes.trim(),
    };

    // Validate required fields
    if (!formData.company || !formData.position || !formData.status || !formData.applied_date) {
      throw new Error('Please fill in all required fields');
    }

    // Log formData to verify its structure
    console.log('Submitting formData:', formData);

    const method = application?.id ? 'put' : 'post';

    await axios({
      method,
      url,
      headers,
      data: formData,
    });

    onSubmit();
    onClose();
  } catch (error) {
    console.error('Failed to save application', error);
    let errorMesasage = 'Failed to save application. Please check the form data and try again.';
    setError(errorMesasage || 'Failed to save application. Please check the form data and try again.');
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
            margin="dense"
            label="Status"
            type="text"
            fullWidth
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
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
