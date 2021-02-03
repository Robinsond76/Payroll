import React, { Fragment } from 'react';
import {
  Pagination,
  Table,
  Icon,
  Header,
  Popup,
  Segment,
  Divider,
} from 'semantic-ui-react';
import { User } from '../../app/api/agent';
import EditEmployee from '../employees/EditEmployee';
import EditManagerStatus from './EditManagerStatus';
import { openModal } from '../../app/context/modal/modalActions';
import { useModalDispatch } from '../../app/context/modal/modalContext';

const ListManagers = () => {
  const pageSize = 10;
  const pageOne = 1;

  const [managers, setManagers] = React.useState([]);
  const [managersPagination, setManagersPagination] = React.useState(null);
  const modalDispatch = useModalDispatch();

  const loadManagers = React.useCallback((pageSize, pageNumber) => {
    User.getManagers(pageSize, pageNumber).then((result) => {
      setManagers(result.data);
      setManagersPagination(JSON.parse(result.headers['x-pagination']));
    });
  }, []);

  React.useEffect(() => {
    loadManagers(pageSize, pageOne);
  }, [loadManagers]);

  const jobsitePageChangeHandler = (e, { activePage }) => {
    loadManagers(pageSize, activePage);
  };

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
      <Segment>
        <Table selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell width={2}>Manage</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {managers.map((manager) => {
              return (
                <Table.Row key={manager.username}>
                  <Table.Cell>{manager.displayName}</Table.Cell>
                  <Table.Cell>{manager.username}</Table.Cell>
                  <Table.Cell>{manager.email}</Table.Cell>
                  <Table.Cell>
                    {' '}
                    <Icon
                      name='edit'
                      color='blue'
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        openModal(
                          <EditEmployee
                            username={manager.username}
                            manager={true}
                          />,
                          modalDispatch
                        )
                      }
                    />
                    <Icon
                      name='cancel'
                      color='red'
                      style={{ marginLeft: '10px', cursor: 'pointer' }}
                      onClick={() =>
                        openModal(
                          <EditManagerStatus
                            username={manager.username}
                            revoke={true}
                          />,
                          modalDispatch
                        )
                      }
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <div style={{ width: '100%', overflow: 'auto' }}>
          {managersPagination && (
            <Pagination
              boundaryRange={0}
              activePage={managersPagination.CurrentPage}
              onPageChange={jobsitePageChangeHandler}
              siblingRange={1}
              totalPages={Math.ceil(
                managersPagination.TotalCount / managersPagination.PageSize
              )}
              borderless
              size='small'
              floated='right'
            />
          )}
        </div>
      </Segment>
    </Fragment>
  );
};

export default ListManagers;
