import React, { Fragment, useCallback } from 'react';
import { Pagination } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';
import { useTimestampState } from '../../app/context/timestamps/timestampContext';
import FilterDateForm from '../../app/layout/FilterDateForm';
import TimestampTable from './TimestampTable';

const ListJobsiteTimestamps = ({
  username,
  moniker,
  pageSize,
  forOneUser = true,
}) => {
  const { fromDate, toDate } = useTimestampState();
  const [timestamps, setTimestamps] = React.useState([]);
  const [pagination, setPagination] = React.useState(0);
  const pageOne = 1;

  const loadTimestamps = useCallback(
    (activePage) => {
      if (forOneUser) {
        Timestamps.getUserJobsiteTimestamps(
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
    [forOneUser, moniker, username, pageSize, fromDate, toDate]
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

      <TimestampTable timestamps={timestamps} forOneUser={forOneUser} />

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
