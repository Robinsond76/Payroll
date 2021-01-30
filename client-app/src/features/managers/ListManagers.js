import React, { Fragment } from 'react';
import { Pagination, Table, Icon } from 'semantic-ui-react';
import { User } from '../../app/api/agent';
import { openModal } from '../../app/context/modal/modalActions';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import EditEmployee from '../employees/EditEmployee';
import EditManagerStatus from './EditManagerStatus';

const ListManagers = () => {
  const pageSize = 3;
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
      <h3>Managers</h3>
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
    </Fragment>
  );
};

export default ListManagers;
