import React from 'react';
import { Icon } from 'semantic-ui-react';
import { useAlertState } from '../context/alerts/alertContext';

const Alerts = () => {
  const { alerts } = useAlertState();

  return (
    alerts.length > 0 &&
    alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        <Icon name='info circle' /> {alert.msg}
      </div>
    ))
  );
};

export default Alerts;
