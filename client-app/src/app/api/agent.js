import axios from 'axios';
import { history } from '../..';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//for error messages and logging user out when token expires
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const { status, headers } = error.response;

    if (
      status === 401 &&
      headers['www-authenticate'] &&
      headers['www-authenticate'].includes(
        'Bearer error="invalid_token", error_description="The token expired'
      )
    ) {
      window.localStorage.removeItem('token');
      history.push('/');
      console.log('your session expired. Please login again');
    }

    return Promise.reject(error.response);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url) => api.get(url).then(responseBody),
  post: (url, body) => api.post(url, body).then(responseBody),
  put: (url, body) => api.put(url, body).then(responseBody),
  del: (url) => api.delete(url).then(responseBody),
};

const Jobsites = {
  getJobsite: (moniker) => requests.get(`/jobsites/${moniker}`),
  addJobsite: (jobsite) => requests.post('/jobsites', jobsite),
  editJobsite: (moniker, jobsite) =>
    requests.put(`/jobsites/${moniker}`, jobsite),
  deleteJobsite: (moniker) => requests.del(`/jobsites/${moniker}`),
  listJobsites: (query, pageSize, pageNumber) =>
    api.get(
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
    return api.get(url + parameters);
  },
  getJobsitesVisited: (pageSize, pageNumber, fromDate = '', toDate = '') => {
    let url = `/timestamps/jobsitesvisited?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return api.get(url + parameters);
  },
};

const Timestamps = {
  addTimestamp: (values) => requests.post('/timestamps', values),
  editTimestamp: (timestampId, values) =>
    requests.put(`/timestamps/${timestampId}`, values),
  deleteTimestamp: (timestampId) => requests.del(`/timestamps/${timestampId}`),
  getCurrentUserTimestamps: (
    pageSize,
    pageNumber,
    fromDate = '',
    toDate = ''
  ) => {
    let url = `/user/timestamps?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return api.get(url + parameters);
  },
  getCurrentUserJobsiteTimestamps: (
    moniker,
    pageSize,
    pageNumber,
    fromDate = '',
    toDate = ''
  ) => {
    let url = `/user/timestamps/${moniker}?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return api.get(url + parameters);
  },
  getAnyUserTimestamps: (
    username,
    pageSize,
    pageNumber,
    fromDate = '',
    toDate = ''
  ) => {
    let url = `/timestamps/${username}?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return api.get(url + parameters);
  },
  getAnyUserJobsiteTimestamps: (
    moniker,
    username,
    pageSize,
    pageNumber,
    fromDate = '',
    toDate = ''
  ) => {
    let url = `/timestamps/${username}/${moniker}?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return api.get(url + parameters);
  },
  getClockedInTimestamps: (pageSize, pageNumber) =>
    api.get(
      `/timestamps/clockedin?pagesize=${pageSize}&pagenumber=${pageNumber}`
    ),
  getClockedInJobsites: (pageSize, pageNumber) =>
    api.get(
      `/timestamps/jobsitesclockedin?pagesize=${pageSize}&pagenumber=${pageNumber}`
    ),
  getWorkHistory: (fromDate, toDate) => {
    let url = `/timestamps/workhistory?`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return api.get(url + parameters);
  },
  getUserWorkHistory: (username, fromDate, toDate) => {
    let url = `/timestamps/workhistory/${username}?`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return api.get(url + parameters);
  },
  getAllTimestamps: (pageSize, pageNumber, fromDate = '', toDate = '') => {
    let url = `/timestamps?pagesize=${pageSize}&pagenumber=${pageNumber}`;
    let parameters = '';
    if (fromDate) parameters = `&fromDate=${fromDate}`;
    if (toDate) parameters += `&toDate=${toDate}`;
    return api.get(url + parameters);
  },
};

const User = {
  current: () => requests.get('/user'),
  login: (user) => requests.post(`/user/login`, user),
  register: (user) => requests.post('/user/register', user),
  status: (username) => requests.get(`/user/${username}`),
  clockIn: (moniker) => requests.post(`/jobsites/${moniker}/clockin`),
  clockOut: (moniker) => requests.post(`/jobsites/${moniker}/clockout`),
  clockOutEmployee: (moniker, username) =>
    requests.post(`/jobsites/${moniker}/clockout?username=${username}`),
  getUsers: (pageSize, pageNumber) =>
    api.get(`/users?pagesize=${pageSize}&pagenumber=${pageNumber}`),
  getManagers: (pageSize, pageNumber) =>
    api.get(`/managers?pagesize=${pageSize}&pagenumber=${pageNumber}`),
  editManager: (username, managerStatus) =>
    api.post(`/user/${username}?manager=${managerStatus}`),
  getUser: (username) => requests.get(`/user/${username}`),
  updateUser: (username, updatedUser) =>
    requests.put(`/user/${username}`, updatedUser),
  deleteUser: (username) => requests.del(`/user/${username}`),
};

export { Jobsites, User, Timestamps };
