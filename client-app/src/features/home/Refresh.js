import React from 'react';
import LoadingComponent from '../../app/layout/LoadingComponent';

const Refresh = (props) => {
  React.useEffect(() => {
    props.history.goBack();
  }, [props.history]);

  return (
    <React.Fragment>
      Loading...
      <LoadingComponent />
    </React.Fragment>
  );
};

export default Refresh;
