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
import JobsiteForm from './JobsiteForm';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { useJobsiteDispatch } from '../../app/context/jobsites/jobsiteContext';
import { getJobsites } from '../../app/context/jobsites/jobsiteActions';
import { openModal } from '../../app/context/modal/modalActions';

// url: /jobsites
const ViewJobsites = () => {
  const modalDispatch = useModalDispatch();
  const jobsiteDispatch = useJobsiteDispatch();
  const [query, setQuery] = React.useState('');
  const pageSize = 10;

  //getJobsites loads the results and pagination into context upon searching,
  //which is then retrieved by the 'ListJobsites' table component to display results
  const searchJobsites = (query) => {
    getJobsites(jobsiteDispatch, query, pageSize);
  };

  //set query on search input change
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

      <ListJobsites query={query} pageSize={pageSize} />
    </Fragment>
  );
};

export default ViewJobsites;
