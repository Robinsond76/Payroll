import {Jobsites} from '../../api/agent';

const getJobsites = async (dispatch) => {
  try {
    const jobsites = await Jobsites.list();
    dispatch({type: 'GET_JOBSITES', payload: jobsites});
  } catch (err) {
    console.log(err);
  }
}

export {getJobsites}