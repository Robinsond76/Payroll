import React from 'react';
import { Button, Container, Dropdown, Image, Menu } from 'semantic-ui-react';
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
          <Menu.Item>
            <Button positive as={NavLink} to='/register'>
              Register
            </Button>
          </Menu.Item>
          <Menu.Item name='Jobsites' as={NavLink} to='/jobsites' />
          <Menu.Item>
            <Link to='/clock'>Clock</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/timestamps'>Timestamps</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/employees'>Employees</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/employees/ClockedIn'>Clocked In</Link>
          </Menu.Item>
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
                    as={Link}
                    to={`/profile/username`}
                    text='My profile'
                    icon='user'
                  />
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
