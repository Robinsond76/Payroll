import React, { Fragment } from 'react';
import ListTimestamps from '../tables/ListTimestamps';
import FilterDateForm from '../../app/layout/FilterDateForm';
import { Button, Divider } from 'semantic-ui-react';
// import { useModalDispatch } from '../../app/context/modal/modalContext';
// import { openModal } from '../../app/context/modal/modalActions';
// import ConfirmDelete from '../../app/layout/ConfirmDelete';

// /employees/:username
const ViewEmployee = ({ match }) => {
  const username = match.params.username;
  const pageSize = 3;

  // const modalDispatch = useModalDispatch();

  return (
    <Fragment>
      <h3>{username}'s Timestamps</h3>

      <Button>Add Timestamp</Button>

      <Divider />

      <FilterDateForm />
      <ListTimestamps
        username={username}
        pageSize={pageSize}
        forOneUser={true}
        showEditDelete={true}
      />
    </Fragment>
  );
};

export default ViewEmployee;
