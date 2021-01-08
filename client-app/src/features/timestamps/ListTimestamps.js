import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { getUserTimestamps } from '../../app/context/timestamps/timestampActions';
import {
  useTimestampState,
  useTimestampDispatch,
} from '../../app/context/timestamps/timestampContext';
import { useAuthState } from '../../app/context/auth/authContext';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { Table, Pagination } from 'semantic-ui-react';
import { format, intervalToDuration } from 'date-fns';

const ListTimestamps = () => {
  const { user } = useAuthState();
  const { displayName, username } = user;
  const { timestamps, timestampPagination, loading } = useTimestampState();
  const timestampDispatch = useTimestampDispatch();
  const { TotalCount, PageSize, CurrentPage } = timestampPagination;

  React.useEffect(() => {
    if (timestamps.length === 0) {
      getUserTimestamps(username, timestampDispatch);
    }
  }, [timestampDispatch, timestamps.length, username]);

  //page variables and functions

  const pageChangeHandler = (e, { activePage }) => {
    getUserTimestamps(username, timestampDispatch, 3, activePage);
  };

  //LOADER
  if (loading) return <LoadingComponent />;

  return (
    <Fragment>
      <h3>{displayName}'s Timestamps</h3>
      <Table padded size='small' celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Job Name</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Clocked In</Table.HeaderCell>
            <Table.HeaderCell>Clocked Out</Table.HeaderCell>
            <Table.HeaderCell>Time Worked</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {timestamps.map((timestamp) => {
            const dateClockedIn = new Date(timestamp.clockedInStamp);
            const dateClockedOut = new Date(timestamp.clockedOutStamp);
            const date = format(dateClockedIn, 'eeee, MMMM do, yyyy');
            const clockedIn = `${format(dateClockedIn, 'h:mm a')}`;
            const clockedOut = `${format(dateClockedOut, 'h:mm a')}`;
            const duration = intervalToDuration({
              start: dateClockedIn,
              end: dateClockedOut,
            });

            return (
              <Table.Row key={timestamp.clockedInStamp}>
                <Table.Cell>
                  <Link to={`/timestamps/${timestamp.moniker}`}>
                    {timestamp.moniker}
                  </Link>
                </Table.Cell>
                <Table.Cell>{timestamp.jobsite}</Table.Cell>
                <Table.Cell>{date}</Table.Cell>
                <Table.Cell>{clockedIn}</Table.Cell>
                <Table.Cell>{clockedOut}</Table.Cell>
                <Table.Cell>
                  {duration.days}:{duration.hours}:{duration.minutes}:
                  {duration.seconds}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      {timestampPagination && (
        <Pagination
          boundaryRange={0}
          activePage={CurrentPage}
          onPageChange={pageChangeHandler}
          siblingRange={1}
          totalPages={Math.ceil(TotalCount / PageSize)}
        />
      )}
    </Fragment>
  );
};

export default ListTimestamps;
