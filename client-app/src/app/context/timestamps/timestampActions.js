import { Timestamps } from '../../api/agent';

const getUserTimestamps = async (
  username,
  dispatch,
  pageSize = 3,
  pageNumber = 1
) => {
  dispatch({ type: 'LOADING' });
  try {
    const result = await Timestamps.getTimestamps(
      username,
      pageSize,
      pageNumber
    );

    dispatch({
      type: 'GET_USER_TIMESTAMPS',
      payload: result.data.timestamps,
      pagination: JSON.parse(result.headers['x-pagination']),
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { getUserTimestamps };
