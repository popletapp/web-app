

import axios from 'axios';

export default async (id) => {
  return await axios.get(`/chatroom/${id}`)
    .then(res => res.data)
}
