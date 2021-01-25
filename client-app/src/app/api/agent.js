import axios from 'axios';
// import { history } from '../..';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//for error messages
axios.interceptors.response.use(undefined, (error) => {
  // if (error.message === 'Network Error' && !error.response) {
  //   console('Network error - confirm API is running');
  // }
  // console.log(error);
  // const { status, data, config } = error.response;
  // if (status === 404) {
  //   history.push('/notfound');
  // }
  // if (
  //   status === 400 &&
  //   config.method === 'get' &&
  //   data.errors.hasOwnProperty('id')
  // ) {
  //   history.push('/notfound');
  // }

  // if (status === 500) {
  //   console.log('Server error - check the terminal for more info!');
  // }

  throw error.response;
});

const responseBody = (response) => response.data;

const requests = {
  get: (url) => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  put: (url, body) => axios.put(url, body).then(responseBody),
  del: (url) => axios.delete(url).then(responseBody),
};

const Jobsites = {
  getJobsite: (moniker) => requests.get(`/jobsites/${moniker}`),
  addJobsite: (jobsite) => requests.post('/jobsites', jobsite),
  editJobsite: (moniker, jobsite) =>
    requests.put(`/jobsites/${moniker}`, jobsite),
  deleteJobsite: (moniker) => requests.del(`/jobsites/${moniker}`),
  listJobsites: (query, pageSize, pageNumber) =>
    axios.get(
      `/jobsites/search?q=${query}&pagesize=${pageSize}&pagenumber=${pageNumber}`
    ),
  getJobsiteTimestamps: (
    moniker,
    pageSize,
    pageNumber,
    fromDate = '',
    toDate = ''
  ) => {
    let url = `/jobsites/${moniker}/timestamps?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return axios.get(url + parameters);
  },
  getJobsitesVisited: (pageSize, pageNumber, fromDate = '', toDate = '') => {
    let url = `/timestamps/jobsitesvisited?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return axios.get(url + parameters);
  },
};

const Timestamps = {
  getUserTimestamps: (
    username,
    pageSize,
    pageNumber,
    fromDate = '',
    toDate = ''
  ) => {
    let url = `/user/${username}/timestamps?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return axios.get(url + parameters);
  },
  getUserJobsiteTimestamps: (
    moniker,
    username,
    pageSize,
    pageNumber,
    fromDate = '',
    toDate = ''
  ) => {
    let url = `/user/${username}/timestamps/${moniker}?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return axios.get(url + parameters);
  },
  getClockedInTimestamps: () => requests.get('/timestamps/clockedin'),
  getWorkHistory: () => axios.get('/timestamps/workhistory?fromDate=01/01'),
  getUserWorkHistory: (username) =>
    axios.get(`/timestamps/workhistory/${username}?fromDate=01/01`),
  getAllTimestamps: (pageSize, pageNumber, fromDate = '', toDate = '') => {
    let url = `/timestamps?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return axios.get(url + parameters);
  },
};

const User = {
  current: () => requests.get('/user'),
  login: (user) => requests.post(`/user/login`, user),
  register: (user) => requests.post('/user/register', user),
  status: (username) => requests.get(`/user/${username}`),
  clockIn: (moniker) => requests.post(`/jobsites/${moniker}/clockin`),
  clockOut: (moniker) => requests.post(`/jobsites/${moniker}/clockout`),
  getUsers: (pageSize, pageNumber) =>
    axios.get(`/users?pagesize=${pageSize}&pagenumber=${pageNumber}`),
  getUser: (username) => requests.get(`/user/${username}`),
  updateUser: (username, updatedUser) =>
    requests.put(`/user/${username}`, updatedUser),
  deleteUser: (username) => requests.del(`/user/${username}`),
};

export { Jobsites, User, Timestamps };
