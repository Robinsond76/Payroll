import { Timestamps } from '../../api/agent';

const getUserTimestamps = async (username, dispatch) => {
  dispatch({ type: 'LOADING' });
  try {
    const result = await Timestamps.getTimestamps(username);
    dispatch({ type: 'GET_USER_TIMESTAMPS', payload: result.timestamps });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { getUserTimestamps };
