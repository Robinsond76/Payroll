import React, { Fragment } from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { history } from '../..';

import { useAlertDispatch } from '../../app/context/alerts/alertContext';
import { setAlert } from '../../app/context/alerts/alertActions';

const DeleteTimestamp = ({ timestampId }) => {
  const modalDispatch = useModalDispatch();
  const alertDispatch = useAlertDispatch();

  const onDelete = () => {
    Timestamps.deleteTimestamp(timestampId).then(() => {
      modalDispatch({ type: 'CLOSE_MODAL' });
      history.push('/refresh');
      setAlert(alertDispatch, `Timestamp deleted`, 'error');
    });
  };

  return (
    <Fragment>
      <div style={{ display: 'grid' }}>
        <Header icon style={{ margin: 'auto', marginBottom: '20px' }}>
          <Icon name='clock outline' />
          Delete Timestamp ?
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

export default DeleteTimestamp;
