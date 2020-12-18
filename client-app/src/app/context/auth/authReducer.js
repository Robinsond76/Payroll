const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload        
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default authReducer;