import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Menu, Sidebar, Ref } from 'semantic-ui-react';
import { LeftMenuItems, RightMenuItems } from './MenuItems';

const NavbarMobile = ({ children, onPusherClick, onToggle, visible }) => {
  const menuRef = React.useRef();

  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation='overlay'
        icon='labeled'
        inverted
        vertical
        visible={visible}
        borderless
        width='thin'
        target={menuRef}
        onClick={onPusherClick}
      >
        <Ref innerRef={menuRef}>
          <LeftMenuItems />
        </Ref>
      </Sidebar>

      <Sidebar.Pusher
        dimmed={visible}
        onClick={onPusherClick}
        style={{ minHeight: '100vh' }}
      >
        <Menu fixed='top' inverted borderless>
          <Menu.Item header>
            <img
              src='/assets/logo.png'
              alt='logo'
              style={{ marginRight: '10px' }}
            />
            <Link to='/'>JOBTME</Link>
          </Menu.Item>

          <Menu.Item onClick={onToggle}>
            <Icon name='sidebar' />
          </Menu.Item>

          <Menu.Menu position='right'>
            <RightMenuItems />
          </Menu.Menu>
        </Menu>

        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default NavbarMobile;
