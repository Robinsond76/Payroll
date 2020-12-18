import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom';

const navbar = () => {
  return (
    <>
      <Menu fixed='top' inverted>
        <Container>

        <Menu.Item header>
          <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
          Payroll
        </Menu.Item>

        <Menu.Item name='Login' as={NavLink} to="/login"/>

        <Menu.Item>
          <Button positive as={NavLink} to="/register">Register</Button>
        </Menu.Item>

        <Menu.Item name='Jobsites' as={NavLink} to="/jobsites"/>

        </Container>
      </Menu>
    </>
  )
}

export default navbar
