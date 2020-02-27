import Poplet from '../..';
import { deleteGroup } from '../../actions/board';
import axios from 'axios';
import { permissions } from './../../util';


export default async (boardID, groupID) => {
  if (!permissions.has('MANAGE_NOTES')) return false;
  const store = Poplet.store;
  store.dispatch(deleteGroup(boardID, groupID));
  Poplet.ws.emit('message', deleteGroup(boardID, groupID));
  await axios.delete(`/boards/${boardID}/groups/${groupID}`);
  return true;
};
