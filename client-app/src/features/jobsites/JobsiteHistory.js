import React, { Fragment, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Button, Divider } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';
import { Jobsites } from '../../app/api/agent';
import { useTimestampState } from '../../app/context/timestamps/timestampContext';
import JobsiteHistoryTable from '../tables/JobsiteHistoryTable';
import FilterDateForm from '../../app/layout/FilterDateForm';

import { openModal } from '../../app/context/modal/modalActions';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import JobsiteForm from './JobsiteForm';
import DeleteJobsite from './DeleteJobsite';

const JobsiteHistory = ({ match }) => {
  const moniker = match.params.moniker;
  const { fromDate, toDate } = useTimestampState();
  const modalDispatch = useModalDispatch();

  const [jobsite, setJobsite] = React.useState(null);
  const [pagination, setPagination] = React.useState('');
  const pageOne = 1;
  const pageSize = 3;

  const loadJobsiteTimestamps = useCallback(
    async (activePage) => {
      const result = await Jobsites.getJobsiteTimestamps(
        moniker,
        pageSize,
        activePage,
        fromDate,
        toDate
      );
      setJobsite(result.data);
      setPagination(JSON.parse(result.headers['x-pagination']));
    },
    [fromDate, moniker, pageSize, toDate]
  );

  React.useEffect(() => {
    loadJobsiteTimestamps(pageOne);
  }, [loadJobsiteTimestamps]);

  const pageChangeHandler = (e, { activePage }) => {
    loadJobsiteTimestamps(activePage);
  };

  return (
    <Fragment>
      <h2>
        {jobsite && jobsite.name} - {jobsite && jobsite.moniker}
      </h2>

      <Button
        color='blue'
        onClick={() =>
          openModal(<JobsiteForm moniker={moniker} />, modalDispatch)
        }
      >
        Edit Jobsite
      </Button>
      <Button
        color='red'
        onClick={() =>
          openModal(<DeleteJobsite moniker={moniker} />, modalDispatch)
        }
      >
        Delete Jobsite
      </Button>
      <Divider />

      <p>All employees who clocked into this location:</p>
      <ul>
        {jobsite &&
          jobsite.employeesThatClocked.map((employee) => (
            <li key={uuidv4()}>
              <Link to={`/jobsites/${moniker}/${employee.username}`}>
                {employee.displayName}
              </Link>
            </li>
          ))}
      </ul>

      <FilterDateForm />
      {jobsite && <JobsiteHistoryTable timestamps={jobsite.timestamps} />}

      {pagination !== '' && (
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
    </Fragment>
  );
};

export default JobsiteHistory;
