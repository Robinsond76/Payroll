import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = (response) => response.data;

const requests = {
  get: (url) => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  put: (url, body) => axios.put(url, body).then(responseBody),
  del: (url) => axios.delete(url).then(responseBody),
};

const Jobsites = {
  list: () => requests.get('/jobsites'),
};

const User = {
  current: () => requests.get('/user'),
  login: (user) => requests.post(`/user/login`, user),
  register: (user) => requests.post('/user/register', user),
};

export { Jobsites, User };
