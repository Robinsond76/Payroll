import React, { Fragment } from 'react';
import { Button, Search } from 'semantic-ui-react';
import { clockInUser } from '../../../app/context/auth/authActions';
import { Jobsites } from '../../../app/api/agent';
import {
  useAuthDispatch,
  useAuthState,
} from '../../../app/context/auth/authContext';

const HomeNotClockedIn = () => {
  const { user } = useAuthState();
  const authDispatch = useAuthDispatch();

  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectionValue, setSelectionValue] = React.useState('');

  //handle selection of search result
  const handleResultSelect = (e, { result }) => setSelectionValue(result.title);

  //handler for jobsite search bar
  const handleSearchChange = async (e, { value }) => {
    setSelectionValue(value);
    setLoading(true);
    let searchResults = await Jobsites.listJobsites(value, 4, 1);
    searchResults = searchResults.data;

    //create a list of objects that the search will accept
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

  return (
    <Fragment>
      <h3 className='homepage-h3'>You are currently not clocked in.</h3>
      <p>
        Last jobsite visited:{' '}
        {user.lastJobsiteVisited && user.lastJobsiteVisited.moniker} -{' '}
        {user.lastJobsiteVisited && user.lastJobsiteVisited.jobsite}
      </p>
      <div style={{ maxWidth: '300px', margin: 'auto' }}>
        <Search
          placeholder='search jobsite...'
          loading={loading}
          onResultSelect={handleResultSelect}
          onSearchChange={handleSearchChange}
          results={results}
          value={selectionValue}
        />
      </div>
      <span className='homepage-clock-in'>
        <Button
          style={{ marginTop: '1rem' }}
          onClick={() => clockInUser(selectionValue, authDispatch)}
          color='teal'
        >
          Clock In
        </Button>
      </span>
    </Fragment>
  );
};

export default HomeNotClockedIn;
