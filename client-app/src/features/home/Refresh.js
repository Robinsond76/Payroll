import React from 'react';
import LoadingComponent from '../../app/layout/LoadingComponent';

const Refresh = (props) => {
  React.useEffect(() => {
    props.history.goBack();
  }, [props.history]);

  return <LoadingComponent />;
};

export default Refresh;
