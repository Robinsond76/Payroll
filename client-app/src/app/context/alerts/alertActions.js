import { v4 as uuidv4 } from 'uuid';

const setAlert = (dispatch, msg, type, timeout = 4000) => {
  const id = uuidv4();
  dispatch({
    type: 'SET_ALERT',
    payload: { msg, type, id },
  });

  setTimeout(() => dispatch({ type: 'REMOVE_ALERT', payload: id }), timeout);
};

export { setAlert };
