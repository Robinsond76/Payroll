import React, { Fragment } from 'react';
import { useAuthState } from '../../app/context/auth/authContext';
import ListJobsiteTimestamps from '../tables/ListJobsiteTimestamps';
import FilterDateForm from '../../app/layout/FilterDateForm';
import { Divider, Header, Icon, Popup, Segment } from 'semantic-ui-react';

// /timestamps/user/:moniker
//this page lists timestamps for the VIEWING EMPLOYEE at a particular jobsite

//NOTE: The page that lists timestamps for any user at a jobsite is component 'EmployeeJobsite'

const UserJobsiteTimestamps = ({ match }) => {
  const moniker = match.params.moniker;
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
        Jobsite: {moniker}
      </Header>
      <Popup
        trigger={<Icon name='question circle outline' />}
        content='See all your timestamps at this jobsite - can be filtered by date.'
        position='right center'
      />

      <Divider />

      <FilterDateForm />
      <Segment>
        <ListJobsiteTimestamps
          pageSize={pageSize}
          username={username}
          moniker={moniker}
          forCurrentUser={true}
          noLinksInTable={true}
        />
      </Segment>
    </Fragment>
  );
};

export default UserJobsiteTimestamps;
