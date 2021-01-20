import React, { Fragment } from 'react';
import ListTimestamps from '../tables/ListTimestamps';
import FilterDateForm from '../../app/layout/FilterDateForm';

// /employees/:username
const ViewEmployee = ({ match }) => {
  const username = match.params.username;
  const pageSize = 3;

  return (
    <Fragment>
      <h3>{username}'s Timestamps</h3>
      <FilterDateForm />
      <ListTimestamps
        username={username}
        pageSize={pageSize}
        forOneUser={true}
      />
    </Fragment>
  );
};

export default ViewEmployee;
