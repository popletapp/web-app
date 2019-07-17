import axios from 'axios';

export default async () => {
  return await axios.get(`/users/me`)
    .then(res => res.data)
    .catch(err => err)
}
