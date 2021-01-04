import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Header,
  Image,
  Segment,
  Dropdown,
} from 'semantic-ui-react';
import {
  useAuthDispatch,
  useAuthState,
} from '../../app/context/auth/authContext';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { openModal } from '../../app/context/modal/modalActions';
import LoginForm from '../user/LoginForm';
import { clockInUser, clockOutUser } from '../../app/context/auth/authActions';
import {
  useJobsiteDispatch,
  useJobsiteState,
} from '../../app/context/jobsites/jobsiteContext';
import { getJobsites } from '../../app/context/jobsites/jobsiteActions';
import { format } from 'date-fns';

const Homepage = () => {
  const { isAuthenticated, user } = useAuthState();
  const authDispatch = useAuthDispatch();
  const modalDispatch = useModalDispatch();

  const { jobsites } = useJobsiteState();
  const jobsiteDispatch = useJobsiteDispatch();

  const [jobsiteList, setJobsiteList] = React.useState([]);

  //load jobsites on first visit
  React.useEffect(() => {
    if (user && jobsites.length === 0) {
      getJobsites(jobsiteDispatch);
      console.log('database call ran');
    }
  }, [user, jobsites, jobsiteDispatch]);

  //populate the selection with jobsites
  React.useEffect(() => {
    setJobsiteList(
      jobsites.map((jobsite) => ({
        key: jobsite.moniker,
        text: `${jobsite.moniker} - ${jobsite.name}`,
        value: jobsite.moniker,
      }))
    );
    console.log('second effect ran');
  }, [jobsites]);

  //handle dropdown selection
  const [selection, setSelection] = React.useState('');
  const handleSelect = (e, { value }) => {
    setSelection(value);
  };

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
              <Fragment>
                <h3>You are currently clocked in at: </h3>
                <h2>{user.clockedInTimestamp.moniker}</h2>
                <h3>{user.clockedInTimestamp.jobsite}</h3>
                <h4>
                  Clocked in on:{' '}
                  {format(
                    new Date(user.clockedInTimestamp.clockedIn),
                    'eeee, MMMM do, yyyy'
                  )}{' '}
                  at {format(user.clockedInTimestamp.clockedIn, 'h:mm a')}
                </h4>

                <Button
                  onClick={() =>
                    clockOutUser(user.clockedInTimestamp.moniker, authDispatch)
                  }
                >
                  Clock Out
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <h3>You are not currently clocked in.</h3>
                <p>Choose a jobsite below:</p>
                <Dropdown
                  placeholder='Jobsite'
                  search
                  selection
                  clearable
                  options={jobsiteList}
                  onChange={handleSelect}
                />
                <Button onClick={() => clockInUser(selection, authDispatch)}>
                  Clock in
                </Button>
              </Fragment>
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
