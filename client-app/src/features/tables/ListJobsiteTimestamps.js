import React, { Fragment, useCallback } from 'react';
import { Image, Pagination, Segment } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';
import { useTimestampState } from '../../app/context/timestamps/timestampContext';
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
  const [loading, setLoading] = React.useState(false);
  const [timestamps, setTimestamps] = React.useState([]);
  const [pagination, setPagination] = React.useState(null);

  const pageOne = 1;

  const loadTimestamps = useCallback(
    (activePage) => {
      setLoading(true);
      //retrieves timestamps at jobsite for current logged-in user
      if (forCurrentUser) {
        Timestamps.getCurrentUserJobsiteTimestamps(
          moniker,
          pageSize,
          activePage,
          fromDate,
          toDate
        ).then((result) => {
          setTimestamps(result.data.timestamps);
          setPagination(JSON.parse(result.headers['x-pagination']));
          setLoading(false);
        });
      } else if (!forCurrentUser && username) {
        //retrieves timestamps at jobsite for any user
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
          setLoading(false);
        });
      }
    },
    [forCurrentUser, username, moniker, pageSize, fromDate, toDate]
  );

  React.useEffect(() => {
    loadTimestamps(pageOne);
  }, [loadTimestamps]);

  const pageChangeHandler = async (e, { activePage }) => {
    if (pagination.HasNext || pagination.HasPrevious) {
      loadTimestamps(activePage);
    }
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
        forEmployeeView={forEmployeeView}
        noLinksInTable={noLinksInTable}
      />
      <div style={{ width: '100%', overflow: 'auto', marginBottom: '30px' }}>
        {pagination && (
          <Pagination
            boundaryRange={0}
            activePage={pagination.CurrentPage}
            onPageChange={pageChangeHandler}
            siblingRange={1}
            totalPages={Math.ceil(pagination.TotalCount / pagination.PageSize)}
            borderless
            size='small'
            floated='right'
          />
        )}
      </div>
    </Fragment>
  );
};

export default ListJobsiteTimestamps;
