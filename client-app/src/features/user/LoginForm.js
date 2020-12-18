import React, { Fragment } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';

const LoginForm = () => {
  const handleFinalFormSubmit = (values) => console.log(values);

  return (
    <Fragment>
      <FinalForm
        onSubmit={handleFinalFormSubmit}
        render={({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field name='email' component={TextInput} placeholder='Email' />
            <Field
              name='password'
              component={TextInput}
              placeholder='Password'
              type='password'
            />
            <Button positive content='Login' />
          </Form>
        )}
      />
    </Fragment>
  );
};

export default LoginForm;
