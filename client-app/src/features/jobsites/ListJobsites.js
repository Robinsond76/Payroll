import React, { useEffect } from 'react';
import { Header, List } from 'semantic-ui-react';

import { getJobsites } from '../../app/context/jobsites/jobsiteActions';
import { useJobsiteState, useJobsiteDispatch } 
  from '../../app/context/jobsites/jobsiteContext';

const ListJobsites = () => {

  const jobsiteDispatch = useJobsiteDispatch();
  const { jobsites } = useJobsiteState();

  useEffect( () => {
    if(jobsites.length === 0)
      getJobsites(jobsiteDispatch);
  }, [jobsites, jobsiteDispatch]);


  return (
    <>
      <Header as='h2' icon='map' content='Jobsites' />
      <List>
          {jobsites.map(activity => (
              <List.Item key={activity.moniker}>{activity.name}</List.Item>
            ))}
      </List>
    </>
  )
}

export default ListJobsites
