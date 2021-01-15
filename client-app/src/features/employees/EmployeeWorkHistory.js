import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';

const EmployeeWorkHistory = ({ match }) => {
  const username = match.params.username;

  const [employee, setEmployee] = React.useState(null);

  React.useEffect(() => {
    Timestamps.getUserWorkHistory(username).then((result) => {
      setEmployee(result.data);
    });
  }, [username]);

  return (
    <div>
      <p>This page will show one employee's payroll history</p>
      <Table basic='very' size='small' celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Jobsite</Table.HeaderCell>
            <Table.HeaderCell>Hours Worked</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {employee &&
            employee.workHistory.map((entry) => {
              return (
                <Table.Row key={entry.moniker}>
                  <Table.Cell>
                    <Link to={`/jobsites/${entry.moniker}/${username}`}>
                      {entry.moniker}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{entry.name}</Table.Cell>
                  <Table.Cell>{entry.hoursWorked}</Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default EmployeeWorkHistory;
