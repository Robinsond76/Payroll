import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';
import { useAuthState } from '../../app/context/auth/authContext';

const Homepage = () => {
  const { isAuthenticated, user } = useAuthState();

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
              content={`Welcome back ${user.displayName}`}
            />
            <Button as={Link} to='/jobsites' size='huge' inverted>
              Take me to Jobsites
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Header as='h2' inverted content='Welcome to Payroll App' />
            <Button as={Link} to='/login' size='huge' inverted>
              Login
            </Button>
            <Button as={Link} to='/register' size='huge' inverted>
              Register
            </Button>
          </Fragment>
        )}
      </Container>
    </Segment>
  );
};

export default Homepage;
