import Poplet from '../..';
import { removeRank } from '../../actions/board';
import axios from 'axios';
import { permissions } from './../../util';


export default async (boardID, rank) => {
  if (!permissions.has('MANAGE_BOARD')) return false;
  const { id } = rank;
  const store = Poplet.store;
  store.dispatch(removeRank(boardID, id));
  const value = await axios.delete(`/boards/${boardID}/ranks/${id}`, rank).then(res => res.data);
  return value;
};
