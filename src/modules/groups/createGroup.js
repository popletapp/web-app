import axios from 'axios';
import Poplet from '../..';
import { findNextAvailablePosition } from '../';
import { createGroup } from './../../actions/board';
import { permissions } from './../../util';


export default async (boardID, obj) => {
  if (!permissions.has('MANAGE_NOTES')) return false;
  const store = Poplet.store;
  const value = await axios.put(`/boards/${boardID}/groups`, { ...obj, boardID }).then(res => res.data);
  findNextAvailablePosition(boardID, value);
  store.dispatch(createGroup(boardID, value));
  Poplet.ws.emit('message', createGroup(boardID, value));
  return value;
};
