import React from 'react';
import { Container } from 'semantic-ui-react';

const NavbarChildren = ({ children }) => (
  <Container style={{ marginTop: '7em' }}>{children}</Container>
);

export default NavbarChildren;
