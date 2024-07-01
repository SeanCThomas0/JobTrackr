// frontend/src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const theme = createTheme();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/login">
            {isAuthenticated ? <Redirect to="/dashboard" /> : <Login onLogin={handleLogin} />}
          </Route>
          <Route path="/register">
            {isAuthenticated ? <Redirect to="/dashboard" /> : <Register />}
          </Route>
          <Route path="/dashboard">
            {isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Redirect to="/login" />}
          </Route>
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;