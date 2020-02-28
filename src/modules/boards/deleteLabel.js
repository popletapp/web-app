import Poplet from '../..';
import { removeLabel } from '../../actions/board';
import axios from 'axios';
import { permissions } from '../../util';

export default async (boardID, label) => {
  if (!permissions.has('MANAGE_BOARD')) return false;
  const { id } = label;
  const store = Poplet.store;
  store.dispatch(removeLabel(boardID, id));
  const value = await axios.delete(`/boards/${boardID}/labels/${id}`, label).then(res => res.data);
  return value;
};
