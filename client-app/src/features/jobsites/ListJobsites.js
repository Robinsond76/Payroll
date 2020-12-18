import React, { useState, useEffect } from 'react';
import { Header, List } from 'semantic-ui-react'
import axios from 'axios';

const ListJobsites = () => {

  const [activities, setActivities] = useState([
    {moniker: 'Test1', name: 'jobsite1' },
    {moniker: 'Test2', name: 'jobsite2' },
  ]);

  useEffect( () => {
    axios.get('http://localhost:5000/api/jobsites')
    .then(response => {
      setActivities(response.data);
    })
  }, []);


  return (
    <>
      <Header as='h2' icon='map' content='Jobsites' />
      <List>
          {activities.map(activity => (
              <List.Item key={activity.moniker}>{activity.name}</List.Item>
            ))}
      </List>
    </>
  )
}

export default ListJobsites
