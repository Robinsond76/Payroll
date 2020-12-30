import { Jobsites } from '../../api/agent';

const getJobsites = async (dispatch) => {
  dispatch({ type: 'LOADING' });
  try {
    const jobsites = await Jobsites.list();
    dispatch({ type: 'GET_JOBSITES', payload: jobsites });
    return jobsites;
  } catch (err) {
    console.log(err);
  }
};

export { getJobsites };
