import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';

const Payroll = () => {
  const [employees, setEmployees] = React.useState([]);

  React.useEffect(() => {
    Timestamps.getWorkHistory().then((result) => {
      setEmployees(result.data);
    });
  }, []);

  return (
    <div>
      <p>This page will show employee payroll information</p>
      <Table basic='very' size='small' celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Employee</Table.HeaderCell>
            <Table.HeaderCell>Hours Worked</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {employees.map((employee) => {
            return (
              <Table.Row key={employee.username}>
                <Table.Cell>
                  <Link to={`/employees/payroll/${employee.username}`}>
                    {employee.displayName}
                  </Link>
                </Table.Cell>
                <Table.Cell>{employee.totalHoursWorked}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Payroll;
