import React from 'react';
import { format, intervalToDuration } from 'date-fns';
import { Table } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';

const JobsiteHistoryTable = ({ timestamps }) => {
  return (
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
  );
};

export default JobsiteHistoryTable;
