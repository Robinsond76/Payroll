import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './styles.css';
import App from './App';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ScrollToTop from './app/layout/ScrollToTop';
import { AuthProvider } from './app/context/auth/authContext';

export const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <AuthProvider>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </AuthProvider>
  </Router>,
  document.getElementById('root')
);
