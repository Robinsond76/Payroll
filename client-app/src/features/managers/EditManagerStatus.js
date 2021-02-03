import React, { Fragment } from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { User } from '../../app/api/agent';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { history } from '../..';

import { useAlertDispatch } from '../../app/context/alerts/alertContext';
import { setAlert } from '../../app/context/alerts/alertActions';

//modal to edit manager status
//if revoke is true, component's purpose is confirm revoking a user
//if false, component's purpose is to confirm making a user a manager

const EditManagerStatus = ({ username, revoke = false }) => {
  const modalDispatch = useModalDispatch();
  const alertDispatch = useAlertDispatch();

  const onSubmit = () => {
    if (revoke) {
      User.editManager(username, false).then(() => {
        modalDispatch({ type: 'CLOSE_MODAL' });
        history.push('/refresh');
        setAlert(
          alertDispatch,
          `${username} - Manager status revoked`,
          'error'
        );
      });
    } else {
      User.editManager(username, true).then(() => {
        modalDispatch({ type: 'CLOSE_MODAL' });
        history.push('/employees');
        setAlert(alertDispatch, `${username} is now a manager`, 'update');
      });
    }
  };

  return (
    <Fragment>
      <div style={{ display: 'grid' }}>
        <Header icon style={{ margin: 'auto', marginBottom: '20px' }}>
          <Icon name='user' />
          {revoke ? `Revoke Manager Status?` : 'Make Manager?'}
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
          onClick={onSubmit}
          style={{ marginBottom: '5px' }}
        >
          <Icon name='checkmark' /> Yes
        </Button>
      </div>
    </Fragment>
  );
};

export default EditManagerStatus;
