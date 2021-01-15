import { format, intervalToDuration } from 'date-fns';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Table } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';
import FilterDateForm from '../../app/layout/FilterDateForm';
import { useTimestampState } from '../../app/context/timestamps/timestampContext';

const ListAllTimestamps = () => {
  const { fromDate, toDate } = useTimestampState();

  const [timestamps, setTimestamps] = React.useState([]);
  const [timestampPagination, setTimestampPagination] = React.useState(0);
  const [jobsitesVisited, setJobsitesVisited] = React.useState([]);
  const [jobsitesPagination, setJobsitesPagination] = React.useState(0);

  React.useEffect(() => {
    Timestamps.getAllTimestamps(3, 1).then((result) => {
      setTimestamps(result.data);
      setTimestampPagination(JSON.parse(result.headers['x-pagination']));
    });
    Timestamps.getJobsitesVisited(3, 1).then((result) => {
      setJobsitesVisited(result.data);
      setJobsitesPagination(JSON.parse(result.headers['x-pagination']));
    });
  }, []);

  const loadTimestamps = async (activePage = 1) => {
    const result = await Timestamps.getAllTimestamps(
      3,
      activePage,
      fromDate,
      toDate
    );
    setTimestamps(result.data);
    setTimestampPagination(JSON.parse(result.headers['x-pagination']));
  };

  const loadJobsites = async (activePage = 1) => {
    const result = await Timestamps.getJobsitesVisited(
      3,
      activePage,
      fromDate,
      toDate
    );
    setJobsitesVisited(result.data);
    setJobsitesPagination(JSON.parse(result.headers['x-pagination']));
  };

  const timestampPageChangeHandler = async (e, { activePage }) => {
    loadTimestamps(activePage);
  };

  const jobsitePageChangeHandler = async (e, { activePage }) => {
    loadJobsites(activePage);
  };

  const filterHandler = async () => {
    await loadJobsites();
    await loadTimestamps();
  };

  return (
    <Fragment>
      <FilterDateForm filterHandler={filterHandler} />

      <h3>Jobsites Visited</h3>
      <Table padded size='small' celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Job Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {jobsitesVisited.map((jobsite) => {
            return (
              <Table.Row key={jobsite.moniker}>
                <Table.Cell>{jobsite.moniker}</Table.Cell>
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
        />
      )}

      <h3>Timestamps</h3>
      <Table padded size='small' celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Job Name</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>Employee</Table.HeaderCell>
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
                <Table.Cell>
                  <Link to={`/jobsites/${timestamp.moniker}`}>
                    {timestamp.moniker}
                  </Link>
                </Table.Cell>
                <Table.Cell>{timestamp.jobsite}</Table.Cell>
                <Table.Cell>{date}</Table.Cell>
                <Table.Cell>{timestamp.displayName}</Table.Cell>
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
      {timestampPagination && (
        <Pagination
          boundaryRange={0}
          activePage={timestampPagination.CurrentPage}
          onPageChange={timestampPageChangeHandler}
          siblingRange={1}
          totalPages={Math.ceil(
            timestampPagination.TotalCount / timestampPagination.PageSize
          )}
        />
      )}
    </Fragment>
  );
};

export default ListAllTimestamps;
