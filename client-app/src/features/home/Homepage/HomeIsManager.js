import React, { Fragment } from 'react';
import {
  useAuthDispatch,
  useAuthState,
} from '../../../app/context/auth/authContext';
import { logoutUser } from '../../../app/context/auth/authActions';
import { Button, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const HomeIsManager = () => {
  const { user } = useAuthState();
  const authDispatch = useAuthDispatch();

  return (
    <Fragment>
      <Header as='h2' content={`Welcome back ${user.displayName},`} />

      <span className='homepage-dashboard'>
        <Button color='teal' as={Link} to='/dashboard'>
          Dashboard
        </Button>
      </span>

      <span className='homepage-log-out'>
        <Button onClick={() => logoutUser(authDispatch)}>Log Out</Button>
      </span>
    </Fragment>
  );
};

export default HomeIsManager;
