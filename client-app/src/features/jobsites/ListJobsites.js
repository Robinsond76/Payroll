import React, { Fragment, useEffect } from 'react';
import { Header, Input, Form, Table, Pagination } from 'semantic-ui-react';
import LoadingComponent from '../../app/layout/LoadingComponent';

import { getJobsites } from '../../app/context/jobsites/jobsiteActions';
import {
  useJobsiteState,
  useJobsiteDispatch,
} from '../../app/context/jobsites/jobsiteContext';
import { Link } from 'react-router-dom';

const ListJobsites = () => {
  const jobsiteDispatch = useJobsiteDispatch();
  const { jobsites, jobsitePagination, loading } = useJobsiteState();
  const { TotalCount, PageSize, CurrentPage } = jobsitePagination;

  //get jobsites if necessary
  useEffect(() => {
    if (jobsites.length === 0) {
      getJobsites(jobsiteDispatch);
    }
  }, [jobsites, jobsiteDispatch]);

  const [query, setQuery] = React.useState('');

  const searchJobsites = (query) => {
    getJobsites(jobsiteDispatch, query);
  };

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  const pageChangeHandler = (e, { activePage }) => {
    getJobsites(jobsiteDispatch, query, 3, activePage);
  };

  if (loading) return <LoadingComponent />;

  return (
    <Fragment>
      <Header as='h2' icon='map' content='Jobsites' />

      <Form onSubmit={() => searchJobsites(query)}>
        <Input
          name='query'
          value={query}
          onChange={onChange}
          action={
            loading ? { icon: 'search', loading: true } : { icon: 'search' }
          }
          placeholder='Search...'
        />
      </Form>
      <Table padded size='small' celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Job Name</Table.HeaderCell>
            <Table.HeaderCell>Address 1</Table.HeaderCell>
            <Table.HeaderCell>Address 2</Table.HeaderCell>
            <Table.HeaderCell>Address 3</Table.HeaderCell>
            <Table.HeaderCell>City</Table.HeaderCell>
            <Table.HeaderCell>State</Table.HeaderCell>
            <Table.HeaderCell>Zip Code</Table.HeaderCell>
            <Table.HeaderCell>Country</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {jobsites &&
            jobsites.map((jobsite) => {
              return (
                <Table.Row key={jobsite.moniker}>
                  <Table.Cell>
                    <Link to={`/jobsites/${jobsite.moniker}`}>
                      {jobsite.moniker}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{jobsite.name}</Table.Cell>
                  <Table.Cell>{jobsite.location.address1}</Table.Cell>
                  <Table.Cell>{jobsite.location.address2}</Table.Cell>
                  <Table.Cell>{jobsite.location.address3}</Table.Cell>
                  <Table.Cell>{jobsite.location.cityTown}</Table.Cell>
                  <Table.Cell>{jobsite.location.stateProvince}</Table.Cell>
                  <Table.Cell>{jobsite.location.postalCode}</Table.Cell>
                  <Table.Cell>{jobsite.location.country}</Table.Cell>
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

export default ListJobsites;
