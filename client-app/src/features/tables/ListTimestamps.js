import React, { Fragment, useCallback } from 'react';
import { Pagination } from 'semantic-ui-react';
import TimestampTable from './TimestampTable';

// import actions
import {
  getUserTimestamps,
  getAllTimestamps,
} from '../../app/context/timestamps/timestampActions';

//import context
import {
  useTimestampState,
  useTimestampDispatch,
} from '../../app/context/timestamps/timestampContext';

const ListTimestamps = ({ pageSize, username }) => {
  const pageOne = 1;

  const tDispatch = useTimestampDispatch();
  const {
    fromDate,
    toDate,
    timestamps,
    timestampPagination,
  } = useTimestampState();

  const loadUserTimestamps = useCallback(
    (activePage) => {
      if (username) {
        getUserTimestamps(
          tDispatch,
          username,
          pageSize,
          activePage,
          fromDate,
          toDate
        );
      } else {
        getAllTimestamps(tDispatch, pageSize, activePage, fromDate, toDate);
      }
    },
    [fromDate, pageSize, tDispatch, toDate, username]
  );

  React.useEffect(() => {
    loadUserTimestamps(pageOne);
    return () => {
      tDispatch({ type: 'CLEAR_TIMESTAMPS' });
    };
  }, [loadUserTimestamps, tDispatch]);

  const pageChangeHandler = (e, { activePage }) => {
    loadUserTimestamps(activePage);
  };

  return (
    <Fragment>
      <TimestampTable
        timestamps={timestamps}
        forOneUser={username ? true : false}
      />
      {timestampPagination && (
        <Pagination
          boundaryRange={0}
          activePage={timestampPagination.CurrentPage}
          onPageChange={pageChangeHandler}
          siblingRange={1}
          totalPages={Math.ceil(
            timestampPagination.TotalCount / timestampPagination.PageSize
          )}
          borderless
          size='small'
          floated='right'
        />
      )}
    </Fragment>
  );
};

export default ListTimestamps;
