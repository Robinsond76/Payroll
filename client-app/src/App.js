import React, { Fragment } from 'react';
import { Container, Header } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { JobsiteProvider } from './app/context/jobsites/jobsiteContext';
import { AuthProvider } from './app/context/auth/authContext';

//components
import Navbar from './features/nav/Navbar.js';
import Homepage from './features/home/Homepage';
import ListJobsites from './features/jobsites/ListJobsites';
import LoginForm from './features/user/LoginForm';
import RegisterForm from './features/user/RegisterForm';

const App = () => {
  return (
    <Fragment>
      <JobsiteProvider>
        <AuthProvider>
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
        </AuthProvider>
      </JobsiteProvider>
    </Fragment>
  );
};

export default withRouter(App);
