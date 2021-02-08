import React, { Fragment, useCallback } from 'react';
import { Image, Pagination, Segment } from 'semantic-ui-react';
import TimestampTable from './TimestampTable';

// import actions
import {
  getCurrentUserTimestamps,
  getUserTimestamps,
  getAllTimestamps,
} from '../../app/context/timestamps/timestampActions';

//import context
import {
  useTimestampState,
  useTimestampDispatch,
} from '../../app/context/timestamps/timestampContext';

//This is a table component
//username: If username is provided, will retrieve that user's timestamps
//forCurrentUser: table will load currently logged in user's timestamps, otherwise, everyone's
//showEditDelete: Will show options to edit/delete the timestamps
//forEmployeeView: If true, will change certain links on table

const ListTimestamps = ({
  pageSize,
  username,
  forCurrentUser = false,
  showEditDelete = false,
  forEmployeeView = false,
}) => {
  const pageOne = 1;

  const tDispatch = useTimestampDispatch();
  const {
    fromDate,
    toDate,
    timestamps,
    timestampPagination,
    loading,
  } = useTimestampState();

  const loadUserTimestamps = useCallback(
    (activePage) => {
      if (forCurrentUser) {
        getCurrentUserTimestamps(
          tDispatch,
          pageSize,
          activePage,
          fromDate,
          toDate
        );
      } else if (username) {
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
    [forCurrentUser, fromDate, pageSize, tDispatch, toDate, username]
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

  if (loading)
    return (
      <Segment loading={loading}>
        <Image src='/assets/paragraph.png' />
      </Segment>
    );

  return (
    <Fragment>
      <TimestampTable
        timestamps={timestamps}
        forOneUser={username ? true : false}
        username={username}
        showEditDelete={showEditDelete}
        forEmployeeView={forEmployeeView}
      />
      <div style={{ width: '100%', overflow: 'auto' }}>
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
      </div>
    </Fragment>
  );
};

export default ListTimestamps;
