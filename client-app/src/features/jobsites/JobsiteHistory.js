import React, { Fragment, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Pagination,
  Button,
  Divider,
  Header,
  Segment,
  Popup,
  Icon,
  Image,
} from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';
import { Jobsites } from '../../app/api/agent';
import JobsiteHistoryTable from '../tables/JobsiteHistoryTable';
import FilterDateForm from '../../app/layout/FilterDateForm';
import JobsiteForm from './JobsiteForm';
import DeleteJobsite from './DeleteJobsite';
import {
  useTimestampDispatch,
  useTimestampState,
} from '../../app/context/timestamps/timestampContext';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { openModal } from '../../app/context/modal/modalActions';

const JobsiteHistory = ({ match }) => {
  const moniker = match.params.moniker;
  const { fromDate, toDate, loading } = useTimestampState();
  const timestampDispatch = useTimestampDispatch();
  const modalDispatch = useModalDispatch();

  const [jobsite, setJobsite] = React.useState(null);
  const [pagination, setPagination] = React.useState(null);
  const pageSize = 10;
  const pageOne = 1;

  const loadJobsiteTimestamps = useCallback(
    async (activePage) => {
      timestampDispatch({ type: 'SET_LOADING_TRUE' });
      const result = await Jobsites.getJobsiteTimestamps(
        moniker,
        pageSize,
        activePage,
        fromDate,
        toDate
      );
      setJobsite(result.data);
      setPagination(JSON.parse(result.headers['x-pagination']));
      timestampDispatch({ type: 'SET_LOADING_FALSE' });
    },
    [fromDate, moniker, timestampDispatch, toDate]
  );

  React.useEffect(() => {
    loadJobsiteTimestamps(pageOne);
  }, [loadJobsiteTimestamps]);

  const pageChangeHandler = (e, { activePage }) => {
    if (pagination.HasNext || pagination.HasPrevious) {
      loadJobsiteTimestamps(activePage);
    }
  };

  return (
    <Fragment>
      <Header as='h2' color='teal'>
        {jobsite && jobsite.name} - {jobsite && jobsite.moniker}
      </Header>

      <Button
        color='blue'
        size='small'
        onClick={() =>
          openModal(<JobsiteForm moniker={moniker} />, modalDispatch)
        }
      >
        Edit Jobsite
      </Button>
      <Button
        className='delete-jobsite-btn'
        color='red'
        size='small'
        onClick={() =>
          openModal(<DeleteJobsite moniker={moniker} />, modalDispatch)
        }
      >
        Delete Jobsite
      </Button>
      <Divider />

      <Header
        as='h4'
        color='teal'
        style={{ display: 'inline-block', margin: '5px 5px' }}
      >
        Employees:
      </Header>
      <Popup
        trigger={<Icon name='question circle outline' />}
        content='Employees who have clocked into this jobsite at least once. Click on a name to filter timestamps to only that user for this location'
        position='right center'
      />

      <ul className='employees-list'>
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
      {loading ? (
        <Segment loading={loading}>
          <Image src='/assets/paragraph.png' />
        </Segment>
      ) : (
        <Fragment>
          {jobsite && <JobsiteHistoryTable timestamps={jobsite.timestamps} />}
          <div
            style={{ width: '100%', overflow: 'auto', marginBottom: '30px' }}
          >
            {pagination && (
              <Pagination
                boundaryRange={0}
                activePage={pagination.CurrentPage}
                onPageChange={pageChangeHandler}
                siblingRange={1}
                totalPages={Math.ceil(
                  pagination.TotalCount / pagination.PageSize
                )}
                borderless
                size='small'
                floated='right'
              />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default JobsiteHistory;
