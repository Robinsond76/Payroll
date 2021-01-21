import { Jobsites } from '../../api/agent';

const getJobsite = async (moniker) => {
  const jobsite = await Jobsites.getJobsite(moniker);

  //necessary for final form in JobsiteForm component
  const jobsiteFormValues = {
    name: jobsite.name,
    moniker: jobsite.moniker,
    address1: jobsite.location.address1,
    address2: jobsite.location.address2,
    address3: jobsite.location.address3,
    cityTown: jobsite.location.cityTown,
    stateProvince: jobsite.location.stateProvince,
    postalCode: jobsite.location.postalCode,
    country: jobsite.location.country,
  };

  return jobsiteFormValues;
};

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

export { getJobsites, getJobsitesVisitedByDate, getJobsite };
