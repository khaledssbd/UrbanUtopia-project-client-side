import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(config => {
      const token = localStorage.getItem('access-token');
      config.headers.authorization = `Bearer ${token}`;
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  axiosSecure.interceptors.response.use(response => {
      return response;
    },
    async error => {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        await logOut();
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  //   Request Interceptor
  //   axios.interceptors.request
  return axiosSecure;
};

export default useAxiosSecure;
