const jobsiteReducer = (state, action) => {
  switch (action.type) {
    case 'GET_JOBSITES_VISITED':
    case 'GET_JOBSITES':
      return {
        ...state,
        jobsites: action.payload,
        jobsitePagination: action.pagination,
        loading: false,
      };
    case 'CLEAR_JOBSITES':
      return {
        ...state,
        jobsites: [],
        jobsitePagination: 0,
      };
    case 'LOADING':
      return {
        ...state,
        loading: true,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default jobsiteReducer;
