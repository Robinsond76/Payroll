import React from 'react';
import { Loader } from 'semantic-ui-react';

const LoadingComponent = ({ content }) => {
  return <Loader active content={content} />;
};

export default LoadingComponent;
