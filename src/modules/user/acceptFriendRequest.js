import axios from 'axios';

export default async (id) => {
  return await axios.post(`/users/me/friends/accept/${id}`).then(res => res.data);
};
