import React, { Fragment } from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';
import { Jobsites } from '../../app/api/agent';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { history } from '../..';

const DeleteJobsite = ({ moniker }) => {
  const modalDispatch = useModalDispatch();

  const onDelete = () => {
    Jobsites.deleteJobsite(moniker).then(() => {
      modalDispatch({ type: 'CLOSE_MODAL' });
      history.push('/jobsites');
    });
  };

  return (
    <Fragment>
      <div style={{ display: 'grid' }}>
        <Header icon style={{ margin: 'auto', marginBottom: '5px' }}>
          <Icon name='map outline' />
          Delete Jobsite ?
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

export default DeleteJobsite;
