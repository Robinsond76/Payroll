import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Table } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Timestamps } from '../../../app/api/agent';

const DashboardJobsites = () => {
  const pageSize = 10;
  const pageOne = 1;

  const [clockedInJobsites, setClockedInJobsites] = React.useState([]);
  const [jobsitesPagination, setJobsitesPagination] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const loadJobsites = React.useCallback((pageSize, pageNumber) => {
    setLoading(true);
    Timestamps.getClockedInJobsites(pageSize, pageNumber).then((result) => {
      setClockedInJobsites(result.data);
      setJobsitesPagination(JSON.parse(result.headers['x-pagination']));
      setLoading(false);
    });
  }, []);

  const jobsitePageChangeHandler = (e, { activePage }) => {
    loadJobsites(pageSize, activePage);
  };

  //on load, load jobsites
  React.useEffect(() => {
    loadJobsites(pageSize, pageOne);
  }, [loadJobsites]);

  if (loading) return <LoadingComponent />;

  return (
    <Fragment>
      <h3>Jobsites Currently Clocked Into</h3>
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {clockedInJobsites.map((jobsite) => {
            return (
              <Table.Row key={jobsite.moniker}>
                <Table.Cell>
                  <Link to={`/jobsites/${jobsite.moniker}`}>
                    {jobsite.moniker}
                  </Link>
                </Table.Cell>
                <Table.Cell>{jobsite.name}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <div style={{ width: '100%', overflow: 'auto' }}>
        {jobsitesPagination && (
          <Pagination
            boundaryRange={0}
            activePage={jobsitesPagination.CurrentPage}
            onPageChange={jobsitePageChangeHandler}
            siblingRange={1}
            totalPages={Math.ceil(
              jobsitesPagination.TotalCount / jobsitesPagination.PageSize
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

export default DashboardJobsites;
