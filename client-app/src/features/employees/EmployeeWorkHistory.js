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

// url: /employees/payroll/{username}
const EmployeeWorkHistory = ({ match }) => {
  const username = match.params.username;

  const [employee, setEmployee] = React.useState(null);
  const { fromDate, toDate } = useTimestampState();
  const timestampDispatch = useTimestampDispatch();

  //set initial FromDate
  React.useEffect(() => {
    const oneWeekAgo = addDays(new Date(), -7);
    const formattedOneWeekAgo = format(oneWeekAgo, 'MM/dd/yyyy');
    timestampDispatch({ type: 'SET_FROM_DATE', payload: formattedOneWeekAgo });
  }, [timestampDispatch]);

  React.useEffect(() => {
    Timestamps.getUserWorkHistory(username, fromDate, toDate).then((result) => {
      setEmployee(result.data);
    });
  }, [fromDate, toDate, username]);

  return (
    <div>
      <Header
        as='h2'
        color='teal'
        style={{ display: 'inline-block', marginRight: '5px' }}
      >
        Payroll: {employee && employee.displayName}
      </Header>
      <Popup
        trigger={<Icon name='question circle outline' />}
        content='Showing hours worked per jobsite for this user, within the time frame'
        position='right center'
      />

      <Divider />

      <FilterDateForm open={true} />
      <Table basic='very' size='small' celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Moniker</Table.HeaderCell>
            <Table.HeaderCell>Jobsite</Table.HeaderCell>
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
