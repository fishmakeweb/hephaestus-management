import axios from 'axios';

const getToken = () => {
  if (typeof window !== 'undefined') {
    // This ensures sessionStorage is only accessed in a browser environment
    return sessionStorage.getItem('token');
  }
  return '';
};

const instance = axios.create({
  baseURL: "https://api.hephaestus.store/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
});

export default instance;
