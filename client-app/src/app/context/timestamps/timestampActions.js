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

const getJobsiteTimestampsByUser = async (
  moniker,
  username,
  dispatch,
  pageSize = 3,
  pageNumber = 1
) => {
  dispatch({ type: 'LOADING' });
  try {
    const result = await Timestamps.getJobsiteTimestamps(
      moniker,
      username,
      pageSize,
      pageNumber
    );
    dispatch({
      type: 'GET_JOBSITE_TIMESTAMPS_BY_USER',
      payload: result.data.timestamps,
      pagination: JSON.parse(result.headers['x-pagination']),
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const clearJobsiteTimestamps = (dispatch) => {
  dispatch({ type: 'CLEAR_JOBSITE_TIMESTAMPS' });
};

export {
  getUserTimestamps,
  getJobsiteTimestampsByUser,
  clearJobsiteTimestamps,
};
