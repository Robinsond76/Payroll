import { Timestamps } from '../../api/agent';

const getAllTimestamps = async (
  dispatch,
  pageSize,
  pageNumber = 1,
  fromDate = '',
  toDate = ''
) => {
  dispatch({ type: 'SET_LOADING_TRUE' });
  try {
    const result = await Timestamps.getAllTimestamps(
      pageSize,
      pageNumber,
      fromDate,
      toDate
    );
    const pagination = JSON.parse(result.headers['x-pagination']);
    dispatch({
      type: 'LOAD_TIMESTAMPS',
      payload: result.data,
      pagination: pagination,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getCurrentUserTimestamps = async (
  dispatch,
  username,
  pageSize,
  pageNumber = 1,
  fromDate = '',
  toDate = ''
) => {
  dispatch({ type: 'SET_LOADING_TRUE' });
  try {
    const result = await Timestamps.getCurrentUserTimestamps(
      username,
      pageSize,
      pageNumber,
      fromDate,
      toDate
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

const getUserTimestamps = async (
  dispatch,
  username,
  pageSize,
  pageNumber = 1,
  fromDate = '',
  toDate = ''
) => {
  dispatch({ type: 'SET_LOADING_TRUE' });
  try {
    const result = await Timestamps.getAnyUserTimestamps(
      username,
      pageSize,
      pageNumber,
      fromDate,
      toDate
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
  dispatch({ type: 'SET_LOADING_TRUE' });
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
  getAllTimestamps,
  getUserTimestamps,
  getJobsiteTimestampsByUser,
  clearJobsiteTimestamps,
  getCurrentUserTimestamps,
};
