import React, { Fragment } from 'react';
import { Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import {
  useAuthDispatch,
  useAuthState,
} from '../../app/context/auth/authContext';
import { logoutUser } from '../../app/context/auth/authActions';

const Navbar = () => {
  const authDispatch = useAuthDispatch();
  const { user } = useAuthState();

  return (
    <>
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item header>
            <img
              src='/assets/logo.png'
              alt='logo'
              style={{ marginRight: '10px' }}
            />
            <Link to='/'>Payroll</Link>
          </Menu.Item>
          {user && user.manager && (
            <Fragment>
              <Menu.Item name='Jobsites' as={NavLink} to='/jobsites' />
              <Menu.Item name='Timestamps' as={NavLink} to='/timestamps' />
              <Menu.Item name='Employees' as={NavLink} to='/employees' />
            </Fragment>
          )}
          {user && !user.manager && (
            <Fragment>
              <Menu.Item name='Timestamps' as={NavLink} to='/timestamps/user' />
            </Fragment>
          )}
          {user && (
            <Menu.Item position='right'>
              <Image
                avatar
                spaced='right'
                src={user.image || '/assets/user.png'}
              />
              <Dropdown pointing='top left' text={user.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => logoutUser(authDispatch)}
                    text='Logout'
                    icon='power'
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
        </Container>
      </Menu>
    </>
  );
};

export default Navbar;
