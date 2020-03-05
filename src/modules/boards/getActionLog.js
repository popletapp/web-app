import Poplet from '../..';
import axios from 'axios';
import { permissions } from '../../util';

export default async (boardID, type, limit, skip) => {
  if (!permissions.has('MODERATOR')) return false;
  const store = Poplet.store;
  const value = await axios.get(`/boards/${boardID}/actionlog`, { type, limit, skip }).then(res => res.data);
  return value;
};
