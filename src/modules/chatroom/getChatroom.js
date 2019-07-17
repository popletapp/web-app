
import axios from 'axios';

export default async (id) => {
  return axios.get(`/chatroom/${id}`)
    .then(res => res.data);
};
