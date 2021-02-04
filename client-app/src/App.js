import React, { useEffect, Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { TimestampProvider } from './app/context/timestamps/timestampContext';
import { JobsiteProvider } from './app/context/jobsites/jobsiteContext';
import { ModalProvider } from './app/context/modal/modalContext';
import { useAuthDispatch } from './app/context/auth/authContext';
import { AlertProvider } from './app/context/alerts/alertContext';
import { loadUser } from './app/context/auth/authActions';
import PrivateRoute from './app/layout/PrivateRoute';

//components
import Navbar from './features/nav/Navbar.js';
import Alerts from './app/layout/Alerts';
import ViewJobsites from './features/jobsites/ViewJobsites';
import ModalContainer from './app/common/modals/ModalContainer';
import NotFound from './app/layout/NotFound';
import ViewUserTimestamps from './features/timestamps/ViewUserTimestamps';
import UserJobsiteTimestamps from './features/jobsites/UserJobsiteTimestamps';
import Dashboard from './features/home/Dashboard';
import JobsiteHistory from './features/jobsites/JobsiteHistory';
import ListEmployees from './features/employees/ListEmployees';
import ViewEmployee from './features/employees/ViewEmployee';
import Homepage from './features/home/Homepage';
import EmployeeJobsite from './features/employees/EmployeeJobsite';
import Payroll from './features/employees/Payroll';
import EmployeeWorkHistory from './features/employees/EmployeeWorkHistory';
import ViewAllTimestamps from './features/timestamps/ViewAllTimestamps';
import Refresh from './features/home/Refresh';
import ListManagers from './features/managers/ListManagers';

const App = () => {
  const authDispatch = useAuthDispatch();
  const token = window.localStorage.getItem('token');
  const [isLoaded, setIsLoaded] = React.useState(false);

  //get user if logged in
  useEffect(() => {
    if (token && isLoaded === false) {
      loadUser(authDispatch).catch((err) => {
        throw err;
      });
      setIsLoaded(true);
    }
  }, [token, authDispatch, isLoaded]);

  return (
    <Fragment>
      <JobsiteProvider>
        <TimestampProvider>
          <AlertProvider>
            <ModalProvider>
              <ModalContainer />

              <Route exact path='/' component={Homepage} />
              <Route
                path={'/(.+)'}
                render={() => (
                  <Fragment>
                    <Navbar />
                    <Container style={{ marginTop: '7em' }}>
                      <Alerts />

                      <Switch>
                        <PrivateRoute
                          exact
                          path='/jobsites'
                          component={ViewJobsites}
                        />
                        <PrivateRoute
                          exact
                          path='/jobsites/:moniker'
                          component={JobsiteHistory}
                        />
                        <PrivateRoute
                          exact
                          path='/jobsites/:moniker/:username'
                          component={EmployeeJobsite}
                        />
                        <PrivateRoute
                          exact
                          path='/timestamps'
                          component={ViewAllTimestamps}
                        />
                        <PrivateRoute
                          exact
                          path='/timestamps/user'
                          component={ViewUserTimestamps}
                        />
                        <PrivateRoute
                          exact
                          path='/timestamps/user/:moniker'
                          component={UserJobsiteTimestamps}
                        />
                        <PrivateRoute
                          exact
                          path='/employees'
                          component={ListEmployees}
                        />
                        <PrivateRoute
                          exact
                          path='/dashboard'
                          component={Dashboard}
                        />
                        <PrivateRoute
                          exact
                          path='/employees/payroll'
                          component={Payroll}
                        />
                        <PrivateRoute
                          exact
                          path='/employees/payroll/:username'
                          component={EmployeeWorkHistory}
                        />
                        <PrivateRoute
                          exact
                          path='/employees/:username'
                          component={ViewEmployee}
                        />
                        <PrivateRoute
                          exact
                          path='/managers'
                          component={ListManagers}
                        />
                        <PrivateRoute
                          exact
                          path='/refresh'
                          component={Refresh}
                        />
                        <PrivateRoute component={NotFound} />
                      </Switch>
                    </Container>
                  </Fragment>
                )}
              />
            </ModalProvider>
          </AlertProvider>
        </TimestampProvider>
      </JobsiteProvider>
    </Fragment>
  );
};

export default withRouter(App);
