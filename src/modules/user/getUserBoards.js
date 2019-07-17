import axios from 'axios';

export default async () => {
  return await axios.get(`/users/me/boards`)
    .then(res => res.data)
    .catch(err => err)
}
