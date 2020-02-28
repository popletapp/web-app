import Poplet from '../..';
import { updateLabel } from '../../actions/board';
import axios from 'axios';
import { permissions } from '../../util';

export default async (boardID, label) => {
  if (!permissions.has('MANAGE_BOARD')) return false;
  const { id } = label;
  const store = Poplet.store;
  const value = await axios.patch(`/boards/${boardID}/labels/${id}`, label).then(res => res.data);
  store.dispatch(updateLabel(boardID, value || label));
  return value;
};
