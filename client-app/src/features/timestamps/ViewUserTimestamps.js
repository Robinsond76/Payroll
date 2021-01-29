import React, { Fragment } from 'react';
import { useAuthState } from '../../app/context/auth/authContext';

import FilterDateForm from '../../app/layout/FilterDateForm';
import ListTimestamps from '../tables/ListTimestamps';

//url: /timestamps/user

//this page lists all timestamps for the VIEWING EMPLOYEE

const ViewUserTimestamps = () => {
  const { user } = useAuthState();
  const { displayName, username } = user;
  const pageSize = 3;

  return (
    <Fragment>
      <FilterDateForm />

      <h2>{displayName}'s Timestamps </h2>
      <ListTimestamps
        username={username}
        forCurrentUser={true}
        pageSize={pageSize}
        forEmployeeView={true}
      />
    </Fragment>
  );
};

export default ViewUserTimestamps;
