import axios from 'axios';

export default async (id, friend) => {
  return await axios.patch(`/users/me/friends/accept/${id}`, friend).then(res => res.data);
};
