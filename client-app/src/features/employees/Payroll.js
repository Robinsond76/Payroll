import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Header, Icon, Popup, Table } from 'semantic-ui-react';
import { Timestamps } from '../../app/api/agent';
import {
  useTimestampState,
  useTimestampDispatch,
} from '../../app/context/timestamps/timestampContext';
import FilterDateForm from '../../app/layout/FilterDateForm';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import LoadingComponent from '../../app/layout/LoadingComponent';

const Payroll = () => {
  const [employees, setEmployees] = React.useState([]);
  const { fromDate, toDate } = useTimestampState();
  const timestampDispatch = useTimestampDispatch();
  const [loading, setLoading] = React.useState(false);

  //load work History
  React.useEffect(() => {
    setLoading(true);
    Timestamps.getWorkHistory(fromDate, toDate).then((result) => {
      setEmployees(result.data);
      setLoading(false);
    });
  }, [fromDate, toDate]);

  //set initial FromDate for Date Filter
  React.useEffect(() => {
    const oneWeekAgo = addDays(new Date(), -7);
    const formattedOneWeekAgo = format(oneWeekAgo, 'MM/dd/yyyy');
    timestampDispatch({ type: 'SET_FROM_DATE', payload: formattedOneWeekAgo });
  }, [timestampDispatch]);

  return (
    <div>
      <div>
        <Header
          as='h2'
          color='teal'
          style={{ display: 'inline-block', marginRight: '5px' }}
        >
          Payroll
        </Header>
        <Popup
          trigger={<Icon name='question circle outline' />}
          content='See hours worked per employee in a given time frame.'
          position='right center'
        />
      </div>

      <div className='payroll-notes'>
        <Header as='h4' color='teal'>
          Note:
        </Header>
        <p>
          Default view with no dates in filter is from 7 days ago to this
          moment.
        </p>
        <p>Maximum 'From Date' allowed is 45 days ago.</p>
        <p>The 'To Date' includes timestamps for that date.</p>
        <p>Clocked-in Stamps are not considered.</p>
      </div>

      <Divider />

      <FilterDateForm open={true} />

      {loading ? (
        <LoadingComponent />
      ) : (
        <Table
          basic='very'
          size='small'
          celled
          selectable
          style={{ marginBottom: '30px' }}
        >
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Employee</Table.HeaderCell>
              <Table.HeaderCell>
                Hours Worked{' '}
                <Popup
                  trigger={<Icon name='question circle outline' />}
                  content='Decimal values represent a fractional hour, not minutes.'
                  position='right center'
                />
              </Table.HeaderCell>
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
      )}
    </div>
  );
};

export default Payroll;
