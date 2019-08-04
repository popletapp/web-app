import Poplet from '../..';
import { updateGroup } from '../../actions/board';
import axios from 'axios';

export default async (boardID, group) => {
  const { id } = group;
  const store = Poplet.store;
  store.dispatch(updateGroup(boardID, group));
  Poplet.ws.emit('message', updateGroup(boardID, group));
  const value = await axios.patch(`/boards/${boardID}/groups/${id}`, group).then(res => res.data);
  return value;
};
