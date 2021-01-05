import React, { createContext, useReducer } from 'react';
import timestampReducer from './timestampReducer';

const TimestampStateContext = createContext();
const TimestampDispatchContext = createContext();

const TimestampProvider = ({ children }) => {
  const initialState = {
    timestamps: [],
    jobsiteTimestamps: [],
    timestampPagination: 0,
    jobsitePagination: 0,
    loading: false,
  };

  const [state, dispatch] = useReducer(timestampReducer, initialState);

  return (
    <TimestampStateContext.Provider value={state}>
      <TimestampDispatchContext.Provider value={dispatch}>
        {children}
      </TimestampDispatchContext.Provider>
    </TimestampStateContext.Provider>
  );
};

const useTimestampState = () => {
  const timestampState = React.useContext(TimestampStateContext);
  return timestampState;
};

const useTimestampDispatch = () => {
  const timestampDispatch = React.useContext(TimestampDispatchContext);
  return timestampDispatch;
};

export { TimestampProvider, useTimestampState, useTimestampDispatch };
