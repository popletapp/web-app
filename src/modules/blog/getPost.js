import axios from 'axios';

export default async (id) => {
  const value = await axios.get(`/blog/post/${id}`).then(res => res.data);
  return value;
};
