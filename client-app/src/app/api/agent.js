import axios from 'axios';

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

const responseBody = (response) => response.data;

const requests = {
  get: (url) => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  put: (url, body) => axios.put(url, body).then(responseBody),
  del: (url) => axios.delete(url).then(responseBody),
};

const Jobsites = {
  listJobsites: (query, pageSize, pageNumber) =>
    axios.get(
      `/jobsites/search?q=${query}&pagesize=${pageSize}&pagenumber=${pageNumber}`
    ),
  getJobsite: (moniker, pageSize, pageNumber) =>
    axios.get(
      `/jobsites/${moniker}/timestamps?pagesize=${pageSize}&pagenumber=${pageNumber}`
    ),
};

const Timestamps = {
  getTimestamps: (username, pageSize, pageNumber) =>
    axios.get(
      `/user/${username}/timestamps?pagesize=${pageSize}&pagenumber=${pageNumber}`
    ),
  getJobsiteTimestamps: (moniker, username, pageSize, pageNumber) =>
    axios.get(
      `/user/${username}/timestamps/${moniker}?pagesize=${pageSize}&pagenumber=${pageNumber}`
    ),
  getClockedInTimestamps: () => requests.get('/timestamps/clockedin'),
  getWorkHistory: () => axios.get('/timestamps/workhistory?fromDate=01/01'),
  getUserWorkHistory: (username) =>
    axios.get(`/timestamps/workhistory/${username}?fromDate=01/01`),
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
};

export { Jobsites, User, Timestamps };
