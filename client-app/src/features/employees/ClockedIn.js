import React, { Fragment } from 'react';
import { Table } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const ClockedIn = () => {
  React.useEffect(() => {
    Timestamps.getClockedInTimestamps().then((result) => {
      setClockedInJobsites(result.clockedInJobsites);
      setClockedInTimestamps(result.timestamps);
    });
  }, []);

  const [clockedInJobsites, setClockedInJobsites] = React.useState([]);
  const [clockedInTimestamps, setClockedInTimestamps] = React.useState([]);

  return (
    <Fragment>
      <h3>Active Jobsites</h3>
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {clockedInJobsites.map((jobsite) => {
            return (
              <Table.Row key={jobsite.moniker}>
                <Table.Cell>
                  <Link to={`/jobsites/${jobsite.moniker}`}>
                    {jobsite.moniker}
                  </Link>
                </Table.Cell>
                <Table.Cell>{jobsite.name}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      <h3>Employees Currently Clocked In</h3>
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Jobsite</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Clocked In</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {clockedInTimestamps.map((timestamp) => {
            const dateClockedIn = new Date(timestamp.clockedInStamp);
            const date = format(dateClockedIn, 'eeee, MMMM do, yyyy');
            const clockedIn = `${format(dateClockedIn, 'h:mm a')}`;

            return (
              <Table.Row key={timestamp.clockedInStamp}>
                <Table.Cell>
                  <Link to={`/employees/${timestamp.username}`}>
                    {timestamp.displayName}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/jobsites/${timestamp.moniker}`}>
                    {timestamp.moniker}
                  </Link>
                </Table.Cell>
                <Table.Cell>{timestamp.jobsite}</Table.Cell>
                <Table.Cell>{date}</Table.Cell>
                <Table.Cell>{clockedIn}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Fragment>
  );
};

export default ClockedIn;
