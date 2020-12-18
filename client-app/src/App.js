import React, { Fragment } from 'react';
import { Container, Header } from 'semantic-ui-react'
// import axios from 'axios';
import Navbar from './features/nav/Navbar.js';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//components
import ListJobsites from './features/jobsites/ListJobsites'
import LoginForm   from './features/user/LoginForm'
import RegisterForm from './features/user/RegisterForm'

const App = () => {

  

  return (
    <Fragment>
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
    </Fragment>
  );
}

export default App;
