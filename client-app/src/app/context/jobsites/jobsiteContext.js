import React, { createContext, useReducer } from 'react';
import jobsiteReducer from './jobsiteReducer';

const JobsiteStateContext = createContext();
const JobsiteDispatchContext = createContext();

const JobsiteProvider = ({children}) => {
  const initialState = {
    jobsites: []
  }

  const [state, dispatch] = useReducer(jobsiteReducer, initialState);

  return (
    <JobsiteStateContext.Provider value={state}>
      <JobsiteDispatchContext.Provider value={dispatch}>
        {children}
      </JobsiteDispatchContext.Provider>
    </JobsiteStateContext.Provider>
  );
};

//helper functions
const useJobsiteState = () => {
  const jobsiteState = React.useContext(JobsiteStateContext);
  return jobsiteState;
}

const useJobsiteDispatch = () => {
  const jobsiteDispatch = React.useContext(JobsiteDispatchContext);
  return jobsiteDispatch;
}


export { JobsiteProvider, useJobsiteState, useJobsiteDispatch }

