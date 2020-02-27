import Poplet from '../..';
import { updateRank } from '../../actions/board';
import axios from 'axios';
import { permissions } from './../../util';

export default async (boardID, rank) => {
  if (!permissions.has('MANAGE_BOARD')) return false;
  const { id } = rank;
  const store = Poplet.store;
  const value = await axios.patch(`/boards/${boardID}/ranks/${id}`, rank).then(res => res.data);
  store.dispatch(updateRank(boardID, value || rank));
  return value;
};
