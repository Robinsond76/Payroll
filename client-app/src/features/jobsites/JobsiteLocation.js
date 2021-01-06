import React, { Fragment } from 'react';

const JobsiteLocation = ({ jobsite }) => {
  return (
    <Fragment>
      <h1>{jobsite.name}</h1>
    </Fragment>
  );
};

export default JobsiteLocation;
