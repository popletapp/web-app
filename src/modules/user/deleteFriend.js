import axios from 'axios';

export default async (id) => {
  return await axios.delete(`/users/me/friends/${id}`).then(res => res.data);
};
