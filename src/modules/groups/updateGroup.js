import Poplet from '../..';
import { updateGroup } from '../../actions/board';
import axios from 'axios';

export default async (boardID, group) => {
  const { id } = group;
  const store = Poplet.store;
  const value = await axios.patch(`/boards/${boardID}/groups/${id}`, group).then(res => res.data);
  store.dispatch(updateGroup(boardID, value || group));
  return value;
};
