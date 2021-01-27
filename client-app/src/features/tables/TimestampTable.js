import React from 'react';
import { Table } from 'semantic-ui-react';
import { format, intervalToDuration } from 'date-fns';
import { Link } from 'react-router-dom';
import TimestampForm from '../timestamps/TimestampForm';
import { openModal } from '../../app/context/modal/modalActions';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import DeleteTimestamp from '../timestamps/DeleteTimestamp';

const TimestampsTable = ({
  timestamps,
  forOneUser = false,
  username = '',
  showEditDelete = false,
}) => {
  const modalDispatch = useModalDispatch();

  return (
    <Table padded size='small' celled selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Moniker</Table.HeaderCell>
          <Table.HeaderCell>Job Name</Table.HeaderCell>
          <Table.HeaderCell>Date</Table.HeaderCell>
          {!forOneUser && <Table.HeaderCell>Employee</Table.HeaderCell>}
          <Table.HeaderCell>Clocked In</Table.HeaderCell>
          <Table.HeaderCell>Clocked Out</Table.HeaderCell>
          <Table.HeaderCell>Time Worked</Table.HeaderCell>
          {showEditDelete && <Table.HeaderCell>Manage</Table.HeaderCell>}
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
                <Link to={`/jobsites/${timestamp.moniker}`}>
                  {timestamp.moniker}
                </Link>
              </Table.Cell>
              <Table.Cell>{timestamp.jobsite}</Table.Cell>
              <Table.Cell>{date}</Table.Cell>
              {!forOneUser && <Table.Cell>{timestamp.displayName}</Table.Cell>}
              <Table.Cell>{clockedIn}</Table.Cell>
              <Table.Cell>{clockedOut}</Table.Cell>
              <Table.Cell>
                {duration.days}:{duration.hours}:{duration.minutes}:
                {duration.seconds}
              </Table.Cell>
              {showEditDelete && (
                <Table.Cell>
                  <p>
                    <span
                      className='manage-edit'
                      onClick={() =>
                        openModal(
                          <TimestampForm
                            username={username}
                            editTimestamp={timestamp}
                          />,
                          modalDispatch
                        )
                      }
                    >
                      Edit
                    </span>{' '}
                    |{' '}
                    <span
                      className='manage-delete'
                      onClick={() =>
                        openModal(
                          <DeleteTimestamp
                            timestampId={timestamp.timestampId}
                          />,
                          modalDispatch
                        )
                      }
                    >
                      Delete
                    </span>
                  </p>
                </Table.Cell>
              )}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default TimestampsTable;
