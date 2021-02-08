import React from 'react';
import { Table, Icon, Segment, Image } from 'semantic-ui-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import TimestampForm from '../timestamps/TimestampForm';
import { openModal } from '../../app/context/modal/modalActions';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import DeleteTimestamp from '../timestamps/DeleteTimestamp';
import { getDuration } from '../../app/common/util';

const TimestampsTable = ({
  loading,
  timestamps,
  forOneUser = false,
  forEmployeeView = false,
  username = '',
  showEditDelete = false,
  noLinksInTable = false,
}) => {
  const modalDispatch = useModalDispatch();

  if (loading)
    return (
      <Segment loading={loading}>
        <Image src='/assets/paragraph.png' />
      </Segment>
    );

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
          <Table.HeaderCell>
            Time Worked <span className='duration'>(hh:mm:ss)</span>
          </Table.HeaderCell>
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
          const duration = getDuration(dateClockedIn, dateClockedOut);

          //Links in Table
          let monikerLink;
          if (forEmployeeView && !noLinksInTable) {
            monikerLink = (
              <Link to={`/timestamps/user/${timestamp.moniker}`}>
                {timestamp.moniker}
              </Link>
            );
          } else if (noLinksInTable) {
            monikerLink = timestamp.moniker;
          } else {
            monikerLink = (
              <Link to={`/jobsites/${timestamp.moniker}`}>
                {timestamp.moniker}
              </Link>
            );
          }

          return (
            <Table.Row key={timestamp.clockedInStamp}>
              <Table.Cell>{monikerLink}</Table.Cell>
              <Table.Cell>{timestamp.jobsite}</Table.Cell>
              <Table.Cell>{date}</Table.Cell>
              {!forOneUser && <Table.Cell>{timestamp.displayName}</Table.Cell>}
              <Table.Cell>{clockedIn}</Table.Cell>
              <Table.Cell>{clockedOut}</Table.Cell>
              <Table.Cell>{duration}</Table.Cell>
              {showEditDelete && (
                <Table.Cell>
                  <div style={{ margin: 'auto' }}>
                    <Icon
                      name='edit'
                      color='blue'
                      style={{ marginLeft: '10px', cursor: 'pointer' }}
                      onClick={() =>
                        openModal(
                          <TimestampForm
                            username={username}
                            editTimestamp={timestamp}
                          />,
                          modalDispatch
                        )
                      }
                    />
                    <Icon
                      name='cancel'
                      style={{
                        marginLeft: '10px',
                        cursor: 'pointer',
                        color: 'crimson',
                      }}
                      onClick={() =>
                        openModal(
                          <DeleteTimestamp
                            timestampId={timestamp.timestampId}
                          />,
                          modalDispatch
                        )
                      }
                    />
                  </div>
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
