import React, { useState, useEffect } from 'react';
import { Header, List } from 'semantic-ui-react'
import axios from 'axios';
import './App.css';

const App = () => {

  const [values, setValues] = useState([
    {moniker: 'Test1', name: 'jobsite1' },
    {moniker: 'Test2', name: 'jobsite2' },
  ]);

  useEffect( () => {
    axios.get('http://localhost:5000/api/jobsites')
    .then(response => {
      setValues(response.data);
    })
  }, []);

  return (
    <div>
      <Header as='h2' icon='users' content='Payroll App' />
      Welcome <br />
      <List>
      {values.map(value => (
          <List.Item key={value.moniker}>{value.name}</List.Item>
        ))}
      </List>

        

    </div>
  );
}

export default App;
