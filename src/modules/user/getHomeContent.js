import axios from 'axios';

export default async () => {
  return await axios.get(`/users/me/home`).then(res => res.data);
};
