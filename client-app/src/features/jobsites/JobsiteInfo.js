import React, { Fragment } from 'react';
import JobsiteHistory from '../tables/JobsiteHistory';

// /jobsite/:moniker
const JobsiteInfo = ({ match }) => {
  const moniker = match.params.moniker;
  const pageSize = 3;

  return (
    <Fragment>
      <JobsiteHistory moniker={moniker} pageSize={pageSize} />
    </Fragment>
  );
};

export default JobsiteInfo;
