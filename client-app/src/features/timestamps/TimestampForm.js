import React, { Fragment } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { Button, Form, Header, Search } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { FORM_ERROR } from 'final-form';
import { formatDateTime, reverseFormatDateTime } from '../../app/common/util';
import { combineValidators, isRequired } from 'revalidate';
import { history } from '../..';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import DateTimeCustomInput from '../../app/common/form/DateTimeCustomInput';
import { Timestamps, Jobsites } from '../../app/api/agent';
import { useModalDispatch } from '../../app/context/modal/modalContext';
import { useAlertDispatch } from '../../app/context/alerts/alertContext';
import { setAlert } from '../../app/context/alerts/alertActions';

const validate = combineValidators({
  username: isRequired('Username'),
  moniker: isRequired('Moniker'),
  clockedInStamp: isRequired('Clocked In Time'),
  clockedOutStamp: isRequired('Clocked Out Time'),
});

// modal - form used to add/edit a timestamp
//if editTimestamp is true, will load form with data and prevent changing jobsite

const TimestampForm = ({ username, editTimestamp = false }) => {
  const modalDispatch = useModalDispatch();
  const alertDispatch = useAlertDispatch();
  const pageSize = 10;

  const [timestamp, setTimestamp] = React.useState({
    username: username,
    moniker: '',
    clockedInStamp: '',
    clockedOutStamp: '',
  });

  React.useEffect(() => {
    if (editTimestamp) {
      setTimestamp({
        username: username,
        moniker: editTimestamp.moniker,
        clockedInStamp: reverseFormatDateTime(editTimestamp.clockedInStamp),
        clockedOutStamp: reverseFormatDateTime(editTimestamp.clockedOutStamp),
      });
      setSelectionValue(editTimestamp.moniker);
    }
  }, [editTimestamp, username]);

  const handleFinalFormSubmit = async (values) => {
    try {
      //format values into a timestamp
      const timestamp = {
        username: values.username,
        moniker: values.moniker,
        clockedInStamp: formatDateTime(values.clockedInStamp),
        clockedOutStamp: formatDateTime(values.clockedOutStamp),
      };

      //editing timestamp requires only two fields
      if (editTimestamp) {
        const clockedStamps = {
          clockedInStamp: timestamp.clockedInStamp,
          clockedOutStamp: timestamp.clockedOutStamp,
        };
        await Timestamps.editTimestamp(
          editTimestamp.timestampId,
          clockedStamps
        );
        modalDispatch({ type: 'CLOSE_MODAL' });
        history.push('/refresh');
        setAlert(alertDispatch, `Timestamp Updated`, 'update');
      } else {
        await Timestamps.addTimestamp(timestamp);
        modalDispatch({ type: 'CLOSE_MODAL' });
        history.push('/refresh');
        setAlert(alertDispatch, `New Timestamp added`, 'success');
      }
    } catch (error) {
      return { [FORM_ERROR]: error };
    }
  };

  //Ccode here supports the job search bar component----------------
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selectionValue, setSelectionValue] = React.useState('');

  const handleSearchChange = async (e, { value }) => {
    setSelectionValue(value);
    setLoading(true);
    let searchResults = await Jobsites.listJobsites(value, pageSize, 1);
    searchResults = searchResults.data;

    let newResults = [];
    searchResults.forEach((jobsite) => {
      newResults.push({
        title: jobsite.moniker,
        description: `${jobsite.name} - ${jobsite.location.cityTown}`,
      });
    });
    setLoading(false);
    setResults(newResults);
  };

  const handleResultSelect = (e, { result }) => {
    setSelectionValue(result.title);
    setTimestamp({ ...timestamp, moniker: result.title });
  };

  // end of job search bar component -----------------------------
  return (
    <Fragment>
      <FinalForm
        onSubmit={handleFinalFormSubmit}
        validate={validate}
        initialValues={timestamp}
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
              content={editTimestamp ? 'Edit Timestamp' : 'Add Timestamp'}
              color='teal'
              textAlign='center'
            />
            <Field
              name='username'
              component={TextInput}
              placeholder='Username'
              value={timestamp.username}
              disabled
            />

            {!editTimestamp && pristine && (
              <p style={{ fontStyle: 'italic', color: 'red' }}>
                Choose a jobsite first
              </p>
            )}
            <Search
              placeholder='Search jobsites...'
              loading={loading}
              onResultSelect={handleResultSelect}
              onSearchChange={handleSearchChange}
              results={results}
              value={selectionValue}
              disabled={editTimestamp ? true : false}
            />
            <Field
              name='moniker'
              component={TextInput}
              placeholder='Moniker'
              value={timestamp.moniker}
              style={{ display: 'none' }}
            />

            <Field
              name='clockedInStamp'
              value={timestamp.clockedInStamp}
              component={DateTimeCustomInput}
              placeholder='Clocked In Time'
              dateFormat='MM-DD-YYYY'
              clearable
              closable
            />
            <Field
              name='clockedOutStamp'
              value={timestamp.clockedOutStamp}
              component={DateTimeCustomInput}
              placeholder='Clocked Out Time'
              dateFormat='MM-DD-YYYY'
              clearable
              closable
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

export default TimestampForm;
