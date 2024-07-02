import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/health`);
        setMessage(response.data.message);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Error connecting to the server');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Job Application Tracker</h1>
      <p>{message}</p>
    </div>
  );
};

export default App;