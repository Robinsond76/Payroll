import React, { useEffect, Fragment } from 'react';
import { Container, Header } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { JobsiteProvider } from './app/context/jobsites/jobsiteContext';
import { useAuthDispatch } from './app/context/auth/authContext';
import { loadUser } from './app/context/auth/authActions';

//components
import Navbar from './features/nav/Navbar.js';
import Homepage from './features/home/Homepage';
import ListJobsites from './features/jobsites/ListJobsites';
import LoginForm from './features/user/LoginForm';
import RegisterForm from './features/user/RegisterForm';

const App = () => {
  const authDispatch = useAuthDispatch();
  const token = window.localStorage.getItem('token');

  //get user if logged in
  useEffect(() => {
    if (token) {
      loadUser(authDispatch);
    }
  }, [token, authDispatch]);

  return (
    <Fragment>
      <JobsiteProvider>
        <Route exact path='/' component={Homepage} />
        <Route
          path={'/(.+)'}
          render={() => (
            <Fragment>
              <Navbar />
              <Container style={{ marginTop: '7em' }}>
                <Header as='h2' icon='users' content='Payroll App' />
                <Switch>
                  <Route exact path='/jobsites' component={ListJobsites} />
                  <Route exact path='/register' component={RegisterForm} />
                  <Route exact path='/login' component={LoginForm} />
                </Switch>
              </Container>
            </Fragment>
          )}
        />
      </JobsiteProvider>
    </Fragment>
  );
};

export default withRouter(App);
