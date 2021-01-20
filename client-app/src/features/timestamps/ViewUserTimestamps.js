import React, { Fragment } from 'react';
import { useAuthState } from '../../app/context/auth/authContext';
import { getUserTimestamps } from '../../app/context/timestamps/timestampActions';

import {
  useTimestampState,
  useTimestampDispatch,
} from '../../app/context/timestamps/timestampContext';
import FilterDateForm from '../../app/layout/FilterDateForm';
import ListTimestamps from '../tables/ListTimestamps';

//url: /timestamps/user
const ViewUserTimestamps = () => {
  const { user } = useAuthState();
  const { displayName, username } = user;

  const tDispatch = useTimestampDispatch();
  const { fromDate, toDate } = useTimestampState();
  const pageSize = 3;
  const firstPage = 1;

  const filterHandler = async () => {
    getUserTimestamps(
      tDispatch,
      username,
      pageSize,
      firstPage,
      fromDate,
      toDate
    );
  };

  return (
    <Fragment>
      <FilterDateForm filterHandler={filterHandler} />

      <h2>{displayName}'s Timestamps </h2>
      <ListTimestamps username={username} pageSize={pageSize} />
    </Fragment>
  );
};

export default ViewUserTimestamps;
