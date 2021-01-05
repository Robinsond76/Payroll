import React, { Fragment } from 'react';
import { Table } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';
import { format } from 'date-fns';

const ClockedIn = () => {
  React.useEffect(() => {
    Timestamps.getClockedInTimestamps().then((result) =>
      setClockedInTimestamps(result.timestamps)
    );
  }, []);

  const [clockedInTimestamps, setClockedInTimestamps] = React.useState([]);

  return (
    <Fragment>
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
                <Table.Cell>{timestamp.displayName}</Table.Cell>
                <Table.Cell>{timestamp.moniker}</Table.Cell>
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
