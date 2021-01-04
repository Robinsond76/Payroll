import React, { Fragment } from 'react';
import { getUserTimestamps } from '../../app/context/timestamps/timestampActions';
import {
  useTimestampState,
  useTimestampDispatch,
} from '../../app/context/timestamps/timestampContext';
import { useAuthState } from '../../app/context/auth/authContext';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { Table } from 'semantic-ui-react';
import { format, intervalToDuration } from 'date-fns';
import { Pagination } from 'semantic-ui-react';

const ListTimestamps = () => {
  const { user } = useAuthState();
  const { username } = user;
  const { timestamps, timestampPagination, loading } = useTimestampState();
  const timestampDispatch = useTimestampDispatch();
  const { TotalCount, PageSize } = timestampPagination;

  React.useEffect(() => {
    if (timestamps.length === 0) {
      getUserTimestamps(username, timestampDispatch);
      console.log('useEffect LT01 ran with database call');
    }
    console.log('useEffect LT01 ran');
  }, [timestampDispatch, timestamps.length, username]);

  //page variables and functions
  const [activePage, setActivePage] = React.useState(1);

  const pageChangeHandler = (e, { activePage }) => {
    setActivePage(activePage);
    getUserTimestamps(username, timestampDispatch, 3, activePage);
  };

  //LOADER
  if (loading) return <LoadingComponent />;

  return (
    <Fragment>
      <Table celled selectable>
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
                <Table.Cell>{timestamp.moniker}</Table.Cell>
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
          activePage={activePage}
          onPageChange={pageChangeHandler}
          siblingRange={1}
          totalPages={Math.ceil(TotalCount / PageSize)}
        />
      )}
    </Fragment>
  );
};

export default ListTimestamps;
