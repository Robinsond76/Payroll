import React, { Fragment } from 'react';
import {
  useAuthDispatch,
  useAuthState,
} from '../../../app/context/auth/authContext';
import { logoutUser } from '../../../app/context/auth/authActions';
import { Dropdown, Image, Menu } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const LeftMenuItems = () => {
  const { user } = useAuthState();
  return (
    <Fragment>
      {user && user.manager && (
        <Fragment>
          <Menu.Item name='Dashboard' as={NavLink} to='/dashboard' />
          <Menu.Item name='Jobsites' as={NavLink} to='/jobsites' />
          <Menu.Item name='Timestamps' as={NavLink} to='/timestamps' />
          <Menu.Item name='Employees' as={NavLink} to='/employees' />
          {user.admin && (
            <Menu.Item name='Managers' as={NavLink} to='/managers' />
          )}
        </Fragment>
      )}
      {user && !user.manager && (
        <Fragment>
          <Menu.Item name='Timestamps' as={NavLink} to='/timestamps/user' />
        </Fragment>
      )}
    </Fragment>
  );
};

const RightMenuItems = () => {
  const authDispatch = useAuthDispatch();
  const { user } = useAuthState();

  return (
    <Fragment>
      {user && (
        <Menu.Item position='right'>
          <Image avatar spaced='right' src={user.image || '/assets/user.png'} />
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
    </Fragment>
  );
};

export { LeftMenuItems, RightMenuItems };
