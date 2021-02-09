import React, { Fragment } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form, Header } from 'semantic-ui-react';
import { combineValidators, isRequired } from 'revalidate';
import TextInput from '../../app/common/form/TextInput';
import { User } from '../../app/api/agent';
import { history } from '../..';
import { FORM_ERROR } from 'final-form';

import ErrorMessage from '../../app/common/form/ErrorMessage';
import { useAlertDispatch } from '../../app/context/alerts/alertContext';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { setAlert } from '../../app/context/alerts/alertActions';
import { useTimestampDispatch } from '../../app/context/timestamps/timestampContext';

const validate = combineValidators({
  username: isRequired('Username'),
  displayName: isRequired('Display Name'),
  email: isRequired('Email'),
});

//modal to Edit Employee
const EditEmployee = ({ username, manager = false }) => {
  const modalDispatch = useModalDispatch();
  const alertDispatch = useAlertDispatch();
  const timestampDispatch = useTimestampDispatch();

  const [employee, setEmployee] = React.useState({});

  React.useEffect(() => {
    User.getUser(username).then((result) => setEmployee(result));
  }, [username]);

  const handleFinalFormSubmit = (values) =>
    User.updateUser(username, values)
      .then((result) => {
        modalDispatch({ type: 'CLOSE_MODAL' });
        setAlert(alertDispatch, `${username} updated`, 'update');
        if (manager) {
          //if editing a manager, will refresh manager page.
          timestampDispatch({ type: 'REFRESH' });
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
