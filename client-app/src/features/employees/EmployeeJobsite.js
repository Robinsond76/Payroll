import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import ListJobsiteTimestamps from '../tables/ListJobsiteTimestamps';

// url: '/jobsites/:moniker/:username'
const EmployeeJobsite = ({ match }) => {
  const username = match.params.username;
  const moniker = match.params.moniker;
  const pageSize = 3;

  return (
    <Fragment>
      <h2>{moniker}</h2>
      <p>Showing timestamps for user '{username}' at this location</p>
      <Button as={Link} to={`/jobsites/${moniker}`} size='mini'>
        See all timestamps
      </Button>
      <ListJobsiteTimestamps
        pageSize={pageSize}
        username={username}
        moniker={moniker}
        forOneUser={true}
      />
    </Fragment>
  );
};

export default EmployeeJobsite;
