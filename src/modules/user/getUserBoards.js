import axios from 'axios';

export default async () => {
  return await axios.get(`/user/me/boards`)
    .then(res => res.data)
    .catch(err => err)
}
