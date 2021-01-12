import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Table, Pagination } from 'semantic-ui-react';
import { format, intervalToDuration } from 'date-fns';
import { Timestamps } from '../../app/api/agent';

const ViewEmployee = ({ match }) => {
  const username = match.params.username;
  const [user, setUser] = React.useState(null);
  const [pagination, setPagination] = React.useState(0);

  React.useEffect(() => {
    Timestamps.getTimestamps(username, 3, 1).then((result) => {
      setUser(result.data);
      setPagination(JSON.parse(result.headers['x-pagination']));
    });
  }, [username]);

  const pageChangeHandler = async (e, { activePage }) => {
    const result = await Timestamps.getTimestamps(username, 3, activePage);
    setUser(result.data);
    setPagination(JSON.parse(result.headers['x-pagination']));
  };

  return (
    <Fragment>
      <h3>{user && user.displayName}'s Timestamps</h3>
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
          {user &&
            user.timestamps.map((timestamp) => {
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
      {pagination !== 0 && (
        <Pagination
          boundaryRange={0}
          activePage={pagination.CurrentPage}
          onPageChange={pageChangeHandler}
          siblingRange={1}
          totalPages={Math.ceil(pagination.TotalCount / pagination.PageSize)}
        />
      )}
    </Fragment>
  );
};

export default ViewEmployee;
