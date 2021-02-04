import React, { Fragment } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { format } from 'date-fns';
import {
  useAuthDispatch,
  useAuthState,
} from '../../../app/context/auth/authContext';
import { clockOutUser } from '../../../app/context/auth/authActions';

const HomeClockedIn = () => {
  const { user } = useAuthState();
  const authDispatch = useAuthDispatch();

  //Function that prints date of clockedIn timestamp
  const showClockedInDate = () => {
    const timestamp = new Date(user.clockedInTimestamp.clockedIn);
    const date = format(timestamp, 'eeee, MMMM do, yyyy');
    const time = format(timestamp, 'h:mm a');

    return `${date} at ${time}`;
  };

  return (
    <Fragment>
      <h3>Currently clocked in at:</h3>
      <Header as='h2' color='teal' style={{ marginBottom: '25px' }}>
        {user.clockedInTimestamp.moniker} - {user.clockedInTimestamp.jobsite}
      </Header>

      <p>{showClockedInDate()}</p>

      <span className='homepage-clock-out'>
        <Button
          onClick={() =>
            clockOutUser(user.clockedInTimestamp.moniker, authDispatch)
          }
          color='teal'
        >
          Clock Out
        </Button>
      </span>
    </Fragment>
  );
};

export default HomeClockedIn;
