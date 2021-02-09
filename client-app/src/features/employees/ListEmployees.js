import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Divider, Header, Icon, Popup } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';
import { openModal } from '../../app/context/modal/modalActions';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import ListEmployeesTable from '../tables/ListEmployeesTable';
import AddEmployee from './AddEmployee';

// url: /employees
const ListEmployees = () => {
  const modalDispatch = useModalDispatch();

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

      <Button
        size='small'
        as={Link}
        to={'/employees/payroll'}
        className='payroll-btn'
      >
        Payroll
      </Button>

      <Divider />

      <ListEmployeesTable />
    </Fragment>
  );
};

export default ListEmployees;
