import React, { Fragment } from 'react';
import { Icon, Pagination, Table } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { openModal } from '../../app/context/modal/modalActions';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import ClockOutEmployee from '../employees/ClockOutEmployee';

const Dashboard = () => {
  const modalDispatch = useModalDispatch();
  const pageSize = 3;
  const pageOne = 1;

  const [clockedInJobsites, setClockedInJobsites] = React.useState([]);
  const [jobsitesPagination, setJobsitesPagination] = React.useState(null);
  const [clockedInTimestamps, setClockedInTimestamps] = React.useState([]);
  const [timestampsPagination, setTimestampsPagination] = React.useState(null);

  const loadJobsites = React.useCallback((pageSize, pageNumber) => {
    Timestamps.getClockedInJobsites(pageSize, pageNumber).then((result) => {
      setClockedInJobsites(result.data);
      setJobsitesPagination(JSON.parse(result.headers['x-pagination']));
    });
  }, []);

  const loadTimestamps = React.useCallback((pageSize, pageNumber) => {
    Timestamps.getClockedInTimestamps(pageSize, pageNumber).then((result) => {
      setClockedInTimestamps(result.data);
      setTimestampsPagination(JSON.parse(result.headers['x-pagination']));
    });
  }, []);

  React.useEffect(() => {
    loadJobsites(pageSize, pageOne);
    loadTimestamps(pageSize, pageOne);
  }, [loadJobsites, loadTimestamps]);

  const jobsitePageChangeHandler = (e, { activePage }) => {
    loadJobsites(pageSize, activePage);
  };

  const timestampPageChangeHandler = (e, { activePage }) => {
    loadTimestamps(pageSize, activePage);
  };

  return (
    <Fragment>
      <h3>Jobsites Clocked Into</h3>
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
      {jobsitesPagination && (
        <Pagination
          boundaryRange={0}
          activePage={jobsitesPagination.CurrentPage}
          onPageChange={jobsitePageChangeHandler}
          siblingRange={1}
          totalPages={Math.ceil(
            jobsitesPagination.TotalCount / jobsitesPagination.PageSize
          )}
          borderless
          size='small'
          floated='right'
        />
      )}

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
    </Fragment>
  );
};

export default Dashboard;
