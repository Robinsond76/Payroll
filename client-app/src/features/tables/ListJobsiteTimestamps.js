import React, { Fragment, useCallback } from 'react';
import { Pagination } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';
import { useTimestampState } from '../../app/context/timestamps/timestampContext';
import FilterDateForm from '../../app/layout/FilterDateForm';
import TimestampTable from './TimestampTable';

//This is a tables page that fetches timestamps at a jobsite for one user or for all users

//forOneUser = timestamps for a single user
//forEmployeeView = Links in table will differ if the table is viewed by an Employee
//noLinksInTable = Remove all Links in table

//this table also allows viewing all timestamps for a jobsite, but its not currently used

const ListJobsiteTimestamps = ({
  username,
  moniker,
  pageSize,
  forCurrentUser = false,
  forEmployeeView = false,
  noLinksInTable = false,
}) => {
  const { fromDate, toDate } = useTimestampState();
  const [timestamps, setTimestamps] = React.useState([]);
  const [pagination, setPagination] = React.useState(0);
  const pageOne = 1;

  const loadTimestamps = useCallback(
    (activePage) => {
      if (forCurrentUser) {
        Timestamps.getCurrentUserJobsiteTimestamps(
          moniker,
          username,
          pageSize,
          activePage,
          fromDate,
          toDate
        ).then((result) => {
          setTimestamps(result.data.timestamps);
          setPagination(JSON.parse(result.headers['x-pagination']));
        });
      } else if (!forCurrentUser && username) {
        Timestamps.getAnyUserJobsiteTimestamps(
          moniker,
          username,
          pageSize,
          activePage,
          fromDate,
          toDate
        ).then((result) => {
          setTimestamps(result.data.timestamps);
          setPagination(JSON.parse(result.headers['x-pagination']));
        });
      } else {
        Timestamps.getJobsiteTimestamps(
          moniker,
          pageSize,
          activePage,
          fromDate,
          toDate
        ).then((result) => {
          setTimestamps(result.data.timestamps);
          setPagination(JSON.parse(result.headers['x-pagination']));
        });
      }
    },
    [forCurrentUser, moniker, username, pageSize, fromDate, toDate]
  );

  React.useEffect(() => {
    loadTimestamps(pageOne);
  }, [loadTimestamps]);

  const pageChangeHandler = async (e, { activePage }) => {
    loadTimestamps(activePage);
  };

  return (
    <Fragment>
      <FilterDateForm />

      <TimestampTable
        timestamps={timestamps}
        forOneUser={username ? true : false}
        forEmployeeView={forEmployeeView}
        noLinksInTable={noLinksInTable}
      />
      {pagination && (
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

export default ListJobsiteTimestamps;
