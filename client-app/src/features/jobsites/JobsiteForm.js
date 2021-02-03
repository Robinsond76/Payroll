import React, { Fragment, useEffect } from 'react';
import { Jobsites } from '../../app/api/agent';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form, Header, Divider } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { combineValidators, isRequired } from 'revalidate';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import { history } from '../..';
import { FORM_ERROR } from 'final-form';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { useAlertDispatch } from '../../app/context/alerts/alertContext';
import { setAlert } from '../../app/context/alerts/alertActions';
import { getJobsite } from '../../app/context/jobsites/jobsiteActions';

//validator to validate form
const validate = combineValidators({
  name: isRequired('name'),
  moniker: isRequired('moniker'),
  address1: isRequired('address1'),
  cityTown: isRequired('cityTown'),
  stateProvince: isRequired('stateProvince'),
  postalCode: isRequired('postalCode'),
  country: isRequired('country'),
});

const JobsiteForm = ({ moniker }) => {
  const modalDispatch = useModalDispatch();
  const alertDispatch = useAlertDispatch();
  const [loading, setLoading] = React.useState(false);
  const [jobsite, setJobsite] = React.useState({
    name: '',
    moniker: '',
    address1: '',
    address2: '',
    address3: '',
    cityTown: '',
    stateProvince: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    if (moniker) {
      setLoading(true);
      //the function below was necessary to work with final forms
      getJobsite(moniker)
        .then((result) => {
          setJobsite(result);
        })
        .finally(setLoading(false));
    }
  }, [moniker]);

  const handleFinalFormSubmit = async (values) => {
    const formValues = {
      name: values.name,
      moniker: values.moniker,
      location: {
        address1: values.address1,
        address2: values.address2 || null,
        address3: values.address3 || null,
        cityTown: values.cityTown,
        stateProvince: values.stateProvince,
        postalCode: values.postalCode,
        country: values.country,
      },
    };
    try {
      //if moniker is true, then submitting means editting the form
      if (moniker) {
        await Jobsites.editJobsite(moniker, formValues);
        modalDispatch({ type: 'CLOSE_MODAL' });
        history.push(`/jobsites`);

        setAlert(alertDispatch, 'Edit Successful', 'update');
      } else {
        // if moniker is not present, form submission means new jobsite
        const newJobsite = await Jobsites.addJobsite(formValues);
        modalDispatch({ type: 'CLOSE_MODAL' });
        history.push(`/jobsites/${newJobsite.moniker}`);

        setAlert(alertDispatch, 'Jobsite Added', 'success');
      }
    } catch (error) {
      return {
        [FORM_ERROR]: error,
      };
    }
  };

  return (
    <Fragment>
      {moniker ? <h2>Edit Jobsite</h2> : <h2>Create a New Jobsite</h2>}

      <Divider />

      <FinalForm
        onSubmit={(values) => handleFinalFormSubmit(values)}
        validate={validate}
        initialValues={jobsite}
        render={({
          handleSubmit,
          submitting,
          submitError,
          invalid,
          pristine,
          dirtySinceLastSubmit,
        }) => (
          <Form onSubmit={handleSubmit} loading={loading} error>
            <Header
              as='h2'
              content={
                moniker ? `${jobsite.moniker} - ${jobsite.name}` : 'New Jobsite'
              }
              color='teal'
              textAlign='center'
            />
            <Field
              name='name'
              value={jobsite.name}
              component={TextInput}
              placeholder='name'
            />
            <Field
              name='moniker'
              value={jobsite.moniker}
              component={TextInput}
              placeholder='moniker'
            />
            <Field
              name='address1'
              value={jobsite.address1}
              component={TextInput}
              placeholder='address'
            />
            <Field
              name='address2'
              component={TextInput}
              placeholder='address2'
              value={jobsite.address2}
            />
            <Field
              name='address3'
              component={TextInput}
              placeholder='address3'
              value={jobsite.address3}
            />
            <Field
              name='cityTown'
              component={TextInput}
              placeholder='cityTown'
              value={jobsite.cityTown}
            />
            <Field
              name='stateProvince'
              component={TextInput}
              placeholder='stateProvince'
              value={jobsite.stateProvince}
            />
            <Field
              name='postalCode'
              component={TextInput}
              placeholder='postalCode'
              value={jobsite.postalCode}
            />
            <Field
              name='country'
              component={TextInput}
              placeholder='country'
              value={jobsite.country}
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
            {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
          </Form>
        )}
      />
    </Fragment>
  );
};

export default JobsiteForm;
