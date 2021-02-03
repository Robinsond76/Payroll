import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import {
  Divider,
  Header,
  Icon,
  Pagination,
  Popup,
  Segment,
  Table,
} from 'semantic-ui-react';
import { User } from '../../app/api/agent';
import { Button } from 'semantic-ui-react';

import { openModal } from '../../app/context/modal/modalActions';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import AddEmployee from './AddEmployee';

const ListEmployees = () => {
  const [users, setUsers] = React.useState([]);
  const [pagination, setPagination] = React.useState(null);
  const modalDispatch = useModalDispatch();
  const pageSize = 10;
  const pageOne = 1;

  //load employees on page load
  React.useEffect(() => {
    User.getUsers(pageSize, pageOne).then((result) => {
      setUsers(result.data);
      setPagination(JSON.parse(result.headers['x-pagination']));
    });
  }, []);

  const pageChangeHandler = async (e, { activePage }) => {
    const result = await User.getUsers(pageSize, activePage);
    setUsers(result.data);
    setPagination(JSON.parse(result.headers['x-pagination']));
  };

  return (
    <Fragment>
      <div>
        <Header
          as='h2'
          color='teal'
          style={{ display: 'inline-block', marginRight: '5px' }}
        >
          Employee Management
        </Header>
        <Popup
          trigger={<Icon name='question circle outline' />}
          content='View all employees in the system. Click on an employee for more management options.'
          position='right center'
        />
      </div>

      <Button
        color='green'
        size='small'
        onClick={() => openModal(<AddEmployee />, modalDispatch)}
      >
        Add New Employee
      </Button>

      <Button size='small' as={Link} to={'/employees/payroll'}>
        Payroll
      </Button>

      <Divider />

      <Segment>
        <Table selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {users &&
              users.map((user) => (
                <Table.Row key={user.username}>
                  <Table.Cell>
                    <Link to={`/employees/${user.username}`}>
                      {user.displayName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
        <div style={{ width: '100%', overflow: 'auto' }}>
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
      </Segment>
    </Fragment>
  );
};

export default ListEmployees;
