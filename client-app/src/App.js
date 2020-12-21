import React, { useEffect, Fragment } from 'react';
import { Container, Header } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { JobsiteProvider } from './app/context/jobsites/jobsiteContext';
import { ModalProvider } from './app/context/modal/modalContext';
import { useAuthDispatch } from './app/context/auth/authContext';
import { loadUser } from './app/context/auth/authActions';
import PrivateRoute from './app/layout/PrivateRoute';

//components
import Navbar from './features/nav/Navbar.js';
import Homepage from './features/home/Homepage';
import ListJobsites from './features/jobsites/ListJobsites';
import RegisterForm from './features/user/RegisterForm';
import ModalContainer from './app/common/modals/ModalContainer';

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
        <ModalProvider>
          <ModalContainer />
          <Route exact path='/' component={Homepage} />
          <Route
            path={'/(.+)'}
            render={() => (
              <Fragment>
                <Navbar />
                <Container style={{ marginTop: '7em' }}>
                  <Header as='h2' icon='users' content='Payroll App' />
                  <Switch>
                    <PrivateRoute
                      exact
                      path='/jobsites'
                      component={ListJobsites}
                    />
                    <PrivateRoute
                      exact
                      path='/register'
                      component={RegisterForm}
                    />
                  </Switch>
                </Container>
              </Fragment>
            )}
          />
        </ModalProvider>
      </JobsiteProvider>
    </Fragment>
  );
};

export default withRouter(App);
