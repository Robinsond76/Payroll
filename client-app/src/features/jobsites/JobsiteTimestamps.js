import React, { Fragment } from 'react';
import { useAuthState } from '../../app/context/auth/authContext';
import {
  useTimestampState,
  useTimestampDispatch,
} from '../../app/context/timestamps/timestampContext';
import {
  getJobsiteTimestampsByUser,
  clearJobsiteTimestamps,
} from '../../app/context/timestamps/timestampActions';
import { Table, Pagination } from 'semantic-ui-react';
import { format, intervalToDuration } from 'date-fns';
import LoadingComponent from '../../app/layout/LoadingComponent';

const JobsiteTimestamps = ({ match }) => {
  const moniker = match.params.moniker;
  const { user } = useAuthState();
  const { username } = user;
  const { jobsiteTimestamps, jobsitePagination, loading } = useTimestampState();
  const timestampDispatch = useTimestampDispatch();
  const { TotalCount, PageSize, CurrentPage } = jobsitePagination;

  React.useEffect(() => {
    getJobsiteTimestampsByUser(moniker, username, timestampDispatch);

    return () => {
      clearJobsiteTimestamps(timestampDispatch);
    };
  }, [moniker, timestampDispatch, username]);

  const pageChangeHandler = (e, { activePage }) => {
    getJobsiteTimestampsByUser(
      moniker,
      username,
      timestampDispatch,
      3,
      activePage
    );
  };

  //LOADER
  if (loading) return <LoadingComponent />;

  return (
    <Fragment>
      <h2>{moniker}</h2>
      <Table celled selectable>
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
          {jobsiteTimestamps.map((timestamp) => {
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

      {jobsitePagination && (
        <Pagination
          boundaryRange={0}
          activePage={CurrentPage}
          onPageChange={pageChangeHandler}
          siblingRange={1}
          totalPages={Math.ceil(TotalCount / PageSize)}
        />
      )}
    </Fragment>
  );
};

export default JobsiteTimestamps;
