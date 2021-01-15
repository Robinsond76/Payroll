import { format, intervalToDuration } from 'date-fns';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button, Pagination, Table } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';

// url: /employees/(username)/(jobsite)
const EmployeeJobsite = ({ match }) => {
  const username = match.params.username;
  const moniker = match.params.moniker;

  const [timestamps, setTimestamps] = React.useState([]);
  const [pagination, setPagination] = React.useState(0);

  React.useEffect(() => {
    Timestamps.getJobsiteTimestamps(moniker, username, 3, 1).then((result) => {
      setTimestamps(result.data.timestamps);
      setPagination(JSON.parse(result.headers['x-pagination']));
    });
  }, [username, moniker]);

  const pageChangeHandler = async (e, { activePage }) => {
    const result = await Timestamps.getJobsiteTimestamps(
      moniker,
      username,
      3,
      activePage
    );
    setTimestamps(result.data.timestamps);
    setPagination(JSON.parse(result.headers['x-pagination']));
  };

  return (
    <Fragment>
      <h2>{moniker}</h2>
      <p>Showing timestamps for user '{username}' at this location</p>
      <Button as={Link} to={`/jobsites/${moniker}`} size='mini'>
        See all timestamps
      </Button>
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

      {pagination && (
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

export default EmployeeJobsite;
