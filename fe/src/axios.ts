import axios from 'axios';

import { getToken } from './redux/utils/token';

export const configureAxios = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
};
