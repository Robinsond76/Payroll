import React from 'react';
import { Grid, Header, Image, Segment } from 'semantic-ui-react';
import { useAuthState } from '../../../app/context/auth/authContext';
import HomeLoggedIn from './HomeLoggedIn';
import HomeNotLoggedIn from './HomeNotLoggedIn';

const TestHome = () => {
  const { isAuthenticated, user } = useAuthState();

  const token = window.localStorage.getItem('token');

  //if a manager logs in, redirect
  // React.useEffect(() => {
  //   if (user && user.manager === true) history.push('/dashboard');
  // }, [user]);

  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Grid
        textAlign='center'
        style={{ margin: 'auto' }}
        verticalAlign='middle'
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          {/* Header ---------------------------------------------------*/}
          <span className='homepage-header'>
            <Header as='h3' color='teal' textAlign='center'>
              <Image
                size='massive'
                src='/assets/logo.png'
                alt='logo'
                style={{ marginBottom: 12 }}
              />{' '}
              JobTME
            </Header>
          </span>

          {/* Segment container -------------------------------------------*/}
          <Segment>
            {/* If user is logged in ------------------------ */}
            {isAuthenticated && user && token ? (
              <HomeLoggedIn />
            ) : (
              // If user is NOT LOGGED IN ---------------------------
              <HomeNotLoggedIn />
            )}
          </Segment>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default TestHome;
