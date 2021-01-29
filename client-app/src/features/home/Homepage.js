import React, { Fragment } from 'react';
import {
  Button,
  Container,
  Grid,
  Header,
  Image,
  Search,
  Segment,
} from 'semantic-ui-react';
import {
  useAuthDispatch,
  useAuthState,
} from '../../app/context/auth/authContext';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { openModal } from '../../app/context/modal/modalActions';
import LoginForm from '../user/LoginForm';
import { Jobsites } from '../../app/api/agent';
import { clockInUser, clockOutUser } from '../../app/context/auth/authActions';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { history } from '../..';

const TestHome = () => {
  const { isAuthenticated, user } = useAuthState();
  const authDispatch = useAuthDispatch();
  const modalDispatch = useModalDispatch();

  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectionValue, setSelectionValue] = React.useState('');

  //handle selection of search result
  const handleResultSelect = (e, { result }) => setSelectionValue(result.title);

  //jobsite search bar
  const handleSearchChange = async (e, { value }) => {
    setSelectionValue(value);
    setLoading(true);
    let searchResults = await Jobsites.listJobsites(value, 10, 1);
    searchResults = searchResults.data;

    let newResults = [];
    searchResults.forEach((jobsite) => {
      newResults.push({
        title: jobsite.moniker,
        description: `${jobsite.name} - ${jobsite.location.cityTown}`,
      });
    });
    setLoading(false);
    setResults(newResults);
  };

  //Prints date of clockedIn timestamp
  const showClockedInDate = () => {
    const timestamp = new Date(user.clockedInTimestamp.clockedIn);
    const date = format(timestamp, 'eeee, MMMM do, yyyy');
    const time = format(timestamp, 'h:mm a');

    return `${date} at ${time}`;
  };

  //if manager logs in, redirect
  React.useEffect(() => {
    if (user && user.manager === true) history.push('/dashboard');
  }, [user]);

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' color='teal' textAlign='center'>
          <Image
            size='massive'
            src='/assets/logo.png'
            alt='logo'
            style={{ marginBottom: 12 }}
          />{' '}
          Payroll
        </Header>
        <Segment>
          <Container>
            {/* If user is logged in */}
            {isAuthenticated && user ? (
              <Fragment>
                <Header as='h2' content={`Welcome back ${user.displayName},`} />

                {/* If user is CLOCKED in */}
                {user.currentlyClockedIn ? (
                  <Fragment>
                    <h3>Currently clocked in at:</h3>
                    <p>
                      {user.clockedInTimestamp.moniker} -{' '}
                      {user.clockedInTimestamp.jobsite}
                    </p>
                    <p>{showClockedInDate()}</p>

                    <Button
                      onClick={() =>
                        clockOutUser(
                          user.clockedInTimestamp.moniker,
                          authDispatch
                        )
                      }
                    >
                      Clock Out
                    </Button>
                  </Fragment>
                ) : (
                  <Fragment>
                    <h3>You are currently not clocked in.</h3>
                    <p>
                      Last jobsite visited:{' '}
                      {user.lastJobsiteVisited &&
                        user.lastJobsiteVisited.moniker}{' '}
                      -{' '}
                      {user.lastJobsiteVisited &&
                        user.lastJobsiteVisited.jobsite}
                    </p>
                    <Search
                      placeholder='search jobsite...'
                      loading={loading}
                      onResultSelect={handleResultSelect}
                      onSearchChange={handleSearchChange}
                      results={results}
                      value={selectionValue}
                    />
                    <Button
                      style={{ marginTop: '1rem' }}
                      onClick={() => clockInUser(selectionValue, authDispatch)}
                    >
                      Clock In
                    </Button>
                  </Fragment>
                )}
                <br />
                <Button
                  as={Link}
                  to='/timestamps/user'
                  size='small'
                  style={{ marginTop: '1rem' }}
                >
                  My Timestamps
                </Button>
              </Fragment>
            ) : (
              // If user is not logged in
              <Fragment>
                <Header as='h2' content='Welcome to Payroll App' />
                <Button
                  onClick={() => openModal(<LoginForm />, modalDispatch)}
                  to='/login'
                  size='huge'
                >
                  Login
                </Button>
              </Fragment>
            )}
          </Container>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default TestHome;
