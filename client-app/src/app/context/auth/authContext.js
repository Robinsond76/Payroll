import React, { useContext, useReducer } from 'react';
import authReducer from './authReducer';

const AuthContext = React.createContext();
const AuthDispathContext = React.createContext();

const AuthProvider = ({ children }) => {
  const initialState = {
    isAuthenticated: null,
    loading: false,
    user: null,
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

const useAuthContext = () => {
  const authContext = useContext(AuthContext);
  return authContext;
};

const useAuthDispatchContext = () => {
  const authDispatch = useContext(AuthDispathContext);
  return authDispatch;
};

export { AuthProvider, useAuthContext, useAuthDispatchContext };
