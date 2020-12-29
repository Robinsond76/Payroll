import React, { Fragment, useEffect } from 'react';
import { Header, List } from 'semantic-ui-react';
import LoadingComponent from '../../app/layout/LoadingComponent';

import { getJobsites } from '../../app/context/jobsites/jobsiteActions';
import {
  useJobsiteState,
  useJobsiteDispatch,
} from '../../app/context/jobsites/jobsiteContext';

const ListJobsites = () => {
  const jobsiteDispatch = useJobsiteDispatch();
  const { jobsites, loading } = useJobsiteState();

  useEffect(() => {
    if (jobsites.length === 0) getJobsites(jobsiteDispatch);
  }, [jobsites, jobsiteDispatch]);

  if (loading) return <LoadingComponent />;

  return (
    <Fragment>
      <Header as='h2' icon='map' content='Jobsites' />
      <List>
        {jobsites.map((activity) => (
          <List.Item key={activity.moniker}>{activity.name}</List.Item>
        ))}
      </List>
    </Fragment>
  );
};

export default ListJobsites;
