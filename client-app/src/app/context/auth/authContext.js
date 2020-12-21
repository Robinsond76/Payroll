import React, { createContext, useReducer } from 'react';
import authReducer from './authReducer';

const AuthContext = createContext();
const AuthDispathContext = createContext();

const AuthProvider = ({ children }) => {
  const initialState = {
    isAuthenticated: null,
    loading: false,
    user: {},
    errors: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={state}>
      <AuthDispathContext.Provider value={dispatch}>
        {children}
      </AuthDispathContext.Provider>
    </AuthContext.Provider>
  );
};

//Helper Functions

const useAuthState = () => {
  const authState = React.useContext(AuthContext);
  return authState;
};

const useAuthDispatch = () => {
  const authDispatch = React.useContext(AuthDispathContext);
  return authDispatch;
};

export { AuthProvider, useAuthState, useAuthDispatch };
