import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';
import { LeftMenuItems, RightMenuItems } from './MenuItems';

const NavbarDesktop = () => (
  <Menu fixed='top' inverted borderless>
    <Container>
      <Menu.Item header>
        <img
          src='/assets/logo.png'
          alt='logo'
          style={{ marginRight: '10px' }}
        />
        <Link to='/'>JOBTME</Link>
      </Menu.Item>

      <LeftMenuItems />

      <Menu.Menu position='right'>
        <RightMenuItems />
      </Menu.Menu>
    </Container>
  </Menu>
);

export default NavbarDesktop;
