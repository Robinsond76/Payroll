import React, { Fragment } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form, Header } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { combineValidators, isRequired } from 'revalidate';
import { User } from '../../app/api/agent';
import { FORM_ERROR } from 'final-form';

import ErrorMessage from '../../app/common/form/ErrorMessage';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { history } from '../..';

const validate = combineValidators({
  username: isRequired('Username'),
  displayName: isRequired('Display Name'),
  email: isRequired('Email'),
});

const EditEmployee = ({ username, manager = false }) => {
  const modalDispatch = useModalDispatch();
  const [employee, setEmployee] = React.useState({});

  React.useEffect(() => {
    User.getUser(username).then((result) => setEmployee(result));
  }, [username]);

  const handleFinalFormSubmit = (values) =>
    User.updateUser(username, values)
      .then((result) => {
        modalDispatch({ type: 'CLOSE_MODAL' });
        if (manager) {
          history.push('/refresh');
        } else {
          history.push('/employees');
        }
      })
      .catch((error) => ({ [FORM_ERROR]: error }));

  return (
    <Fragment>
      <FinalForm
        onSubmit={handleFinalFormSubmit}
        validate={validate}
        initialValues={employee}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
          pristine,
          dirtySinceLastSubmit,
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Header
              as='h2'
              content={manager ? 'Edit Manager' : 'Edit Employee'}
              color='teal'
              textAlign='center'
            />
            <Field
              name='username'
              component={TextInput}
              placeholder='Username'
              value={employee.username}
            />
            <Field
              name='displayName'
              component={TextInput}
              placeholder='Display Name'
              value={employee.displayName}
            />
            <Field
              name='email'
              component={TextInput}
              placeholder='Email'
              value={employee.email}
            />

            {submitError && !dirtySinceLastSubmit && (
              <ErrorMessage error={submitError} />
            )}
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              color='teal'
              content='Submit'
              fluid
            />
          </Form>
        )}
      />
    </Fragment>
  );
};

export default EditEmployee;
