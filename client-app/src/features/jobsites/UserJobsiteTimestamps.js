import React, { Fragment } from 'react';
import { useAuthState } from '../../app/context/auth/authContext';
import ListJobsiteTimestamps from '../tables/ListJobsiteTimestamps';

// /timestamps/user/:moniker
const UserJobsiteTimestamps = ({ match }) => {
  const moniker = match.params.moniker;
  const { user } = useAuthState();
  const { username } = user;
  const pageSize = 3;

  return (
    <Fragment>
      <h2>{moniker}</h2>
      <ListJobsiteTimestamps
        pageSize={pageSize}
        username={username}
        moniker={moniker}
      />
    </Fragment>
  );
};

export default UserJobsiteTimestamps;
