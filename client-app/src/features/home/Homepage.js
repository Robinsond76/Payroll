import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

const Homepage = () => {
  return (
    <Container style={{ marginTop: '7em' }}>
      <h2>This is the homepage.</h2>
      <h3>
        Go to <Link to='/jobsites'>Jobsites</Link>{' '}
      </h3>
    </Container>
  );
};

export default Homepage;
