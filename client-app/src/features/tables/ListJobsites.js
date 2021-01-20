import React, { Fragment, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Table } from 'semantic-ui-react';

// import actions
import {
  getJobsites,
  getJobsitesVisitedByDate,
} from '../../app/context/jobsites/jobsiteActions';

//import context
import {
  useJobsiteState,
  useJobsiteDispatch,
} from '../../app/context/jobsites/jobsiteContext';
import { useTimestampState } from '../../app/context/timestamps/timestampContext';

const ListJobsites = ({ pageSize, query = '', basicView = false }) => {
  const jDispatch = useJobsiteDispatch();
  const { jobsites, jobsitePagination } = useJobsiteState();
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
  }, [loadJobsites, query]);

  const pageChangeHandler = (e, { activePage }) => {
    loadJobsites(activePage, query);
  };

  return (
    <Fragment>
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
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={basicView ? '2' : '9'}>
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
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Fragment>
  );
};

export default ListJobsites;
