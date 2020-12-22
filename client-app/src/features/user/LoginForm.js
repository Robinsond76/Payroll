import React, { Fragment } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form, Header } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { useAuthDispatch } from '../../app/context/auth/authContext';
import { loginUser } from '../../app/context/auth/authActions';
import { FORM_ERROR } from 'final-form';
import { combineValidators, isRequired } from 'revalidate';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { useModalDispatch } from '../../app/context/modal/modalContext';

const validate = combineValidators({
  email: isRequired('email'),
  password: isRequired('password'),
});

const LoginForm = () => {
  const authDispatch = useAuthDispatch();
  const modalDispatch = useModalDispatch();

  const handleFinalFormSubmit = (values) =>
    loginUser(values, authDispatch)
      .then(() => modalDispatch({ type: 'CLOSE_MODAL' }))
      .catch((error) => ({
        [FORM_ERROR]: error.response,
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
        }) => (
          <Form onSubmit={handleSubmit} error>
            <Header
              as='h2'
              content='Login to Payroll App'
              color='teal'
              textAlign='center'
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
              content='Login'
              fluid
            />
            {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
          </Form>
        )}
      />
    </Fragment>
  );
};

export default LoginForm;
