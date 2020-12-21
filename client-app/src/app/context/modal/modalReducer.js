const modalReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return {
        open: true,
        body: action.payload,
      };
    case 'CLOSE_MODAL':
      return {
        open: false,
        body: null,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export default modalReducer;
