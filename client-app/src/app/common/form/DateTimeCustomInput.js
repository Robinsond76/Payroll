import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';

const TextInput = ({ input, meta: { touched, error }, ...rest }) => {
  return (
    <Form.Field error={touched && !!error}>
      <DateTimeInput
        value={input.value}
        onBlur={input.onBlur}
        {...rest}
        onChange={(event, value) => input.onChange(value.value)}
      />
      {touched && error && (
        <Label basic color='red'>
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default TextInput;
