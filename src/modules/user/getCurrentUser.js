import axios from 'axios';

export default async () => {
  return axios.get(`/users/me`)
    .then(res => res.data)
    .catch(err => err);
};
