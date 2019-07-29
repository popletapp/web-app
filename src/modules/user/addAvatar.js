import Poplet from '../..';
import { updateUser } from '../../actions/user';
import axios from 'axios';

export default async (userId, avatar) => {
  const store = Poplet.store;
  const value = await axios.post(`/avatars/${userId}`, avatar).then(res => res.data);
  await store.dispatch(updateUser(userId));
  return value;
};
