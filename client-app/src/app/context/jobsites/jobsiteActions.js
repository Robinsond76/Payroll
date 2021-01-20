import { Jobsites } from '../../api/agent';

const getJobsites = async (dispatch, query = '', pageSize, pageNumber = 1) => {
  dispatch({ type: 'LOADING' });
  try {
    const result = await Jobsites.listJobsites(query, pageSize, pageNumber);
    dispatch({
      type: 'GET_JOBSITES',
      payload: result.data,
      pagination: JSON.parse(result.headers['x-pagination']),
    });
  } catch (err) {
    console.log(err);
  }
};

const getJobsitesVisitedByDate = async (
  dispatch,
  pageSize,
  pageNumber = 1,
  fromDate = '',
  toDate = ''
) => {
  dispatch({ type: 'LOADING' });
  try {
    const result = await Jobsites.getJobsitesVisited(
      pageSize,
      pageNumber,
      fromDate,
      toDate
    );
    dispatch({
      type: 'GET_JOBSITES_VISITED',
      payload: result.data,
      pagination: JSON.parse(result.headers['x-pagination']),
    });
  } catch (err) {
    console.log(err);
  }
};

export { getJobsites, getJobsitesVisitedByDate };
