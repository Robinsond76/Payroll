import React, { Fragment } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { openModal } from '../../../app/context/modal/modalActions';
import { useModalDispatch } from '../../../app/context/modal/modalContext';
import LoginForm from '../../user/LoginForm';

const HomeNotLoggedIn = () => {
  const modalDispatch = useModalDispatch();

  return (
    <Fragment>
      <Header as='h2' content='Welcome!' />
      <Button
        onClick={() => openModal(<LoginForm />, modalDispatch)}
        to='/login'
        size='huge'
      >
        Login
      </Button>
    </Fragment>
  );
};

export default HomeNotLoggedIn;
