import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import ReactDOM from 'react-dom';

type PrivateRouteProps = {
  component: React.ComponentType<any>;
  path: string;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();

  return (
    <Routes>
      <Route
        path={rest.path}
        element={
          isAuthenticated ? (
            <Component />
          ) : (
            <Navigate to="/login" state={{ from: location }} />
          )
        }
      />
    </Routes>
  );
};

export default PrivateRoute;
