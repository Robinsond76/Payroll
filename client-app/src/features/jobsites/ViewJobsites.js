import React, { Fragment } from 'react';
import { Header, Input, Form, Button, Divider } from 'semantic-ui-react';
import ListJobsites from '../tables/ListJobsites';
import { openModal } from '../../app/context/modal/modalActions';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import JobsiteForm from './JobsiteForm';

import { getJobsites } from '../../app/context/jobsites/jobsiteActions';
import { useJobsiteDispatch } from '../../app/context/jobsites/jobsiteContext';

// url: /jobsites
const ViewJobsites = () => {
  const modalDispatch = useModalDispatch();
  const jobsiteDispatch = useJobsiteDispatch();
  const [query, setQuery] = React.useState('');
  const pageSize = 3;

  const searchJobsites = (query) => {
    getJobsites(jobsiteDispatch, query, pageSize);
  };

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <Fragment>
      <Header as='h2' icon='map' content='Jobsites' />

      <Button
        color='green'
        onClick={() => openModal(<JobsiteForm />, modalDispatch)}
      >
        Add New Jobsite
      </Button>

      <Divider />

      <Form onSubmit={() => searchJobsites(query)}>
        <div className='margin-right-40'>
          <Input
            name='query'
            value={query}
            onChange={onChange}
            action={{ icon: 'search' }}
            placeholder='Search...'
          />
        </div>
      </Form>

      <ListJobsites query={query} pageSize={pageSize} />
    </Fragment>
  );
};

export default ViewJobsites;
