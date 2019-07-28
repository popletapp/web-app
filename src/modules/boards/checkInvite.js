import axios from 'axios';

export default async (code) => {
  return axios.get(`/invites/${code}`)
    .then(res => res.data);
};
