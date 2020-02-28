import axios from 'axios';

export default async (post) => {
  const value = await axios.post(`/blog/create`, post).then(res => res.data);
  return value;
};
