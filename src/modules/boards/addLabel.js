import Poplet from '../..';
import { addLabel } from '../../actions/board';
import axios from 'axios';
import { permissions } from '../../util';

export default async (boardID, label) => {
  if (!permissions.has('MANAGE_BOARD')) return false;
  const store = Poplet.store;
  const value = await axios.put(`/boards/${boardID}/labels`, label).then(res => res.data);
  store.dispatch(addLabel(boardID, value || label));
  return value;
};
