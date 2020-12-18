import React, { Fragment } from 'react';
import { Container, Header } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {JobsiteProvider} from './app/context/jobsites/jobsiteContext';

//components
import Navbar from './features/nav/Navbar.js';
import ListJobsites from './features/jobsites/ListJobsites'
import LoginForm   from './features/user/LoginForm'
import RegisterForm from './features/user/RegisterForm'

const App = () => {

  return (
    <Fragment>
      <JobsiteProvider>
        <Router>
          <Navbar />
          <Container style={{marginTop: '7em'}}>
            <Header as='h2' icon='users' content='Payroll App' />
            <Switch>
              <Route exact path='/' component={ListJobsites} />
              <Route exact path='/jobsites' component={ListJobsites} />
              <Route exact path='/register' component={RegisterForm} />
              <Route exact path='/login' component={LoginForm} />
            </Switch>
          </Container>
        </Router>
      </JobsiteProvider>
    </Fragment>
  );
}

export default App;
