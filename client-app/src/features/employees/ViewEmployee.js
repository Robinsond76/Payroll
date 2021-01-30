import React, { Fragment } from 'react';
import ListTimestamps from '../tables/ListTimestamps';
import FilterDateForm from '../../app/layout/FilterDateForm';
import { Button, Divider } from 'semantic-ui-react';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { openModal } from '../../app/context/modal/modalActions';
import { useAuthState } from '../../app/context/auth/authContext';
import EditEmployee from './EditEmployee';
import DeleteEmployee from './DeleteEmployee';
import TimestampForm from '../timestamps/TimestampForm';
import EditManagerStatus from '../managers/EditManagerStatus';

// /employees/:username
const ViewEmployee = ({ match }) => {
  const username = match.params.username;
  const pageSize = 3;

  const modalDispatch = useModalDispatch();
  const { user } = useAuthState();

  return (
    <Fragment>
      <h3>{username}'s Timestamps</h3>

      <Button
        color='teal'
        onClick={() =>
          openModal(<TimestampForm username={username} />, modalDispatch)
        }
      >
        Add Timestamp
      </Button>

      {user.admin && (
        <Button
          color='green'
          onClick={() =>
            openModal(
              <EditManagerStatus username={username} action='access' />,
              modalDispatch
            )
          }
        >
          Make Manager
        </Button>
      )}

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
