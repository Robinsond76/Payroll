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
