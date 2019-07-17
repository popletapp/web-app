import axios from 'axios';

export default async () => {
  return axios.get(`/users/me/boards`)
    .then(res => res.data)
    .catch(err => err);
};
