const timestampReducer = (state, action) => {
  switch (action.type) {
    case 'GET_USER_TIMESTAMPS':
      return {
        ...state,
        timestamps: action.payload,
        loading: false,
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
