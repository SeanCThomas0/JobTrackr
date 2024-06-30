// frontend/src/App.tsx

import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

interface Application {
  id: number;
  companyName: string;
  position: string;
  status: string;
}

const App: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Application[]>('http://localhost:3000/api/applications'); // Updated API endpoint
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Application Tracker</h1>
      </header>
      <main>
        <button onClick={fetchApplications} disabled={loading}>
          {loading ? 'Loading...' : 'Load Applications'}
        </button>
        <h2>Applications</h2>
        <ul>
          {applications.map((app) => (
            <li key={app.id}>
              <strong>Company Name:</strong> {app.companyName}<br />
              <strong>Position:</strong> {app.position}<br />
              <strong>Status:</strong> {app.status}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;
