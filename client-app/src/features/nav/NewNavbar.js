import React, { Fragment } from 'react';

import NavbarMobile from './navbar/NavbarMobile';
import NavbarDesktop from './navbar/NavbarDesktop';
import NavbarChildren from './navbar/NavbarChildren';

const NewNavbar = ({ children }) => {
  const [visible, setVisible] = React.useState(false);

  const handlePusher = () => {
    if (visible) setVisible(false);
  };

  const handleToggle = () => setVisible(!visible);

  return (
    <Fragment>
      <div className='navbar-mobile'>
        <NavbarMobile
          onPusherClick={handlePusher}
          onToggle={handleToggle}
          visible={visible}
        >
          <NavbarChildren>{children}</NavbarChildren>
        </NavbarMobile>
      </div>

      <div className='navbar-desktop'>
        <NavbarDesktop />
        <NavbarChildren>{children}</NavbarChildren>
      </div>
    </Fragment>
  );
};

export default NewNavbar;
