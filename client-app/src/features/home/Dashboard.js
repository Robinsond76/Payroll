import React, { Fragment } from 'react';
import { Header, Icon, Popup, Tab } from 'semantic-ui-react';

import DashboardJobsites from './Dashboard/DashboardJobsites';
import DashboardEmployees from './Dashboard/DashboardEmployees';

const Dashboard = () => {
  //panes that will be loaded on the dashboard
  const panes = [
    {
      menuItem: 'Jobsites',
      render: () => (
        <Tab.Pane>
          <DashboardJobsites />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Employees',
      render: () => (
        <Tab.Pane>
          <DashboardEmployees />
        </Tab.Pane>
      ),
    },
  ];

  //the dashboard
  return (
    <>
      <Header
        as='h2'
        color='teal'
        style={{ display: 'inline-block', marginRight: '5px' }}
      >
        Dashboard
      </Header>
      <Popup
        trigger={<Icon name='question circle outline' />}
        content='See all jobsites and employees who are currently clocked in'
        position='right center'
      />

      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </>
  );
};

export default Dashboard;
