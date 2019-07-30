import Poplet from '../..';
import { updateGroup } from '../../actions/board';
import axios from 'axios';

export default async (boardID, group) => {
  const { id } = group;
  const store = Poplet.store;
  Poplet.ws.emit('message', { type: 'UPDATE_GROUP', board: boardID, group });
  store.dispatch(updateGroup(boardID, group));
  const value = await axios.patch(`/boards/${boardID}/groups/${id}`, group).then(res => res.data);
  return value;
};
