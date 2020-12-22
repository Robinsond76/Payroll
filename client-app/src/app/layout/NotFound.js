import React from 'react';
import { Segment, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NotFound = (props) => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='search' />
        404 - Page not found
      </Header>
      <Segment.Inline>
        <Button as={Link} onClick={() => props.history.goBack()} primary>
          Return to previous page
        </Button>
      </Segment.Inline>
    </Segment>
  );
};

export default NotFound;
