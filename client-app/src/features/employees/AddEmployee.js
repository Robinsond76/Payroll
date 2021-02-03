import React, { Fragment } from 'react';
import { FORM_ERROR } from 'final-form';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form, Header } from 'semantic-ui-react';
import { combineValidators, isRequired } from 'revalidate';
import TextInput from '../../app/common/form/TextInput';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { useAuthDispatch } from '../../app/context/auth/authContext';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { useAlertDispatch } from '../../app/context/alerts/alertContext';
import { registerUser } from '../../app/context/auth/authActions';
import { setAlert } from '../../app/context/alerts/alertActions';

const validate = combineValidators({
  username: isRequired('Username'),
  displayName: isRequired('Display Name'),
  email: isRequired('Email'),
  password: isRequired('password'),
});

//Modal form to add employee
const AddEmployee = () => {
  const modalDispatch = useModalDispatch();
  const authDispatch = useAuthDispatch();
  const alertDispatch = useAlertDispatch();

  const handleFinalFormSubmit = (values) =>
    registerUser(values, authDispatch)
      .then(() => modalDispatch({ type: 'CLOSE_MODAL' }))
      .then(() => setAlert(alertDispatch, 'Added New Employee', 'success'))
      .catch((error) => ({
        [FORM_ERROR]: error,
      }));

  return (
    <Fragment>
      <FinalForm
        onSubmit={handleFinalFormSubmit}
        validate={validate}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
          pristine,
          dirtySinceLastSubmit,
          form,
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Header
              as='h2'
              content='Register a new employee'
              color='teal'
              textAlign='center'
            />
            <Field
              name='username'
              component={TextInput}
              placeholder='Username'
            />
            <Field
              name='displayName'
              component={TextInput}
              placeholder='Display Name'
            />
            <Field name='email' component={TextInput} placeholder='Email' />
            <Field
              name='password'
              component={TextInput}
              placeholder='Password'
              type='password'
            />
            {submitError && !dirtySinceLastSubmit && (
              <ErrorMessage error={submitError} />
            )}
            <Button
              disabled={(invalid && !dirtySinceLastSubmit) || pristine}
              loading={submitting}
              color='teal'
              content='Register'
              fluid
            />
            {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
          </Form>
        )}
      />
    </Fragment>
  );
};

export default AddEmployee;
