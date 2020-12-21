import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuthState } from '../context/auth/authContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuthState();

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to={'/'} />
      }
    />
  );
};

export default PrivateRoute;
