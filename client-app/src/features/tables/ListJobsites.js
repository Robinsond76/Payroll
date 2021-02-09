import React, { Fragment, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Segment, Table, Image } from 'semantic-ui-react';
//import context
import {
  useJobsiteState,
  useJobsiteDispatch,
} from '../../app/context/jobsites/jobsiteContext';
import { useTimestampState } from '../../app/context/timestamps/timestampContext';

// import actions
import {
  getJobsites,
  getJobsitesVisitedByDate,
} from '../../app/context/jobsites/jobsiteActions';

//this is a table component
//pageSize: determines how many results to return per page on table
//query: The query is necessary for loading pages beyond page one of query in the
//'View Jobsites' component
//basicView: used to display only two columns. If true, returns jobsites visited

const ListJobsites = ({ pageSize, query = '', basicView = false }) => {
  const jDispatch = useJobsiteDispatch();
  const { jobsites, jobsitePagination, loading } = useJobsiteState();
  const { fromDate, toDate } = useTimestampState();
  const pageOne = 1;

  const loadJobsites = useCallback(
    (activePage, query) => {
      if (basicView) {
        getJobsitesVisitedByDate(
          jDispatch,
          pageSize,
          activePage,
          fromDate,
          toDate
        );
      } else {
        getJobsites(jDispatch, query, pageSize, activePage);
      }
    },
    [basicView, fromDate, jDispatch, pageSize, toDate]
  );

  React.useEffect(() => {
    loadJobsites(pageOne, query);
    return () => {
      jDispatch({ type: 'CLEAR_JOBSITES' });
    };
  }, [jDispatch, loadJobsites, query]);

  const pageChangeHandler = (e, { activePage }) => {
    if (jobsitePagination.HasNext || jobsitePagination.HasPrevious) {
      loadJobsites(activePage, query);
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
      {/* <div style={{ marginBottom: '15px' }}> */}
      <Table padded size='small' celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Job Name</Table.HeaderCell>
            {!basicView && (
              <Fragment>
                <Table.HeaderCell>Address 1</Table.HeaderCell>
                <Table.HeaderCell>Address 2</Table.HeaderCell>
                <Table.HeaderCell>Address 3</Table.HeaderCell>
                <Table.HeaderCell>City</Table.HeaderCell>
                <Table.HeaderCell>State</Table.HeaderCell>
                <Table.HeaderCell>Zip Code</Table.HeaderCell>
                <Table.HeaderCell>Country</Table.HeaderCell>
              </Fragment>
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {jobsites.map((jobsite) => {
            return (
              <Table.Row key={jobsite.moniker}>
                <Table.Cell>
                  <Link to={`/jobsites/${jobsite.moniker}`}>
                    {jobsite.moniker}
                  </Link>
                </Table.Cell>
                <Table.Cell>{jobsite.name}</Table.Cell>
                {!basicView && jobsite.location && (
                  <Fragment>
                    <Table.Cell>{jobsite.location.address1}</Table.Cell>
                    <Table.Cell>{jobsite.location.address2}</Table.Cell>
                    <Table.Cell>{jobsite.location.address3}</Table.Cell>
                    <Table.Cell>{jobsite.location.cityTown}</Table.Cell>
                    <Table.Cell>{jobsite.location.stateProvince}</Table.Cell>
                    <Table.Cell>{jobsite.location.postalCode}</Table.Cell>
                    <Table.Cell>{jobsite.location.country}</Table.Cell>
                  </Fragment>
                )}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <div style={{ width: '100%', overflow: 'auto', marginBottom: '30px' }}>
        {jobsitePagination && (
          <Pagination
            boundaryRange={0}
            activePage={jobsitePagination.CurrentPage}
            onPageChange={pageChangeHandler}
            siblingRange={1}
            totalPages={Math.ceil(
              jobsitePagination.TotalCount / jobsitePagination.PageSize
            )}
            borderless
            size='small'
            floated='right'
          />
        )}
      </div>
      {/* </div> */}
    </Fragment>
  );
};

export default ListJobsites;
