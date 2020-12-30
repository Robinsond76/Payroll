import React, { Fragment } from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import {
  useAuthDispatch,
  useAuthState,
} from '../../app/context/auth/authContext';

import { clockInUser, clockOutUser } from '../../app/context/auth/authActions';
import { useJobsiteState } from '../../app/context/jobsites/jobsiteContext';

const Clock = () => {
  const { user } = useAuthState();
  const authDispatch = useAuthDispatch();
  const { jobsites } = useJobsiteState();

  const [jobsiteList] = React.useState(
    jobsites.map((jobsite) => ({
      key: jobsite.moniker,
      text: `${jobsite.moniker} - ${jobsite.name}`,
      value: jobsite.moniker,
    }))
  );

  //handle dropdown selection
  const [selection, setSelection] = React.useState('');
  const handleSelect = (e, { value }) => {
    setSelection(value);
  };

  return (
    <Fragment>
      {user.currentlyClockedIn ? (
        <Fragment>
          <h3>
            You are currently clocked in at jobsite {user.clockedInAtJobsite}
          </h3>
          <Button
            onClick={() => clockOutUser(user.clockedInAtJobsite, authDispatch)}
          >
            Clock Out
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <h3>You are not currently clocked in.</h3>
          <p>Choose a jobsite below:</p>
          <Dropdown
            placeholder='Jobsite'
            search
            selection
            clearable
            options={jobsiteList}
            onChange={handleSelect}
          />
          <Button onClick={() => clockInUser(selection, authDispatch)}>
            Clock in
          </Button>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Clock;
