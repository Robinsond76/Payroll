import React, { Fragment } from 'react';
import { Divider, Header, Icon, Popup, Segment } from 'semantic-ui-react';
import { useAuthState } from '../../app/context/auth/authContext';

import FilterDateForm from '../../app/layout/FilterDateForm';
import ListTimestamps from '../tables/ListTimestamps';

//url: /timestamps/user

//this page lists all timestamps for the VIEWING EMPLOYEE

const ViewUserTimestamps = () => {
  const { user } = useAuthState();
  const { username } = user;
  const pageSize = 10;

  return (
    <Fragment>
      <Header
        as='h2'
        color='teal'
        style={{ display: 'inline-block', marginRight: '5px' }}
      >
        Your Timestamps
      </Header>
      <Popup
        trigger={<Icon name='question circle outline' />}
        content='These are all your timestamps - can be filtered by date.'
        position='right center'
      />

      <Divider />

      <FilterDateForm />
      <Segment>
        <ListTimestamps
          username={username}
          forCurrentUser={true}
          pageSize={pageSize}
          forEmployeeView={true}
        />
      </Segment>
    </Fragment>
  );
};

export default ViewUserTimestamps;
