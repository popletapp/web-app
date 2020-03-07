import Poplet from '../..';
import axios from 'axios';
import { updateUser } from '../../actions/user';

export default async (user) => {
  const { id } = user;
  const store = Poplet.store;
  store.dispatch(updateUser(user));
  Poplet.ws.emit('message', updateUser(user));
  const value = await axios.patch(`/users/${id}`, user).then(res => res.data);
  return value;
};
