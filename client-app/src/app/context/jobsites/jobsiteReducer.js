const jobsiteReducer = (state, action) => {
  switch (action.type) {
    case 'GET_JOBSITES':
      return {
        ...state,
        jobsites: action.payload
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default jobsiteReducer;