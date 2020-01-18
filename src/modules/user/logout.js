import axios from 'axios';

export default async () => {
  const value = await axios.post(`/users/logout`).then(res => res.data);
  localStorage.removeItem('token');
  axios.defaults.headers.common['Authorization'] = undefined;
  window.location.pathname = '/';
  return value;
};
