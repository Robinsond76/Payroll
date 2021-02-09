import React, { Fragment } from 'react';
import ListTimestamps from '../tables/ListTimestamps';
import ListJobsites from '../tables/ListJobsites';
import FilterDateForm from '../../app/layout/FilterDateForm';
import { Header, Icon, Popup, Tab } from 'semantic-ui-react';

//url: /timestamps
const ViewAllTimestamps = () => {
  const pageSize = 10;

  const panes = [
    {
      menuItem: 'Timestamps',
      render: () => (
        <Tab.Pane>
          <Popup
            trigger={<Icon name='question circle outline' />}
            content='All completed timestamps in the system sorted by most recent.'
            position='right center'
          />
          <ListTimestamps pageSize={pageSize} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Jobsites',
      render: () => (
        <Tab.Pane>
          <Popup
            trigger={<Icon name='question circle outline' />}
            content='Use this view along with the date filter to determine jobsites visited within a time frame.'
            position='right center'
          />
          <ListJobsites pageSize={pageSize} basicView={true} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Fragment>
      <Header
        as='h2'
        color='teal'
        style={{ display: 'inline-block', marginRight: '5px' }}
      >
        All Timestamps
      </Header>
      <Popup
        trigger={<Icon name='question circle outline' />}
        content='See all timestamps in the system and filter by date.'
        position='right center'
      />

      <FilterDateForm />
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={panes}
        style={{ marginTop: '5px' }}
      />
    </Fragment>
  );
};

export default ViewAllTimestamps;
