import React, { Fragment } from 'react';
import {
  Header,
  Input,
  Form,
  Button,
  Divider,
  Popup,
  Icon,
  Segment,
} from 'semantic-ui-react';
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
  const pageSize = 10;

  const searchJobsites = (query) => {
    getJobsites(jobsiteDispatch, query, pageSize);
  };

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <Fragment>
      <div>
        <Header
          as='h2'
          color='teal'
          style={{ display: 'inline-block', marginRight: '5px' }}
        >
          Jobsites
        </Header>
        <Popup
          trigger={<Icon name='question circle outline' />}
          content='See all jobsites in the system'
          position='right center'
        />
      </div>

      <Button
        color='green'
        onClick={() => openModal(<JobsiteForm />, modalDispatch)}
      >
        Add New Jobsite
      </Button>
      <Divider />

      <Form onSubmit={() => searchJobsites(query)}>
        <div className='view-jobsites-search'>
          <Input
            name='query'
            value={query}
            onChange={onChange}
            action={{ icon: 'search' }}
            placeholder='Search...'
          />
        </div>
      </Form>

      <Segment>
        <ListJobsites query={query} pageSize={pageSize} />
      </Segment>
    </Fragment>
  );
};

export default ViewJobsites;
