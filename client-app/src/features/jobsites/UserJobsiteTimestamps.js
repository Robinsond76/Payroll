import React, { Fragment } from 'react';
import { useAuthState } from '../../app/context/auth/authContext';
import ListJobsiteTimestamps from '../tables/ListJobsiteTimestamps';

// /timestamps/user/:moniker
//this page lists timestamps for the VIEWING EMPLOYEE at a particular jobsite

//NOTE: The page that lists timestamps for any user at a jobsite is component 'EmployeeJobsite'

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
        forCurrentUser={true}
        noLinksInTable={true}
      />
    </Fragment>
  );
};

export default UserJobsiteTimestamps;
