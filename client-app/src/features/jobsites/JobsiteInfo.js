import { format, intervalToDuration } from 'date-fns';
import React, { Fragment } from 'react';
import { Pagination, Table } from 'semantic-ui-react';
import { Jobsites } from '../../app/api/agent';
import { v4 as uuidv4 } from 'uuid';

// /jobsites/moniker
const JobsiteInfo = ({ match }) => {
  const moniker = match.params.moniker;

  const [jobsite, setJobsite] = React.useState(null);
  const [pagination, setPagination] = React.useState(0);

  const pageChangeHandler = async (e, { activePage }) => {
    const result = await Jobsites.getJobsite(moniker, 3, activePage);
    setJobsite(result.data);
    setPagination(JSON.parse(result.headers['x-pagination']));
  };

  React.useEffect(() => {
    Jobsites.getJobsite(moniker, 3, 1).then((result) => {
      setJobsite(result.data);
      setPagination(JSON.parse(result.headers['x-pagination']));
    });
    console.log('useeffect ran');
  }, [moniker]);

  return (
    <Fragment>
      <h2>
        {jobsite && jobsite.name} - {jobsite && jobsite.moniker}
      </h2>
      <p>All employees who clocked into this location:</p>
      <ul>
        {jobsite &&
          jobsite.employeesThatClocked.map((employee) => (
            <li key={uuidv4()}>{employee}</li>
          ))}
      </ul>
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Clocked In Now</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Clocked In</Table.HeaderCell>
            <Table.HeaderCell>Clocked Out</Table.HeaderCell>
            <Table.HeaderCell>Time Worked</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {jobsite &&
            jobsite.timestamps.map((timestamp) => {
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
                <Table.Row key={uuidv4()}>
                  <Table.Cell>{timestamp.displayName}</Table.Cell>
                  <Table.Cell>
                    {timestamp.CurrentlyClockedIn ? 'Yes' : 'No'}
                  </Table.Cell>
                  <Table.Cell>{date}</Table.Cell>
                  <Table.Cell>{clockedIn}</Table.Cell>
                  <Table.Cell>
                    {timestamp.CurrentlyClockedIn ? '--' : `${clockedOut}`}
                  </Table.Cell>
                  <Table.Cell>
                    {timestamp.CurrentlyClockedIn
                      ? '--'
                      : `${duration.days}:${duration.hours}:${duration.minutes}:
                    ${duration.seconds}`}
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

export default JobsiteInfo;
