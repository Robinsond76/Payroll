import React, { Fragment } from 'react';
import { Button, Divider, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../../app/context/auth/authActions';
import {
  useAuthDispatch,
  useAuthState,
} from '../../../app/context/auth/authContext';
import HomeClockedIn from './HomeClockedIn';
import HomeNotClockedIn from './HomeNotClockedIn';
import HomeIsManager from './HomeIsManager';

const HomeLoggedIn = () => {
  const { user } = useAuthState();
  const authDispatch = useAuthDispatch();

  if (user.manager) return <HomeIsManager />;

  return (
    <Fragment>
      <Header as='h2' content={`Welcome back ${user.displayName},`} />
      {user.currentlyClockedIn ? <HomeClockedIn /> : <HomeNotClockedIn />}
      <br />
      <Divider />
      <span className='homepage-timestamps'>
        <Button as={Link} to='/timestamps/user' style={{ width: '150px' }}>
          Timestamps
        </Button>
      </span>
      <span className='homepage-log-out'>
        <Button onClick={() => logoutUser(authDispatch)}>Log Out</Button>
      </span>
    </Fragment>
  );
};

export default HomeLoggedIn;
