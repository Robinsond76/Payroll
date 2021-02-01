const alertReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALERT':
      return {
        alerts: [...state.alerts, action.payload],
      };
    case 'REMOVE_ALERT':
      return {
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      };
    default:
      return state;
  }
};

export default alertReducer;
