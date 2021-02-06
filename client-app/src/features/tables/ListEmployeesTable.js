import React from 'react';
import { Pagination, Segment, Table } from 'semantic-ui-react';
import { User } from '../../app/api/agent';
import { Link } from 'react-router-dom';
import LoadingComponent from '../../app/layout/LoadingComponent';

const ListEmployeesTable = () => {
  const [users, setUsers] = React.useState([]);
  const [pagination, setPagination] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const pageSize = 10;
  const pageOne = 1;

  //load employees on page load
  React.useEffect(() => {
    setLoading(true);
    User.getUsers(pageSize, pageOne).then((result) => {
      setUsers(result.data);
      setPagination(JSON.parse(result.headers['x-pagination']));
      setLoading(false);
    });
  }, []);

  const pageChangeHandler = async (e, { activePage }) => {
    const result = await User.getUsers(pageSize, activePage);
    setUsers(result.data);
    setPagination(JSON.parse(result.headers['x-pagination']));
  };

  if (loading) return <LoadingComponent />;

  return (
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
            totalPages={Math.ceil(pagination.TotalCount / pagination.PageSize)}
            borderless
            size='small'
            floated='right'
          />
        )}
      </div>
    </Segment>
  );
};

export default ListEmployeesTable;
