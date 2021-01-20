import React, { Fragment } from 'react';
import ListTimestamps from '../tables/ListTimestamps';
import ListJobsites from '../tables/ListJobsites';
import FilterDateForm from '../../app/layout/FilterDateForm';

//url: /timestamps
const ViewAllTimestamps = () => {
  const pageSize = 5;

  return (
    <Fragment>
      <FilterDateForm />
      <h3>Jobsites Visited</h3>
      <ListJobsites pageSize={pageSize} basicView={true} />

      <h3>Timestamps</h3>
      <ListTimestamps pageSize={pageSize} />
    </Fragment>
  );
};

export default ViewAllTimestamps;
