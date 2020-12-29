const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
    case 'LOAD_USER':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
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

export default authReducer;
