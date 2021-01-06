import { Jobsites } from '../../api/agent';

const getJobsites = async (
  dispatch,
  query = '',
  pageSize = 3,
  pageNumber = 1
) => {
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

export { getJobsites };
