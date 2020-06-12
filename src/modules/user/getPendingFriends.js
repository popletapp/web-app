import axios from 'axios';

export default async () => {
  return await axios.get(`/users/me/friends/pending`).then(res => res.data);
};
