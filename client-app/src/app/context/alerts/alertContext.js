import React, { createContext, useReducer } from 'react';
import alertReducer from './alertReducer';

const AlertContext = createContext();
const AlertDispatchContext = createContext();

const AlertProvider = ({ children }) => {
  const initialState = {
    alerts: [],
  };

  const [state, dispatch] = useReducer(alertReducer, initialState);

  return (
    <AlertContext.Provider value={state}>
      <AlertDispatchContext.Provider value={dispatch}>
        {children}
      </AlertDispatchContext.Provider>
    </AlertContext.Provider>
  );
};

//Helper Functions

const useAlertState = () => {
  const alertState = React.useContext(AlertContext);
  return alertState;
};

const useAlertDispatch = () => {
  const alertDispatch = React.useContext(AlertDispatchContext);
  return alertDispatch;
};

export { AlertProvider, useAlertState, useAlertDispatch };
