import React, { Fragment } from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { User } from '../../app/api/agent';
import { history } from '../..';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { useAlertDispatch } from '../../app/context/alerts/alertContext';
import { setAlert } from '../../app/context/alerts/alertActions';

//modal to clock out employee
const ClockOutEmployee = ({ moniker, username }) => {
  const modalDispatch = useModalDispatch();
  const alertDispatch = useAlertDispatch();

  const onDelete = () => {
    User.clockOutEmployee(moniker, username).then(() => {
      modalDispatch({ type: 'CLOSE_MODAL' });
      history.push('/refresh');
      setAlert(
        alertDispatch,
        `Successfully clocked out ${username}`,
        'success'
      );
    });
  };

  return (
    <Fragment>
      <div style={{ display: 'grid' }}>
        <Header icon style={{ margin: 'auto', marginBottom: '15px' }}>
          <Icon name='stopwatch' />
          Clock out {username}?
        </Header>

        <Button
          color='red'
          inverted
          onClick={() => modalDispatch({ type: 'CLOSE_MODAL' })}
          style={{ marginBottom: '5px' }}
        >
          <Icon name='remove' /> No
        </Button>
        <Button
          color='green'
          inverted
          onClick={onDelete}
          style={{ marginBottom: '5px' }}
        >
          <Icon name='checkmark' /> Yes
        </Button>
      </div>
    </Fragment>
  );
};

export default ClockOutEmployee;
