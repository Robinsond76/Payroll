import React, { Fragment } from 'react';
import { Icon, Header, Popup, Divider } from 'semantic-ui-react';

import ListManagersTable from '../tables/ListManagersTable';

const ListManagers = () => {
  return (
    <Fragment>
      <Header
        as='h2'
        color='teal'
        style={{ display: 'inline-block', marginRight: '5px' }}
      >
        Managers
      </Header>
      <Popup
        trigger={<Icon name='question circle outline' />}
        content='See all employees appointed as managers in the system'
        position='right center'
      />
      <Divider />
      <ListManagersTable />
    </Fragment>
  );
};

export default ListManagers;
