import React, { Fragment } from 'react';
import ListTimestamps from '../tables/ListTimestamps';
import FilterDateForm from '../../app/layout/FilterDateForm';
import { Button, Divider } from 'semantic-ui-react';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { openModal } from '../../app/context/modal/modalActions';
import EditEmployee from './EditEmployee';
import DeleteEmployee from './DeleteEmployee';

// /employees/:username
const ViewEmployee = ({ match }) => {
  const username = match.params.username;
  const pageSize = 3;

  const modalDispatch = useModalDispatch();

  return (
    <Fragment>
      <h3>{username}'s Timestamps</h3>

      <Button color='grey'>Add Timestamp</Button>
      <Button
        color='blue'
        onClick={() =>
          openModal(<EditEmployee username={username} />, modalDispatch)
        }
      >
        Edit Employee
      </Button>
      <Button
        color='red'
        onClick={() =>
          openModal(<DeleteEmployee username={username} />, modalDispatch)
        }
      >
        Delete Employee
      </Button>

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
