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
        jobsitePagination: null,
      };
    case 'SET_LOADING_TRUE':
      return {
        ...state,
        loading: true,
      };
    case 'SET_LOADING_FALSE':
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default jobsiteReducer;
