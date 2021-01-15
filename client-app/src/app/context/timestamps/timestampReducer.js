const timestampReducer = (state, action) => {
  switch (action.type) {
    case 'GET_USER_TIMESTAMPS':
      return {
        ...state,
        timestamps: action.payload,
        loading: false,
        timestampPagination: action.pagination,
      };
    case 'GET_JOBSITE_TIMESTAMPS_BY_USER':
      return {
        ...state,
        jobsiteTimestamps: action.payload,
        loading: false,
        jobsitePagination: action.pagination,
      };
    case 'CLEAR_JOBSITE_TIMESTAMPS':
      return {
        ...state,
        jobsiteTimestamps: [],
        jobsitePagination: 0,
      };
    case 'SET_FROM_DATE':
      return {
        ...state,
        fromDate: action.payload,
      };
    case 'SET_TO_DATE':
      return {
        ...state,
        toDate: action.payload,
      };
    case 'CLEAR_DATES':
      return {
        ...state,
        fromDate: '',
        toDate: '',
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

export default timestampReducer;
