import React, { Fragment } from 'react';
import { Button, Form, Input, Pagination, Table } from 'semantic-ui-react';
import { Jobsites } from '../../app/api/agent';

import {
  useAuthDispatch,
  useAuthState,
} from '../../app/context/auth/authContext';
import { clockInUser, clockOutUser } from '../../app/context/auth/authActions';

const Clock = () => {
  const { user } = useAuthState();
  const authDispatch = useAuthDispatch();

  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [searched, setSearched] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState([]);
  const [searchPagination, setSearchPagination] = React.useState(0);

  const searchJobsites = async (query) => {
    setLoading(true);
    const result = await Jobsites.listJobsites(query, 3, 1);
    if (!searched) setSearched(true);
    setSearchResult(result.data);
    setLoading(false);
    setSearchPagination(JSON.parse(result.headers['x-pagination']));
  };

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  const pageChangeHandler = async (e, { activePage }) => {
    const result = await Jobsites.listJobsites(query, 3, activePage);
    setSearchResult(result.data);
    setSearchPagination(JSON.parse(result.headers['x-pagination']));
  };

  return (
    <Fragment>
      {user.currentlyClockedIn ? (
        <Fragment>
          <h3>
            You are currently clocked in at jobsite{' '}
            {user.clockedInTimestamp.moniker}
          </h3>
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
          <p>Search for a jobsite below:</p>

          <Form onSubmit={() => searchJobsites(query)}>
            <Input
              name='query'
              value={query}
              onChange={onChange}
              action={
                loading ? { icon: 'search', loading: true } : { icon: 'search' }
              }
              placeholder='Search...'
            />
          </Form>
          {searchResult.length === 0 &&
            searched === true &&
            'No Jobsite found...'}
          {searchResult.length > 0 && (
            <Fragment>
              <Table padded size='small' celled selectable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Action</Table.HeaderCell>
                    <Table.HeaderCell>Moniker</Table.HeaderCell>
                    <Table.HeaderCell>Job Name</Table.HeaderCell>
                    <Table.HeaderCell>City</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {searchResult.map((jobsite) => {
                    return (
                      <Table.Row key={jobsite.moniker}>
                        <Table.Cell collapsing>
                          <Button
                            onClick={() =>
                              clockInUser(jobsite.moniker, authDispatch)
                            }
                          >
                            Clock In
                          </Button>
                        </Table.Cell>
                        <Table.Cell>{jobsite.moniker}</Table.Cell>
                        <Table.Cell>{jobsite.name}</Table.Cell>
                        <Table.Cell>{jobsite.location.cityTown}</Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
              {searchPagination !== 0 && (
                <Pagination
                  boundaryRange={0}
                  activePage={searchPagination.CurrentPage}
                  onPageChange={pageChangeHandler}
                  siblingRange={1}
                  totalPages={Math.ceil(
                    searchPagination.TotalCount / searchPagination.PageSize
                  )}
                />
              )}
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Clock;
