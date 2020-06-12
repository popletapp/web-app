import axios from 'axios';

export default async () => {
  return await axios.get(`/users/me/friends`).then(res => res.data);
};
