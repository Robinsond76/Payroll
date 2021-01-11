import React, { useEffect, Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { TimestampProvider } from './app/context/timestamps/timestampContext';
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
import NotFound from './app/layout/NotFound';
import Clock from './features/home/Clock';
import ListTimestamps from './features/timestamps/ListTimestamps';
import UserJobsiteTimestamps from './features/jobsites/UserJobsiteTimestamps';
import ClockedIn from './features/employees/ClockedIn';
import JobsiteInfo from './features/jobsites/JobsiteInfo';
import ListEmployees from './features/employees/ListEmployees';
import ViewEmployee from './features/employees/ViewEmployee';

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
        <TimestampProvider>
          <ModalProvider>
            <ModalContainer />
            <Route exact path='/' component={Homepage} />
            <Route
              path={'/(.+)'}
              render={() => (
                <Fragment>
                  <Navbar />
                  <Container style={{ marginTop: '7em' }}>
                    {/* <Header as='h2' icon='users' content='Payroll App' /> */}
                    {/* <Link to='/oogabooga'>Test link for notfound page </Link> */}
                    <Switch>
                      <PrivateRoute
                        exact
                        path='/jobsites'
                        component={ListJobsites}
                      />
                      <PrivateRoute
                        exact
                        path='/jobsite/:moniker'
                        component={JobsiteInfo}
                      />
                      <PrivateRoute
                        exact
                        path='/register'
                        component={RegisterForm}
                      />
                      <PrivateRoute exact path='/clock' component={Clock} />
                      <PrivateRoute
                        exact
                        path='/timestamps'
                        component={ListTimestamps}
                      />
                      <PrivateRoute
                        exact
                        path='/timestamps/:moniker'
                        component={UserJobsiteTimestamps}
                      />
                      <PrivateRoute
                        exact
                        path='/employees'
                        component={ListEmployees}
                      />
                      <PrivateRoute
                        exact
                        path='/employees/clockedIn'
                        component={ClockedIn}
                      />
                      <PrivateRoute
                        exact
                        path='/employees/:username'
                        component={ViewEmployee}
                      />
                      <PrivateRoute component={NotFound} />
                    </Switch>
                  </Container>
                </Fragment>
              )}
            />
          </ModalProvider>
        </TimestampProvider>
      </JobsiteProvider>
    </Fragment>
  );
};

export default withRouter(App);
