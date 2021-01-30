import React, { Fragment } from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { User } from '../../app/api/agent';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { history } from '../..';

const EditManagerStatus = ({ username, revoke = false }) => {
  const modalDispatch = useModalDispatch();

  const onDelete = () => {
    if (revoke) {
      User.editManager(username, false).then(() => {
        modalDispatch({ type: 'CLOSE_MODAL' });
        history.push('/refresh');
      });
    } else {
      User.editManager(username, true).then(() => {
        modalDispatch({ type: 'CLOSE_MODAL' });
        history.push('/employees');
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
          onClick={onDelete}
          style={{ marginBottom: '5px' }}
        >
          <Icon name='checkmark' /> Yes
        </Button>
      </div>
    </Fragment>
  );
};

export default EditManagerStatus;
