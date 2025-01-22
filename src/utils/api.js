import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  async (config) => {
    // const token = localStorage.getItem('authToken'); 
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTczNzU2ODY3NCwiZXhwIjoxNzQwMTYwNjc0fQ.Un92MBQbbqwxPDQD087BzfmTStGwqPAe_NJ0L08kSSw";
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    } else {
      console.error('No token found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response; 
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Token is invalid or expired');
      return Promise.reject(new Error('Token is invalid or expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
