import React, { Fragment } from 'react';
import { DateInput } from 'semantic-ui-calendar-react';
import { Accordion, Divider, Icon } from 'semantic-ui-react';
import {
  useTimestampState,
  useTimestampDispatch,
} from '../context/timestamps/timestampContext';

const FilterDateForm = ({ open = false }) => {
  const { fromDate, toDate } = useTimestampState();
  const timestampDispatch = useTimestampDispatch();

  //Accordion index
  const [activeIndex, setActiveIndex] = React.useState(-1);

  const handleAccordion = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  React.useEffect(() => {
    if (open) setActiveIndex(0);
    return timestampDispatch({ type: 'CLEAR_DATES' });
  }, [open, timestampDispatch]);

  const handleFromDate = (event, { name, value }) => {
    timestampDispatch({ type: 'SET_FROM_DATE', payload: value });
  };

  const handleToDate = (event, { name, value }) => {
    timestampDispatch({ type: 'SET_TO_DATE', payload: value });
  };

  return (
    <Fragment>
      <Accordion>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleAccordion}
        >
          <Icon name='dropdown' />
          <Icon name='search' />
          <h4 style={{ display: 'inline' }}>Filter By Date</h4>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <div className='Filter-Date-Form'>
            <p>From:</p>
            <DateInput
              name='date'
              placeholder='Date'
              value={fromDate}
              onChange={handleFromDate}
              dateFormat='MM-DD-YYYY'
              closable
              clearable
              style={{ width: '300px' }}
            />
            <p>To:</p>
            <DateInput
              name='date'
              placeholder='Date'
              value={toDate}
              onChange={handleToDate}
              dateFormat='MM-DD-YYYY'
              closable
              clearable
              style={{ width: '300px' }}
            />
          </div>
          <Divider />
        </Accordion.Content>
      </Accordion>
    </Fragment>
  );
};

export default FilterDateForm;
