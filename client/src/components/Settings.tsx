import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Switch, FormControlLabel } from '@mui/material';

interface UserSettings {
  username: string;
  email: string;
  public_applications: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({ username: '', email: '', public_applications: true });
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/user/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch user settings', error);
      setError('Failed to fetch user settings. Please try again.');
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/user/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings', error);
      setError('Failed to update settings. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:5000/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token');
        window.location.href = '/login';
      } catch (error) {
        console.error('Failed to delete account', error);
        setError('Failed to delete account. Please try again.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Account Settings</Typography>
      <form onSubmit={handleUpdateSettings}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          value={settings.username}
          onChange={(e) => setSettings({ ...settings, username: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={settings.email}
          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="New Password (leave blank to keep current)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.public_applications}
              onChange={(e) => setSettings({ ...settings, public_applications: e.target.checked })}
            />
          }
          label="Make my applications public"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
          Update Settings
        </Button>
      </form>
      <Button onClick={handleDeleteAccount} variant="contained" color="secondary" fullWidth style={{ marginTop: '1rem' }}>
        Delete Account
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {message && <Typography color="primary">{message}</Typography>}
    </Container>
  );
};

export default Settings;