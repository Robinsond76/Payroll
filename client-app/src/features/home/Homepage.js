import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';
import { useAuthState } from '../../app/context/auth/authContext';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { openModal } from '../../app/context/modal/modalActions';
import LoginForm from '../user/LoginForm';

const Homepage = () => {
  const { isAuthenticated, user } = useAuthState();
  const modalDispatch = useModalDispatch();

  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/logo.png'
            alt='logo'
            style={{ marginBottom: 12 }}
          />
          Payroll
        </Header>
        {isAuthenticated && user ? (
          <Fragment>
            <Header
              as='h2'
              inverted
              content={`Welcome back ${user.displayName},`}
            />
            {user.currentlyClockedIn ? (
              <h3>Currently clocked in.</h3>
            ) : (
              <h3>You are not currently clocked in.</h3>
            )}
            <br />
            <Button as={Link} to='/jobsites' size='small' inverted>
              Take me to Jobsites
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Header as='h2' inverted content='Welcome to Payroll App' />
            <Button
              onClick={() => openModal(<LoginForm />, modalDispatch)}
              to='/login'
              size='huge'
              inverted
            >
              Login
            </Button>
          </Fragment>
        )}
      </Container>
    </Segment>
  );
};

export default Homepage;
