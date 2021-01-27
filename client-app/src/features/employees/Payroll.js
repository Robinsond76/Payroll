import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';
import {
  useTimestampState,
  useTimestampDispatch,
} from '../../app/context/timestamps/timestampContext';
import FilterDateForm from '../../app/layout/FilterDateForm';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';

const Payroll = () => {
  const [employees, setEmployees] = React.useState([]);
  const { fromDate, toDate } = useTimestampState();
  const timestampDispatch = useTimestampDispatch();

  //set initial FromDate
  React.useEffect(() => {
    const oneWeekAgo = addDays(new Date(), -7);
    const formattedOneWeekAgo = format(oneWeekAgo, 'MM/dd/yyyy');
    timestampDispatch({ type: 'SET_FROM_DATE', payload: formattedOneWeekAgo });
  }, [timestampDispatch]);

  React.useEffect(() => {
    Timestamps.getWorkHistory(fromDate, toDate).then((result) => {
      setEmployees(result.data);
    });
  }, [fromDate, toDate]);

  return (
    <div>
      <p>This page will show employee payroll information</p>
      <FilterDateForm open={true} />
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
