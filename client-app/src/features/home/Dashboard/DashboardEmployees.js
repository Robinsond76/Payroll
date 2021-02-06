import { format } from 'date-fns';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Pagination, Table } from 'semantic-ui-react';
import { Timestamps } from '../../../app/api/agent';
import { openModal } from '../../../app/context/modal/modalActions';
import { useModalDispatch } from '../../../app/context/modal/modalContext';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ClockOutEmployee from '../../employees/ClockOutEmployee';

const DashboardEmployees = () => {
  const modalDispatch = useModalDispatch();
  const pageSize = 10;
  const pageOne = 1;

  const [clockedInTimestamps, setClockedInTimestamps] = React.useState([]);
  const [timestampsPagination, setTimestampsPagination] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const loadTimestamps = React.useCallback((pageSize, pageNumber) => {
    setLoading(true);
    Timestamps.getClockedInTimestamps(pageSize, pageNumber).then((result) => {
      setClockedInTimestamps(result.data);
      setTimestampsPagination(JSON.parse(result.headers['x-pagination']));
      setLoading(false);
    });
  }, []);

  //on load, load timestamps
  React.useEffect(() => {
    loadTimestamps(pageSize, pageOne);
  }, [loadTimestamps]);

  const timestampPageChangeHandler = (e, { activePage }) => {
    loadTimestamps(pageSize, activePage);
  };

  if (loading) return <LoadingComponent />;

  return (
    <Fragment>
      <h3>Employees Currently Clocked In</h3>
      <Table selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Jobsite</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Clocked In</Table.HeaderCell>
            <Table.HeaderCell width={1}>Manage</Table.HeaderCell>
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
                <Table.Cell>
                  <span className='clockOut'>
                    <Icon
                      name='stopwatch'
                      onClick={() =>
                        openModal(
                          <ClockOutEmployee
                            moniker={timestamp.moniker}
                            username={timestamp.username}
                          />,
                          modalDispatch
                        )
                      }
                    />
                  </span>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <div style={{ width: '100%', overflow: 'auto' }}>
        {timestampsPagination && (
          <Pagination
            boundaryRange={0}
            activePage={timestampsPagination.CurrentPage}
            onPageChange={timestampPageChangeHandler}
            siblingRange={1}
            totalPages={Math.ceil(
              timestampsPagination.TotalCount / timestampsPagination.PageSize
            )}
            borderless
            size='small'
            floated='right'
          />
        )}
      </div>
    </Fragment>
  );
};

export default DashboardEmployees;
