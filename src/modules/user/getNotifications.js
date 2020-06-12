import axios from 'axios';

export default async (type, limit, skip) => {
  return await axios.get(`/users/me/notifications`, { type, limit, skip }).then(res => res.data);
};
