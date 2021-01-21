import React, { Fragment } from 'react';
import { Header, Input, Form, Button, Divider } from 'semantic-ui-react';
import ListJobsites from '../tables/ListJobsites';

import { getJobsites } from '../../app/context/jobsites/jobsiteActions';
import { useJobsiteDispatch } from '../../app/context/jobsites/jobsiteContext';
import { Link } from 'react-router-dom';

const ViewJobsites = () => {
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

      <Button as={Link} to='jobsites/create'>
        Add New Jobsite
      </Button>

      <Divider />

      <Form onSubmit={() => searchJobsites(query)}>
        <Input
          name='query'
          value={query}
          onChange={onChange}
          action={{ icon: 'search' }}
          placeholder='Search...'
        />
      </Form>

      <ListJobsites query={query} pageSize={pageSize} />
    </Fragment>
  );
};

export default ViewJobsites;
